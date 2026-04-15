export type LocaleCode = "es-MX" | "en";

export interface StudentProfile {
  entryTerm: string;
  activePlanIds: string[];
  locale: LocaleCode;
}

export interface PlannerState {
  selectedPeriodId: string | null;
  selectedOfferingIds: string[];
}

export interface BulletinSummary {
  bulletin_id: string;
  source_code: string;
  title: string;
  program_title: string;
  plan_code: string;
  plan_id: string;
  application_term: string | null;
  application_year: number | null;
  active_from: string | null;
  active_to: string | null;
  entry_from_term: string | null;
  entry_to_term: string | null;
}

export interface SchedulePeriodSummary {
  period_id: string;
  label: string;
  level: string;
  year: number | null;
  term: string | null;
  active_from: string | null;
  active_to: string | null;
}

export interface ScheduleMeeting {
  weekday_code: string;
  start_time: string;
  end_time: string;
  room_code: string | null;
  campus_name: string | null;
}

export interface ScheduleOffering {
  offering_id: string;
  period_id: string;
  course_code: string;
  group_code: string;
  crn: string;
  section_type: string;
  display_title: string;
  instructor_name: string | null;
  credits: number | null;
  room_code: string | null;
  campus_name: string | null;
  raw_comments: string | null;
  meetings: ScheduleMeeting[];
}

export interface SchedulePeriodDetail extends SchedulePeriodSummary {
  subjects: Array<{
    subject_id: string;
    raw_value: string;
    course_code: string;
    canonical_title: string;
  }>;
  offerings: ScheduleOffering[];
}
