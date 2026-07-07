const MEETING_LENGTH = 60;
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

const days = [
  { key: "mon", label: "월", date: "6/30", full: "월요일 6/30" },
  { key: "tue", label: "화", date: "7/1", full: "화요일 7/1" },
  { key: "wed", label: "수", date: "7/2", full: "수요일 7/2" },
  { key: "thu", label: "목", date: "7/3", full: "목요일 7/3" },
  { key: "fri", label: "금", date: "7/4", full: "금요일 7/4" }
];

function scheduleItem(title, start, end) {
  const toMinute = value => {
    const [hour, minute] = value.split(":").map(Number);
    return hour * 60 + minute - START_OF_DAY;
  };

  return {
    title,
    start: toMinute(start),
    end: toMinute(end)
  };
}

const people = [
  {
    id: "p1",
    name: "이지현",
    role: "프로덕트 매니저",
    type: "핵심",
    isMe: true,
    initial: "이",
    color: "#4F8DF7",
    schedule: {
      mon: [
        scheduleItem("스탠드업", "09:00", "10:00"),
        scheduleItem("출장 · 파트너 미팅", "11:00", "12:00"),
        scheduleItem("리뷰", "14:00", "15:00"),
        scheduleItem("1:1", "16:00", "17:00")
      ],
      tue: [
        scheduleItem("주간 미팅", "09:00", "10:00"),
        scheduleItem("제품 싱크", "11:00", "12:00"),
        scheduleItem("문서 리뷰", "14:00", "15:00"),
        scheduleItem("리더십 미팅", "16:00", "17:00")
      ],
      wed: [
        scheduleItem("스탠드업", "09:00", "10:00"),
        scheduleItem("인터뷰", "10:00", "11:00"),
        scheduleItem("리뷰", "11:00", "12:00"),
        scheduleItem("의사결정 미팅", "15:00", "16:00")
      ],
      thu: [
        scheduleItem("스탠드업", "09:00", "10:00"),
        scheduleItem("워크숍", "13:00", "15:00"),
        scheduleItem("1:1", "16:00", "17:00")
      ],
      fri: [
        scheduleItem("주간 미팅", "09:00", "10:00"),
        scheduleItem("로드맵 리뷰", "11:00", "12:00"),
        scheduleItem("회고", "13:00", "14:00"),
        scheduleItem("반차 휴가", "14:00", "15:00"),
        scheduleItem("마감 정리", "16:00", "17:00")
      ]
    }
  },
  {
    id: "p2",
    name: "김민수",
    role: "디자인 리드",
    type: "핵심",
    initial: "김",
    color: "#36B37E",
    schedule: {
      mon: [
        scheduleItem("디자인 크리틱", "10:00", "11:00"),
        scheduleItem("에셋 정리", "13:00", "14:00"),
        scheduleItem("UI 리뷰", "15:00", "16:00")
      ],
      tue: [
        scheduleItem("디자인 싱크", "09:00", "10:00"),
        scheduleItem("QA 확인", "11:00", "12:00"),
        scheduleItem("플로우 점검", "15:00", "16:00")
      ],
      wed: [
        scheduleItem("디자인 리뷰", "09:00", "10:00"),
        scheduleItem("핸드오프", "10:00", "11:00"),
        scheduleItem("QA", "11:00", "12:00"),
        scheduleItem("피드백 반영", "15:00", "16:00")
      ],
      thu: [
        scheduleItem("워크숍", "09:00", "11:00"),
        scheduleItem("사용자 테스트", "14:00", "15:00"),
        scheduleItem("디자인 오피스아워", "16:00", "17:00")
      ],
      fri: [
        scheduleItem("UI QA", "10:00", "11:00"),
        scheduleItem("디자인 리뷰", "13:00", "15:00"),
        scheduleItem("싱크", "16:00", "17:00")
      ]
    }
  },
  {
    id: "p3",
    name: "박서연",
    role: "개발 리드",
    type: "핵심",
    initial: "박",
    color: "#FF8B3D",
    schedule: {
      mon: [
        scheduleItem("스프린트", "09:00", "11:00"),
        scheduleItem("코드 리뷰", "13:00", "14:00"),
        scheduleItem("개발 집중", "15:00", "17:00")
      ],
      tue: [
        scheduleItem("이슈 트리아지", "09:00", "10:00"),
        scheduleItem("백엔드 싱크", "11:00", "12:00"),
        scheduleItem("배포 준비", "14:00", "16:00")
      ],
      wed: [
        scheduleItem("스탠드업", "09:00", "10:00"),
        scheduleItem("기술 싱크", "10:00", "12:00"),
        scheduleItem("코드 리뷰", "13:00", "14:00"),
        scheduleItem("개발 집중", "15:00", "16:00")
      ],
      thu: [
        scheduleItem("아키텍처 리뷰", "10:00", "12:00"),
        scheduleItem("장애 점검", "13:00", "14:00"),
        scheduleItem("스프린트", "15:00", "17:00")
      ],
      fri: [
        scheduleItem("스탠드업", "09:00", "10:00"),
        scheduleItem("버그 트리아지", "11:00", "12:00"),
        scheduleItem("배포", "13:00", "15:00"),
        scheduleItem("기술 리뷰", "16:00", "17:00")
      ]
    }
  },
  {
    id: "p4",
    name: "정우진",
    role: "데이터 분석가",
    type: "핵심",
    initial: "정",
    color: "#8B6FE8",
    schedule: {
      mon: [
        scheduleItem("대시보드 점검", "09:30", "10:30"),
        scheduleItem("데이터 싱크", "11:00", "12:00"),
        scheduleItem("분석 작업", "14:00", "16:00")
      ],
      tue: [
        scheduleItem("데이터 싱크", "09:00", "10:00"),
        scheduleItem("요청사항 정리", "11:00", "12:00"),
        scheduleItem("ETL 리뷰", "14:00", "15:00"),
        scheduleItem("리포트", "16:00", "17:00")
      ],
      wed: [
        scheduleItem("대시보드 점검", "09:00", "10:00"),
        scheduleItem("지표 회의", "10:00", "11:00"),
        scheduleItem("리뷰", "11:00", "12:00"),
        scheduleItem("리포트", "15:00", "16:00")
      ],
      thu: [
        scheduleItem("스탠드업", "09:00", "10:00"),
        scheduleItem("지표 리뷰", "11:00", "12:00"),
        scheduleItem("분석 작업", "13:00", "15:00")
      ],
      fri: [
        scheduleItem("주간 리포트", "09:00", "10:00"),
        scheduleItem("데이터 QA", "10:00", "11:00"),
        scheduleItem("대시보드 작업", "13:00", "15:00"),
        scheduleItem("리포트", "16:00", "17:00")
      ]
    }
  },
  {
    id: "p5",
    name: "최은지",
    role: "마케팅 매니저",
    type: "참조",
    initial: "최",
    color: "#11A7A7",
    schedule: {
      mon: [
        scheduleItem("캠페인 회의", "10:00", "12:00"),
        scheduleItem("크리에이티브 리뷰", "13:00", "14:00"),
        scheduleItem("대행사 미팅", "16:00", "17:00")
      ],
      tue: [
        scheduleItem("캠페인 점검", "09:00", "10:00"),
        scheduleItem("콘텐츠 회의", "11:00", "12:00"),
        scheduleItem("대행사 싱크", "15:00", "16:00")
      ],
      wed: [
        scheduleItem("캠페인 점검", "09:00", "10:00"),
        scheduleItem("브랜드 체크", "10:00", "11:00"),
        scheduleItem("콘텐츠 회의", "11:00", "12:00"),
        scheduleItem("세일즈 싱크", "15:00", "16:00")
      ],
      thu: [
        scheduleItem("외부 미팅", "09:00", "12:00"),
        scheduleItem("기획 정리", "13:00", "14:00"),
        scheduleItem("내부 공유", "16:00", "17:00")
      ],
      fri: [
        scheduleItem("캠페인 운영", "09:00", "11:00"),
        scheduleItem("리뷰", "13:00", "14:00"),
        scheduleItem("크리에이티브 확인", "14:00", "15:00")
      ]
    }
  },
  {
    id: "p6",
    name: "이재훈",
    role: "CS 매니저",
    type: "참조",
    initial: "이",
    color: "#FF5C7A",
    schedule: {
      mon: [
        scheduleItem("티켓 확인", "09:00", "10:00"),
        scheduleItem("VOC 리뷰", "11:00", "12:00"),
        scheduleItem("고객 콜", "13:00", "15:00"),
        scheduleItem("CS 싱크", "16:00", "17:00")
      ],
      tue: [
        scheduleItem("VOC 확인", "09:00", "10:00"),
        scheduleItem("CS 싱크", "11:00", "12:00"),
        scheduleItem("교육", "14:00", "15:00"),
        scheduleItem("리포트", "16:00", "17:00")
      ],
      wed: [
        scheduleItem("VOC 확인", "09:00", "10:00"),
        scheduleItem("티켓 정리", "10:00", "11:00"),
        scheduleItem("CS 싱크", "11:00", "12:00"),
        scheduleItem("고객 콜", "15:00", "16:00")
      ],
      thu: [
        scheduleItem("고객 미팅", "10:00", "12:00"),
        scheduleItem("교육", "13:00", "14:00"),
        scheduleItem("CS 대응", "15:00", "17:00")
      ],
      fri: [
        scheduleItem("VOC 확인", "09:00", "10:00"),
        scheduleItem("싱크", "10:00", "11:00"),
        scheduleItem("티켓 정리", "11:00", "12:00"),
        scheduleItem("주간 공유", "13:00", "14:00"),
        scheduleItem("문서화", "14:00", "15:00"),
        scheduleItem("CS 싱크", "16:00", "17:00")
      ]
    }
  }
];

const state = {
  selectedIds: ["p1", "p2", "p3", "p4"],
  selectedDay: "wed",
  selectedCandidate: null,
  showPersonal: true,
  showAllCandidates: false,
  mobileCandidatesOpen: false,
  weekOffset: 0,
  confirmedCandidate: null,
  confirmModalStep: "confirm",
  myAvailabilitySaved: false,
  myAvailability: null,
  availabilityDraft: null,
  availabilityDragging: false,
  availabilityDragMode: true,
  reasonsExpanded: false,
  displayGuideExpanded: false,
  availabilityFeedback: false,
  entryFeedbackState: "calculating"
};

const els = {
  availabilityEntryBtn: document.getElementById("availabilityEntryBtn"),
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
  confirmModalDate: document.getElementById("confirmModalDate"),
  confirmModalTime: document.getElementById("confirmModalTime"),
  confirmModalAttendees: document.getElementById("confirmModalAttendees"),
  confirmModalCancel: document.getElementById("confirmModalCancel"),
  confirmModalSubmit: document.getElementById("confirmModalSubmit"),
  availabilityModal: document.getElementById("availabilityModal"),
  availabilityModalClose: document.getElementById("availabilityModalClose"),
  availabilityGrid: document.getElementById("availabilityGrid"),
  availabilitySummary: document.getElementById("availabilitySummary"),
  selectWorkHoursBtn: document.getElementById("selectWorkHoursBtn"),
  excludeLunchBtn: document.getElementById("excludeLunchBtn"),
  clearAvailabilityBtn: document.getElementById("clearAvailabilityBtn"),
  calendarSyncBtn: document.getElementById("calendarSyncBtn"),
  availabilityCancelBtn: document.getElementById("availabilityCancelBtn"),
  saveAvailabilityBtn: document.getElementById("saveAvailabilityBtn")
};

let availabilityFeedbackTimer = null;
let entryFeedbackTimers = [];

function selectedPeople() {
  return people.filter(person => state.selectedIds.includes(person.id));
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

function blankAvailabilityDraft(value = false) {
  return Object.fromEntries(
    days.map(day => [day.key, Array.from({ length: AVAILABILITY_SLOT_COUNT }, () => value)])
  );
}

function cloneDraft(draft) {
  return Object.fromEntries(
    days.map(day => [day.key, [...draft[day.key]]])
  );
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

  slots.forEach((isAvailable, index) => {
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

function customAvailabilityForDay(dayKey) {
  if (!state.myAvailabilitySaved || !state.myAvailability) return null;
  return subtractIntervals(state.myAvailability[dayKey] || [], [[LUNCH_START, LUNCH_END]]);
}

function blockedScheduleFor(person, dayKey) {
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

function myPerson() {
  return people.find(person => person.isMe) || people[0];
}

function currentMyAvailabilityDraft() {
  const me = myPerson();

  if (state.myAvailabilitySaved && state.myAvailability) {
    return Object.fromEntries(
      days.map(day => [day.key, intervalsToSlots(state.myAvailability[day.key] || [])])
    );
  }

  return Object.fromEntries(
    days.map(day => [day.key, intervalsToSlots(baseAvailabilityFor(me, day.key))])
  );
}

function setDraftDay(dayKey, value) {
  state.availabilityDraft[dayKey] = state.availabilityDraft[dayKey].map(() => value);
}

function setDraftLunch(value) {
  days.forEach(day => {
    for (
      let minute = LUNCH_START;
      minute < LUNCH_END;
      minute += AVAILABILITY_STEP
    ) {
      const index = minute / AVAILABILITY_STEP;
      state.availabilityDraft[day.key][index] = value;
    }
  });
}

function selectedDraftMinutes() {
  return days.reduce((total, day) => {
    return total + state.availabilityDraft[day.key].filter(Boolean).length * AVAILABILITY_STEP;
  }, 0);
}

function renderAvailabilitySummary() {
  const selectedMinutes = selectedDraftMinutes();
  const availableDays = days.filter(day =>
    state.availabilityDraft[day.key].some(Boolean)
  ).length;
  const hours = Math.floor(selectedMinutes / 60);
  const minutes = selectedMinutes % 60;
  const durationLabel = `${hours}시간${minutes ? ` ${minutes}분` : ""}`;

  els.availabilitySummary.textContent =
    `${availableDays}일에 ${durationLabel} 선택됨 · 점심시간은 추천 계산에서 제외돼요.`;
}

function updateDraftCell(cell, isAvailable) {
  const { day, slot } = cell.dataset;
  state.availabilityDraft[day][Number(slot)] = isAvailable;
  cell.setAttribute("aria-pressed", String(isAvailable));
  refreshAvailabilityCellStyles(day);
  renderAvailabilitySummary();
}

function eventCategoryForTitle(item) {
  const title = item.title || "";

  if (item.isGlobal || title.includes("점심")) return "lunch";
  if (/휴가|연차|반차|오프/.test(title)) return "vacation";
  if (/출장|외근|외부|파트너|대행사|고객 콜|고객 미팅/.test(title)) return "travel";
  if (/집중|작업|정리|문서|리포트|QA|확인|에셋|분석|티켓|대응|운영|배포 준비|마감/.test(title)) return "focus";
  return "meeting";
}

function eventForAvailabilitySlot(dayKey, index) {
  const minute = index * AVAILABILITY_STEP;
  const midpoint = minute + AVAILABILITY_STEP / 2;
  const event = baseBlockedScheduleFor(myPerson(), dayKey).find(item =>
    midpoint >= item.start && midpoint < item.end
  );

  if (!event) return null;

  const category = eventCategoryForTitle(event);
  const prevMidpoint = midpoint - AVAILABILITY_STEP;
  const nextMidpoint = midpoint + AVAILABILITY_STEP;
  const hasPrevious = prevMidpoint >= 0 &&
    prevMidpoint >= event.start &&
    prevMidpoint < event.end;
  const hasNext = nextMidpoint < WORK_MINUTES &&
    nextMidpoint >= event.start &&
    nextMidpoint < event.end;

  return {
    title: event.title,
    category,
    isStart: !hasPrevious,
    isEnd: !hasNext,
    isMiddle: hasPrevious && hasNext
  };
}

function availabilityEventClasses(event) {
  if (!event) return "";

  return [
    "event",
    `event-${event.category}`,
    event.isStart ? "event-start" : "",
    event.isEnd ? "event-end" : "",
    event.isMiddle ? "event-middle" : ""
  ].filter(Boolean).join(" ");
}

function availabilityCellClasses(dayKey, index) {
  const slots = state.availabilityDraft[dayKey];
  const selected = slots[index];
  const prevSelected = slots[index - 1] || false;
  const nextSelected = slots[index + 1] || false;

  return [
    selected ? "available" : "",
    selected && !prevSelected ? "range-start" : "",
    selected && !nextSelected ? "range-end" : "",
    selected && prevSelected && nextSelected ? "range-middle" : ""
  ].filter(Boolean).join(" ");
}

function refreshAvailabilityCellStyles(dayKey = null) {
  const selector = dayKey
    ? `.availability-cell[data-day="${dayKey}"]`
    : ".availability-cell";

  els.availabilityGrid.querySelectorAll(selector).forEach(cell => {
    const index = Number(cell.dataset.slot);
    const isSelected = state.availabilityDraft[cell.dataset.day][index];

    cell.classList.toggle("available", isSelected);
    cell.classList.toggle("range-start", isSelected && !(state.availabilityDraft[cell.dataset.day][index - 1] || false));
    cell.classList.toggle("range-end", isSelected && !(state.availabilityDraft[cell.dataset.day][index + 1] || false));
    cell.classList.toggle("range-middle", isSelected && Boolean(state.availabilityDraft[cell.dataset.day][index - 1]) && Boolean(state.availabilityDraft[cell.dataset.day][index + 1]));
    cell.setAttribute("aria-pressed", String(isSelected));
  });
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
        const selected = state.availabilityDraft[day.key][index];
        const event = eventForAvailabilitySlot(day.key, index);
        const eventLabel = event?.isStart
          ? `<span class="availability-event-label">${event.title}</span>`
          : "";
        return `
          <button
            class="availability-cell ${availabilityCellClasses(day.key, index)} ${availabilityEventClasses(event)} ${isHour ? "hour-start" : ""} ${isLunch ? "lunch" : ""}"
            type="button"
            data-day="${day.key}"
            data-slot="${index}"
            aria-label="${displayDay(day).full} ${timeRangeLabel(start, end)} ${selected ? "가능 시간" : event ? event.title : "미선택"}"
            aria-pressed="${selected}"
          >${eventLabel}</button>
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
      const shouldSelect = !state.availabilityDraft[dayKey].every(Boolean);
      setDraftDay(dayKey, shouldSelect);
      renderAvailabilityGrid();
    });
  });

  els.availabilityGrid.querySelectorAll(".availability-cell").forEach(cell => {
    cell.addEventListener("pointerdown", event => {
      event.preventDefault();
      state.availabilityDragging = true;
      state.availabilityDragMode = !cell.classList.contains("available");
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
}

function openAvailabilityModal() {
  state.availabilityDraft = currentMyAvailabilityDraft();
  renderAvailabilityGrid();
  els.availabilityEntryBtn.classList.add("active");
  els.availabilityModal.hidden = false;
  document.body.classList.add("modal-open");
  els.saveAvailabilityBtn.focus();
}

function closeAvailabilityModal() {
  els.availabilityModal.hidden = true;
  els.availabilityEntryBtn.classList.remove("active");
  document.body.classList.remove("modal-open");
  els.availabilityEntryBtn.focus();
}

function saveAvailability() {
  state.myAvailability = draftToAvailability(state.availabilityDraft);
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
  els.availabilityEntryBtn.classList.toggle("saved", state.myAvailabilitySaved);
  els.availabilityEntryBtn.classList.toggle("just-saved", state.availabilityFeedback);
  els.availabilityEntryBtn.querySelector("strong").textContent = state.myAvailabilitySaved
    ? "내 가능 시간 수정하기"
    : "내 가능 시간 등록하기";
  els.availabilityEntryBtn.querySelector("small").textContent = state.myAvailabilitySaved
    ? state.availabilityFeedback
      ? "내 가능 시간이 반영됐어요."
      : "저장된 내 시간을 기준으로 추천 중"
    : "내 시간이 필요할 때만 조정";
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
  els.scheduleDetailTime.textContent = `${day.full} · ${timeRangeLabel(item.start, item.end)}`;
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

function commonIntervalsForDay(dayKey) {
  const selected = selectedPeople();

  if (selected.length === 0) {
    return [];
  }

  // 공통 시간은 각 사람의 확정 일정이 아닌 빈 시간 교집합으로만 만든다.
  let common = availabilityFor(selected[0], dayKey).map(interval => [...interval]);

  selected.slice(1).forEach(person => {
    common = intersectTwo(common, availabilityFor(person, dayKey));
  });

  return common.filter(([start, end]) => end - start >= MEETING_LENGTH);
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
  let score = 400 - Math.abs(candidate.start - PREFERRED_START) * 0.3;

  score += dayPreference[candidate.day];
  if (candidate.start === PREFERRED_START) score += 40;
  if (candidate.start === 10 * 60 - START_OF_DAY) score += 50;
  if (overlapsPostLunch) score -= 200;
  if (candidate.start < COMFORT_START) score -= 120;
  if (candidate.start >= COMFORT_END) score -= 220;

  return score;
}

function generateCandidates() {
  const list = [];

  days.forEach(day => {
    const common = commonIntervalsForDay(day.key);

    common.forEach(([rangeStart, rangeEnd]) => {
      for (
        let start = ceilToStep(rangeStart, 30);
        start + MEETING_LENGTH <= rangeEnd;
        start += 30
      ) {
        list.push({
          day: day.key,
          dayLabel: displayDay(day).full,
          start,
          end: start + MEETING_LENGTH,
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

function cycleCenterCandidate() {
  const candidates = candidatesForDay(state.selectedDay);
  if (candidates.length < 2) return;

  const currentIndex = candidates.findIndex(candidate =>
    sameCandidate(candidate, state.selectedCandidate)
  );
  const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % candidates.length;
  state.selectedCandidate = candidates[nextIndex];
  renderAll();
}

function renderParticipants() {
  const selected = selectedPeople();

  els.selectionCount.textContent = `선택 ${selected.length}/6`;
  els.selectedSummary.textContent = `선택한 ${selected.length}명 기준`;
  els.asideDesc.textContent = `선택한 ${selected.length}명이 동시에 비어 있는 후보입니다.`;

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
      state.selectedCandidate = firstForDay || null;
      renderAll();
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
  hideScheduleDetail();

  const selected = selectedPeople();
  const highlightedCandidate = state.selectedCandidate;
  const ringCount = selected.length;
  const { outerRadius, ringWidth, gap } = ringLayout(ringCount);
  const innerRadius = outerRadius - (ringCount - 1) * (ringWidth + gap);
  const innerEdge = innerRadius - ringWidth / 2;
  const outerEdge = outerRadius + ringWidth / 2;
  const indexDotRadius = Math.max(8, Math.min(12, ringWidth * 0.55));
  const common = commonIntervalsForDay(state.selectedDay);
  const selectedRange = highlightedCandidate?.day === state.selectedDay
    ? [highlightedCandidate.start, highlightedCandidate.end]
    : null;

  const splitCommonBand = (start, end) => {
    const boundaries = [start, end];

    if (selectedRange) {
      const [selectedStart, selectedEnd] = selectedRange;
      if (selectedStart > start && selectedStart < end) boundaries.push(selectedStart);
      if (selectedEnd > start && selectedEnd < end) boundaries.push(selectedEnd);
    }

    const sorted = [...new Set(boundaries)].sort((a, b) => a - b);

    return sorted.slice(0, -1).map((segmentStart, index) => {
      const segmentEnd = sorted[index + 1];
      const midpoint = (segmentStart + segmentEnd) / 2;
      const isSelected = selectedRange &&
        midpoint >= selectedRange[0] && midpoint < selectedRange[1];

      return {
        start: segmentStart,
        end: segmentEnd,
        type: isSelected ? "selected" : "common"
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

    blockedScheduleFor(person, state.selectedDay).forEach(item => {
      const path = createSvg("path", {
        d: describeArc(
          CHART.cx,
          CHART.cy,
          radius,
          angleForMinute(item.start),
          angleForMinute(item.end)
        ),
        class: `arc-busy ${item.isGlobal ? "global" : ""}`,
        stroke: item.isGlobal ? "#cbd5e1" : person.color,
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

    const schedule = [...person.schedule[state.selectedDay]].sort(
      (a, b) => a.start - b.start
    );

    schedule.slice(0, -1).forEach((item, scheduleIndex) => {
      const nextItem = schedule[scheduleIndex + 1];
      if (item.end !== nextItem.start) return;

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

  common.forEach(([start, end]) => {
    splitCommonBand(start, end).forEach(segment => {
      if (segment.end <= segment.start) return;

      svg.appendChild(createSvg("path", {
        d: describeAnnularSector(
          CHART.cx,
          CHART.cy,
          innerEdge,
          outerEdge,
          angleForMinute(segment.start),
          angleForMinute(segment.end)
        ),
        class: `common-band ${segment.type}`
      }));
    });
  });

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
  const selected = selectedPeople();
  const needsMyAvailability = !state.myAvailabilitySaved;
  const dayCandidates = candidates
    .filter(item => item.day === state.selectedDay)
    .sort((a, b) => a.start - b.start);
  const canSwitch = Boolean(candidate && dayCandidates.length > 1);

  els.centerCard.classList.toggle("switchable", canSwitch);
  els.centerCard.classList.toggle("saved-feedback", Boolean(candidate && state.availabilityFeedback));
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
    els.confirmBtn.classList.remove("confirmed");
    els.confirmBtn.classList.remove("soft-priority");
    els.actionRow.classList.toggle("availability-pending", needsMyAvailability);
    els.centerState.textContent = "공통 가능 시간 없음";
    els.centerDay.textContent = displayDay(day).full;
    els.centerTime.textContent = "참석자 선택을 조정해보세요";
    els.centerMeta.innerHTML = `
      <div>선택한 ${selected.length}명 기준</div>
      <div>1시간 이상 겹치는 시간이 없어요</div>
    `;
    els.confirmBtn.textContent = "가능한 시간 없음";
    els.confirmBtn.disabled = true;
    return;
  }

  const day = days.find(item => item.key === candidate.day);
  const isRecommendation = sameCandidate(candidate, recommendation);
  const isConfirmed = isConfirmedCandidate(candidate);
  els.centerState.textContent = isConfirmed
    ? "확정된 회의 시간"
    : state.availabilityFeedback
      ? "내 가능 시간이 반영됐어요."
      : isRecommendation
      ? "추천 회의 시간"
      : "선택한 회의 시간";
  els.centerDay.textContent = displayDay(day).full;
  els.centerTime.textContent = timeRangeLabel(candidate.start, candidate.end);
  els.centerMeta.innerHTML = `
    <div>선택한 참석자 모두 가능</div>
    <div>${state.availabilityFeedback
      ? "추천 시간을 다시 계산했어요"
      : isRecommendation
      ? "공통 가능 시간 중 가장 적합한 시간이에요"
      : "공통 후보 중 직접 선택한 시간이에요"}</div>
  `;
  els.confirmBtn.classList.toggle("confirmed", isConfirmed);
  els.actionRow.classList.toggle("availability-pending", needsMyAvailability);
  els.confirmBtn.classList.toggle("soft-priority", needsMyAvailability && !isConfirmed);
  els.confirmBtn.innerHTML = isConfirmed
    ? `${iconMarkup("check")} ${timeRangeLabel(candidate.start, candidate.end)} 회의 확정됨`
    : `${iconMarkup("calendar")} ${timeRangeLabel(candidate.start, candidate.end)}으로 확정하기`;
  els.confirmBtn.disabled = isConfirmed;
}

function renderCandidates() {
  const candidates = generateCandidates();
  const recommendation = recommendedCandidate(candidates);
  const selected = selectedPeople();

  if (!candidates.length) {
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
        선택한 ${selected.length}명이 동시에 가능한 1시간 구간이 없어요.<br />
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
          <span class="candidate-status">선택한 참석자 모두 가능</span>
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
            : `<div class="candidate-day-empty">이 날짜에는 1시간 이상 겹치는 시간이 없어요.</div>`}
        </section>
      `;
  };

  const visibleDays = state.showAllCandidates
    ? [selectedDay, ...days.filter(day => day.key !== state.selectedDay)]
    : [selectedDay];
  els.candidateList.innerHTML = visibleDays.map(candidateGroup).join("");

  els.candidateList.querySelectorAll(".candidate").forEach(button => {
    button.addEventListener("click", () => {
      state.selectedDay = button.dataset.day;
      state.selectedCandidate = {
        day: button.dataset.day,
        dayLabel: displayDay(button.dataset.day).full,
        start: Number(button.dataset.start),
        end: Number(button.dataset.end)
      };
      state.showAllCandidates = false;
      renderAll();
    });
  });
}

function renderReasons() {
  const candidate = state.selectedCandidate;
  els.reasonToggle.setAttribute("aria-expanded", String(state.reasonsExpanded));
  els.reasonList.hidden = !state.reasonsExpanded;

  if (!candidate) {
    els.reasonSummaryText.textContent = "현재 조건에서는 1시간 이상 겹치는 시간이 부족해요.";
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

  els.reasonSummaryText.textContent = "가장 무리 없는 공통 가능 시간이에요.";
  els.reasonList.innerHTML = `
    <div class="reason">
      <span class="reason-icon">${iconMarkup("check")}</span>
      <div>
        <strong>선택한 참석자가 모두 비어 있어요</strong>
        <span>${timeRangeLabel(candidate.start, candidate.end)}에는 선택된 모든 참석자가 참여할 수 있어요.</span>
      </div>
    </div>

    <div class="reason">
      <span class="reason-icon">${iconMarkup("check")}</span>
      <div>
        <strong>이번 주 공통 가능 시간 중 가장 무리 없는 시간이에요</strong>
        <span>겹치는 후보들 중 업무 흐름이 끊기지 않는 시간대를 우선했어요.</span>
      </div>
    </div>

    <div class="reason">
      <span class="reason-icon">${iconMarkup("check")}</span>
      <div>
        <strong>점심 직후와 퇴근 직전 시간을 피해 추천했어요</strong>
        <span>13:00 직후와 17:00에 가까운 후보는 우선순위를 낮췄어요.</span>
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
  els.confirmModalDate.textContent = day.long;
  els.confirmModalTime.textContent = timeRangeLabel(candidate.start, candidate.end);
  els.confirmModalAttendees.textContent = `참석자 ${attendees.length}명 · ${attendees.map(person => person.name).join(", ")}`;
  els.confirmModalCancel.hidden = false;
  els.confirmModalSubmit.textContent = "확정하기";
  els.confirmModal.hidden = false;
  document.body.classList.add("modal-open");
  els.confirmModalSubmit.focus();
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

  state.confirmedCandidate = {
    ...candidate,
    weekOffset: state.weekOffset
  };
  state.confirmModalStep = "success";

  els.confirmModal.classList.add("success");
  els.confirmModalIcon.innerHTML = iconMarkup("check");
  els.confirmModalTitle.textContent = "회의 시간이 확정됐어요";
  els.confirmModalMessage.textContent = "프로토타입 일정에 회의 시간이 저장되었습니다.";
  els.confirmModalCancel.hidden = true;
  els.confirmModalSubmit.textContent = "완료";
  renderCenter();
}

function bindStaticEvents() {
  els.scheduleDetailClose.addEventListener("click", hideScheduleDetail);
  els.availabilityEntryBtn.addEventListener("click", openAvailabilityModal);
  els.availabilityModalClose.addEventListener("click", closeAvailabilityModal);
  els.availabilityCancelBtn.addEventListener("click", closeAvailabilityModal);
  els.saveAvailabilityBtn.addEventListener("click", saveAvailability);

  els.selectWorkHoursBtn.addEventListener("click", () => {
    state.availabilityDraft = blankAvailabilityDraft(true);
    renderAvailabilityGrid();
  });

  els.excludeLunchBtn.addEventListener("click", () => {
    setDraftLunch(false);
    renderAvailabilityGrid();
  });

  els.clearAvailabilityBtn.addEventListener("click", () => {
    state.availabilityDraft = blankAvailabilityDraft(false);
    renderAvailabilityGrid();
  });

  els.availabilityModal.addEventListener("click", event => {
    if (event.target === els.availabilityModal) {
      closeAvailabilityModal();
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
      closeAvailabilityModal();
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
}

bindStaticEvents();
renderAll();
startEntryFeedback();
