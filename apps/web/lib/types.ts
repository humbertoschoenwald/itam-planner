export type LocaleCode = "es-MX" | "en";
export type AcademicLevel = "undergraduate" | "graduate";

export interface StudentProfile {
  academicLevel: AcademicLevel | null;
  entryTerm: string;
  activePlanIds: string[];
  locale: LocaleCode;
  selectedCareerIds: string[];
  selectedJointProgramIds: string[];
}

export interface PlannerState {
  selectedPeriodId: string | null;
  selectedOfferingIds: string[];
  selectedSubjectCodes: string[];
}

export type PlannerWidgetId = "today" | "week" | "subjects";

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

export interface BulletinRequirementReference {
  ordinal_position: number;
  referenced_course_code: string;
}

export interface BulletinRequirement {
  course_code: string;
  credits: number | null;
  display_title: string;
  prerequisite_references: BulletinRequirementReference[];
  raw_prerequisite_text: string | null;
  requirement_id: string;
  semester_label: string | null;
  semester_order: number | null;
  sort_order: number;
}

export interface BulletinDocument extends BulletinSummary {
  requirements: BulletinRequirement[];
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

export interface ScrapeRunSummary {
  run_id: string;
  started_at: string;
  completed_at: string | null;
  status: "running" | "succeeded" | "failed" | "no_changes" | "drift_detected";
  notes: string | null;
}

export interface PromotedReleaseSummary {
  release_id: string;
  run_id: string;
  promoted_at: string;
  notes: string | null;
}

export interface SourceSnapshotSummary {
  snapshot_id: string;
  run_id: string;
  source_id: string;
  upstream_url: string;
  observed_at: string;
  content_hash: string;
  parse_status: "parsed" | "skipped" | "failed" | "unchanged";
  media_type: string;
  relative_path: string | null;
  size_bytes: number;
}

export interface SourcesMetadata {
  scrape_runs: ScrapeRunSummary[];
  promoted_releases: PromotedReleaseSummary[];
  source_snapshots: SourceSnapshotSummary[];
}

export interface CalendarLegendItem {
  symbol: string;
  label: string;
  notes: string | null;
}

export interface SchoolCalendarEvent {
  symbol: string;
  label: string;
  event_date: string;
  notes: string | null;
  active_from: string | null;
  active_to: string | null;
}

export interface PaymentCalendarEvent {
  code: string;
  label: string;
  academic_period: string | null;
  event_date: string | null;
  date_range_start: string | null;
  date_range_end: string | null;
  notes: string | null;
  active_from: string | null;
  active_to: string | null;
}

export interface SchoolCalendarDocument {
  calendar_id: string;
  source_snapshot_id: string;
  calendar_kind: "school";
  title: string;
  period_label: string | null;
  active_from: string | null;
  active_to: string | null;
  legend: CalendarLegendItem[];
  events: SchoolCalendarEvent[];
}

export interface PaymentCalendarDocument {
  calendar_id: string;
  source_snapshot_id: string;
  calendar_kind: "payment";
  title: string;
  period_label: string | null;
  active_from: string | null;
  active_to: string | null;
  legend: CalendarLegendItem[];
  events: never[];
  payment_events: PaymentCalendarEvent[];
}

export interface AcademicCareerReference {
  career_id: string;
  category: "ingenieria" | "licenciatura";
  display_name: string;
  source_url: string;
  study_plan_url: string | null;
}

export interface JointProgramReference {
  component_career_ids: string[];
  display_name: string;
  joint_program_id: string;
  source_url: string;
}

export interface SiteNewsItem {
  category: string;
  href: string;
  published_at: string | null;
  source_label: string;
  source_url: string;
  summary: string;
  title: string;
}

export interface LocalSearchIndexItem {
  body: string;
  category: string;
  href: string;
  keywords: string[];
  title: string;
}
