import { afterEach, describe, expect, it } from "vitest";

import { buildStudentCodePayload, decodeStudentCode, encodeStudentCode } from "@/lib/student-code";

describe("student code", () => {
  const originalBuffer = globalThis.Buffer;

  afterEach(() => {
    globalThis.Buffer = originalBuffer;
  });

  it("round-trips the current profile and planner state", () => {
    const payload = buildStudentCodePayload(
      {
        academicLevel: "undergraduate",
        selectedCareerIds: ["matematicas-aplicadas"],
        selectedJointProgramIds: [],
        entryTerm: "OTOÑO 2025",
        activePlanIds: ["plan:ma-e"],
        locale: "es-MX",
      },
      {
        selectedPeriodId: "2938",
        selectedOfferingIds: ["2938:ACT-11300:001"],
        selectedSubjectCodes: ["ACT-11300"],
      },
    );

    const token = encodeStudentCode(payload);

    expect(decodeStudentCode(token)).toEqual(payload);
  });

  it("rejects an invalid prefix", () => {
    expect(() => decodeStudentCode("broken")).toThrow(/Invalid student code prefix/u);
  });

  it("uses browser-safe base64 helpers even when Buffer exists in the window context", () => {
    const payload = buildStudentCodePayload(
      {
        academicLevel: "undergraduate",
        selectedCareerIds: ["matematicas-aplicadas"],
        selectedJointProgramIds: [],
        entryTerm: "PRIMAVERA 2024",
        activePlanIds: ["plan:ma-e"],
        locale: "es-MX",
      },
      {
        selectedPeriodId: "2938",
        selectedOfferingIds: ["2938:ACT-11300:001"],
        selectedSubjectCodes: ["ACT-11300"],
      },
    );

    const unsupportedBuffer = Object.assign(function UnsupportedBuffer() {}, {
      from: () => {
        throw new Error("Buffer branch should not run in the browser");
      },
    });

    globalThis.Buffer = unsupportedBuffer as unknown as typeof Buffer;

    const token = encodeStudentCode(payload);

    expect(token).toMatch(/^itp1\./u);
    expect(decodeStudentCode(token)).toEqual(payload);
  });
});
