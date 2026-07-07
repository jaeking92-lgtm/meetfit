const DEFAULT_MEETING_LENGTH = 30;
const MEETING_LENGTH_OPTIONS = [30, 60];
const START_OF_DAY = 9 * 60;
const WORK_MINUTES = 9 * 60;
const PREFERRED_START = 14 * 60 - START_OF_DAY;
const COMFORT_START = 10 * 60 - START_OF_DAY;
const COMFORT_END = 17 * 60 - START_OF_DAY;
const LUNCH_START = 12 * 60 - START_OF_DAY;
const LUNCH_END = 13 * 60 - START_OF_DAY;
const POST_LUNCH_END = 14 * 60 - START_OF_DAY;
const AVAILABILITY_STEP = 30;
const AVAILABILITY_SLOT_COUNT = WORK_MINUTES / AVAILABILITY_STEP;
const MEETING_SHARE_URL = "meetfit.app/m/ob-2026-flow";
const AVAILABILITY_PAINT_MODES = {
  meeting: "회의",
  focus: "집중업무",
  travel: "출장",
  vacation: "휴가",
  lunch: "점심"
};
const AVAILABILITY_PAINT_KEYS = Object.keys(AVAILABILITY_PAINT_MODES);
const AVAILABILITY_NOTE_PLACEHOLDERS = {
  meeting: "미팅 제목",
  focus: "업무명",
  travel: "출장명",
  vacation: "휴가명",
  lunch: "점심"
};
const DEFAULT_MEETING_TITLE = "신규 온보딩 플로우 개선 회의";

function iconMarkup(name, className = "ui-icon") {
  return `<svg class="${className}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
}

function getNextMonday() {
  const date = new Date();
  const daysUntilNextMonday = ((8 - date.getDay()) % 7) || 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + daysUntilNextMonday);
  return date;
}

const BASE_WEEK_START = getNextMonday();
const CHART = {
  cx: 360,
  cy: 360,
  outer: 286,
  ringWidth: 30,
  gap: 13,
  startAngle: 180,
  totalAngle: 270
};
let scheduleLabelPathId = 0;

const days = [
  { key: "mon", label: "월", date: "6/30", full: "월요일 6/30" },
  { key: "tue", label: "화", date: "7/1", full: "화요일 7/1" },
  { key: "wed", label: "수", date: "7/2", full: "수요일 7/2" },
  { key: "thu", label: "목", date: "7/3", full: "목요일 7/3" },
  { key: "fri", label: "금", date: "7/4", full: "금요일 7/4" }
];

function scheduleItem(title, start, end, importance = "soft") {
  const toMinute = value => {
    const [hour, minute] = value.split(":").map(Number);
    return hour * 60 + minute - START_OF_DAY;
  };

  return {
    title,
    start: toMinute(start),
    end: toMinute(end),
    importance
  };
}

const people = [
  {
    id: "p1",
    name: "김재혁",
    role: "UXUI 디자이너",
    type: "필수",
    isMe: true,
    initial: "김",
    color: "#4F8DF7",
    schedule: {
      mon: [
        scheduleItem("사용자 인터뷰", "10:00", "11:00"),
        scheduleItem("디자인 의사결정", "14:00", "15:00", "hard")
      ],
      tue: [
        scheduleItem("외부 디자인 워크숍", "13:00", "15:00", "hard")
      ],
      wed: [
        scheduleItem("사용성 검증", "10:00", "11:00", "hard"),
        scheduleItem("최종 디자인 승인", "15:00", "16:00", "hard")
      ],
      thu: [
        scheduleItem("온보딩 워크숍", "13:00", "15:00")
      ],
      fri: [
        scheduleItem("오후 반차", "14:00", "18:00", "hard")
      ]
    }
  },
  {
    id: "p2",
    name: "김민수",
    role: "프로덕트 매니저",
    type: "필수",
    initial: "김",
    color: "#36B37E",
    schedule: {
      mon: [
        scheduleItem("경영진 보고", "09:00", "10:00", "hard"),
        scheduleItem("고객사 미팅", "15:00", "16:00", "hard")
      ],
      tue: [
        scheduleItem("스프린트 킥오프", "10:00", "11:00"),
        scheduleItem("릴리즈 의사결정", "15:00", "16:00", "hard")
      ],
      wed: [
        scheduleItem("임원 리뷰", "11:00", "12:00", "hard"),
        scheduleItem("릴리즈 승인", "16:00", "17:00", "hard")
      ],
      thu: [
        scheduleItem("파트너 미팅", "14:00", "15:30", "hard")
      ],
      fri: [
        scheduleItem("오후 휴가", "13:00", "18:00", "hard")
      ]
    }
  },
  {
    id: "p3",
    name: "박서연",
    role: "프론트엔드 엔지니어",
    type: "필수",
    initial: "박",
    color: "#FF8B3D",
    schedule: {
      mon: [
        scheduleItem("긴급 버그 대응", "13:00", "14:00", "hard")
      ],
      tue: [
        scheduleItem("배포 락다운", "14:00", "16:00", "hard")
      ],
      wed: [
        scheduleItem("보안 점검", "09:00", "10:00", "hard"),
        scheduleItem("핫픽스 검증", "13:00", "14:00", "hard")
      ],
      thu: [
        scheduleItem("장애 회고", "10:00", "12:00", "hard")
      ],
      fri: [
        scheduleItem("릴리즈 배포", "13:00", "15:00", "hard")
      ]
    }
  },
  {
    id: "p4",
    name: "정우진",
    role: "프로덕트 데이터 분석가",
    type: "필수",
    initial: "정",
    color: "#8B6FE8",
    schedule: {
      mon: [
        scheduleItem("지표 감사", "11:00", "12:00"),
        scheduleItem("분석 결과 보고", "14:00", "15:30", "hard")
      ],
      tue: [
        scheduleItem("실험 결과 리뷰", "13:00", "14:00"),
        scheduleItem("데이터 배치 점검", "16:00", "17:00")
      ],
      wed: [
        scheduleItem("핵심 지표 리뷰", "10:00", "11:00"),
        scheduleItem("데이터 승인", "15:30", "16:30", "hard")
      ],
      thu: [
        scheduleItem("리포트 발행", "09:00", "10:00"),
        scheduleItem("대시보드 검수", "13:00", "15:00")
      ],
      fri: [
        scheduleItem("주간 지표 보고", "09:00", "10:00"),
        scheduleItem("데이터 반영 확인", "15:00", "16:00")
      ]
    }
  },
  {
    id: "p5",
    name: "최은지",
    role: "그로스 마케터",
    type: "참조",
    initial: "최",
    color: "#11A7A7",
    schedule: {
      mon: [
        scheduleItem("캠페인 촬영", "10:00", "12:00"),
        scheduleItem("대행사 미팅", "16:00", "17:00", "hard")
      ],
      tue: [
        scheduleItem("광고 집행 승인", "09:00", "10:00", "hard"),
        scheduleItem("브랜드 캠페인 리뷰", "15:00", "16:00")
      ],
      wed: [
        scheduleItem("세일즈 웨비나", "14:00", "16:00", "hard")
      ],
      thu: [
        scheduleItem("연차", "09:00", "18:00", "hard")
      ],
      fri: [
        scheduleItem("파트너 공동 캠페인", "10:00", "12:00", "hard")
      ]
    }
  },
  {
    id: "p6",
    name: "이재훈",
    role: "고객 성공 매니저",
    type: "참조",
    initial: "이",
    color: "#FF5C7A",
    schedule: {
      mon: [
        scheduleItem("고객 온보딩", "13:00", "15:00", "hard"),
        scheduleItem("엔터프라이즈 콜", "17:00", "18:00", "hard")
      ],
      tue: [
        scheduleItem("오전 반차", "09:00", "13:00", "hard"),
        scheduleItem("장애 고객 콜", "15:00", "16:00", "hard")
      ],
      wed: [
        scheduleItem("VIP 고객 콜", "15:00", "16:00", "hard")
      ],
      thu: [
        scheduleItem("고객 방문", "10:00", "12:00", "hard"),
        scheduleItem("도입 고객 대응", "15:00", "17:00", "hard")
      ],
      fri: [
        scheduleItem("전사 교육", "09:00", "12:00"),
        scheduleItem("오후 휴가", "13:00", "18:00", "hard")
      ]
    }
  }
];

const state = {
  selectedIds: ["p1", "p2", "p3", "p4"],
  selectedDay: "wed",
  selectedCandidate: null,
  meetingLength: DEFAULT_MEETING_LENGTH,
  meetingTitle: DEFAULT_MEETING_TITLE,
  showPersonal: true,
  showAllCandidates: false,
  mobileCandidatesOpen: false,
  weekOffset: 0,
  confirmedCandidate: null,
  confirmModalStep: "confirm",
  myAvailabilitySaved: false,
  myAvailability: null,
  myAvailabilityPaints: null,
  myAvailabilityNotes: null,
  myAvailabilityAllowsLunch: false,
  availabilityDraft: null,
  availabilityDraftNotes: null,
  availabilityDraftAllowsLunch: false,
  availabilityDragging: false,
  availabilityDragMode: "meeting",
  availabilityPaintMode: "meeting",
  editingNoteTarget: null,
  reasonsExpanded: false,
  displayGuideExpanded: false,
  availabilityFeedback: false,
  entryFeedbackState: "calculating",
  linkCopied: false,
  calendarAdded: false,
  shareUpdatedText: "마지막 업데이트 2분 전"
};

const els = {
  availabilityEntryBtn: document.getElementById("availabilityEntryBtn"),
  copyLinkBtn: document.getElementById("copyLinkBtn"),
  shareUpdated: document.getElementById("shareUpdated"),
  participantList: document.getElementById("participantList"),
  weekStrip: document.getElementById("weekStrip"),
  chartSvg: document.getElementById("chartSvg"),
  entryFeedback: document.getElementById("entryFeedback"),
  entryFeedbackTitle: document.getElementById("entryFeedbackTitle"),
  entryFeedbackText: document.getElementById("entryFeedbackText"),
  scheduleDetail: document.getElementById("scheduleDetail"),
  scheduleDetailClose: document.getElementById("scheduleDetailClose"),
  scheduleDetailColor: document.getElementById("scheduleDetailColor"),
  scheduleDetailPerson: document.getElementById("scheduleDetailPerson"),
  scheduleDetailTitle: document.getElementById("scheduleDetailTitle"),
  scheduleDetailTime: document.getElementById("scheduleDetailTime"),
  candidateList: document.getElementById("candidateList"),
  candidateToggle: document.getElementById("candidateToggle"),
  candidatePanelBody: document.getElementById("candidatePanelBody"),
  mobileCandidateToggle: document.getElementById("mobileCandidateToggle"),
  mobileCandidateToggleLabel: document.getElementById("mobileCandidateToggleLabel"),
  selectionCount: document.getElementById("selectionCount"),
  selectedSummary: document.getElementById("selectedSummary"),
  durationOptions: document.querySelectorAll(".duration-option"),
  displayGuide: document.getElementById("displayGuide"),
  displayGuideToggle: document.getElementById("displayGuideToggle"),
  displayGuideBody: document.getElementById("displayGuideBody"),
  asideDesc: document.getElementById("asideDesc"),
  reasonList: document.getElementById("reasonList"),
  reasonToggle: document.getElementById("reasonToggle"),
  reasonSummaryText: document.getElementById("reasonSummaryText"),
  centerState: document.getElementById("centerState"),
  centerDay: document.getElementById("centerDay"),
  centerTime: document.getElementById("centerTime"),
  centerMeta: document.getElementById("centerMeta"),
  centerCard: document.getElementById("centerCard"),
  centerSwitchHint: document.getElementById("centerSwitchHint"),
  actionRow: document.getElementById("actionRow"),
  confirmBtn: document.getElementById("confirmBtn"),
  togglePersonalBtn: document.getElementById("togglePersonalBtn"),
  confirmModal: document.getElementById("confirmModal"),
  confirmModalClose: document.getElementById("confirmModalClose"),
  confirmModalIcon: document.getElementById("confirmModalIcon"),
  confirmModalTitle: document.getElementById("confirmModalTitle"),
  confirmModalMessage: document.getElementById("confirmModalMessage"),
  confirmTitleField: document.getElementById("confirmTitleField"),
  confirmMeetingTitleInput: document.getElementById("confirmMeetingTitleInput"),
  confirmModalDate: document.getElementById("confirmModalDate"),
  confirmModalTime: document.getElementById("confirmModalTime"),
  confirmModalAttendees: document.getElementById("confirmModalAttendees"),
  confirmModalCancel: document.getElementById("confirmModalCancel"),
  confirmModalSubmit: document.getElementById("confirmModalSubmit"),
  availabilityModal: document.getElementById("availabilityModal"),
  availabilityModalClose: document.getElementById("availabilityModalClose"),
  availabilityGrid: document.getElementById("availabilityGrid"),
  availabilitySummary: document.getElementById("availabilitySummary"),
  availabilityDurationBadge: document.getElementById("availabilityDurationBadge"),
  allowLunchMeetingInput: document.getElementById("allowLunchMeetingInput"),
  availabilityPaintChoices: document.querySelectorAll(".paint-choice"),
  noteModal: document.getElementById("noteModal"),
  noteModalClose: document.getElementById("noteModalClose"),
  noteModalType: document.getElementById("noteModalType"),
  noteTitleInput: document.getElementById("noteTitleInput"),
  notePeopleInput: document.getElementById("notePeopleInput"),
  notePlaceInput: document.getElementById("notePlaceInput"),
  noteModalCancel: document.getElementById("noteModalCancel"),
  noteModalSave: document.getElementById("noteModalSave"),
  selectWorkHoursBtn: document.getElementById("selectWorkHoursBtn"),
  excludeLunchBtn: document.getElementById("excludeLunchBtn"),
  clearAvailabilityBtn: document.getElementById("clearAvailabilityBtn"),
  calendarSyncBtn: document.getElementById("calendarSyncBtn"),
  availabilityCancelBtn: document.getElementById("availabilityCancelBtn"),
  saveAvailabilityBtn: document.getElementById("saveAvailabilityBtn")
};

function validateDomRefs(refs) {
  const missing = Object.entries(refs)
    .filter(([, value]) => {
      if (value instanceof NodeList) return value.length === 0;
      return !value;
    })
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(`MeetFit DOM reference missing: ${missing.join(", ")}`);
  }
}

validateDomRefs(els);

let availabilityFeedbackTimer = null;
let entryFeedbackTimers = [];

function selectedPeople() {
  return people.filter(person => state.selectedIds.includes(person.id));
}

function requiredPeople() {
  const selected = selectedPeople();
  const required = selected.filter(person => person.type !== "참조");
  return required.length ? required : selected;
}

function referencePeople() {
  const selected = selectedPeople();
  const hasRequired = selected.some(person => person.type !== "참조");

  if (!hasRequired) return [];

  return selected.filter(person => person.type === "참조");
}

function displayDay(dayOrKey) {
  const day = typeof dayOrKey === "string"
    ? days.find(item => item.key === dayOrKey)
    : dayOrKey;
  const dayIndex = days.findIndex(item => item.key === day.key);
  const date = new Date(BASE_WEEK_START);
  date.setDate(date.getDate() + state.weekOffset * 7 + dayIndex);

  const shortDate = `${date.getMonth() + 1}/${date.getDate()}`;

  return {
    ...day,
    date: shortDate,
    full: `${day.label}요일 ${shortDate}`,
    long: `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${day.label}요일`
  };
}

function isConfirmedCandidate(candidate) {
  return Boolean(
    state.confirmedCandidate &&
    state.confirmedCandidate.weekOffset === state.weekOffset &&
    sameCandidate(candidate, state.confirmedCandidate)
  );
}

function minutesToLabel(value) {
  const total = START_OF_DAY + value;
  const hour = Math.floor(total / 60);
  const min = total % 60;
  return `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

function timeRangeLabel(start, end) {
  return `${minutesToLabel(start)} - ${minutesToLabel(end)}`;
}

function durationLabel(minutes = state.meetingLength) {
  if (minutes < 60) return `${minutes}분`;

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;
  return remaining ? `${hours}시간 ${remaining}분` : `${hours}시간`;
}

function confirmedCandidateForCurrentWeek() {
  return state.confirmedCandidate &&
    state.confirmedCandidate.weekOffset === state.weekOffset
    ? state.confirmedCandidate
    : null;
}

function slotPaintMode(value) {
  return AVAILABILITY_PAINT_KEYS.includes(value) ? value : null;
}

function isAvailableSlot(value) {
  return slotPaintMode(value) === null;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function emptyNoteDetail() {
  return {
    title: "",
    people: "",
    place: ""
  };
}

function normalizeNoteDetail(value) {
  if (!value) return emptyNoteDetail();
  if (typeof value === "string") {
    return {
      ...emptyNoteDetail(),
      title: value
    };
  }

  return {
    title: value.title || "",
    people: value.people || "",
    place: value.place || ""
  };
}

function noteTitle(value, fallback = "") {
  const detail = normalizeNoteDetail(value);
  return detail.title || fallback;
}

function noteSummary(value) {
  const detail = normalizeNoteDetail(value);
  return [detail.people, detail.place].filter(Boolean).join(" · ");
}

function hasNoteDetail(value) {
  const detail = normalizeNoteDetail(value);
  return Boolean(detail.title || detail.people || detail.place);
}

function attendeeSummary() {
  const attendees = selectedPeople();
  return {
    count: attendees.length,
    names: attendees.map(person => person.name).join(", ")
  };
}

function blankAvailabilityDraft(value = null) {
  const normalized = slotPaintMode(value);
  return Object.fromEntries(
    days.map(day => [day.key, Array.from({ length: AVAILABILITY_SLOT_COUNT }, () => normalized)])
  );
}

function cloneAvailabilityDraft(draft) {
  return Object.fromEntries(
    days.map(day => [
      day.key,
      (draft?.[day.key] || Array.from({ length: AVAILABILITY_SLOT_COUNT }, () => null))
        .map(slot => slot === "available" ? null : slotPaintMode(slot))
    ])
  );
}

function blankAvailabilityNotes() {
  return Object.fromEntries(
    days.map(day => [day.key, Array.from({ length: AVAILABILITY_SLOT_COUNT }, emptyNoteDetail)])
  );
}

function cloneAvailabilityNotes(notes) {
  return Object.fromEntries(
    days.map(day => [
      day.key,
      (notes?.[day.key] || Array.from({ length: AVAILABILITY_SLOT_COUNT }, emptyNoteDetail))
        .map(normalizeNoteDetail)
    ])
  );
}

function schedulePaintMode(item = {}) {
  if (item.isGlobal) return "lunch";
  if (scheduleTone(item) === "vacation") return "vacation";
  if (scheduleTone(item) === "external") return "travel";
  return "meeting";
}

function myBaseAvailabilityDraft() {
  const me = people.find(person => person.isMe);
  const draft = blankAvailabilityDraft(null);

  if (!me) return draft;

  days.forEach(day => {
    baseBlockedScheduleFor(me, day.key).forEach(item => {
      const mode = schedulePaintMode(item);
      const startIndex = Math.max(0, Math.floor(item.start / AVAILABILITY_STEP));
      const endIndex = Math.min(
        AVAILABILITY_SLOT_COUNT,
        Math.ceil(item.end / AVAILABILITY_STEP)
      );

      for (let index = startIndex; index < endIndex; index += 1) {
        draft[day.key][index] = mode;
      }
    });
  });

  return draft;
}

function myBaseAvailabilityNotes() {
  const me = people.find(person => person.isMe);
  const notes = blankAvailabilityNotes();

  if (!me) return notes;

  days.forEach(day => {
    baseBlockedScheduleFor(me, day.key).forEach(item => {
      const detail = { ...emptyNoteDetail(), title: item.title };
      const startIndex = Math.max(0, Math.floor(item.start / AVAILABILITY_STEP));
      const endIndex = Math.min(
        AVAILABILITY_SLOT_COUNT,
        Math.ceil(item.end / AVAILABILITY_STEP)
      );

      for (let index = startIndex; index < endIndex; index += 1) {
        notes[day.key][index] = detail;
      }
    });
  });

  return notes;
}

function intervalsToSlots(intervals) {
  const slots = Array.from({ length: AVAILABILITY_SLOT_COUNT }, () => false);

  intervals.forEach(([start, end]) => {
    for (let index = 0; index < AVAILABILITY_SLOT_COUNT; index += 1) {
      const slotStart = index * AVAILABILITY_STEP;
      const slotEnd = slotStart + AVAILABILITY_STEP;
      const midpoint = (slotStart + slotEnd) / 2;
      if (midpoint >= start && midpoint < end) {
        slots[index] = true;
      }
    }
  });

  return slots;
}

function slotsToIntervals(slots) {
  const intervals = [];
  let startIndex = null;

  slots.forEach((slot, index) => {
    const isAvailable = isAvailableSlot(slot);

    if (isAvailable && startIndex === null) {
      startIndex = index;
    }

    if ((!isAvailable || index === slots.length - 1) && startIndex !== null) {
      const endIndex = isAvailable && index === slots.length - 1 ? index + 1 : index;
      intervals.push([startIndex * AVAILABILITY_STEP, endIndex * AVAILABILITY_STEP]);
      startIndex = null;
    }
  });

  return intervals;
}

function availabilityIntervalsToDraft(availability) {
  const availableSlots = intervalsToSlots(availability);
  return availableSlots.map(isAvailable => isAvailable ? null : "meeting");
}

function draftToAvailability(draft) {
  return Object.fromEntries(
    days.map(day => [day.key, slotsToIntervals(draft[day.key])])
  );
}

function subtractIntervals(sourceIntervals, blockers) {
  let result = sourceIntervals.map(interval => [...interval]);

  blockers.forEach(([blockStart, blockEnd]) => {
    result = result.flatMap(([start, end]) => {
      if (blockEnd <= start || blockStart >= end) return [[start, end]];

      const next = [];
      if (blockStart > start) next.push([start, Math.min(blockStart, end)]);
      if (blockEnd < end) next.push([Math.max(blockEnd, start), end]);
      return next;
    });
  });

  return result.filter(([start, end]) => end > start);
}

function inverseIntervals(availableIntervals) {
  const intervals = [];
  let cursor = 0;

  availableIntervals
    .map(([start, end]) => [Math.max(0, start), Math.min(WORK_MINUTES, end)])
    .filter(([start, end]) => end > start)
    .sort((a, b) => a[0] - b[0])
    .forEach(([start, end]) => {
      if (start > cursor) intervals.push([cursor, start]);
      cursor = Math.max(cursor, end);
    });

  if (cursor < WORK_MINUTES) intervals.push([cursor, WORK_MINUTES]);
  return intervals;
}

function angleForMinute(minute) {
  return CHART.startAngle + (minute / WORK_MINUTES) * CHART.totalAngle;
}

function polar(cx, cy, r, angle) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polar(cx, cy, r, startAngle);
  const end = polar(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

function describeAnnularSector(cx, cy, innerRadius, outerRadius, startAngle, endAngle) {
  const outerStart = polar(cx, cy, outerRadius, startAngle);
  const outerEnd = polar(cx, cy, outerRadius, endAngle);
  const innerEnd = polar(cx, cy, innerRadius, endAngle);
  const innerStart = polar(cx, cy, innerRadius, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    "Z"
  ].join(" ");
}

function createSvg(tag, attrs = {}) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([key, value]) => {
    node.setAttribute(key, value);
  });
  return node;
}

function compactScheduleTitle(title) {
  const cleanTitle = String(title || "일정").replace(/\s+/g, " ").trim();
  return cleanTitle.length > 8 ? `${cleanTitle.slice(0, 8)}...` : cleanTitle;
}

function meetingTitle() {
  return (state.meetingTitle || DEFAULT_MEETING_TITLE).trim() || DEFAULT_MEETING_TITLE;
}

function compactMeetingTitle() {
  const normalized = meetingTitle()
    .replace(/신규|플로우|온보딩/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const fallback = normalized || meetingTitle();
  return fallback.length > 6 ? `${fallback.slice(0, 6)}...` : fallback;
}

function scheduleTone(item = {}) {
  const title = item.title || "";
  if (/휴가|반차|연차/.test(title)) return "vacation";
  if (/배포|장애|긴급|핫픽스/.test(title)) return "critical";
  if (/고객|콜|임원|경영진|파트너|외부|방문|대행사|VIP/.test(title)) return "external";
  if (/승인|의사결정|보고/.test(title)) return "approval";
  return "";
}

function scheduleBlocksMeeting(item = {}) {
  if (item.isGlobal) return true;
  if (item.importance) return item.importance === "hard";
  return ["vacation", "critical", "external", "approval"].includes(scheduleTone(item));
}

function scheduleStroke(person, item) {
  if (item.isGlobal) return "#cbd5e1";
  if (scheduleTone(item) === "vacation") return "#fb7185";
  return person.color;
}

function createScheduleLabel(person, item, radius) {
  if (item.isGlobal || item.end - item.start < 60) return null;

  const pathId = `schedule-label-path-${scheduleLabelPathId += 1}`;
  const group = createSvg("g", {
    class: `arc-schedule-label ${scheduleTone(item)}`
  });
  const labelPath = createSvg("path", {
    id: pathId,
    d: describeArc(
      CHART.cx,
      CHART.cy,
      radius,
      angleForMinute(item.start),
      angleForMinute(item.end)
    ),
    class: "arc-schedule-label-path"
  });
  const titleText = createSvg("text", {
    class: "arc-schedule-title",
    dy: "-3"
  });
  const titlePath = createSvg("textPath", {
    href: `#${pathId}`,
    startOffset: "50%",
    "text-anchor": "middle"
  });
  const timeText = createSvg("text", {
    class: "arc-schedule-time",
    dy: "9"
  });
  const timePath = createSvg("textPath", {
    href: `#${pathId}`,
    startOffset: "50%",
    "text-anchor": "middle"
  });

  titlePath.textContent = compactScheduleTitle(item.title);
  timePath.textContent = timeRangeLabel(item.start, item.end);
  titleText.appendChild(titlePath);
  timeText.appendChild(timePath);
  group.append(labelPath, titleText, timeText);
  return group;
}

function createConfirmedMeetingLayer(candidate, innerEdge, outerEdge) {
  const pathId = `confirmed-meeting-path-${scheduleLabelPathId += 1}`;
  const midRadius = (innerEdge + outerEdge) / 2;
  const group = createSvg("g", {
    class: "confirmed-meeting-layer",
    "aria-label": `${meetingTitle()} ${timeRangeLabel(candidate.start, candidate.end)} 확정됨`
  });

  const band = createSvg("path", {
    d: describeAnnularSector(
      CHART.cx,
      CHART.cy,
      innerEdge,
      outerEdge,
      angleForMinute(candidate.start),
      angleForMinute(candidate.end)
    ),
    class: "confirmed-meeting-band"
  });
  const labelPath = createSvg("path", {
    id: pathId,
    d: describeArc(
      CHART.cx,
      CHART.cy,
      midRadius,
      angleForMinute(candidate.start),
      angleForMinute(candidate.end)
    ),
    class: "confirmed-meeting-label-path"
  });
  const titleText = createSvg("text", {
    class: "confirmed-meeting-title",
    dy: "-4"
  });
  const titlePath = createSvg("textPath", {
    href: `#${pathId}`,
    startOffset: "50%",
    "text-anchor": "middle"
  });
  const timeText = createSvg("text", {
    class: "confirmed-meeting-time",
    dy: "9"
  });
  const timePath = createSvg("textPath", {
    href: `#${pathId}`,
    startOffset: "50%",
    "text-anchor": "middle"
  });

  titlePath.textContent = compactMeetingTitle();
  timePath.textContent = timeRangeLabel(candidate.start, candidate.end).replace(" - ", "-");
  titleText.appendChild(titlePath);
  timeText.appendChild(timePath);
  group.append(band, labelPath, titleText, timeText);
  return group;
}

function ringLayout(ringCount) {
  if (ringCount <= 4) {
    return {
      outerRadius: CHART.outer,
      ringWidth: CHART.ringWidth,
      gap: CHART.gap
    };
  }

  const innerRadius = 180;
  const step = (CHART.outer - innerRadius) / (ringCount - 1);
  const gap = 6;

  return {
    outerRadius: CHART.outer,
    ringWidth: step - gap,
    gap
  };
}

function baseBlockedScheduleFor(person, dayKey) {
  return [
    ...person.schedule[dayKey],
    {
      title: "점심시간",
      start: LUNCH_START,
      end: LUNCH_END,
      isGlobal: true
    }
  ];
}

function customLunchBlockers() {
  return state.myAvailabilityAllowsLunch ? [] : [[LUNCH_START, LUNCH_END]];
}

function customAvailabilityForDay(dayKey) {
  if (!state.myAvailabilitySaved || !state.myAvailability) return null;
  return subtractIntervals(state.myAvailability[dayKey] || [], customLunchBlockers());
}

function sameNoteDetail(a, b) {
  const left = normalizeNoteDetail(a);
  const right = normalizeNoteDetail(b);
  return left.title === right.title &&
    left.people === right.people &&
    left.place === right.place;
}

function customBlockedScheduleForDay(dayKey) {
  if (!state.myAvailabilitySaved || !state.myAvailabilityPaints) return null;

  const slots = state.myAvailabilityPaints[dayKey] || [];
  const notes = state.myAvailabilityNotes?.[dayKey] || [];
  const items = [];
  let startIndex = null;
  let currentMode = null;
  let currentNote = null;

  const pushItem = endIndex => {
    if (startIndex === null || !currentMode) return;

    const note = normalizeNoteDetail(currentNote);
    items.push({
      title: noteTitle(note, AVAILABILITY_PAINT_MODES[currentMode] || "일정 있음"),
      start: startIndex * AVAILABILITY_STEP,
      end: endIndex * AVAILABILITY_STEP,
      isGlobal: currentMode === "lunch",
      note
    });
  };

  for (let index = 0; index <= AVAILABILITY_SLOT_COUNT; index += 1) {
    const mode = index < AVAILABILITY_SLOT_COUNT ? slotPaintMode(slots[index]) : null;
    const note = index < AVAILABILITY_SLOT_COUNT ? notes[index] : null;
    const keepsRange = mode &&
      mode === currentMode &&
      sameNoteDetail(note, currentNote);

    if (keepsRange) continue;

    pushItem(index);
    startIndex = mode ? index : null;
    currentMode = mode;
    currentNote = mode ? note : null;
  }

  const hasLunchBlock = items.some(item => item.start < LUNCH_END && item.end > LUNCH_START);
  if (!state.myAvailabilityAllowsLunch && !hasLunchBlock) {
    items.push({
      title: "점심시간",
      start: LUNCH_START,
      end: LUNCH_END,
      isGlobal: true
    });
  }

  return items.sort((a, b) => a.start - b.start);
}

function blockedScheduleFor(person, dayKey) {
  const customBlocked = person.isMe ? customBlockedScheduleForDay(dayKey) : null;
  if (customBlocked) {
    return customBlocked;
  }

  const customAvailability = person.isMe ? customAvailabilityForDay(dayKey) : null;

  if (!customAvailability) {
    return baseBlockedScheduleFor(person, dayKey);
  }

  return inverseIntervals(customAvailability).map(([start, end]) => ({
    title: start === LUNCH_START && end === LUNCH_END ? "점심시간" : "비공개 일정",
    start,
    end,
    isGlobal: start === LUNCH_START && end === LUNCH_END
  }));
}

function baseAvailabilityFor(person, dayKey) {
  const blocked = baseBlockedScheduleFor(person, dayKey)
    .filter(scheduleBlocksMeeting)
    .map(item => [Math.max(0, item.start), Math.min(WORK_MINUTES, item.end)])
    .filter(([start, end]) => end > start)
    .sort((a, b) => a[0] - b[0]);

  const merged = [];
  blocked.forEach(([start, end]) => {
    const last = merged[merged.length - 1];
    if (!last || start > last[1]) {
      merged.push([start, end]);
    } else {
      last[1] = Math.max(last[1], end);
    }
  });

  const available = [];
  let cursor = 0;
  merged.forEach(([start, end]) => {
    if (start > cursor) available.push([cursor, start]);
    cursor = Math.max(cursor, end);
  });
  if (cursor < WORK_MINUTES) available.push([cursor, WORK_MINUTES]);

  return available;
}

function availabilityFor(person, dayKey) {
  const customAvailability = person.isMe ? customAvailabilityForDay(dayKey) : null;
  if (customAvailability) {
    return customAvailability;
  }

  return baseAvailabilityFor(person, dayKey);
}

function currentMyAvailabilityDraft() {
  if (state.myAvailabilitySaved && state.myAvailabilityPaints) {
    return cloneAvailabilityDraft(state.myAvailabilityPaints);
  }

  if (state.myAvailabilitySaved && state.myAvailability) {
    return Object.fromEntries(
      days.map(day => [
        day.key,
        availabilityIntervalsToDraft(state.myAvailability[day.key] || [])
      ])
    );
  }

  return myBaseAvailabilityDraft();
}

function currentMyAvailabilityNotes() {
  if (state.myAvailabilitySaved && state.myAvailabilityNotes) {
    return cloneAvailabilityNotes(state.myAvailabilityNotes);
  }

  return myBaseAvailabilityNotes();
}

function setDraftDay(dayKey, value) {
  const normalized = slotPaintMode(value);
  state.availabilityDraft[dayKey] = state.availabilityDraft[dayKey].map(() => normalized);
  state.availabilityDraftNotes[dayKey] = state.availabilityDraftNotes[dayKey].map(() => emptyNoteDetail());
}

function setDraftLunch(value) {
  const normalized = slotPaintMode(value);

  days.forEach(day => {
    for (
      let minute = LUNCH_START;
      minute < LUNCH_END;
      minute += AVAILABILITY_STEP
    ) {
      const index = minute / AVAILABILITY_STEP;
      state.availabilityDraft[day.key][index] = normalized;
      state.availabilityDraftNotes[day.key][index] = normalized === "lunch"
        ? { ...emptyNoteDetail(), title: "점심" }
        : emptyNoteDetail();
    }
  });
}

function applyDraftLunchPreference() {
  if (!state.availabilityDraft || !state.availabilityDraftNotes) return;

  days.forEach(day => {
    for (
      let minute = LUNCH_START;
      minute < LUNCH_END;
      minute += AVAILABILITY_STEP
    ) {
      const index = minute / AVAILABILITY_STEP;
      const currentMode = slotPaintMode(state.availabilityDraft[day.key][index]);

      if (state.availabilityDraftAllowsLunch) {
        if (currentMode === "lunch") {
          state.availabilityDraft[day.key][index] = null;
          state.availabilityDraftNotes[day.key][index] = emptyNoteDetail();
        }
        continue;
      }

      state.availabilityDraft[day.key][index] = "lunch";
      state.availabilityDraftNotes[day.key][index] = { ...emptyNoteDetail(), title: "점심" };
    }
  });
}

function renderLunchPreference() {
  els.allowLunchMeetingInput.checked = state.availabilityDraftAllowsLunch;
}

function selectedDraftMinutes() {
  return days.reduce((total, day) => {
    return total + state.availabilityDraft[day.key].filter(isAvailableSlot).length * AVAILABILITY_STEP;
  }, 0);
}

function renderAvailabilitySummary() {
  const selectedMinutes = selectedDraftMinutes();
  const availableDays = days.filter(day =>
    state.availabilityDraft[day.key].some(isAvailableSlot)
  ).length;
  const blockedSlots = days.reduce((total, day) => {
    return total + state.availabilityDraft[day.key].filter(slot => {
      const mode = slotPaintMode(slot);
      return Boolean(mode);
    }).length;
  }, 0);
  const hours = Math.floor(selectedMinutes / 60);
  const minutes = selectedMinutes % 60;
  const availableDurationText = `${hours}시간${minutes ? ` ${minutes}분` : ""}`;
  const meetingDurationText = durationLabel();
  const lunchLabel = state.availabilityDraftAllowsLunch ? " · 점심 후보 포함" : " · 점심 제외";

  els.availabilityDurationBadge.textContent = meetingDurationText;
  els.saveAvailabilityBtn.textContent = `저장하고 ${meetingDurationText} 후보 보기`;

  if (!blockedSlots) {
    els.availabilitySummary.textContent = `가능 5일 · ${availableDurationText}${lunchLabel} · 추천 기준 ${meetingDurationText}`;
    return;
  }

  const blockedLabel = blockedSlots ? ` · 일정 표시 ${blockedSlots}칸` : "";
  els.availabilitySummary.textContent = `가능 ${availableDays}일 · ${availableDurationText}${blockedLabel}${lunchLabel} · 추천 기준 ${meetingDurationText}`;
}

function updateDraftCell(cell, paintMode) {
  const { day, slot } = cell.dataset;
  const slotIndex = Number(slot);
  const nextMode = slotPaintMode(paintMode);
  state.availabilityDraft[day][slotIndex] = nextMode;
  state.availabilityDraftNotes[day][slotIndex] = nextMode === "lunch"
    ? { ...emptyNoteDetail(), title: "점심" }
    : emptyNoteDetail();
  cell.setAttribute("aria-pressed", String(Boolean(nextMode)));
  refreshAvailabilityCellStyles(day);
  renderAvailabilitySummary();
}

function availabilityCellClasses(dayKey, index) {
  const slots = state.availabilityDraft[dayKey];
  const currentMode = slotPaintMode(slots[index]);
  const prevMode = slotPaintMode(slots[index - 1]);
  const nextMode = slotPaintMode(slots[index + 1]);

  return [
    currentMode ? "filled" : "",
    currentMode ? `paint-${currentMode}` : "",
    currentMode && currentMode !== prevMode ? "range-start" : "",
    currentMode && currentMode !== nextMode ? "range-end" : "",
    currentMode && currentMode === prevMode && currentMode === nextMode ? "range-middle" : ""
  ].filter(Boolean).join(" ");
}

function availabilityEventMarkup({ mode, title, rangeLabel, note }) {
  const detail = normalizeNoteDetail(note);
  const eventRows = [
    `<span class="availability-event-title">${escapeHtml(title)}</span>`,
    rangeLabel ? `<span class="availability-event-row availability-event-time">${escapeHtml(rangeLabel)}</span>` : "",
    detail.people ? `<span class="availability-event-row"><b>인원</b>${escapeHtml(detail.people)}</span>` : "",
    detail.place ? `<span class="availability-event-row"><b>장소</b>${escapeHtml(detail.place)}</span>` : ""
  ].filter(Boolean).join("");

  return `
    <span class="availability-event-card">
      ${eventRows}
    </span>
    ${mode === "lunch" ? "" : `<span class="availability-note-trigger">${hasNoteDetail(note) ? "수정" : "내용 입력"}</span>`}
  `;
}

function refreshAvailabilityCellStyles(dayKey = null) {
  const selector = dayKey
    ? `.availability-cell[data-day="${dayKey}"]`
    : ".availability-cell";

  els.availabilityGrid.querySelectorAll(selector).forEach(cell => {
    const index = Number(cell.dataset.slot);
    const mode = slotPaintMode(state.availabilityDraft[cell.dataset.day][index]);
    const prevMode = slotPaintMode(state.availabilityDraft[cell.dataset.day][index - 1]);
    const nextMode = slotPaintMode(state.availabilityDraft[cell.dataset.day][index + 1]);

    cell.classList.toggle("filled", Boolean(mode));
    AVAILABILITY_PAINT_KEYS.forEach(key => {
      cell.classList.toggle(`paint-${key}`, mode === key);
    });
    cell.classList.toggle("range-start", Boolean(mode) && mode !== prevMode);
    cell.classList.toggle("range-end", Boolean(mode) && mode !== nextMode);
    cell.classList.toggle("range-middle", Boolean(mode) && mode === prevMode && mode === nextMode);
    cell.setAttribute("aria-pressed", String(Boolean(mode)));
    const note = state.availabilityDraftNotes?.[cell.dataset.day]?.[index] || "";
    const title = noteTitle(note, AVAILABILITY_PAINT_MODES[mode]);
    const summary = noteSummary(note);
    cell.classList.toggle("has-detail", Boolean(summary));
    const showNote = mode && mode !== prevMode;
    if (showNote) {
      const range = noteRangeForCell(cell.dataset.day, index);
      const rangeLabel = range
        ? timeRangeLabel(range.start * AVAILABILITY_STEP, range.end * AVAILABILITY_STEP)
        : "";
      cell.style.setProperty("--event-slots", range ? String(range.end - range.start) : "1");
      cell.innerHTML = availabilityEventMarkup({ mode, title, rangeLabel, note });
    } else {
      cell.style.removeProperty("--event-slots");
      cell.innerHTML = "";
    }
    cell.setAttribute(
      "aria-label",
      cell.dataset.labelBase + (mode ? ` ${title}${summary ? ` ${summary}` : ""}` : " 빈 시간")
    );
  });
}

function renderAvailabilityPaintChoices() {
  els.availabilityPaintChoices.forEach(button => {
    const active = button.dataset.paintMode === state.availabilityPaintMode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function noteRangeForCell(dayKey, slotIndex) {
  const mode = slotPaintMode(state.availabilityDraft[dayKey][slotIndex]);
  if (!mode) return null;

  let start = slotIndex;
  let end = slotIndex + 1;

  while (start > 0 && slotPaintMode(state.availabilityDraft[dayKey][start - 1]) === mode) {
    start -= 1;
  }

  while (
    end < AVAILABILITY_SLOT_COUNT &&
    slotPaintMode(state.availabilityDraft[dayKey][end]) === mode
  ) {
    end += 1;
  }

  return { dayKey, mode, start, end };
}

function openNoteModal(dayKey, slotIndex) {
  const target = noteRangeForCell(dayKey, slotIndex);
  if (!target || target.mode === "lunch") return;

  state.editingNoteTarget = target;
  const existingNote = normalizeNoteDetail(state.availabilityDraftNotes[dayKey][target.start]);
  els.noteModalType.textContent = AVAILABILITY_PAINT_MODES[target.mode];
  els.noteTitleInput.placeholder = AVAILABILITY_NOTE_PLACEHOLDERS[target.mode] || "미팅 제목";
  els.noteTitleInput.value = existingNote.title;
  els.notePeopleInput.value = existingNote.people;
  els.notePlaceInput.value = existingNote.place;
  els.noteModal.hidden = false;
  els.noteTitleInput.focus();
  els.noteTitleInput.select();
}

function closeNoteModal() {
  els.noteModal.hidden = true;
  state.editingNoteTarget = null;
}

function saveNoteModal() {
  const target = state.editingNoteTarget;
  if (!target) return;

  const note = {
    title: els.noteTitleInput.value.trim(),
    people: els.notePeopleInput.value.trim(),
    place: els.notePlaceInput.value.trim()
  };
  for (let index = target.start; index < target.end; index += 1) {
    state.availabilityDraftNotes[target.dayKey][index] = { ...note };
  }

  closeNoteModal();
  refreshAvailabilityCellStyles(target.dayKey);
  renderAvailabilitySummary();
}

function renderAvailabilityGrid() {
  const timeRows = Array.from({ length: AVAILABILITY_SLOT_COUNT }, (_, index) => {
    const start = index * AVAILABILITY_STEP;
    const end = start + AVAILABILITY_STEP;
    const isHour = start % 60 === 0;
    const isLunch = start >= LUNCH_START && start < LUNCH_END;

    return `
      <div class="availability-time ${isHour ? "hour" : ""} ${isLunch ? "lunch-time" : ""}">
        ${isHour ? `<span>${minutesToLabel(start)}</span>${start === LUNCH_START ? `<small>점심</small>` : ""}` : ""}
      </div>
      ${days.map(day => {
        const mode = slotPaintMode(state.availabilityDraft[day.key][index]);
        const prevMode = slotPaintMode(state.availabilityDraft[day.key][index - 1]);
        const note = state.availabilityDraftNotes?.[day.key]?.[index] || "";
        const title = noteTitle(note, AVAILABILITY_PAINT_MODES[mode]);
        const summary = noteSummary(note);
        const showNote = mode && mode !== prevMode;
        const range = showNote ? noteRangeForCell(day.key, index) : null;
        const rangeLabel = range
          ? timeRangeLabel(range.start * AVAILABILITY_STEP, range.end * AVAILABILITY_STEP)
          : "";
        const eventSlots = range ? range.end - range.start : 1;
        const labelBase = `${displayDay(day).full} ${timeRangeLabel(start, end)}`;
        return `
          <button
            class="availability-cell ${availabilityCellClasses(day.key, index)} ${summary ? "has-detail" : ""} ${isHour ? "hour-start" : ""} ${isLunch ? "lunch" : ""}"
            type="button"
            data-day="${day.key}"
            data-slot="${index}"
            data-label-base="${labelBase}"
            ${showNote ? `style="--event-slots: ${eventSlots};"` : ""}
            aria-label="${labelBase} ${mode ? `${title}${summary ? ` ${summary}` : ""}` : "빈 시간"}"
            aria-pressed="${Boolean(mode)}"
          >${showNote ? availabilityEventMarkup({ mode, title, rangeLabel, note }) : ""}</button>
        `;
      }).join("")}
    `;
  }).join("");

  els.availabilityGrid.innerHTML = `
    <div class="availability-corner"></div>
    ${days.map(day => `<button class="availability-day-head" type="button"><strong>${day.label}</strong><span>${displayDay(day).date}</span></button>`).join("")}
    ${timeRows}
  `;

  els.availabilityGrid.querySelectorAll(".availability-day-head").forEach((head, index) => {
    head.addEventListener("click", () => {
      const dayKey = days[index].key;
      const paintMode = state.availabilityPaintMode;
      const shouldPaint = !state.availabilityDraft[dayKey].every(slot => slotPaintMode(slot) === paintMode);
      setDraftDay(dayKey, shouldPaint ? paintMode : null);
      renderAvailabilityGrid();
    });
  });

  els.availabilityGrid.querySelectorAll(".availability-cell").forEach(cell => {
    cell.addEventListener("pointerdown", event => {
      if (event.target.closest(".availability-note-trigger")) {
        event.preventDefault();
        event.stopPropagation();
        openNoteModal(cell.dataset.day, Number(cell.dataset.slot));
        return;
      }

      event.preventDefault();
      state.availabilityDragging = true;
      const currentMode = slotPaintMode(state.availabilityDraft[cell.dataset.day][Number(cell.dataset.slot)]);
      state.availabilityDragMode = currentMode === state.availabilityPaintMode
        ? null
        : state.availabilityPaintMode;
      updateDraftCell(cell, state.availabilityDragMode);
    });

    cell.addEventListener("pointerenter", () => {
      if (!state.availabilityDragging) return;
      updateDraftCell(cell, state.availabilityDragMode);
    });

    cell.addEventListener("click", event => {
      event.preventDefault();
    });
  });

  renderAvailabilitySummary();
  renderLunchPreference();
  renderAvailabilityPaintChoices();
}

function openAvailabilityModal() {
  state.availabilityDraft = currentMyAvailabilityDraft();
  state.availabilityDraftNotes = currentMyAvailabilityNotes();
  state.availabilityDraftAllowsLunch = state.myAvailabilitySaved
    ? state.myAvailabilityAllowsLunch
    : false;
  applyDraftLunchPreference();
  renderAvailabilityGrid();
  els.availabilityEntryBtn.classList.add("active");
  els.availabilityModal.hidden = false;
  document.body.classList.add("modal-open");
  els.saveAvailabilityBtn.focus();
}

function closeAvailabilityModal() {
  closeNoteModal();
  els.availabilityModal.hidden = true;
  els.availabilityEntryBtn.classList.remove("active");
  document.body.classList.remove("modal-open");
  els.availabilityEntryBtn.focus();
}

function saveAvailability() {
  applyDraftLunchPreference();
  state.myAvailability = draftToAvailability(state.availabilityDraft);
  state.myAvailabilityPaints = cloneAvailabilityDraft(state.availabilityDraft);
  state.myAvailabilityNotes = cloneAvailabilityNotes(state.availabilityDraftNotes);
  state.myAvailabilityAllowsLunch = state.availabilityDraftAllowsLunch;
  state.myAvailabilitySaved = true;
  state.availabilityFeedback = true;
  state.confirmedCandidate = null;
  state.showAllCandidates = false;

  const recommendation = recommendedCandidate();
  if (recommendation) {
    state.selectedDay = recommendation.day;
    state.selectedCandidate = recommendation;
  } else {
    state.selectedCandidate = null;
  }

  closeAvailabilityModal();
  renderAll();

  if (availabilityFeedbackTimer) {
    clearTimeout(availabilityFeedbackTimer);
  }

  availabilityFeedbackTimer = setTimeout(() => {
    state.availabilityFeedback = false;
    renderCenter();
    renderAvailabilityEntry();
  }, 2200);
}

function renderAvailabilityEntry() {
  const title = els.availabilityEntryBtn.querySelector("strong");
  const caption = els.availabilityEntryBtn.querySelector("small");

  if (!title || !caption) return;

  els.availabilityEntryBtn.classList.toggle("saved", state.myAvailabilitySaved);
  els.availabilityEntryBtn.classList.toggle("just-saved", state.availabilityFeedback);
  title.textContent = state.myAvailabilitySaved
    ? "내 가능 시간 수정하기"
    : "내 가능 시간 등록하기";
  caption.textContent = state.myAvailabilitySaved
    ? state.availabilityFeedback
      ? "내 가능 시간이 반영됐어요."
      : "저장된 내 시간을 기준으로 추천 중"
    : "내 시간이 필요할 때만 조정";
}

function renderShareStatus() {
  if (!els.copyLinkBtn || !els.shareUpdated) return;

  els.copyLinkBtn.textContent = state.linkCopied ? "복사됨" : "링크 복사";
  els.shareUpdated.textContent = state.shareUpdatedText;
}

function copyMeetingLink() {
  const fullUrl = `https://${MEETING_SHARE_URL}`;

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(fullUrl).catch(() => {});
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = fullUrl;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  state.linkCopied = true;
  renderShareStatus();
  renderCandidates();

  setTimeout(() => {
    state.linkCopied = false;
    renderShareStatus();
    renderCandidates();
  }, 1600);
}

function addToCalendar() {
  state.calendarAdded = true;
  state.shareUpdatedText = "방금 업데이트됨";
  renderAll();
}

function renderEntryFeedback() {
  if (!els.entryFeedback) return;

  const feedbackState = state.entryFeedbackState;
  els.entryFeedback.hidden = feedbackState === "hidden";
  els.entryFeedback.dataset.state = feedbackState;

  if (feedbackState === "found") {
    const count = selectedDayCandidateCount();
    els.entryFeedbackTitle.textContent = `공통 가능 후보 ${count}개를 찾았어요`;
    els.entryFeedbackText.textContent = "가장 무리 없는 시간을 추천했어요.";
    return;
  }

  els.entryFeedbackTitle.textContent = "선택한 참석자의 가능 시간을 계산하고 있어요";
  els.entryFeedbackText.textContent = "공통으로 비어 있는 구간을 찾는 중이에요.";
}

function startEntryFeedback() {
  entryFeedbackTimers.forEach(timer => clearTimeout(timer));
  entryFeedbackTimers = [
    setTimeout(() => {
      state.entryFeedbackState = "found";
      renderEntryFeedback();
    }, 820),
    setTimeout(() => {
      state.entryFeedbackState = "hidden";
      renderEntryFeedback();
    }, 2500)
  ];
}

function renderDisplayGuide() {
  els.displayGuide.classList.toggle("open", state.displayGuideExpanded);
  els.displayGuideToggle.setAttribute("aria-expanded", String(state.displayGuideExpanded));
  els.displayGuideBody.hidden = !state.displayGuideExpanded;
}

function positionScheduleDetail(event, anchorElement) {
  const containerRect = els.scheduleDetail.parentElement.getBoundingClientRect();
  const anchorRect = anchorElement.getBoundingClientRect();
  const detailRect = els.scheduleDetail.getBoundingClientRect();
  const hasPointerPosition = Number.isFinite(event.clientX) && event.clientX > 0;
  const anchorX = hasPointerPosition ? event.clientX : anchorRect.right;
  const anchorY = hasPointerPosition ? event.clientY : anchorRect.top;
  const gap = 12;
  const edge = 8;

  let left = anchorX - containerRect.left + gap;
  let top = anchorY - containerRect.top - detailRect.height - gap;

  if (left + detailRect.width > containerRect.width - edge) {
    left = anchorX - containerRect.left - detailRect.width - gap;
  }

  if (top < edge) {
    top = anchorY - containerRect.top + gap;
  }

  left = Math.max(edge, Math.min(left, containerRect.width - detailRect.width - edge));
  top = Math.max(edge, Math.min(top, containerRect.height - detailRect.height - edge));

  els.scheduleDetail.style.left = `${left}px`;
  els.scheduleDetail.style.top = `${top}px`;
  els.scheduleDetail.style.right = "auto";
  els.scheduleDetail.style.bottom = "auto";
}

function showScheduleDetail(person, item, event, anchorElement) {
  const day = displayDay(state.selectedDay);
  const personLabel = item.isGlobal
    ? "모든 참석자"
    : `${person.name} · ${person.role}`;

  els.scheduleDetailColor.style.background = item.isGlobal ? "#94a3b8" : person.color;
  els.scheduleDetailPerson.textContent = personLabel;
  els.scheduleDetailTitle.textContent = item.isGlobal ? "점심시간 · 공통 제외" : item.title;
  const noteDetail = item.note ? noteSummary(item.note) : "";
  els.scheduleDetailTime.textContent = [
    day.full,
    timeRangeLabel(item.start, item.end),
    noteDetail
  ].filter(Boolean).join(" · ");
  els.scheduleDetail.hidden = false;
  positionScheduleDetail(event, anchorElement);
}

function hideScheduleDetail() {
  els.scheduleDetail.hidden = true;
}

function intersectTwo(a, b) {
  const result = [];
  let i = 0;
  let j = 0;

  while (i < a.length && j < b.length) {
    const start = Math.max(a[i][0], b[j][0]);
    const end = Math.min(a[i][1], b[j][1]);

    if (end > start) {
      result.push([start, end]);
    }

    if (a[i][1] < b[j][1]) {
      i += 1;
    } else {
      j += 1;
    }
  }

  return result;
}

function canAttendCandidate(person, candidate) {
  return availabilityFor(person, candidate.day).some(([start, end]) =>
    start <= candidate.start && end >= candidate.end
  );
}

function candidateFit(candidate) {
  const required = requiredPeople();
  const references = referencePeople();
  const referenceAvailable = references.filter(person => canAttendCandidate(person, candidate));
  const avoidsLunch = !(candidate.start < POST_LUNCH_END && candidate.end > LUNCH_START);
  const avoidsLate = candidate.end <= COMFORT_END;
  const comfortable = candidate.start >= COMFORT_START && avoidsLunch && avoidsLate;

  return {
    requiredCount: required.length,
    referenceCount: references.length,
    referenceAvailableCount: referenceAvailable.length,
    comfortable
  };
}

function candidateSupportLine(candidate) {
  if (!candidate) return "";

  const fit = candidateFit(candidate);
  const allSelectedCount = fit.requiredCount + fit.referenceCount;
  const allReferencesAvailable = fit.referenceCount > 0 &&
    fit.referenceAvailableCount === fit.referenceCount;
  const primary = allReferencesAvailable || fit.referenceCount === 0
    ? `선택한 ${allSelectedCount}명 모두 가능`
    : `필수 ${fit.requiredCount}명 모두 가능`;
  const reference = fit.referenceCount && !allReferencesAvailable
    ? `참조 ${fit.referenceAvailableCount}/${fit.referenceCount}명 가능`
    : null;
  const comfort = fit.comfortable
    ? "점심/퇴근 직전 제외"
    : "업무 흐름 기준 추천";

  return [primary, reference, comfort].filter(Boolean).join(" · ");
}

function commonIntervalsForDay(dayKey) {
  const selected = requiredPeople();

  if (selected.length === 0) {
    return [];
  }

  // 공통 시간은 필수 참석자의 강한 차단 일정만 제외한 빈 시간 교집합으로 만든다.
  let common = availabilityFor(selected[0], dayKey).map(interval => [...interval]);

  selected.slice(1).forEach(person => {
    common = intersectTwo(common, availabilityFor(person, dayKey));
  });

  return common.filter(([start, end]) => end - start >= state.meetingLength);
}

function ceilToStep(value, step) {
  return Math.ceil(value / step) * step;
}

function scoreCandidate(candidate) {
  const dayPreference = {
    mon: 10,
    tue: 25,
    wed: 40,
    thu: 15,
    fri: 0
  };
  const overlapsPostLunch = candidate.start < POST_LUNCH_END && candidate.end > LUNCH_END;
  const fit = candidateFit(candidate);
  let score = 400 - Math.abs(candidate.start - PREFERRED_START) * 0.3;

  score += dayPreference[candidate.day];
  score += fit.referenceAvailableCount * 34;
  if (fit.referenceCount && fit.referenceAvailableCount === fit.referenceCount) score += 22;
  if (candidate.start === PREFERRED_START) score += 40;
  if (candidate.start === 10 * 60 - START_OF_DAY) score += 50;
  if (overlapsPostLunch) score -= 200;
  if (candidate.start < COMFORT_START) score -= 120;
  if (candidate.start >= COMFORT_END) score -= 220;

  return score;
}

function generateCandidates() {
  const list = [];
  const meetingLength = state.meetingLength;

  days.forEach(day => {
    const common = commonIntervalsForDay(day.key);

    common.forEach(([rangeStart, rangeEnd]) => {
      for (
        let start = ceilToStep(rangeStart, 30);
        start + meetingLength <= rangeEnd;
        start += 30
      ) {
        list.push({
          day: day.key,
          dayLabel: displayDay(day).full,
          start,
          end: start + meetingLength,
          score: 0
        });
      }
    });
  });

  return list
    .map(item => ({
      ...item,
      score: scoreCandidate(item)
    }))
    .sort((a, b) => b.score - a.score);
}

function sameCandidate(a, b) {
  if (!a || !b) return false;
  return a.day === b.day && a.start === b.start && a.end === b.end;
}

function recommendedCandidate(candidates = generateCandidates()) {
  return candidates[0] || null;
}

function ensureCandidate() {
  const candidates = generateCandidates();
  const selectedDayCandidates = candidates.filter(
    candidate => candidate.day === state.selectedDay
  );

  if (!selectedDayCandidates.length) {
    state.selectedCandidate = null;
    return;
  }

  const stillExists = selectedDayCandidates.some(candidate =>
    sameCandidate(candidate, state.selectedCandidate)
  );

  if (!stillExists) {
    state.selectedCandidate = selectedDayCandidates[0];
  }
}

function countSlotsForDay(dayKey) {
  return generateCandidates().filter(candidate => candidate.day === dayKey).length;
}

function selectedDayCandidateCount() {
  return candidatesForDay(state.selectedDay).length;
}

function candidatesForDay(dayKey) {
  return generateCandidates()
    .filter(candidate => candidate.day === dayKey)
    .sort((a, b) => a.start - b.start);
}

function selectCandidate(candidate) {
  if (!candidate) return;

  state.selectedDay = candidate.day;
  state.selectedCandidate = {
    day: candidate.day,
    dayLabel: displayDay(candidate.day).full,
    start: candidate.start,
    end: candidate.end
  };
  state.showAllCandidates = false;
  state.mobileCandidatesOpen = false;
  hideScheduleDetail();
  renderAll();
}

function chartPointFromEvent(event) {
  const rect = els.chartSvg.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * 720,
    y: ((event.clientY - rect.top) / rect.height) * 720
  };
}

function minuteFromChartEvent(event) {
  const { x, y } = chartPointFromEvent(event);
  let angle = Math.atan2(y - CHART.cy, x - CHART.cx) * 180 / Math.PI;

  if (angle < CHART.startAngle) {
    angle += 360;
  }

  const progress = Math.max(0, Math.min(CHART.totalAngle, angle - CHART.startAngle));
  return (progress / CHART.totalAngle) * WORK_MINUTES;
}

function isWithinChartRing(event) {
  const selected = selectedPeople();
  if (!selected.length) return false;

  const { outerRadius, ringWidth, gap } = ringLayout(selected.length);
  const innerRadius = outerRadius - (selected.length - 1) * (ringWidth + gap);
  const innerEdge = innerRadius - ringWidth / 2 - 14;
  const outerEdge = outerRadius + ringWidth / 2 + 14;
  const { x, y } = chartPointFromEvent(event);
  const distance = Math.hypot(x - CHART.cx, y - CHART.cy);

  return distance >= innerEdge && distance <= outerEdge;
}

function candidateFromChartRange(rangeStart, rangeEnd, event = null) {
  let candidates = candidatesForDay(state.selectedDay)
    .filter(candidate => candidate.start >= rangeStart && candidate.end <= rangeEnd);

  if (!candidates.length) {
    candidates = candidatesForDay(state.selectedDay)
      .filter(candidate => candidate.start >= rangeStart && candidate.start < rangeEnd);
  }

  if (!candidates.length) return null;
  if (!event || !Number.isFinite(event.clientX)) return candidates[0];

  const clickedMinute = minuteFromChartEvent(event);
  const containing = candidates.filter(candidate =>
    clickedMinute >= candidate.start && clickedMinute < candidate.end
  );
  const pool = containing.length ? containing : candidates;
  const targetStart = Math.max(rangeStart, clickedMinute - state.meetingLength / 2);

  return [...pool].sort((a, b) =>
    Math.abs(a.start - targetStart) - Math.abs(b.start - targetStart)
  )[0];
}

function appendThirtyMinuteDividers(svg, start, end, innerEdge, outerEdge) {
  if (state.meetingLength !== AVAILABILITY_STEP) return;

  for (
    let minute = Math.ceil(start / AVAILABILITY_STEP) * AVAILABILITY_STEP;
    minute < end;
    minute += AVAILABILITY_STEP
  ) {
    if (minute <= start) continue;

    const angle = angleForMinute(minute);
    const lineStart = polar(CHART.cx, CHART.cy, innerEdge + 3, angle);
    const lineEnd = polar(CHART.cx, CHART.cy, outerEdge - 3, angle);

    svg.appendChild(createSvg("line", {
      x1: lineStart.x,
      y1: lineStart.y,
      x2: lineEnd.x,
      y2: lineEnd.y,
      class: "common-slot-divider"
    }));
  }
}

function candidateFromChartEvent(event) {
  if (!isWithinChartRing(event)) return null;

  const clickedMinute = minuteFromChartEvent(event);
  const commonRange = commonIntervalsForDay(state.selectedDay).find(([start, end]) =>
    clickedMinute >= start && clickedMinute < end
  );

  return commonRange ? candidateFromChartRange(commonRange[0], commonRange[1], event) : null;
}

function handleChartFreeTimeClick(event) {
  const target = event.target;
  if (target.closest?.(".common-band, .arc-busy")) return;

  const candidate = candidateFromChartEvent(event);
  if (candidate) {
    event.preventDefault();
    selectCandidate(candidate);
  }
}

function cycleCenterCandidate() {
  const candidates = candidatesForDay(state.selectedDay);
  if (candidates.length < 2) return;

  const currentIndex = candidates.findIndex(candidate =>
    sameCandidate(candidate, state.selectedCandidate)
  );
  const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % candidates.length;
  selectCandidate(candidates[nextIndex]);
}

function renderParticipants() {
  const selected = selectedPeople();
  const required = requiredPeople();
  const references = referencePeople();

  els.selectionCount.textContent = `선택 ${selected.length}/6`;
  els.selectedSummary.textContent = references.length
    ? `필수 ${required.length}명 · 참조 ${references.length}명`
    : `필수 ${required.length}명 기준`;
  els.asideDesc.textContent = references.length
    ? `필수 ${required.length}명은 반드시 가능, 참조 ${references.length}명은 추천 점수에 반영됩니다.`
    : `필수 ${required.length}명이 동시에 비어 있는 후보입니다.`;
  els.durationOptions.forEach(button => {
    const active = Number(button.dataset.duration) === state.meetingLength;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  els.participantList.innerHTML = people.map(person => {
    const isChecked = state.selectedIds.includes(person.id);
    const selectedIndex = selected.findIndex(item => item.id === person.id);
    const ringLabel = isChecked ? `${selectedIndex + 1}번 링` : "후보 제외";
    const optionalClass = person.type === "참조" ? "optional" : "";

    return `
      <label class="participant ${isChecked ? "" : "inactive"}" style="--p-color: ${person.color}">
        <span class="check-wrap">
          <input type="checkbox" data-person-id="${person.id}" ${isChecked ? "checked" : ""} />
          <span class="fake-check"></span>
        </span>
        <span class="person-avatar">${isChecked ? selectedIndex + 1 : person.initial}</span>
        <span class="person-info">
          <strong>
            ${person.name}
            ${person.isMe ? `<span class="me-label">나</span>` : ""}
          </strong>
          <span>${person.role} · ${ringLabel}</span>
        </span>
        <span class="badge ${optionalClass}">${person.type}</span>
      </label>
    `;
  }).join("");

  els.participantList.querySelectorAll("input[type='checkbox']").forEach(input => {
    input.addEventListener("change", event => {
      const id = event.target.dataset.personId;
      const next = new Set(state.selectedIds);

      if (event.target.checked) {
        next.add(id);
      } else {
        next.delete(id);
      }

      if (next.size === 0) {
        event.target.checked = true;
        return;
      }

      state.selectedIds = Array.from(next);
      state.confirmedCandidate = null;
      renderAll();
    });
  });
}

function setMeetingLength(minutes) {
  if (!MEETING_LENGTH_OPTIONS.includes(minutes) || minutes === state.meetingLength) return;

  state.meetingLength = minutes;
  state.confirmedCandidate = null;
  state.calendarAdded = false;
  state.showAllCandidates = false;
  state.mobileCandidatesOpen = false;
  state.selectedCandidate = null;
  renderAll();
}

function renderWeek() {
  els.weekStrip.innerHTML = `
    <button class="nav-arrow" type="button" data-week-shift="-1" aria-label="이전 주">${iconMarkup("chevron-left")}</button>
    ${days.map(day => {
      const count = countSlotsForDay(day.key);
      const displayedDay = displayDay(day);
      return `
        <button class="day-btn ${state.selectedDay === day.key ? "active" : ""}" type="button" data-day="${day.key}">
          <span class="day-count">${count}</span>
          <strong>${day.label}</strong>
          <span>${displayedDay.date}</span>
        </button>
      `;
    }).join("")}
    <button class="nav-arrow" type="button" data-week-shift="1" aria-label="다음 주">${iconMarkup("chevron-right")}</button>
  `;

  els.weekStrip.querySelectorAll(".day-btn").forEach(button => {
    button.addEventListener("click", () => {
      state.selectedDay = button.dataset.day;
      state.showAllCandidates = false;
      const candidates = generateCandidates();
      const firstForDay = candidates.find(candidate => candidate.day === state.selectedDay);
      if (firstForDay) {
        selectCandidate(firstForDay);
      } else {
        state.selectedCandidate = null;
        renderAll();
      }
    });
  });

  els.weekStrip.querySelectorAll("[data-week-shift]").forEach(button => {
    button.addEventListener("click", () => {
      state.weekOffset += Number(button.dataset.weekShift);
      state.selectedCandidate = null;
      state.showAllCandidates = false;
      renderAll();
    });
  });
}

function renderChart() {
  const svg = els.chartSvg;
  svg.innerHTML = "";
  scheduleLabelPathId = 0;
  hideScheduleDetail();

  const selected = selectedPeople();
  const highlightedCandidate = state.selectedCandidate;
  const ringCount = selected.length;
  const { outerRadius, ringWidth, gap } = ringLayout(ringCount);
  const innerRadius = outerRadius - (ringCount - 1) * (ringWidth + gap);
  const innerEdge = innerRadius - ringWidth / 2;
  const outerEdge = outerRadius + ringWidth / 2;
  const requiredRingCount = selected.filter(person => person.type !== "참조").length || ringCount;
  const indexDotRadius = Math.max(8, Math.min(12, ringWidth * 0.55));
  const common = commonIntervalsForDay(state.selectedDay);
  const confirmedCandidate = confirmedCandidateForCurrentWeek();
  const selectedRange = highlightedCandidate?.day === state.selectedDay
    ? [highlightedCandidate.start, highlightedCandidate.end]
    : null;
  const confirmedRange = confirmedCandidate?.day === state.selectedDay
    ? [confirmedCandidate.start, confirmedCandidate.end]
    : null;
  const innerEdgeForRingCount = count => {
    const coveredRadius = outerRadius - (count - 1) * (ringWidth + gap);
    return coveredRadius - ringWidth / 2;
  };
  const ringEdgesForIndex = index => {
    const radius = outerRadius - index * (ringWidth + gap);
    return {
      inner: radius - ringWidth / 2,
      outer: radius + ringWidth / 2
    };
  };
  const isAvailableForRange = (person, start, end) =>
    availabilityFor(person, state.selectedDay).some(([availableStart, availableEnd]) =>
      availableStart <= start && availableEnd >= end
    );
  const requiredInnerEdge = innerEdgeForRingCount(requiredRingCount);
  const referenceRingIndexesForRange = (start, end) =>
    selected
      .map((person, index) => ({ person, index }))
      .filter(({ index }) => index >= requiredRingCount)
      .filter(({ person }) => isAvailableForRange(person, start, end))
      .map(({ index }) => index);

  const splitCommonBand = (start, end) => {
    const boundaries = [start, end];

    if (state.meetingLength === AVAILABILITY_STEP) {
      for (
        let minute = Math.ceil(start / AVAILABILITY_STEP) * AVAILABILITY_STEP;
        minute < end;
        minute += AVAILABILITY_STEP
      ) {
        if (minute > start) boundaries.push(minute);
      }
    }

    if (selectedRange) {
      const [selectedStart, selectedEnd] = selectedRange;
      if (selectedStart > start && selectedStart < end) boundaries.push(selectedStart);
      if (selectedEnd > start && selectedEnd < end) boundaries.push(selectedEnd);
    }

    if (confirmedRange) {
      const [confirmedStart, confirmedEnd] = confirmedRange;
      if (confirmedStart > start && confirmedStart < end) boundaries.push(confirmedStart);
      if (confirmedEnd > start && confirmedEnd < end) boundaries.push(confirmedEnd);
    }

    const sorted = [...new Set(boundaries)].sort((a, b) => a - b);

    return sorted.slice(0, -1).map((segmentStart, index) => {
      const segmentEnd = sorted[index + 1];
      const midpoint = (segmentStart + segmentEnd) / 2;
      const isSelected = selectedRange &&
        midpoint >= selectedRange[0] && midpoint < selectedRange[1];
      const isConfirmed = confirmedRange &&
        midpoint >= confirmedRange[0] && midpoint < confirmedRange[1];

      return {
        start: segmentStart,
        end: segmentEnd,
        type: isConfirmed ? "confirmed-base" : isSelected ? "selected" : "common"
      };
    });
  };

  svg.style.setProperty("--ring-width", `${ringWidth}px`);

  [0, 180, 360, 540].forEach(minute => {
    const angle = angleForMinute(minute);
    const start = polar(CHART.cx, CHART.cy, innerEdge - 18, angle);
    const end = polar(CHART.cx, CHART.cy, outerEdge + 18, angle);

    svg.appendChild(createSvg("line", {
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
      class: "time-grid"
    }));
  });

  const labels = [
    { min: 0, text: "9 AM" },
    { min: 180, text: "12 PM" },
    { min: 360, text: "3 PM" },
    { min: 540, text: "6 PM" }
  ];

  labels.forEach(label => {
    const p = polar(CHART.cx, CHART.cy, outerEdge + 42, angleForMinute(label.min));
    const text = createSvg("text", {
      x: p.x,
      y: p.y,
      class: "chart-label",
      "text-anchor": "middle",
      "dominant-baseline": "middle"
    });
    text.textContent = label.text;
    svg.appendChild(text);
  });

  selected.forEach((person, index) => {
    const radius = outerRadius - index * (ringWidth + gap);
    const displayedSchedule = blockedScheduleFor(person, state.selectedDay);

    svg.appendChild(createSvg("path", {
      d: describeArc(
        CHART.cx,
        CHART.cy,
        radius,
        angleForMinute(0),
        angleForMinute(WORK_MINUTES)
      ),
      class: "arc-base"
    }));

    displayedSchedule.forEach(item => {
      const path = createSvg("path", {
        d: describeArc(
          CHART.cx,
          CHART.cy,
          radius,
          angleForMinute(item.start),
          angleForMinute(item.end)
        ),
        class: `arc-busy ${scheduleBlocksMeeting(item) ? "hard-block" : "soft-block"} ${item.isGlobal ? "global" : ""} ${scheduleTone(item)}`,
        stroke: scheduleStroke(person, item),
        tabindex: "0",
        role: "button",
        "aria-label": `${person.name} ${item.title} ${timeRangeLabel(item.start, item.end)}`
      });

      const openDetail = event => {
        event.stopPropagation();
        showScheduleDetail(person, item, event, path);
      };

      path.addEventListener("click", openDetail);
      path.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openDetail(event);
        }
      });
      svg.appendChild(path);

      const label = createScheduleLabel(person, item, radius);
      if (label) {
        svg.appendChild(label);
      }
    });

    availabilityFor(person, state.selectedDay).forEach(([start, end]) => {
      svg.appendChild(createSvg("path", {
        d: describeArc(
          CHART.cx,
          CHART.cy,
          radius,
          angleForMinute(start),
          angleForMinute(end)
        ),
        class: `arc-person ${!state.showPersonal ? "dimmed" : ""}`,
        stroke: person.color
      }));
    });

    const schedule = displayedSchedule
      .filter(item => !item.isGlobal)
      .sort((a, b) => a.start - b.start);

    schedule.slice(0, -1).forEach((item, scheduleIndex) => {
      const nextItem = schedule[scheduleIndex + 1];
      if (item.end !== nextItem.start) return;
      if (
        item.title === nextItem.title &&
        sameNoteDetail(item.note, nextItem.note)
      ) {
        return;
      }

      const angle = angleForMinute(item.end);
      const lineStart = polar(
        CHART.cx,
        CHART.cy,
        radius - ringWidth / 2 + 2,
        angle
      );
      const lineEnd = polar(
        CHART.cx,
        CHART.cy,
        radius + ringWidth / 2 - 2,
        angle
      );

      svg.appendChild(createSvg("line", {
        x1: lineStart.x,
        y1: lineStart.y,
        x2: lineEnd.x,
        y2: lineEnd.y,
        class: "schedule-divider"
      }));
    });
  });

  const appendCommonBand = (segment, inner, outer, extraClass = "") => {
    const candidate = candidateFromChartRange(segment.start, segment.end);
    const band = createSvg("path", {
      d: describeAnnularSector(
        CHART.cx,
        CHART.cy,
        inner,
        outer,
        angleForMinute(segment.start),
        angleForMinute(segment.end)
      ),
      class: `common-band ${segment.type} ${extraClass}`.trim(),
      tabindex: candidate ? "0" : "-1",
      role: candidate ? "button" : "presentation",
      "aria-label": candidate
        ? `${displayDay(state.selectedDay).full} ${timeRangeLabel(candidate.start, candidate.end)} 공통 가능 시간 선택`
        : "공통 가능 시간"
    });

    if (candidate) {
      const chooseCandidate = event => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.blur?.();
        selectCandidate(candidateFromChartRange(segment.start, segment.end, event));
      };

      band.addEventListener("click", chooseCandidate);
      band.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        chooseCandidate(event);
      });
    }

    svg.appendChild(band);
  };

  common.forEach(([start, end]) => {
    splitCommonBand(start, end).forEach(segment => {
      if (segment.end <= segment.start) return;

      appendCommonBand(segment, requiredInnerEdge, outerEdge);

      referenceRingIndexesForRange(segment.start, segment.end).forEach(index => {
        const { inner, outer } = ringEdgesForIndex(index);
        appendCommonBand(segment, inner, outer, "reference-band");
      });
    });

    appendThirtyMinuteDividers(svg, start, end, requiredInnerEdge, outerEdge);
    referenceRingIndexesForRange(start, end).forEach(index => {
      const { inner, outer } = ringEdgesForIndex(index);
      appendThirtyMinuteDividers(svg, start, end, inner, outer);
    });
  });

  if (confirmedRange) {
    svg.appendChild(createConfirmedMeetingLayer(
      confirmedCandidate,
      requiredInnerEdge,
      outerEdge
    ));

    referenceRingIndexesForRange(confirmedCandidate.start, confirmedCandidate.end).forEach(index => {
      const { inner, outer } = ringEdgesForIndex(index);
      svg.appendChild(createSvg("path", {
        d: describeAnnularSector(
          CHART.cx,
          CHART.cy,
          inner,
          outer,
          angleForMinute(confirmedCandidate.start),
          angleForMinute(confirmedCandidate.end)
        ),
        class: "confirmed-meeting-band confirmed-reference-band"
      }));
    });
  }

  selected.forEach((person, index) => {
    const radius = outerRadius - index * (ringWidth + gap);
    const p = polar(CHART.cx, CHART.cy, radius, angleForMinute(-18));

    svg.appendChild(createSvg("circle", {
      cx: p.x,
      cy: p.y,
      r: indexDotRadius,
      fill: person.color,
      class: "person-index-dot"
    }));

    const label = createSvg("text", {
      x: p.x,
      y: p.y + 0.5,
      class: "person-index-label",
      style: `font-size: ${Math.max(9, indexDotRadius)}px`
    });
    label.textContent = index + 1;
    svg.appendChild(label);
  });
}

function renderCenter() {
  const candidate = state.selectedCandidate;
  const candidates = generateCandidates();
  const recommendation = recommendedCandidate(candidates);
  const needsMyAvailability = !state.myAvailabilitySaved;
  const dayCandidates = candidates
    .filter(item => item.day === state.selectedDay)
    .sort((a, b) => a.start - b.start);
  const isCurrentConfirmed = Boolean(candidate && isConfirmedCandidate(candidate));
  const canSwitch = Boolean(candidate && dayCandidates.length > 1);

  els.centerCard.classList.toggle("switchable", canSwitch);
  els.centerCard.classList.toggle("confirmed", isCurrentConfirmed);
  els.centerCard.classList.toggle("saved-feedback", false);
  els.centerSwitchHint.hidden = !canSwitch;
  els.centerCard.tabIndex = canSwitch ? 0 : -1;

  if (canSwitch) {
    const currentIndex = dayCandidates.findIndex(item => sameCandidate(item, candidate));
    const displayIndex = currentIndex < 0 ? 1 : currentIndex + 1;
    els.centerCard.setAttribute("role", "button");
    els.centerCard.setAttribute(
      "aria-label",
      `${displayDay(candidate.day).full} ${timeRangeLabel(candidate.start, candidate.end)}. 클릭하면 다음 공통 가능 시간으로 변경됩니다.`
    );
    els.centerSwitchHint.innerHTML = `
      ${iconMarkup("chevron-left", "ui-icon center-switch-arrow")}
      <span>다른 시간 · ${displayIndex}/${dayCandidates.length}</span>
      ${iconMarkup("chevron-right", "ui-icon center-switch-arrow")}
    `;
  } else {
    els.centerCard.removeAttribute("role");
    els.centerCard.removeAttribute("aria-label");
  }

  if (!candidate) {
    const day = days.find(item => item.key === state.selectedDay);
    const references = referencePeople();
    els.confirmBtn.classList.remove("confirmed");
    els.confirmBtn.classList.remove("soft-priority");
    els.actionRow.classList.toggle("availability-pending", needsMyAvailability);
    els.centerState.textContent = "공통 가능 시간 없음";
    els.centerDay.textContent = displayDay(day).full;
    els.centerTime.textContent = "참석자 선택을 조정해보세요";
    els.centerMeta.innerHTML = `
      <div>필수 ${requiredPeople().length}명 기준${references.length ? ` · 참조 ${references.length}명 반영` : ""}</div>
      <div>${durationLabel()} 이상 겹치는 시간이 없어요</div>
    `;
    els.confirmBtn.textContent = "가능한 시간 없음";
    els.confirmBtn.disabled = true;
    return;
  }

  const day = days.find(item => item.key === candidate.day);
  const isRecommendation = sameCandidate(candidate, recommendation);
  const isConfirmed = isConfirmedCandidate(candidate);
  const stateLabel = isConfirmed
    ? "확정됨"
    : isRecommendation
    ? "추천 시간"
    : "선택 시간";
  els.centerState.innerHTML = `
    <span>${stateLabel}</span>
    <b class="center-duration">${durationLabel()}</b>
  `;
  els.centerDay.textContent = displayDay(day).full;
  els.centerTime.textContent = timeRangeLabel(candidate.start, candidate.end);
  els.centerMeta.innerHTML = `
    <div>${candidateSupportLine(candidate)}</div>
  `;
  els.confirmBtn.classList.toggle("confirmed", isConfirmed);
  els.actionRow.classList.toggle("availability-pending", needsMyAvailability);
  els.confirmBtn.classList.toggle("soft-priority", needsMyAvailability && !isConfirmed);
  els.confirmBtn.innerHTML = isConfirmed
    ? `${iconMarkup("check")} ${timeRangeLabel(candidate.start, candidate.end)} 확정됨`
    : `${iconMarkup("calendar")} ${timeRangeLabel(candidate.start, candidate.end)}으로 확정하기`;
  els.confirmBtn.disabled = isConfirmed;
}

function renderCandidates() {
  const candidates = generateCandidates();
  const recommendation = recommendedCandidate(candidates);
  const confirmedCandidate = confirmedCandidateForCurrentWeek();

  if (confirmedCandidate) {
    const confirmedDay = displayDay(confirmedCandidate.day);
    const attendees = attendeeSummary();

    state.showAllCandidates = false;
    state.mobileCandidatesOpen = false;
    els.candidateToggle.hidden = true;
    els.candidateToggle.setAttribute("aria-expanded", "false");
    els.candidatePanelBody.classList.remove("open");
    els.mobileCandidateToggle.disabled = false;
    els.mobileCandidateToggle.setAttribute("aria-expanded", "false");
    els.mobileCandidateToggleLabel.textContent = "확정된 회의 보기";
    els.candidateList.innerHTML = `
      <section class="confirmed-panel" aria-label="확정된 회의">
        <div class="confirmed-panel-head">
          <span class="confirmed-kicker">확정된 회의</span>
          <strong>캘린더 초대가 준비됐어요</strong>
          <p>참석자 ${attendees.count}명에게 공유 링크가 생성됐어요.</p>
        </div>

        <div class="confirmed-time-card">
          <em>${meetingTitle()}</em>
          <span>${confirmedDay.full}</span>
          <strong>${timeRangeLabel(confirmedCandidate.start, confirmedCandidate.end)}</strong>
          <small>${attendees.names}</small>
        </div>

        <div class="share-card">
          <span class="share-card-label">공유 링크</span>
          <strong>${MEETING_SHARE_URL}</strong>
          <small>${state.shareUpdatedText}</small>
        </div>

        <div class="confirmed-actions">
          <button class="confirmed-action primary calendar-add-btn" type="button">
            ${iconMarkup(state.calendarAdded ? "check" : "calendar")}
            ${state.calendarAdded ? "캘린더에 저장됨" : "캘린더에 저장"}
          </button>
          <button class="confirmed-action share-copy-action" type="button">
            ${state.linkCopied ? iconMarkup("check") : ""}
            ${state.linkCopied ? "링크 복사됨" : "링크 복사"}
          </button>
        </div>
      </section>
    `;

    els.candidateList.querySelector(".share-copy-action")?.addEventListener("click", copyMeetingLink);
    els.candidateList.querySelector(".calendar-add-btn")?.addEventListener("click", addToCalendar);
    return;
  }

  if (!candidates.length) {
    const required = requiredPeople();
    state.showAllCandidates = false;
    state.mobileCandidatesOpen = false;
    els.candidateToggle.hidden = true;
    els.candidateToggle.setAttribute("aria-expanded", "false");
    els.candidatePanelBody.classList.remove("open");
    els.mobileCandidateToggle.disabled = true;
    els.mobileCandidateToggle.setAttribute("aria-expanded", "false");
    els.mobileCandidateToggleLabel.textContent = "공통 후보 없음";
    els.candidateList.innerHTML = `
      <div class="empty">
        필수 ${required.length}명이 동시에 가능한 ${durationLabel()} 구간이 없어요.<br />
        참석자 선택을 조정하거나 기간을 넓혀보세요.
      </div>
    `;
    return;
  }

  const selectedDay = days.find(day => day.key === state.selectedDay);
  const selectedDayCandidates = candidates
    .filter(candidate => candidate.day === state.selectedDay)
    .sort((a, b) => a.start - b.start);
  const otherCandidates = candidates.filter(
    candidate => candidate.day !== state.selectedDay
  );
  const hasOtherDates = otherCandidates.length > 0;

  els.candidatePanelBody.classList.toggle("open", state.mobileCandidatesOpen);
  els.mobileCandidateToggle.disabled = false;
  els.mobileCandidateToggle.setAttribute(
    "aria-expanded",
    String(state.mobileCandidatesOpen)
  );
  els.mobileCandidateToggleLabel.textContent = state.mobileCandidatesOpen
    ? `공통 가능 후보 ${selectedDayCandidates.length}개 접기`
    : `공통 가능 후보 ${selectedDayCandidates.length}개 보기`;

  if (!hasOtherDates) {
    state.showAllCandidates = false;
  }

  els.candidateToggle.hidden = !hasOtherDates;
  els.candidateToggle.textContent = state.showAllCandidates
    ? "다른 날짜 후보 접기"
    : `이번 주 다른 후보 ${otherCandidates.length}개 보기`;
  els.candidateToggle.setAttribute("aria-expanded", String(state.showAllCandidates));

  const candidateCard = candidate => {
    const active = sameCandidate(candidate, state.selectedCandidate);
    const isRecommendation = sameCandidate(candidate, recommendation);

    return `
      <button class="candidate ${active ? "active" : ""} ${isRecommendation ? "recommended" : ""}" type="button" data-day="${candidate.day}" data-start="${candidate.start}" data-end="${candidate.end}">
        <span class="candidate-marker" aria-hidden="true"></span>
        <div class="candidate-main">
          <div class="candidate-line">
            <strong class="candidate-day">${candidate.dayLabel}</strong>
            ${isRecommendation ? `<span class="recommend-badge">추천</span>` : ""}
          </div>
          <strong class="candidate-time">${timeRangeLabel(candidate.start, candidate.end)}</strong>
          <span class="candidate-status">${candidateSupportLine(candidate)}</span>
        </div>
      </button>
    `;
  };

  const candidateGroup = day => {
      const dayCandidates = candidates
        .filter(candidate => candidate.day === day.key)
        .sort((a, b) => a.start - b.start);

      if (!dayCandidates.length && day.key !== state.selectedDay) return "";

      return `
        <section class="candidate-group ${day.key === state.selectedDay ? "current" : ""}" aria-label="${displayDay(day).full} 후보">
          <div class="candidate-group-head">
            <strong>${displayDay(day).full}${day.key === state.selectedDay ? `<span class="current-day-label">선택한 날짜</span>` : ""}</strong>
            <span>공통 후보 ${dayCandidates.length}개</span>
          </div>
          ${dayCandidates.length
            ? `<div class="candidate-group-list">${dayCandidates.map(candidateCard).join("")}</div>`
            : `<div class="candidate-day-empty">이 날짜에는 ${durationLabel()} 이상 겹치는 시간이 없어요.</div>`}
        </section>
      `;
  };

  const visibleDays = state.showAllCandidates
    ? [selectedDay, ...days.filter(day => day.key !== state.selectedDay)]
    : [selectedDay];
  els.candidateList.innerHTML = visibleDays.map(candidateGroup).join("");

  els.candidateList.querySelectorAll(".candidate").forEach(button => {
    button.addEventListener("click", () => {
      selectCandidate({
        day: button.dataset.day,
        dayLabel: displayDay(button.dataset.day).full,
        start: Number(button.dataset.start),
        end: Number(button.dataset.end)
      });
    });
  });
}

function renderReasons() {
  const candidate = state.selectedCandidate;
  const fit = candidate ? candidateFit(candidate) : null;
  els.reasonToggle.setAttribute("aria-expanded", String(state.reasonsExpanded));
  els.reasonList.hidden = !state.reasonsExpanded;

  if (!candidate) {
    els.reasonSummaryText.textContent = `현재 조건에서는 ${durationLabel()} 이상 겹치는 시간이 부족해요.`;
    els.reasonList.innerHTML = `
      <div class="reason">
        <span class="reason-icon alert">${iconMarkup("alert")}</span>
        <div>
          <strong>공통 시간이 부족해요</strong>
          <span>선택 인원을 줄이거나 회의 기간을 늘리면 후보 시간이 생길 수 있어요.</span>
        </div>
      </div>
    `;
    return;
  }

  els.reasonSummaryText.textContent = candidateSupportLine(candidate);
  els.reasonList.innerHTML = `
    <div class="reason">
      <span class="reason-icon">${iconMarkup("check")}</span>
      <div>
        <strong>필수 참석자가 모두 비어 있어요</strong>
        <span>${timeRangeLabel(candidate.start, candidate.end)}에는 필수 참석자 ${fit.requiredCount}명이 모두 참여할 수 있어요.</span>
      </div>
    </div>

    <div class="reason">
      <span class="reason-icon">${iconMarkup("check")}</span>
      <div>
        <strong>참조 참석자의 가능 여부도 반영했어요</strong>
        <span>${fit.referenceCount ? `참조 ${fit.referenceAvailableCount}/${fit.referenceCount}명이 함께 가능한 후보를 더 높게 봤어요.` : "참조 참석자가 없어서 필수 참석자 기준으로만 추천했어요."}</span>
      </div>
    </div>

    <div class="reason">
      <span class="reason-icon">${iconMarkup("check")}</span>
      <div>
        <strong>점심 직후와 퇴근 직전 시간을 피해 추천했어요</strong>
        <span>13:00 직후와 17:00에 가까운 후보는 우선순위를 낮추고, 업무 흐름이 덜 끊기는 시간을 우선했어요.</span>
      </div>
    </div>
  `;
}

function openConfirmModal() {
  const candidate = state.selectedCandidate;
  if (!candidate) return;

  const day = displayDay(candidate.day);
  const attendees = selectedPeople();

  state.confirmModalStep = "confirm";
  els.confirmModal.classList.remove("success");
  els.confirmModalIcon.innerHTML = iconMarkup("calendar");
  els.confirmModalTitle.textContent = "이 시간으로 회의를 확정할까요?";
  els.confirmModalMessage.textContent = "확정하면 선택한 참석자 기준의 회의 시간으로 저장됩니다.";
  els.confirmTitleField.hidden = false;
  els.confirmMeetingTitleInput.value = meetingTitle();
  els.confirmModalDate.textContent = day.long;
  els.confirmModalTime.textContent = timeRangeLabel(candidate.start, candidate.end);
  els.confirmModalAttendees.textContent = `참석자 ${attendees.length}명 · ${attendees.map(person => person.name).join(", ")}`;
  els.confirmModalCancel.hidden = false;
  els.confirmModalCancel.textContent = "취소";
  els.confirmModalSubmit.textContent = "확정하기";
  els.confirmModal.hidden = false;
  document.body.classList.add("modal-open");
  els.confirmMeetingTitleInput.focus();
  els.confirmMeetingTitleInput.select();
}

function closeConfirmModal() {
  els.confirmModal.hidden = true;
  document.body.classList.remove("modal-open");
  els.confirmBtn.focus();
}

function completeConfirmation() {
  const candidate = state.selectedCandidate;
  if (!candidate) {
    closeConfirmModal();
    return;
  }

  state.meetingTitle = els.confirmMeetingTitleInput.value.trim() || DEFAULT_MEETING_TITLE;
  state.confirmedCandidate = {
    ...candidate,
    weekOffset: state.weekOffset
  };
  state.calendarAdded = false;
  state.shareUpdatedText = "방금 업데이트됨";
  state.confirmModalStep = "success";

  els.confirmModal.classList.add("success");
  els.confirmModalIcon.innerHTML = iconMarkup("check");
  els.confirmModalTitle.textContent = "캘린더 초대가 준비됐어요";
  els.confirmModalMessage.textContent = `${meetingTitle()} · 참석자 ${selectedPeople().length}명에게 공유 링크가 생성됐어요.`;
  els.confirmTitleField.hidden = true;
  els.confirmModalCancel.hidden = false;
  els.confirmModalCancel.textContent = "닫기";
  els.confirmModalSubmit.textContent = "캘린더에 저장";
  renderAll();
}

function bindStaticEvents() {
  els.scheduleDetailClose.addEventListener("click", hideScheduleDetail);
  els.chartSvg.addEventListener("click", handleChartFreeTimeClick);
  els.copyLinkBtn.addEventListener("click", copyMeetingLink);
  els.durationOptions.forEach(button => {
    button.addEventListener("click", () => {
      setMeetingLength(Number(button.dataset.duration));
    });
  });
  els.availabilityEntryBtn.addEventListener("click", openAvailabilityModal);
  els.availabilityModalClose.addEventListener("click", closeAvailabilityModal);
  els.availabilityCancelBtn.addEventListener("click", closeAvailabilityModal);
  els.saveAvailabilityBtn.addEventListener("click", saveAvailability);

  els.availabilityPaintChoices.forEach(button => {
    button.addEventListener("click", () => {
      state.availabilityPaintMode = button.dataset.paintMode;
      renderAvailabilityPaintChoices();
    });
  });

  els.noteModalClose.addEventListener("click", closeNoteModal);
  els.noteModalCancel.addEventListener("click", closeNoteModal);
  els.noteModalSave.addEventListener("click", saveNoteModal);
  [els.noteTitleInput, els.notePeopleInput, els.notePlaceInput].forEach(input => {
    input.addEventListener("keydown", event => {
      if (event.key === "Enter") {
        event.preventDefault();
        saveNoteModal();
      }
    });
  });

  els.selectWorkHoursBtn.addEventListener("click", () => {
    state.availabilityDraft = blankAvailabilityDraft(null);
    state.availabilityDraftNotes = blankAvailabilityNotes();
    applyDraftLunchPreference();
    renderAvailabilityGrid();
  });

  els.excludeLunchBtn.addEventListener("click", () => {
    state.availabilityDraftAllowsLunch = false;
    state.availabilityPaintMode = "lunch";
    setDraftLunch("lunch");
    renderAvailabilityGrid();
  });

  els.clearAvailabilityBtn.addEventListener("click", () => {
    state.availabilityDraft = blankAvailabilityDraft(null);
    state.availabilityDraftNotes = blankAvailabilityNotes();
    applyDraftLunchPreference();
    renderAvailabilityGrid();
  });

  els.allowLunchMeetingInput.addEventListener("change", event => {
    state.availabilityDraftAllowsLunch = event.currentTarget.checked;
    applyDraftLunchPreference();
    renderAvailabilityGrid();
  });

  els.availabilityModal.addEventListener("click", event => {
    if (event.target === els.availabilityModal) {
      closeAvailabilityModal();
    }
  });

  els.noteModal.addEventListener("click", event => {
    if (event.target === els.noteModal) {
      closeNoteModal();
    }
  });

  document.addEventListener("pointerup", () => {
    state.availabilityDragging = false;
  });

  els.centerCard.addEventListener("click", cycleCenterCandidate);
  els.centerCard.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (!els.centerCard.classList.contains("switchable")) return;
    event.preventDefault();
    cycleCenterCandidate();
  });

  els.togglePersonalBtn.addEventListener("click", () => {
    state.showPersonal = !state.showPersonal;
    els.togglePersonalBtn.innerHTML = state.showPersonal
      ? `${iconMarkup("eye")} 개인 가능 시간 숨기기`
      : `${iconMarkup("eye-off")} 개인 가능 시간 보기`;
    renderChart();
  });

  els.candidateToggle.addEventListener("click", () => {
    state.showAllCandidates = !state.showAllCandidates;
    renderCandidates();
  });

  els.mobileCandidateToggle.addEventListener("click", () => {
    state.mobileCandidatesOpen = !state.mobileCandidatesOpen;
    renderCandidates();
  });

  els.displayGuideToggle.addEventListener("click", () => {
    state.displayGuideExpanded = !state.displayGuideExpanded;
    renderDisplayGuide();
  });

  els.reasonToggle.addEventListener("click", () => {
    state.reasonsExpanded = !state.reasonsExpanded;
    renderReasons();
  });

  els.confirmBtn.addEventListener("click", openConfirmModal);
  els.confirmModalClose.addEventListener("click", closeConfirmModal);
  els.confirmModalCancel.addEventListener("click", closeConfirmModal);

  els.confirmModalSubmit.addEventListener("click", () => {
    if (state.confirmModalStep === "confirm") {
      completeConfirmation();
    } else {
      addToCalendar();
      closeConfirmModal();
    }
  });

  els.confirmModal.addEventListener("click", event => {
    if (event.target === els.confirmModal) {
      closeConfirmModal();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !els.availabilityModal.hidden) {
      if (!els.noteModal.hidden) {
        closeNoteModal();
      } else {
        closeAvailabilityModal();
      }
    } else if (event.key === "Escape" && !els.confirmModal.hidden) {
      closeConfirmModal();
    } else if (event.key === "Escape" && !els.scheduleDetail.hidden) {
      hideScheduleDetail();
    }
  });
}

function renderAll() {
  ensureCandidate();
  renderParticipants();
  renderWeek();
  renderChart();
  renderCenter();
  renderCandidates();
  renderReasons();
  renderAvailabilityEntry();
  renderDisplayGuide();
  renderEntryFeedback();
  renderShareStatus();
}

bindStaticEvents();
renderAll();
startEntryFeedback();
