import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const realRepositoryRoot = path.resolve(scriptDirectory, "..");
const repositoryRoot = process.env.REPOSITORY_ROOT_OVERRIDE || realRepositoryRoot;
const requireFromWebWorkspace = createRequire(
  path.join(realRepositoryRoot, "apps", "web", "package.json"),
);
const typescript = requireFromWebWorkspace("typescript");

const SOURCE_DIRECTORIES = [
  "apps/web/lib/presenters",
];
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const EXCLUDED_PATH_SEGMENTS = new Set([
  ".next",
  ".pytest-tmp",
  "__pycache__",
  "coverage",
  "dist",
  "fixtures",
  "node_modules",
  "tests",
]);
const EXEMPT_FILE_BASENAMES = new Set([
  "academic-catalog.ts",
  "copy.ts",
  "locale.ts",
  "navigation.ts",
  "official-academics.ts",
  "official-study-plan-fallbacks.ts",
  "product-copy.ts",
  "seo.ts",
  "site-content.ts",
  "types.ts",
]);
const ALLOWED_DIRECTIVE_LITERALS = new Set(["use client", "use server", "use strict"]);

const violations = collectSourceFiles(repositoryRoot).flatMap((filePath) =>
  scanTypeScriptFile(filePath),
);

if (violations.length > 0) {
  process.stderr.write("Magic literal violations found outside approved literal hosts:\n");

  for (const violation of violations) {
    process.stderr.write(
      `- ${path.relative(repositoryRoot, violation.filePath)}:${violation.line}:${violation.column} ${violation.message}\n`,
    );
  }

  process.exit(1);
}

function collectSourceFiles(rootDirectory) {
  return SOURCE_DIRECTORIES.flatMap((directory) =>
    walkDirectory(path.join(rootDirectory, directory)),
  );
}

function walkDirectory(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  return fs.readdirSync(directoryPath, { withFileTypes: true }).flatMap((entry) => {
    const nextPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      if (EXCLUDED_PATH_SEGMENTS.has(entry.name)) {
        return [];
      }

      return walkDirectory(nextPath);
    }

    if (!SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      return [];
    }

    if (isExcludedFilePath(nextPath)) {
      return [];
    }

    return [nextPath];
  });
}

function isExcludedFilePath(filePath) {
  const normalizedSegments = path.relative(repositoryRoot, filePath).split(path.sep);
  return normalizedSegments.some((segment) => EXCLUDED_PATH_SEGMENTS.has(segment));
}

function scanTypeScriptFile(filePath) {
  if (EXEMPT_FILE_BASENAMES.has(path.basename(filePath))) {
    return [];
  }

  const sourceText = fs.readFileSync(filePath, "utf8");
  const sourceFile = typescript.createSourceFile(
    filePath,
    sourceText,
    typescript.ScriptTarget.Latest,
    true,
  );
  const violations = [];

  visitNode(sourceFile, violations);
  return violations;

  function visitNode(node, accumulator) {
    if (isRelevantLiteralNode(node) && isMagicLiteral(node)) {
      const startPosition = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
      accumulator.push({
        column: startPosition.character + 1,
        filePath,
        line: startPosition.line + 1,
        message: `${describeLiteral(node)} should be promoted to a named constant, enum, adapter, or locale/data host.`,
      });
    }

    typescript.forEachChild(node, (childNode) => visitNode(childNode, accumulator));
  }
}

function isRelevantLiteralNode(node) {
  return (
    typescript.isNumericLiteral(node) ||
    typescript.isStringLiteral(node) ||
    typescript.isNoSubstitutionTemplateLiteral(node) ||
    isNegativeNumericLiteral(node)
  );
}

function isMagicLiteral(node) {
  if (isDirectiveLiteral(node) || isImportLikeLiteral(node) || isTypeLiteral(node)) {
    return false;
  }

  if (hasJsxAncestor(node) || isPropertyName(node)) {
    return false;
  }

  if (isDirectNamedConstantInitializer(node) || isEnumMemberInitializer(node)) {
    return false;
  }

  return isImperativeContext(node);
}

function isDirectiveLiteral(node) {
  return (
    (typescript.isStringLiteral(node) || typescript.isNoSubstitutionTemplateLiteral(node)) &&
    ALLOWED_DIRECTIVE_LITERALS.has(node.text) &&
    typescript.isExpressionStatement(node.parent)
  );
}

function isImportLikeLiteral(node) {
  return (
    (typescript.isStringLiteral(node) || typescript.isNoSubstitutionTemplateLiteral(node)) &&
    (typescript.isImportDeclaration(node.parent) ||
      typescript.isExportDeclaration(node.parent) ||
      typescript.isImportEqualsDeclaration(node.parent))
  );
}

function isTypeLiteral(node) {
  let currentNode = node.parent;

  while (currentNode) {
    if (
      typescript.isLiteralTypeNode(currentNode) ||
      typescript.isTypeAliasDeclaration(currentNode) ||
      typescript.isUnionTypeNode(currentNode)
    ) {
      return true;
    }

    if (
      typescript.isCallExpression(currentNode) ||
      typescript.isReturnStatement(currentNode) ||
      typescript.isVariableDeclaration(currentNode)
    ) {
      return false;
    }

    currentNode = currentNode.parent;
  }

  return false;
}

function hasJsxAncestor(node) {
  let currentNode = node.parent;

  while (currentNode) {
    if (
      typescript.isJsxAttribute(currentNode) ||
      typescript.isJsxElement(currentNode) ||
      typescript.isJsxFragment(currentNode) ||
      typescript.isJsxSelfClosingElement(currentNode)
    ) {
      return true;
    }

    currentNode = currentNode.parent;
  }

  return false;
}

function isPropertyName(node) {
  return (
    (typescript.isStringLiteral(node) || typescript.isNoSubstitutionTemplateLiteral(node)) &&
    ((typescript.isPropertyAssignment(node.parent) && node.parent.name === node) ||
      (typescript.isPropertyDeclaration(node.parent) && node.parent.name === node))
  );
}

function isDirectNamedConstantInitializer(node) {
  const parentNode = node.parent;

  if (
    typescript.isVariableDeclaration(parentNode) &&
    parentNode.initializer === node &&
    isConstVariableDeclaration(parentNode)
  ) {
    return true;
  }

  if (
    typescript.isPropertyDeclaration(parentNode) &&
    parentNode.initializer === node &&
    parentNode.modifiers?.some(
      (modifier) =>
        modifier.kind === typescript.SyntaxKind.ReadonlyKeyword ||
        modifier.kind === typescript.SyntaxKind.StaticKeyword,
    )
  ) {
    return true;
  }

  return false;
}

function isConstVariableDeclaration(node) {
  return Boolean(
    node.parent &&
      typescript.isVariableDeclarationList(node.parent) &&
      (node.parent.flags & typescript.NodeFlags.Const) !== 0,
  );
}

function isEnumMemberInitializer(node) {
  return typescript.isEnumMember(node.parent) && node.parent.initializer === node;
}

function isImperativeContext(node) {
  const parentNode = node.parent;

  return (
    typescript.isBinaryExpression(parentNode) ||
    typescript.isCallExpression(parentNode) ||
    typescript.isCaseClause(parentNode) ||
    typescript.isConditionalExpression(parentNode) ||
    typescript.isNewExpression(parentNode) ||
    typescript.isPropertyAssignment(parentNode) ||
    typescript.isReturnStatement(parentNode) ||
    typescript.isThrowStatement(parentNode) ||
    typescript.isVariableDeclaration(parentNode)
  );
}

function isNegativeNumericLiteral(node) {
  return (
    typescript.isPrefixUnaryExpression(node) &&
    node.operator === typescript.SyntaxKind.MinusToken &&
    typescript.isNumericLiteral(node.operand)
  );
}

function describeLiteral(node) {
  if (typescript.isStringLiteral(node) || typescript.isNoSubstitutionTemplateLiteral(node)) {
    return `String literal ${JSON.stringify(node.text)}`;
  }

  if (typescript.isNumericLiteral(node)) {
    return `Numeric literal ${node.text}`;
  }

  if (isNegativeNumericLiteral(node)) {
    return `Numeric literal -${node.operand.text}`;
  }

  return "Literal";
}
