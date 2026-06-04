import type { BabyState, ResearchItem, SupplyItem } from "./types";

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
    title: "150-180일 이유식 시작 기준",
    category: "개월수",
    status: "to-search",
    note: "고개 가눔, 앉기, 입 벌림, 삼킴 여부 체크",
    createdAt: today.toISOString(),
  },
  {
    id: "research-trip",
    title: "수유실 좋은 실내 외출지",
    category: "여행",
    status: "to-search",
    note: "주차, 엘리베이터, 유모차 동선 기준으로 저장",
    createdAt: today.toISOString(),
  },
  {
    id: "research-play",
    title: "5개월 아기 놀이",
    category: "놀이",
    status: "saved",
    note: "터미타임, 거울 놀이, 촉감 장난감 후보",
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
