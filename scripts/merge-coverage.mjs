import fs from "node:fs";
import path from "node:path";

const repositoryRoot = process.cwd();
const reportInputs = [
  {
    name: "api",
    path: path.join(repositoryRoot, "apps", "api", "coverage", "coverage.xml"),
  },
  {
    name: "web",
    path: path.join(repositoryRoot, "apps", "web", "coverage", "cobertura-coverage.xml"),
  },
];
const outputPath = path.join(repositoryRoot, "coverage.xml");

const reports = reportInputs.map((input) => ({
  ...input,
  xml: fs.readFileSync(input.path, "utf8"),
}));

const packageBlocks = reports.map((report) => {
  const packagesMatch = report.xml.match(/<packages>([\s\S]*?)<\/packages>/u);
  const packageBody = packagesMatch?.[1]?.trim();

  if (packageBody) {
    return packageBody;
  }

  const classesMatch = report.xml.match(/<classes>([\s\S]*?)<\/classes>/u);
  const classBody = classesMatch?.[1]?.trim() ?? "";

  return [
    `<package name="${report.name}" line-rate="0" branch-rate="0" complexity="0">`,
    "<classes>",
    classBody,
    "</classes>",
    "</package>",
  ].join("");
});

const totals = reports.reduce(
  (accumulator, report) => {
    const attrs = parseCoverageAttributes(report.xml);

    return {
      branchesCovered: accumulator.branchesCovered + attrs.branchesCovered,
      branchesValid: accumulator.branchesValid + attrs.branchesValid,
      complexity: accumulator.complexity + attrs.complexity,
      linesCovered: accumulator.linesCovered + attrs.linesCovered,
      linesValid: accumulator.linesValid + attrs.linesValid,
    };
  },
  {
    branchesCovered: 0,
    branchesValid: 0,
    complexity: 0,
    linesCovered: 0,
    linesValid: 0,
  },
);

const mergedXml = [
  '<?xml version="1.0" ?>',
  "<!DOCTYPE coverage SYSTEM 'https://cobertura.sourceforge.net/xml/coverage-04.dtd'>",
  `<coverage line-rate="${toRate(totals.linesCovered, totals.linesValid)}" branch-rate="${toRate(totals.branchesCovered, totals.branchesValid)}" lines-covered="${totals.linesCovered}" lines-valid="${totals.linesValid}" branches-covered="${totals.branchesCovered}" branches-valid="${totals.branchesValid}" complexity="${totals.complexity}" version="itam-planner" timestamp="${Date.now()}">`,
  "<sources>",
  `<source>${escapeXml(repositoryRoot)}</source>`,
  "</sources>",
  "<packages>",
  ...packageBlocks,
  "</packages>",
  "</coverage>",
].join("\n");

fs.writeFileSync(outputPath, `${mergedXml}\n`, "utf8");
console.log(`coverage.xml written to ${outputPath}`);

function parseCoverageAttributes(xml) {
  return {
    branchesCovered: readIntegerAttribute(xml, "branches-covered"),
    branchesValid: readIntegerAttribute(xml, "branches-valid"),
    complexity: readIntegerAttribute(xml, "complexity"),
    linesCovered: readIntegerAttribute(xml, "lines-covered"),
    linesValid: readIntegerAttribute(xml, "lines-valid"),
  };
}

function readIntegerAttribute(xml, attributeName) {
  const match = xml.match(new RegExp(`${attributeName}="([^"]+)"`, "u"));
  const value = Number.parseFloat(match?.[1] ?? "0");

  return Number.isFinite(value) ? value : 0;
}

function toRate(covered, valid) {
  if (valid <= 0) {
    return "0";
  }

  return String(covered / valid);
}

function escapeXml(value) {
  return value
    .replace(/&/gu, "&amp;")
    .replace(/"/gu, "&quot;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;");
}
