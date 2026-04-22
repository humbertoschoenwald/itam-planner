export type LocaleCode = "es-MX" | "en";
export type AcademicLevel = "undergraduate" | "jointPrograms" | "graduate";

export type StudentProfile = {
  academicLevel: AcademicLevel | null;
  entryTerm: string;
  activePlanIds: string[];
  locale: LocaleCode;
  selectedCareerIds: string[];
  selectedJointProgramIds: string[];
}

export type PlannerState = {
  selectedPeriodId: string | null;
  selectedOfferingIds: string[];
  selectedSubjectCodes: string[];
}

export type PlannerWidgetId = "today" | "week" | "subjects";

export type BulletinSummary = {
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

export type BulletinRequirementReference = {
  ordinal_position: number;
  referenced_course_code: string;
}

export type BulletinRequirement = {
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

export type BulletinDocument = {
  requirements: BulletinRequirement[];
} & BulletinSummary

export type SchedulePeriodSummary = {
  period_id: string;
  label: string;
  level: string;
  year: number | null;
  term: string | null;
  active_from: string | null;
  active_to: string | null;
}

export type ScheduleMeeting = {
  weekday_code: string;
  start_time: string;
  end_time: string;
  room_code: string | null;
  campus_name: string | null;
}

export type ScheduleOffering = {
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

export type SchedulePeriodDetail = {
  subjects: Array<{
    subject_id: string;
    raw_value: string;
    course_code: string;
    canonical_title: string;
  }>;
  offerings: ScheduleOffering[];
} & SchedulePeriodSummary

export type ScrapeRunSummary = {
  run_id: string;
  started_at: string;
  completed_at: string | null;
  status: "running" | "succeeded" | "failed" | "no_changes" | "drift_detected";
  notes: string | null;
}

export type PromotedReleaseSummary = {
  release_id: string;
  run_id: string;
  promoted_at: string;
  notes: string | null;
}

export type SourceSnapshotSummary = {
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

export type SourcesMetadata = {
  scrape_runs: ScrapeRunSummary[];
  promoted_releases: PromotedReleaseSummary[];
  source_snapshots: SourceSnapshotSummary[];
}

export type CalendarLegendItem = {
  symbol: string;
  label: string;
  notes: string | null;
}

export type SchoolCalendarEvent = {
  symbol: string;
  label: string;
  event_date: string;
  notes: string | null;
  active_from: string | null;
  active_to: string | null;
}

export type PaymentCalendarEvent = {
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

export type SchoolCalendarDocument = {
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

export type PaymentCalendarDocument = {
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

export type AcademicCareerReference = {
  career_id: string;
  category: "engineering" | "degree";
  display_name: string;
  source_url: string;
  study_plan_url: string | null;
}

export type JointProgramReference = {
  contact_emails: string[];
  component_career_ids: string[];
  coordinators: string[];
  display_name: string;
  joint_program_id: string;
  phone_extensions: string[];
  source_url: string;
}

export type GraduateProgramReference = {
  admission_process_url: string | null;
  brochure_url: string | null;
  calendar_url: string | null;
  contact_emails: string[];
  display_name: string;
  graduate_program_id: string;
  microsite_url: string | null;
  program_kind: "doctorate" | "specialization" | "master" | "mba";
  source_url: string;
  status: "active" | "under-review";
  study_plan_url: string | null;
}

export type DoubleDegreeReference = {
  base_program_label: string;
  brochure_urls: string[];
  contact_emails: string[];
  degree_labels: string[];
  display_name: string;
  double_degree_id: string;
  eligibility_label: string | null;
  language_requirement: string | null;
  location: string | null;
  notes: string[];
  partner_institution: string | null;
  source_url: string;
}

export type SiteNewsItem = {
  category: string;
  href: string;
  published_at: string | null;
  source_label: string;
  source_url: string;
  summary: string;
  title: string;
}

export type LocalSearchIndexItem = {
  body: string;
  category: string;
  href: string;
  keywords: string[];
  title: string;
}
