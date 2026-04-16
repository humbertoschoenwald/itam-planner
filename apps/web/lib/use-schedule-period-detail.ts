"use client";

import { useEffect, useState } from "react";

import { fetchSchedulePeriodDetail } from "@/lib/api";

export function useSchedulePeriodDetail(periodId: string | null, loadErrorMessage: string) {
  const [detail, setDetail] = useState<Awaited<ReturnType<typeof fetchSchedulePeriodDetail>> | null>(
    null,
  );
  const [resolvedPeriodId, setResolvedPeriodId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!periodId) {
      return;
    }

    let active = true;

    void fetchSchedulePeriodDetail(periodId)
      .then((nextDetail) => {
        if (!active) {
          return;
        }

        setResolvedPeriodId(periodId);
        setDetail(nextDetail);
        setError(null);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setResolvedPeriodId(periodId);
        setDetail(null);
        setError(loadErrorMessage);
      });

    return () => {
      active = false;
    };
  }, [loadErrorMessage, periodId]);

  return {
    detail: periodId !== null && resolvedPeriodId === periodId ? detail : null,
    error: periodId !== null && resolvedPeriodId === periodId ? error : null,
    isLoading: periodId !== null && resolvedPeriodId !== periodId && error === null,
  };
}
