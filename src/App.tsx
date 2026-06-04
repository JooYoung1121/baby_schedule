import {
  Activity,
  Apple,
  Baby,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  ClipboardList,
  Clock,
  Download,
  Droplets,
  Home,
  MapPin,
  Milk,
  Moon,
  NotebookTabs,
  PackageCheck,
  Pill,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Trash2,
  Upload,
  Utensils,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { monthGuides, readinessItems } from "./data";
import { loadState, normalizeState, saveState } from "./storage";
import type {
  ActivityType,
  BabyState,
  DiaperType,
  FoodTrial,
  ReactionLevel,
  ResearchCategory,
  ResearchItem,
  ResearchStatus,
  ScheduleEntry,
  SleepQuality,
  SupplyItem,
  SupplyStatus,
} from "./types";
import {
  addDays,
  createId,
  currency,
  elapsedLabel,
  formatDate,
  formatDuration,
  formatTime,
  getBabyAge,
  isSameLocalDate,
  isoFromDateTimeInput,
  localDateFromIso,
  minutesBetween,
  toDateInputValue,
  toDateTimeInputValue,
} from "./utils";

type TabId = "today" | "foods" | "supplies" | "ideas" | "data";

interface ActivityConfig {
  label: string;
  defaultTitle: string;
  tone: string;
  unit?: string;
  Icon: LucideIcon;
}

const tabs: Array<{ id: TabId; label: string; Icon: LucideIcon }> = [
  { id: "today", label: "오늘", Icon: Home },
  { id: "foods", label: "이유식", Icon: Utensils },
  { id: "supplies", label: "물품", Icon: ShoppingCart },
  { id: "ideas", label: "탐색", Icon: Search },
  { id: "data", label: "관리", Icon: Settings },
];

const activityConfig: Record<ActivityType, ActivityConfig> = {
  milk: { label: "수유", defaultTitle: "수유", unit: "ml", tone: "mint", Icon: Milk },
  sleep: { label: "수면", defaultTitle: "잠", tone: "blue", Icon: Moon },
  diaper: { label: "기저귀", defaultTitle: "기저귀", tone: "yellow", Icon: Droplets },
  solid: { label: "이유식", defaultTitle: "이유식", unit: "g", tone: "green", Icon: Apple },
  medicine: { label: "약/체온", defaultTitle: "약", tone: "rose", Icon: Pill },
  play: { label: "놀이", defaultTitle: "놀이", tone: "violet", Icon: Activity },
  note: { label: "메모", defaultTitle: "메모", tone: "gray", Icon: NotebookTabs },
};

const diaperLabels: Record<DiaperType, string> = {
  wet: "소변",
  dirty: "대변",
  mixed: "소변+대변",
  dry: "마른 기저귀",
};

const sleepQualityLabels: Record<SleepQuality, string> = {
  good: "편안",
  normal: "보통",
  hard: "힘듦",
};

const reactionLabels: Record<ReactionLevel, string> = {
  none: "이상 없음",
  watch: "관찰 필요",
  mild: "가벼운 반응",
};

const supplyStatusLabels: Record<SupplyStatus, string> = {
  needed: "필요",
  ordered: "주문",
  stocked: "보유",
  low: "부족",
  bought: "구매완료",
};

const researchStatusLabels: Record<ResearchStatus, string> = {
  "to-search": "검색 예정",
  saved: "저장",
  done: "정리 완료",
};

const researchCategories: ResearchCategory[] = ["개월수", "여행", "놀이", "건강", "쇼핑", "기타"];

function getDaySummary(entries: ScheduleEntry[]) {
  const milk = entries.filter((entry) => entry.type === "milk");
  const sleep = entries.filter((entry) => entry.type === "sleep");
  const diapers = entries.filter((entry) => entry.type === "diaper");
  const solids = entries.filter((entry) => entry.type === "solid");
  const medicines = entries.filter((entry) => entry.type === "medicine");

  return {
    milkCount: milk.length,
    milkTotal: milk.reduce((sum, entry) => sum + (entry.amount ?? 0), 0),
    sleepMinutes: sleep.reduce((sum, entry) => sum + minutesBetween(entry.startedAt, entry.endedAt), 0),
    diaperCount: diapers.length,
    solidCount: solids.length,
    medicineCount: medicines.length,
  };
}

function getLastEntry(entries: ScheduleEntry[], type: ActivityType) {
  return [...entries]
    .filter((entry) => entry.type === type)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())[0];
}

function App() {
  const [state, setState] = useState<BabyState>(loadState);
  const [activeTab, setActiveTab] = useState<TabId>("today");
  const [selectedDate, setSelectedDate] = useState(toDateInputValue(new Date()));
  const [quickType, setQuickType] = useState<ActivityType | null>(null);
  const [toast, setToast] = useState("");
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const age = useMemo(() => getBabyAge(state.profile.birthDate), [state.profile.birthDate]);
  const dayEntries = useMemo(
    () =>
      state.schedule
        .filter((entry) => isSameLocalDate(entry.startedAt, selectedDate))
        .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()),
    [state.schedule, selectedDate],
  );
  const daySummary = useMemo(() => getDaySummary(dayEntries), [dayEntries]);
  const lastMilk = useMemo(() => getLastEntry(state.schedule, "milk"), [state.schedule]);
  const lastSleep = useMemo(() => getLastEntry(state.schedule, "sleep"), [state.schedule]);

  function updateState(updater: (previous: BabyState) => BabyState) {
    setState((previous) => updater(previous));
  }

  function addScheduleEntry(entry: Omit<ScheduleEntry, "id">) {
    const nextEntry = { ...entry, id: createId("log") };
    updateState((previous) => ({
      ...previous,
      schedule: [nextEntry, ...previous.schedule],
    }));
    setSelectedDate(localDateFromIso(nextEntry.startedAt));
    setQuickType(null);
    setToast(`${activityConfig[nextEntry.type].label} 기록을 추가했어요.`);
  }

  function deleteScheduleEntry(id: string) {
    updateState((previous) => ({
      ...previous,
      schedule: previous.schedule.filter((entry) => entry.id !== id),
    }));
  }

  function addFood(food: Omit<FoodTrial, "id">) {
    const nextFood = { ...food, id: createId("food") };
    const mealTime = new Date(`${food.date}T12:00:00`).toISOString();
    updateState((previous) => ({
      ...previous,
      foods: [nextFood, ...previous.foods],
      schedule: [
        {
          id: createId("log"),
          type: "solid",
          startedAt: mealTime,
          title: `이유식: ${food.food}`,
          amount: Number.parseFloat(food.amount) || undefined,
          unit: Number.parseFloat(food.amount) ? "g" : undefined,
          note: [food.texture, food.reaction !== "none" ? reactionLabels[food.reaction] : "", food.note]
            .filter(Boolean)
            .join(" · "),
        },
        ...previous.schedule,
      ],
    }));
    setToast("이유식 기록을 추가했어요.");
  }

  function deleteFood(id: string) {
    updateState((previous) => ({
      ...previous,
      foods: previous.foods.filter((food) => food.id !== id),
    }));
  }

  function addSupply(item: Omit<SupplyItem, "id">) {
    updateState((previous) => ({
      ...previous,
      supplies: [{ ...item, id: createId("supply") }, ...previous.supplies],
    }));
    setToast("물품을 추가했어요.");
  }

  function updateSupplyStatus(id: string, status: SupplyStatus) {
    updateState((previous) => ({
      ...previous,
      supplies: previous.supplies.map((item) => (item.id === id ? { ...item, status } : item)),
    }));
  }

  function deleteSupply(id: string) {
    updateState((previous) => ({
      ...previous,
      supplies: previous.supplies.filter((item) => item.id !== id),
    }));
  }

  function addResearch(item: Omit<ResearchItem, "id" | "createdAt">) {
    updateState((previous) => ({
      ...previous,
      research: [{ ...item, id: createId("research"), createdAt: new Date().toISOString() }, ...previous.research],
    }));
    setToast("탐색 주제를 추가했어요.");
  }

  function updateResearchStatus(id: string, status: ResearchStatus) {
    updateState((previous) => ({
      ...previous,
      research: previous.research.map((item) => (item.id === id ? { ...item, status } : item)),
    }));
  }

  function deleteResearch(id: string) {
    updateState((previous) => ({
      ...previous,
      research: previous.research.filter((item) => item.id !== id),
    }));
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `baby-schedule-${toDateInputValue(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function importData(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        setState(normalizeState(parsed));
        setToast("백업 데이터를 불러왔어요.");
      } catch {
        setToast("JSON 파일을 확인해 주세요.");
      } finally {
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <img src={`${import.meta.env.BASE_URL}baby-care.svg`} alt="" className="brand-image" />
          <div>
            <p className="eyebrow">Baby Schedule</p>
            <h1>{state.profile.name} 루틴</h1>
            <p className="muted">{age.days}일째 · {age.monthStage}개월차</p>
          </div>
        </div>
        <button className="icon-button" type="button" title="관리" onClick={() => setActiveTab("data")}>
          <Settings size={20} />
        </button>
      </header>

      <div className="layout">
        <aside className="sidebar" aria-label="주요 메뉴">
          <div className="profile-panel">
            <Baby size={24} />
            <div>
              <strong>{state.profile.name}</strong>
              <span>{state.profile.memo || "우리 가족 전용 기록"}</span>
            </div>
          </div>
          <nav className="side-nav">
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={activeTab === id ? "active" : ""}
                type="button"
                onClick={() => setActiveTab(id)}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="content">
          {activeTab === "today" && (
            <TodayView
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              dayEntries={dayEntries}
              daySummary={daySummary}
              lastMilk={lastMilk}
              lastSleep={lastSleep}
              quickType={quickType}
              setQuickType={setQuickType}
              onAddEntry={addScheduleEntry}
              onDeleteEntry={deleteScheduleEntry}
            />
          )}

          {activeTab === "foods" && (
            <FoodsView
              state={state}
              updateState={updateState}
              addFood={addFood}
              deleteFood={deleteFood}
            />
          )}

          {activeTab === "supplies" && (
            <SuppliesView
              supplies={state.supplies}
              addSupply={addSupply}
              updateSupplyStatus={updateSupplyStatus}
              deleteSupply={deleteSupply}
            />
          )}

          {activeTab === "ideas" && (
            <IdeasView
              ageMonthStage={age.monthStage}
              research={state.research}
              addResearch={addResearch}
              updateResearchStatus={updateResearchStatus}
              deleteResearch={deleteResearch}
            />
          )}

          {activeTab === "data" && (
            <DataView
              state={state}
              updateState={updateState}
              exportData={exportData}
              importData={importData}
              importInputRef={importInputRef}
            />
          )}
        </main>
      </div>

      <nav className="bottom-nav" aria-label="모바일 메뉴">
        {tabs.map(({ id, label, Icon }) => (
          <button key={id} className={activeTab === id ? "active" : ""} type="button" onClick={() => setActiveTab(id)}>
            <Icon size={19} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

interface TodayViewProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  dayEntries: ScheduleEntry[];
  daySummary: ReturnType<typeof getDaySummary>;
  lastMilk?: ScheduleEntry;
  lastSleep?: ScheduleEntry;
  quickType: ActivityType | null;
  setQuickType: (type: ActivityType | null) => void;
  onAddEntry: (entry: Omit<ScheduleEntry, "id">) => void;
  onDeleteEntry: (id: string) => void;
}

function TodayView({
  selectedDate,
  setSelectedDate,
  dayEntries,
  daySummary,
  lastMilk,
  lastSleep,
  quickType,
  setQuickType,
  onAddEntry,
  onDeleteEntry,
}: TodayViewProps) {
  return (
    <div className="stack">
      <section className="surface day-header">
        <div className="date-controls">
          <button className="icon-button" type="button" title="이전 날짜" onClick={() => setSelectedDate(addDays(selectedDate, -1))}>
            <ChevronLeft size={20} />
          </button>
          <label>
            <span>날짜</span>
            <input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
          </label>
          <button className="icon-button" type="button" title="다음 날짜" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
            <ChevronRight size={20} />
          </button>
        </div>
        <div>
          <p className="eyebrow">{formatDate(selectedDate)}</p>
          <h2>오늘 스케줄</h2>
        </div>
      </section>

      <section className="quick-grid" aria-label="빠른 기록">
        {(Object.keys(activityConfig) as ActivityType[]).map((type) => {
          const config = activityConfig[type];
          const Icon = config.Icon;
          return (
            <button key={type} className={`quick-card ${config.tone}`} type="button" onClick={() => setQuickType(type)}>
              <Icon size={22} />
              <span>{config.label}</span>
            </button>
          );
        })}
      </section>

      {quickType && (
        <QuickLogForm type={quickType} onAddEntry={onAddEntry} onCancel={() => setQuickType(null)} />
      )}

      <section className="summary-grid" aria-label="오늘 요약">
        <SummaryTile icon={Milk} label="수유" value={`${daySummary.milkCount}회`} detail={daySummary.milkTotal ? `${daySummary.milkTotal}ml` : "총량 없음"} />
        <SummaryTile icon={Moon} label="수면" value={formatDuration(daySummary.sleepMinutes)} detail={`최근 ${elapsedLabel(lastSleep?.endedAt ?? lastSleep?.startedAt)}`} />
        <SummaryTile icon={Droplets} label="기저귀" value={`${daySummary.diaperCount}회`} detail="소변/대변 기록" />
        <SummaryTile icon={Apple} label="이유식" value={`${daySummary.solidCount}회`} detail={daySummary.medicineCount ? `약 ${daySummary.medicineCount}회` : "식사 기록"} />
      </section>

      <section className="surface insight-strip">
        <div>
          <p className="eyebrow">다음 체크</p>
          <h3>{lastMilk ? `마지막 수유 ${elapsedLabel(lastMilk.startedAt)}` : "첫 수유 기록을 남겨보세요"}</h3>
          <p className="muted">
            {lastSleep?.endedAt
              ? `마지막 수면 종료 ${elapsedLabel(lastSleep.endedAt)}. 컨디션, 졸림 신호, 수유 간격을 같이 보면 좋아요.`
              : "수면 기록에 종료 시간을 넣으면 하루 총 수면을 계산합니다."}
          </p>
        </div>
        <Clock size={30} />
      </section>

      <section className="surface">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Timeline</p>
            <h2>하루 기록</h2>
          </div>
          <span className="count-badge">{dayEntries.length}</span>
        </div>

        {dayEntries.length === 0 ? (
          <EmptyState icon={CalendarDays} title="아직 기록이 없어요" text="위의 빠른 기록에서 수유, 수면, 기저귀를 먼저 남겨보세요." />
        ) : (
          <div className="timeline">
            {dayEntries.map((entry) => (
              <TimelineItem key={entry.id} entry={entry} onDelete={() => onDeleteEntry(entry.id)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

interface QuickLogFormProps {
  type: ActivityType;
  onAddEntry: (entry: Omit<ScheduleEntry, "id">) => void;
  onCancel: () => void;
}

function QuickLogForm({ type, onAddEntry, onCancel }: QuickLogFormProps) {
  const config = activityConfig[type];
  const [title, setTitle] = useState(config.defaultTitle);
  const [startedAt, setStartedAt] = useState(toDateTimeInputValue(new Date()));
  const [endedAt, setEndedAt] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState(config.unit ?? "");
  const [diaper, setDiaper] = useState<DiaperType>("wet");
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>("normal");
  const [note, setNote] = useState("");

  useEffect(() => {
    setTitle(config.defaultTitle);
    setStartedAt(toDateTimeInputValue(new Date()));
    setEndedAt("");
    setAmount("");
    setUnit(config.unit ?? "");
    setNote("");
  }, [config.defaultTitle, config.unit, type]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const numericAmount = Number.parseFloat(amount);
    onAddEntry({
      type,
      startedAt: isoFromDateTimeInput(startedAt),
      endedAt: endedAt ? isoFromDateTimeInput(endedAt) : undefined,
      title: title.trim() || config.defaultTitle,
      amount: Number.isFinite(numericAmount) ? numericAmount : undefined,
      unit: Number.isFinite(numericAmount) && unit ? unit : undefined,
      diaper: type === "diaper" ? diaper : undefined,
      sleepQuality: type === "sleep" ? sleepQuality : undefined,
      note: note.trim() || undefined,
    });
  }

  return (
    <section className={`surface form-surface ${config.tone}`}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Add</p>
          <h2>{config.label} 기록</h2>
        </div>
        <button className="icon-button" type="button" title="닫기" onClick={onCancel}>
          <X size={19} />
        </button>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          <span>이름</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label>
          <span>시작</span>
          <input type="datetime-local" value={startedAt} onChange={(event) => setStartedAt(event.target.value)} required />
        </label>
        {type === "sleep" && (
          <>
            <label>
              <span>종료</span>
              <input type="datetime-local" value={endedAt} onChange={(event) => setEndedAt(event.target.value)} />
            </label>
            <label>
              <span>상태</span>
              <select value={sleepQuality} onChange={(event) => setSleepQuality(event.target.value as SleepQuality)}>
                {Object.entries(sleepQualityLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        {(type === "milk" || type === "solid" || type === "medicine") && (
          <div className="inline-fields">
            <label>
              <span>양</span>
              <input inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="예: 180" />
            </label>
            <label>
              <span>단위</span>
              <input value={unit} onChange={(event) => setUnit(event.target.value)} placeholder="ml/g/cc" />
            </label>
          </div>
        )}
        {type === "diaper" && (
          <label>
            <span>종류</span>
            <select value={diaper} onChange={(event) => setDiaper(event.target.value as DiaperType)}>
              {Object.entries(diaperLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="wide">
          <span>메모</span>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} placeholder="컨디션, 반응, 특이사항" />
        </label>
        <div className="form-actions">
          <button className="secondary-button" type="button" onClick={onCancel}>
            취소
          </button>
          <button className="primary-button" type="submit">
            <Plus size={18} />
            추가
          </button>
        </div>
      </form>
    </section>
  );
}

function SummaryTile({ icon: Icon, label, value, detail }: { icon: LucideIcon; label: string; value: string; detail: string }) {
  return (
    <div className="summary-tile">
      <Icon size={20} />
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function TimelineItem({ entry, onDelete }: { entry: ScheduleEntry; onDelete: () => void }) {
  const config = activityConfig[entry.type];
  const Icon = config.Icon;
  const duration = entry.endedAt ? minutesBetween(entry.startedAt, entry.endedAt) : 0;

  return (
    <article className="timeline-item">
      <div className={`timeline-icon ${config.tone}`}>
        <Icon size={19} />
      </div>
      <div className="timeline-body">
        <div className="timeline-title">
          <div>
            <strong>{entry.title}</strong>
            <span>{formatTime(entry.startedAt)}{entry.endedAt ? ` - ${formatTime(entry.endedAt)}` : ""}</span>
          </div>
          <button className="icon-button danger" type="button" title="삭제" onClick={onDelete}>
            <Trash2 size={17} />
          </button>
        </div>
        <div className="meta-row">
          <span>{config.label}</span>
          {entry.amount ? <span>{entry.amount}{entry.unit}</span> : null}
          {entry.diaper ? <span>{diaperLabels[entry.diaper]}</span> : null}
          {duration ? <span>{formatDuration(duration)}</span> : null}
          {entry.sleepQuality ? <span>{sleepQualityLabels[entry.sleepQuality]}</span> : null}
        </div>
        {entry.note && <p>{entry.note}</p>}
      </div>
    </article>
  );
}

function FoodsView({
  state,
  updateState,
  addFood,
  deleteFood,
}: {
  state: BabyState;
  updateState: (updater: (previous: BabyState) => BabyState) => void;
  addFood: (food: Omit<FoodTrial, "id">) => void;
  deleteFood: (id: string) => void;
}) {
  return (
    <div className="stack">
      <section className="surface">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Solids</p>
            <h2>이유식 준비</h2>
          </div>
          <Utensils size={24} />
        </div>
        <div className="check-grid">
          {readinessItems.map((item) => (
            <label key={item.id} className="check-row">
              <input
                type="checkbox"
                checked={Boolean(state.readiness[item.id])}
                onChange={(event) =>
                  updateState((previous) => ({
                    ...previous,
                    readiness: {
                      ...previous.readiness,
                      [item.id]: event.target.checked,
                    },
                  }))
                }
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </section>

      <FoodForm onAddFood={addFood} />

      <section className="surface">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Food Log</p>
            <h2>시도한 음식</h2>
          </div>
          <span className="count-badge">{state.foods.length}</span>
        </div>
        {state.foods.length === 0 ? (
          <EmptyState icon={Apple} title="첫 음식 기록을 기다리는 중" text="쌀미음, 오트밀, 채소처럼 한 번에 하나씩 기록해 보세요." />
        ) : (
          <div className="list">
            {state.foods.map((food) => (
              <article key={food.id} className="list-item">
                <div>
                  <div className="item-title">
                    <strong>{food.food}</strong>
                    {food.isAllergen && <span className="status-chip rose">알레르겐</span>}
                  </div>
                  <p>{food.date} · {food.meal} · {food.amount || "양 미기록"} · {food.texture}</p>
                  <p className="muted">{reactionLabels[food.reaction]}{food.note ? ` · ${food.note}` : ""}</p>
                </div>
                <button className="icon-button danger" type="button" title="삭제" onClick={() => deleteFood(food.id)}>
                  <Trash2 size={17} />
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FoodForm({ onAddFood }: { onAddFood: (food: Omit<FoodTrial, "id">) => void }) {
  const [food, setFood] = useState("");
  const [date, setDate] = useState(toDateInputValue(new Date()));
  const [meal, setMeal] = useState("오전");
  const [amount, setAmount] = useState("");
  const [texture, setTexture] = useState("미음");
  const [isAllergen, setIsAllergen] = useState(false);
  const [reaction, setReaction] = useState<ReactionLevel>("none");
  const [note, setNote] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!food.trim()) return;
    onAddFood({
      food: food.trim(),
      date,
      meal,
      amount,
      texture,
      isAllergen,
      reaction,
      note: note.trim(),
    });
    setFood("");
    setAmount("");
    setNote("");
    setIsAllergen(false);
    setReaction("none");
  }

  return (
    <section className="surface">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Add Food</p>
          <h2>음식 추가</h2>
        </div>
      </div>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          <span>음식</span>
          <input value={food} onChange={(event) => setFood(event.target.value)} placeholder="예: 쌀미음" />
        </label>
        <label>
          <span>날짜</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label>
          <span>식사</span>
          <select value={meal} onChange={(event) => setMeal(event.target.value)}>
            <option>오전</option>
            <option>오후</option>
            <option>저녁</option>
          </select>
        </label>
        <label>
          <span>양</span>
          <input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="예: 20g" />
        </label>
        <label>
          <span>질감</span>
          <select value={texture} onChange={(event) => setTexture(event.target.value)}>
            <option>미음</option>
            <option>퓨레</option>
            <option>으깬 형태</option>
            <option>핑거푸드</option>
          </select>
        </label>
        <label>
          <span>반응</span>
          <select value={reaction} onChange={(event) => setReaction(event.target.value as ReactionLevel)}>
            {Object.entries(reactionLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="check-row compact">
          <input type="checkbox" checked={isAllergen} onChange={(event) => setIsAllergen(event.target.checked)} />
          <span>알레르겐 후보</span>
        </label>
        <label className="wide">
          <span>메모</span>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} />
        </label>
        <div className="form-actions">
          <button className="primary-button" type="submit">
            <Plus size={18} />
            추가
          </button>
        </div>
      </form>
    </section>
  );
}

function SuppliesView({
  supplies,
  addSupply,
  updateSupplyStatus,
  deleteSupply,
}: {
  supplies: SupplyItem[];
  addSupply: (item: Omit<SupplyItem, "id">) => void;
  updateSupplyStatus: (id: string, status: SupplyStatus) => void;
  deleteSupply: (id: string) => void;
}) {
  const neededCount = supplies.filter((item) => item.status === "needed" || item.status === "low").length;
  const boughtTotal = supplies.reduce((sum, item) => sum + (item.status === "bought" ? item.price ?? 0 : 0), 0);

  return (
    <div className="stack">
      <section className="summary-grid">
        <SummaryTile icon={ClipboardList} label="필요/부족" value={`${neededCount}개`} detail="우선 확인" />
        <SummaryTile icon={PackageCheck} label="구매완료" value={currency(boughtTotal) || "0원"} detail="입력된 비용 합계" />
      </section>

      <SupplyForm onAddSupply={addSupply} />

      <section className="surface">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Inventory</p>
            <h2>물품 목록</h2>
          </div>
          <span className="count-badge">{supplies.length}</span>
        </div>
        <div className="list">
          {supplies.map((item) => (
            <article key={item.id} className="list-item">
              <div>
                <div className="item-title">
                  <strong>{item.name}</strong>
                  <span className={`status-chip ${item.status}`}>{supplyStatusLabels[item.status]}</span>
                </div>
                <p>{item.category} · {item.quantity || "수량 미정"}{item.shop ? ` · ${item.shop}` : ""}</p>
                <p className="muted">
                  {[item.targetDate ? `목표 ${item.targetDate}` : "", currency(item.price), item.note].filter(Boolean).join(" · ")}
                </p>
              </div>
              <div className="item-actions">
                <select value={item.status} onChange={(event) => updateSupplyStatus(item.id, event.target.value as SupplyStatus)}>
                  {Object.entries(supplyStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <button className="icon-button danger" type="button" title="삭제" onClick={() => deleteSupply(item.id)}>
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function SupplyForm({ onAddSupply }: { onAddSupply: (item: Omit<SupplyItem, "id">) => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("이유식");
  const [status, setStatus] = useState<SupplyStatus>("needed");
  const [quantity, setQuantity] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [price, setPrice] = useState("");
  const [shop, setShop] = useState("");
  const [note, setNote] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    onAddSupply({
      name: name.trim(),
      category,
      status,
      quantity,
      targetDate: targetDate || undefined,
      price: Number.parseInt(price, 10) || undefined,
      shop: shop.trim() || undefined,
      note: note.trim() || undefined,
    });
    setName("");
    setQuantity("");
    setTargetDate("");
    setPrice("");
    setShop("");
    setNote("");
  }

  return (
    <section className="surface">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Add Item</p>
          <h2>물품 추가</h2>
        </div>
      </div>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          <span>물품</span>
          <input value={name} onChange={(event) => setName(event.target.value)} placeholder="예: 턱받이" />
        </label>
        <label>
          <span>분류</span>
          <input value={category} onChange={(event) => setCategory(event.target.value)} />
        </label>
        <label>
          <span>상태</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as SupplyStatus)}>
            {Object.entries(supplyStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>수량</span>
          <input value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="예: 3개" />
        </label>
        <label>
          <span>목표일</span>
          <input type="date" value={targetDate} onChange={(event) => setTargetDate(event.target.value)} />
        </label>
        <label>
          <span>금액</span>
          <input inputMode="numeric" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="원" />
        </label>
        <label>
          <span>구매처</span>
          <input value={shop} onChange={(event) => setShop(event.target.value)} placeholder="쿠팡, 당근, 매장" />
        </label>
        <label className="wide">
          <span>메모</span>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} />
        </label>
        <div className="form-actions">
          <button className="primary-button" type="submit">
            <Plus size={18} />
            추가
          </button>
        </div>
      </form>
    </section>
  );
}

function IdeasView({
  ageMonthStage,
  research,
  addResearch,
  updateResearchStatus,
  deleteResearch,
}: {
  ageMonthStage: number;
  research: ResearchItem[];
  addResearch: (item: Omit<ResearchItem, "id" | "createdAt">) => void;
  updateResearchStatus: (id: string, status: ResearchStatus) => void;
  deleteResearch: (id: string) => void;
}) {
  const currentGuide = monthGuides.find((guide) => {
    const [start, end] = guide.range.replace("개월", "").split("-").map(Number);
    return ageMonthStage >= start && ageMonthStage <= end;
  });

  return (
    <div className="stack">
      <section className="surface guide-surface">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Guide</p>
            <h2>{currentGuide?.title ?? "개월수별 체크"}</h2>
          </div>
          <MapPin size={24} />
        </div>
        <div className="guide-grid">
          {monthGuides.map((guide) => (
            <article key={guide.range} className={guide === currentGuide ? "guide-card current" : "guide-card"}>
              <span>{guide.range}</span>
              <strong>{guide.title}</strong>
              <ul>
                {guide.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <ResearchForm onAddResearch={addResearch} />

      <section className="surface">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Research Board</p>
            <h2>검색/정리 목록</h2>
          </div>
          <span className="count-badge">{research.length}</span>
        </div>
        <div className="list">
          {research.map((item) => (
            <article key={item.id} className="list-item">
              <div>
                <div className="item-title">
                  <strong>{item.title}</strong>
                  <span className="status-chip blue">{item.category}</span>
                </div>
                <p className="muted">{item.note || "메모 없음"}</p>
                {item.url && (
                  <a href={item.url} target="_blank" rel="noreferrer">
                    {item.url}
                  </a>
                )}
              </div>
              <div className="item-actions">
                <select value={item.status} onChange={(event) => updateResearchStatus(item.id, event.target.value as ResearchStatus)}>
                  {Object.entries(researchStatusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <button className="icon-button danger" type="button" title="삭제" onClick={() => deleteResearch(item.id)}>
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ResearchForm({ onAddResearch }: { onAddResearch: (item: Omit<ResearchItem, "id" | "createdAt">) => void }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ResearchCategory>("개월수");
  const [status, setStatus] = useState<ResearchStatus>("to-search");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!title.trim()) return;
    onAddResearch({
      title: title.trim(),
      category,
      status,
      url: url.trim() || undefined,
      note: note.trim() || undefined,
    });
    setTitle("");
    setUrl("");
    setNote("");
  }

  return (
    <section className="surface">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Add Topic</p>
          <h2>탐색 주제 추가</h2>
        </div>
      </div>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          <span>제목</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="예: 주말 실내 외출지" />
        </label>
        <label>
          <span>분류</span>
          <select value={category} onChange={(event) => setCategory(event.target.value as ResearchCategory)}>
            {researchCategories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          <span>상태</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as ResearchStatus)}>
            {Object.entries(researchStatusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>링크</span>
          <input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://..." />
        </label>
        <label className="wide">
          <span>메모</span>
          <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={3} />
        </label>
        <div className="form-actions">
          <button className="primary-button" type="submit">
            <Plus size={18} />
            추가
          </button>
        </div>
      </form>
    </section>
  );
}

function DataView({
  state,
  updateState,
  exportData,
  importData,
  importInputRef,
}: {
  state: BabyState;
  updateState: (updater: (previous: BabyState) => BabyState) => void;
  exportData: () => void;
  importData: (event: ChangeEvent<HTMLInputElement>) => void;
  importInputRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <div className="stack">
      <section className="surface">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Profile</p>
            <h2>아기 정보</h2>
          </div>
          <Baby size={24} />
        </div>
        <form className="form-grid">
          <label>
            <span>이름</span>
            <input
              value={state.profile.name}
              onChange={(event) =>
                updateState((previous) => ({
                  ...previous,
                  profile: { ...previous.profile, name: event.target.value },
                }))
              }
            />
          </label>
          <label>
            <span>생일</span>
            <input
              type="date"
              value={state.profile.birthDate}
              onChange={(event) =>
                updateState((previous) => ({
                  ...previous,
                  profile: { ...previous.profile, birthDate: event.target.value },
                }))
              }
            />
          </label>
          <label className="wide">
            <span>메모</span>
            <textarea
              rows={3}
              value={state.profile.memo}
              onChange={(event) =>
                updateState((previous) => ({
                  ...previous,
                  profile: { ...previous.profile, memo: event.target.value },
                }))
              }
            />
          </label>
        </form>
      </section>

      <section className="surface">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Backup</p>
            <h2>데이터 백업</h2>
          </div>
          <CircleCheck size={24} />
        </div>
        <p className="muted block-copy">
          이 버전은 브라우저 안에만 저장됩니다. 같은 휴대폰 브라우저에서는 계속 남아 있고, 다른 기기와 공유하려면 JSON 백업을 옮기거나 다음 단계에서 동기화를 붙이면 됩니다.
        </p>
        <div className="data-actions">
          <button className="primary-button" type="button" onClick={exportData}>
            <Download size={18} />
            내보내기
          </button>
          <button className="secondary-button" type="button" onClick={() => importInputRef.current?.click()}>
            <Upload size={18} />
            가져오기
          </button>
          <input ref={importInputRef} className="hidden-input" type="file" accept="application/json" onChange={importData} />
        </div>
      </section>

      <section className="surface">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Deploy</p>
            <h2>배포 메모</h2>
          </div>
        </div>
        <div className="deploy-grid">
          <div>
            <strong>GitHub Pages</strong>
            <p>현재 빌드 경로는 `/baby_schedule/` 기준입니다.</p>
          </div>
          <div>
            <strong>서비스형 배포</strong>
            <p>Vercel/Netlify/Supabase 연동은 `VITE_BASE_PATH=/`로 빌드하면 됩니다.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function EmptyState({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="empty-state">
      <Icon size={28} />
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

export default App;
