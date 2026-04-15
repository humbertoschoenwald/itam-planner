import { describe, expect, it } from "vitest";

import { buildStudentCodePayload, decodeStudentCode, encodeStudentCode } from "@/lib/student-code";

describe("student code", () => {
  it("round-trips the current profile and planner state", () => {
    const payload = buildStudentCodePayload(
      {
        entryTerm: "OTOÑO 2025",
        activePlanIds: ["plan:ma-e"],
        locale: "es-MX",
      },
      {
        selectedPeriodId: "2938",
        selectedOfferingIds: ["2938:ACT-11300:001"],
      },
    );

    const token = encodeStudentCode(payload);

    expect(decodeStudentCode(token)).toEqual(payload);
  });

  it("rejects an invalid prefix", () => {
    expect(() => decodeStudentCode("broken")).toThrow(/Invalid student code prefix/u);
  });
});
