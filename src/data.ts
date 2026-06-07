import type {
  BabyState,
  BrandCandidate,
  CuratedCard,
  FoodCandidate,
  ResearchItem,
  SupplyItem,
  VendorComparison,
} from "./types";

const today = new Date();

export const readinessItems = [
  { id: "head", label: "머리와 목을 안정적으로 가눔" },
  { id: "sit", label: "도움받아 앉은 자세를 유지함" },
  { id: "mouth", label: "숟가락이나 음식에 입을 벌림" },
  { id: "swallow", label: "혀로 밀어내기보다 삼키는 모습을 보임" },
  { id: "grab", label: "장난감이나 물건을 입으로 가져감" },
  { id: "doctor", label: "소아과 상담 또는 가족 기준 확인" },
];

export const monthGuides = [
  {
    range: "4-6개월",
    title: "루틴 안정과 이유식 준비",
    points: ["낮잠과 밤잠 패턴 관찰", "수유 간격과 총량 확인", "이유식 준비 신호 체크", "짧은 외출 동선 테스트"],
  },
  {
    range: "6-8개월",
    title: "초기 이유식과 앉기 연습",
    points: ["한 가지 음식씩 천천히 시도", "반응과 변 상태 기록", "컵/숟가락 노출", "유모차 친화 장소 저장"],
  },
  {
    range: "9-12개월",
    title: "놀이 확장과 가족 외출",
    points: ["손가락 음식과 질감 확장", "기어가기/잡고 서기 환경 점검", "수면 변화 메모", "여행 준비물 템플릿화"],
  },
];

export const solidGuideCards: CuratedCard[] = [
  {
    id: "solid-start",
    label: "시작 기준",
    title: "대략 6개월 전후, 준비 신호가 우선",
    summary:
      "모유/분유가 주 영양원이고, 고개 가눔·도움받아 앉기·음식 관심·숟가락을 받는 모습이 보이면 시작 후보로 봅니다. 4개월 전 시작은 권장되지 않습니다.",
    sourceLabel: "CDC",
    url: "https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/when-what-and-how-to-introduce-solid-foods.html",
  },
  {
    id: "solid-one-food",
    label: "첫 방식",
    title: "처음엔 한 번에 한 가지 재료",
    summary:
      "초기에는 단일 재료를 소량으로 주고 반응을 봅니다. 새 재료를 여러 개 동시에 섞으면 어떤 식품에 반응했는지 알기 어렵습니다.",
    sourceLabel: "CDC / 질병관리청",
    url: "https://health.kdca.go.kr/healthinfo/biz/health/gnrlzHealthInfo/gnrlzHealthInfo/gnrlzHealthInfoView.do?cntnts_sn=5212",
  },
  {
    id: "solid-variety",
    label: "확장",
    title: "몇 달 안에 고기·곡류·채소·과일·달걀·생선까지 다양화",
    summary:
      "AAP는 이유식 시작 후 몇 달 안에 다양한 식품군을 경험하도록 안내합니다. 알레르기 고위험군이나 피부 증상이 있으면 소아과 기준을 먼저 잡습니다.",
    sourceLabel: "AAP HealthyChildren",
    url: "https://www.healthychildren.org/English/ages-stages/baby/feeding-nutrition/Pages/Starting-Solid-Foods.aspx",
  },
  {
    id: "solid-avoid",
    label: "주의",
    title: "꿀·생우유·질식 위험 음식은 피하기",
    summary:
      "12개월 전 꿀과 생우유는 피하고, 통포도·견과·팝콘·딱딱하거나 끈적한 음식처럼 질식 위험이 있는 형태는 주지 않습니다.",
    sourceLabel: "CDC / AAP",
    url: "https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/choking-hazards.html",
  },
];

export const firstFoodCandidates: FoodCandidate[] = [
  {
    id: "rice",
    name: "쌀미음",
    timing: "첫 시작 후보",
    reason: "국내 초기 이유식에서 가장 흔한 출발점이고 단일 재료 반응을 보기 쉽습니다.",
    caution: "너무 묽게 시작하고, 2-3일 정도 변·피부·컨디션을 기록합니다.",
  },
  {
    id: "oat",
    name: "오트밀/철분 강화 시리얼",
    timing: "쌀 적응 후 후보",
    reason: "6개월 전후 철분 보충 관점에서 자주 언급되는 곡류 후보입니다.",
    caution: "제품 원재료와 알레르기 표시를 확인하고, 처음엔 단독으로 소량만 줍니다.",
  },
  {
    id: "beef",
    name: "소고기 또는 한우 페이스트",
    timing: "초기 확장 후보",
    reason: "6개월 이후 철분 저장량이 줄어드는 시기에 단백질·철분 공급원으로 많이 씁니다.",
    caution: "곱게 갈아 충분히 부드럽게 만들고, 브랜드 토핑은 나트륨/첨가물 표시를 봅니다.",
  },
  {
    id: "vegetables",
    name: "애호박·양배추·단호박",
    timing: "쌀미음 적응 후",
    reason: "부드럽게 익혀 갈기 쉽고 초기 채소 경험으로 많이 선택합니다.",
    caution: "단맛이 강한 재료만 오래 반복하지 말고, 새 재료는 하나씩 추가합니다.",
  },
  {
    id: "fruit",
    name: "배·사과 퓨레",
    timing: "채소 뒤 후보",
    reason: "식감과 향을 확장하기 좋고, 시판 퓨레도 선택지가 많습니다.",
    caution: "과일 단맛에 빨리 익숙해질 수 있어 식단의 중심으로 두지 않습니다.",
  },
  {
    id: "allergen",
    name: "달걀·두부·생선",
    timing: "소아과 기준 확인 후",
    reason: "AAP는 알레르기 식품을 지나치게 늦출 근거가 부족하다고 안내합니다.",
    caution: "아토피·가족력·기존 반응이 있으면 시작 전 상담하고, 소량 단일 재료로 기록합니다.",
  },
];

export const babyFoodBrandCandidates: BrandCandidate[] = [
  {
    id: "bebecook",
    name: "베베쿡",
    fit: "단계가 세분화된 정기/선택 배송 후보",
    why: "공식 안내에서 초기1 4-5M, 초기1.5/초기2 5-6M처럼 단계가 세분화되어 있고 한 가지 재료 단계부터 시작할 수 있습니다.",
    check: "안심배송 가능 지역, 1팩 중량, 첫 체험 조건, 냉장/냉동 배송 요일을 확인합니다.",
    sourceLabel: "베베쿡 공식 이용안내",
    url: "https://www.bebecook.com/page/service/usage",
  },
  {
    id: "jjangjuk",
    name: "짱죽",
    fit: "체험팩으로 맛/배송 테스트하기 좋은 후보",
    why: "공식 안내 기준 초기 미음은 5개월부터, 160g, 18종 메뉴로 소개되어 있고 2팩 체험팩 페이지가 있습니다.",
    check: "아기 월령과 질감 단계가 맞는지, 160g 1팩을 어떻게 나눠 먹일지 먼저 정합니다.",
    sourceLabel: "짱죽 공식 이유식소개",
    url: "https://jjangjuk.com/page/story02",
  },
  {
    id: "alvins",
    name: "엘빈즈",
    fit: "쿠팡/공식몰 접근성이 좋은 시판 후보",
    why: "공식몰에 초기1 4-5개월 카테고리가 있고, 최근에는 단백질 강화 라인도 쿠팡 배송으로 노출되고 있습니다.",
    check: "초기에는 단백질 강화보다 단일 재료와 월령 단계가 맞는 상품부터 비교합니다.",
    sourceLabel: "엘빈즈 공식 초기1",
    url: "https://www.alvins.co.kr/category/%EC%B4%88%EA%B8%B01-%284~5%EA%B0%9C%EC%9B%94%29/48/",
  },
  {
    id: "farmtobaby",
    name: "팜투베이비",
    fit: "친환경/유기 인증 관점으로 비교할 후보",
    why: "준비기·초기 이유식 전 제품 유기가공식품 인증 보도자료가 있어 원재료 기준을 중시할 때 비교해볼 만합니다.",
    check: "현재 판매 단계, 배송 가능 지역, 원재료 인증 표시가 최신인지 공식몰에서 한 번 더 확인합니다.",
    sourceLabel: "머니투데이 보도",
    url: "https://www.mt.co.kr/future/2021/03/09/2021030912521593342",
  },
];

export const vendorComparisons: VendorComparison[] = [
  {
    id: "bebecook",
    name: "베베쿡",
    homepage: "https://www.bebecook.com/",
    productList: ["초기1 4-5M 140g", "초기1.5/초기2 5-6M", "중기/후기/완료기", "오트 이유식", "한우·생선 토핑", "단품SET"],
    priceExamples: ["초기1 단품SET 1팩 140g 8,700원 예시", "초기1.5 한우미음 7세트 72,800원 예시", "2025년 이유식 전 단계 팩당 100-200원 인상 보도"],
    monthlyEstimate: "1일 1팩 기준 약 13만-26만원대, 2팩 이상은 25만-50만원대까지 열어두고 계산",
    strengths: ["단계와 식단 매니저가 세분화", "안심배송/정기배송 운영", "초기부터 토핑·오트 등 확장 선택지가 많음"],
    watchouts: ["지역별 배송 유형 확인 필요", "행사/패키지 여부에 따라 체감 단가 차이가 큼", "일부 가격은 앱/로그인/식단 선택 후 확인되는 경우가 있음"],
    promoSignal: "첫주문, 단품SET, 쿠폰, 등급 혜택, V특가 문구 감지",
    crawlNote: "공식 페이지가 Vue 템플릿/API 기반이라 HTML만 긁으면 일부 가격이 템플릿으로 남을 수 있음",
    sourceLabel: "베베쿡 공식/뉴시스",
    url: "https://www.bebecook.com/page/exhibition/131?_bannerId=11005",
  },
  {
    id: "sangol",
    name: "산골이유식",
    homepage: "https://www.ecomommeal.co.kr/",
    productList: ["준비기", "초기 150g", "중기 150g", "후기/완료기 200g", "반찬/국", "정기배송"],
    priceExamples: ["SSG 6일분 정기배송 최적가 38,000원~ 예시", "카드혜택가 35,340원 예시", "초기 150g, 후기/완료기 200g 상품 정보"],
    monthlyEstimate: "6일분 38,000원 예시 기준 월 19만원 전후, 카드/쿠폰 적용 시 변동",
    strengths: ["지리산/로컬 식재료 스토리가 강함", "정기배송 단위가 명확", "초기부터 후기까지 중량 정보가 비교적 선명"],
    watchouts: ["공식몰·백화점·SSG·컬리 등 판매 채널별 가격 차이", "배송/소비기한과 냉장 보관 여유 확인 필요", "현재 공식몰 상세 가격은 동적 노출 가능"],
    promoSignal: "정기배송, 카드혜택, 청구할인, 행사 문구 감지",
    crawlNote: "공식몰과 입점몰을 함께 봐야 실제 최저가에 가까워짐",
    sourceLabel: "SSG 산골이유식 상품",
    url: "https://www.ssg.com/item/itemView.ssg?itemId=1000552209224",
  },
  {
    id: "jjangjuk",
    name: "짱죽",
    homepage: "https://www.jjangjuk.com/",
    productList: ["초기 미음 5M부터", "초기 묽은죽 7M부터", "중기/후기/완료기", "2팩 체험팩", "냉장&실온 이유식", "간식/김/음료"],
    priceExamples: ["신규몰 이유식 1,900원~ 문구", "초기 미음 시작세트 14,000원 / 30,000원 예시", "기획전 할인 최대 62% 문구"],
    monthlyEstimate: "행사 단가 1,900-4,400원대 예시 기준 월 6만-26만원대까지 폭이 큼",
    strengths: ["체험팩과 시작세트가 눈에 잘 띔", "냉장/실온 선택지가 있음", "이벤트 문구가 HTML에 잘 잡혀 자동 감지에 유리"],
    watchouts: ["행사 단가와 정상가 차이가 큼", "초기 미음/묽은죽 월령 차이 확인 필요", "옵션별 중량과 배송비를 같이 봐야 함"],
    promoSignal: "신규몰, 1,900원~, 최대 62%, 체험팩, 시작세트 문구 감지",
    crawlNote: "모바일 페이지에서 이벤트/기획전 문구가 비교적 잘 노출됨",
    sourceLabel: "짱죽 공식",
    url: "https://www.jjangjuk.com/?device=mobile",
  },
  {
    id: "alvins",
    name: "엘빈즈",
    homepage: "https://www.alvins.co.kr/",
    productList: ["이유식", "이지밀 이유식(실온)", "반찬/국/볶음밥", "간식/김/음료", "유산균/분유", "유아용품"],
    priceExamples: ["공식몰 카테고리 확인 필요", "외부 최저가 예시로 초기1 140g 2,660원 노출 사례", "쿠팡/SSG/핫딜 채널 변동 폭 큼"],
    monthlyEstimate: "외부몰 단품 2,600-4,800원 예시 기준 월 8만-29만원대",
    strengths: ["공식몰과 외부몰 접근성이 좋음", "실온/냉장 선택지가 있음", "쿠팡·핫딜 가격 비교에 적합"],
    watchouts: ["공식몰 가격이 동적으로 로드될 수 있음", "외부몰 가격은 배송비/쿠폰/판매자 조건 확인 필요", "상품 라인 리뉴얼 공지 확인 필요"],
    promoSignal: "설맞이, 할인, 공식몰 공지, 외부 핫딜 문구 감지",
    crawlNote: "공식몰 단독보다 쿠팡/SSG/핫딜 보조 데이터가 유용할 가능성이 큼",
    sourceLabel: "엘빈즈 공식몰",
    url: "https://www.alvins.co.kr/category/%EC%B4%88%EA%B8%B01-%284~5%EA%B0%9C%EC%9B%94%29/48/",
  },
  {
    id: "lusol",
    name: "루솔",
    homepage: "https://www.lusol.co.kr/",
    productList: ["더프라임 이유식", "냉장 이유식", "실온 이유식/퓨레", "반찬/볶음밥", "영양죽", "스페셜 패키지"],
    priceExamples: ["공식몰 가격 확인 필요", "로켓프레시/외부몰에서 3,000원대 단품 노출 사례", "패키지·회원 혜택 변동 가능"],
    monthlyEstimate: "단품 3,000-5,000원대 가정 시 월 9만-30만원대",
    strengths: ["냉장/실온/퓨레/반찬까지 라인업이 넓음", "영양사 이유식 가이드 콘텐츠가 있음", "외부몰 가격 비교가 쉬운 편"],
    watchouts: ["공식몰·외부몰 가격 차이", "정기배송보다 단품/패키지 조건 확인 필요", "라인업이 넓어 월령 필터가 중요"],
    promoSignal: "스페셜 패키지, 합리적인 가격, 클래스/가이드 문구 감지",
    crawlNote: "공식몰 메인에서 카테고리와 프로모션 문구를 먼저 추적하고 상세 상품은 별도 타깃 필요",
    sourceLabel: "루솔 공식몰",
    url: "https://www.lusol.co.kr/",
  },
];

export const explorationPicks: CuratedCard[] = [
  {
    id: "outing-rule",
    label: "외출 기준",
    title: "150일 전후 외출지는 장소보다 조건이 중요",
    summary:
      "수유실, 기저귀 교환대, 유모차 엘리베이터 동선, 주차, 실내 온도, 조용한 휴식 공간이 있는지 먼저 봅니다.",
    sourceLabel: "서울 영아 나들이 큐레이션",
    url: "https://www.yugacrew.com/crewletter/baby-friendly-places-seoul",
  },
  {
    id: "outing-seoul",
    label: "서울 후보",
    title: "복합몰·백화점·아쿠아리움·박물관은 첫 외출 테스트에 무난",
    summary:
      "날씨 영향을 덜 받고 수유실/엘리베이터를 확인하기 쉬운 곳부터 반나절 코스로 잡는 편이 안전합니다.",
    sourceLabel: "0-6개월 서울 나들이 가이드",
    url: "https://ednpapa.co.kr/seoul-baby-outing-0-6months-guide/",
  },
  {
    id: "play-5m",
    label: "놀이",
    title: "집에서는 터미타임·거울·촉감·딸랑이 루틴부터",
    summary:
      "5개월 전후에는 긴 활동보다 짧고 반복 가능한 놀이가 좋습니다. 컨디션이 좋은 시간대를 기록해두면 루틴화하기 쉽습니다.",
    sourceLabel: "CDC 4개월/6개월 발달 기준",
    url: "https://www.cdc.gov/ncbddd/actearly/milestones/index.html",
  },
  {
    id: "shopping-rule",
    label: "구매 기준",
    title: "이유식 물품은 최소 세트로 시작하고 부족한 것만 추가",
    summary:
      "의자, 실리콘 스푼, 턱받이, 소분 용기, 냄비/찜기, 저울 정도로 시작하고 실제 먹는 양과 조리 빈도를 본 뒤 늘립니다.",
    sourceLabel: "앱 내부 체크리스트",
    url: "https://jooyoung1121.github.io/baby_schedule/",
  },
];

export const starterSupplies: SupplyItem[] = [
  {
    id: "supply-highchair",
    name: "이유식 의자",
    category: "이유식",
    status: "needed",
    quantity: "1개",
    note: "세척 쉬운지, 발받침 있는지 비교",
  },
  {
    id: "supply-spoon",
    name: "실리콘 스푼",
    category: "이유식",
    status: "needed",
    quantity: "2-3개",
  },
  {
    id: "supply-diaper",
    name: "기저귀 재고",
    category: "생활",
    status: "low",
    quantity: "남은 팩 확인",
  },
];

export const starterResearch: ResearchItem[] = [
  {
    id: "research-solids",
    title: "CDC/AAP 기준 이유식 시작 신호",
    category: "개월수",
    status: "saved",
    url: "https://www.cdc.gov/infant-toddler-nutrition/foods-and-drinks/when-what-and-how-to-introduce-solid-foods.html",
    note: "대략 6개월, 4개월 전 시작은 피하기. 고개 가눔, 도움받아 앉기, 입 벌림, 삼킴 여부 체크",
    createdAt: today.toISOString(),
  },
  {
    id: "research-brands",
    title: "시판 이유식 후보 비교",
    category: "쇼핑",
    status: "saved",
    url: "https://www.bebecook.com/page/service/usage",
    note: "베베쿡, 짱죽, 엘빈즈, 팜투베이비 후보. 체험팩/월령/배송/원재료 기준으로 비교",
    createdAt: today.toISOString(),
  },
  {
    id: "research-trip",
    title: "수유실 좋은 실내 외출지",
    category: "여행",
    status: "saved",
    url: "https://www.yugacrew.com/crewletter/baby-friendly-places-seoul",
    note: "수유실, 주차, 엘리베이터, 유모차 동선 기준으로 반나절 코스부터 저장",
    createdAt: today.toISOString(),
  },
  {
    id: "research-play",
    title: "5개월 아기 놀이 루틴",
    category: "놀이",
    status: "saved",
    url: "https://www.cdc.gov/ncbddd/actearly/milestones/index.html",
    note: "터미타임, 거울 놀이, 촉감 장난감, 짧은 반복 놀이 후보",
    createdAt: today.toISOString(),
  },
];

export const defaultState: BabyState = {
  profile: {
    name: "아기",
    birthDate: "2026-01-03",
    memo: "생후 약 150일 기준으로 시작",
  },
  schedule: [],
  foods: [],
  supplies: starterSupplies,
  research: starterResearch,
  readiness: {},
};
