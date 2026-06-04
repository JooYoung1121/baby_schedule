# Baby Schedule

우리 가족이 쓰기 위한 아기 스케줄 관리 웹앱입니다. 첫 버전은 GitHub Pages에 바로 올릴 수 있는 정적 React 앱이며, 데이터는 브라우저 `localStorage`에 저장됩니다.

## 주요 기능

- 오늘 스케줄 기록: 수유, 수면, 기저귀, 이유식, 약, 놀이, 메모
- 이유식 관리: 음식별 시도 기록, 알레르기/반응 메모, 준비 체크
- 물품 관리: 필요한 물품, 주문/보유/부족 상태, 구매 비용 기록
- 탐색 보드: 개월수별 체크, 여행/놀이/쇼핑 주제 저장
- 데이터 백업: JSON 내보내기/가져오기

## 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

기본 프로덕션 경로는 `JooYoung1121/baby_schedule`의 GitHub Pages 배포를 위해 `/baby_schedule/`로 설정되어 있습니다. 다른 서비스에 배포할 때는 빌드 시 `VITE_BASE_PATH=/`를 지정하면 됩니다.

```bash
VITE_BASE_PATH=/ npm run build
```

## 다음 단계 후보

- Supabase/Firebase 기반 가족 동기화
- 로그인 연동
- 성장 그래프와 예방접종 일정
- 사진/병원 기록
- 검색 API 또는 수동 큐레이션 기반 외출 장소 아카이브
