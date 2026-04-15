import type { PlannerState, StudentProfile } from "@/lib/types";

export interface StudentCodePayload {
  v: 1;
  profile: StudentProfile;
  planner: PlannerState;
}

const TOKEN_PREFIX = "itp1.";

export function buildStudentCodePayload(
  profile: StudentProfile,
  planner: PlannerState,
): StudentCodePayload {
  return {
    v: 1,
    profile,
    planner,
  };
}

export function encodeStudentCode(payload: StudentCodePayload): string {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  return `${TOKEN_PREFIX}${toBase64Url(bytes)}`;
}

export function decodeStudentCode(token: string): StudentCodePayload {
  if (!token.startsWith(TOKEN_PREFIX)) {
    throw new Error("Invalid student code prefix.");
  }
  const encoded = token.slice(TOKEN_PREFIX.length);
  const json = new TextDecoder().decode(fromBase64Url(encoded));
  return JSON.parse(json) as StudentCodePayload;
}

export function buildStudentCode(profile: StudentProfile, planner: PlannerState): string {
  return encodeStudentCode(buildStudentCodePayload(profile, planner));
}

function toBase64Url(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64url");
  }
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/u, "");
}

function fromBase64Url(value: string): Uint8Array {
  if (typeof Buffer !== "undefined") {
    return Uint8Array.from(Buffer.from(value, "base64url"));
  }
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = `${base64}${"=".repeat((4 - (base64.length % 4 || 4)) % 4)}`;
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
