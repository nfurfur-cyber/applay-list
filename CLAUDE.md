# Applay list — 프로젝트 지침

## 프로젝트 개요
- **서비스명**: Applay list (apply + playlist)
- **목적**: 무료 신청곡 플랫폼 → 수익형 사이트로 발전
- **URL**: https://applaylist.com (도메인 연결 진행 중)
- **배포**: Vercel (자동 배포) ← GitHub main 브랜치에 push하면 자동 반영
- **GitHub**: https://github.com/nfurfur-cyber/applay-list

## 기술 스택
- **Frontend**: 순수 HTML/CSS/JS (단일 파일 index.html)
- **DB**: Firebase Realtime Database
- **광고**: Google AdSense (ca-pub-2061027569183097) — 심사 대기 중
- **Analytics**: Google Analytics (G-MCTVK42K72)

## 현재 버전: v1.30.9

## 버전 히스토리
- v1.30.9: 쿠키 동의 배너 추가 (AdSense 심사 보강, GDPR-aware)
- v1.30.0: 인기곡 TOP 10 가로 스크롤 차트 + YouTube 오류 153 자동 스킵
- v1.29.2: 관리자 PIN 보호(9624) + 모바일 로고 5-tap 트리거 추가
- v1.29.1: 관리자 플랜 스위처(Ctrl+Shift+A) + 잠금 행 텍스트 opacity 수정
- v1.29.0: 플랜 시스템 반영 — Free/Plus 잠금 UI, 공지 배너, 화면표시 설정
- v1.28.1: 게스트 입장 시 음소거 실제 적용 버그 수정
- v1.28.0: 호스트 자동 재입장 + 게스트 음소거 시작
- v1.27.7: 호스트 방 생성 시 참여자 0명 버그 수정
- v1.27.6: 타임라인 seek 처음 재시작 버그 완전 수정
- v1.27.5: 타임라인 seek 시 처음부터 재시작 버그 수정
- v1.27.4: AdSense 심사 최적화 (sitemap, 소유권 메타 태그)
- v1.27.3: 검색 초기화 goHome/confirmDeleteRoom 추가
- v1.27.2: 플레이룸 입장 시 이전 검색 내용 초기화
- v1.27.1: 내 플레이룸 미표시 + 만들기 차단 버그 수정
- v1.27.0: 반복재생 시 영상 재시작 안 되는 버그 수정
- v1.26.0: 홈페이지에 8분 이하 음악 안내 삽입
- v1.25.0: 서버 사이드 duration 체크 + 8분 차단 완성

## 레이아웃 구조 (PC)
- **좌측 (pcol)**: 플레이어 헤더, 재생 중 바, 영상, 검색창, URL 입력
- **우측 사이드바**: QR/공유, 참여자, **신청곡 목록** (PC에서만 사이드바로 이동), 후원, 광고
- 모바일(≤820px): 1컬럼, 신청곡 목록은 URL 입력 아래에 위치

## 도메인 상태
- **가비아** DNS 설정 완료 (A: 216.198.79.1, CNAME: www → cname.vercel-dns.com)
- 네임서버: ns1.vercel-dns.com (Vercel 관리)
- DNS 전파 진행 중 → 완료 후 SSL 자동 발급

## 코딩 규칙
- 버전 업데이트 시 footer의 버전 번호 반드시 변경
- 수정 후 반드시 `git add index.html && git commit && git push` 로 Vercel 배포
- 모바일/PC 분기점: 820px
- 변경사항은 항상 커밋 메시지에 버전 명시

## 수익화 계획 (Claude.ai 프로젝트에서 논의 중)
- Google AdSense 광고 (심사 진행 중)
- 추후 프리미엄 기능 추가 예정

## 주의사항
- Firebase 설정 건드리지 말 것
- .gitignore에 .claude/ 포함되어 있음

---

## 🔒 API 키 구분 (혼동 금지)
- `index.html` line 505 `firebaseConfig.apiKey` → Firebase 전용, **절대 수정 금지**
- `index.html` line 921 `YT_API_KEY` → YouTube Data API 전용, 이것만 교체
- 두 값이 현재 동일하나 역할이 다름 — Firebase 키에 referrer 제한 걸면 앱 전체 마비

---

## 🐛 재발 방지 — 과거 확인된 버그

### 1. 호스트-게스트 영상 동기화
- **증상**: 타임라인 seek 시 처음부터 재생 (v1.27.5~v1.27.6에서 반복 발생)
- **원인 A**: `state=1` 핸들러에서 `_hostCurrentTime`이 stale 상태일 때 `playStartedAt` 잘못 계산
- **원인 B**: Firebase listener가 호스트에게도 seek 명령을 내려 중복 실행
- **핵심 수정 위치**: `state=1` 핸들러 내 `_hostSeekPending` 분기, Firebase listener에서 호스트 제외 조건
- **수정 시 반드시 확인**: seek 후 500ms 딜레이로 Firebase 업데이트, `if(!isHost)` 조건으로 호스트 seek 제외

- **증상**: 게스트 입장 시 음소거 표시는 되나 소리 나옴 (v1.28.0~v1.28.1에서 반복 발생)
- **원인**: `enterRoom()` 시점에 `ytCmd('mute')` 호출 → 이때 iframe이 아직 없음
- **핵심 수정 위치**: `state=1` 핸들러에 `if(!isHost&&_muted){ytCmd('mute');ytCmd('setVolume',0);}` 추가
- **수정 시 반드시 확인**: iframe은 `playCur()` → `buildIframe()` 호출 이후에만 존재

### 2. 노래 신청 — 8분 제한 및 비음악 필터
- **3중 구조로 되어 있음**: ① `checkVideoInfo()` 제출 시 길이 확인 ② 검색 키워드에 'MV' 강제 추가 ③ `getDuration()` 폴링으로 런타임 재확인
- **수정 시 절대 이 구조를 단순화하지 말 것** — 하나라도 빠지면 8분 초과 영상이 재생됨
- **비음악 필터**: `checkVideoInfo()`에서 카테고리 ID 확인 — 음악(10) 외 카테고리 차단
- **URL 직접 삽입 경로도 동일한 검증 통과** — URL 입력 시 `checkVideoInfo()` 반드시 호출해야 함

### 3. 참여자 숫자 오류
- **증상 A**: 호스트가 방 만들 때 0명으로 표시 (v1.27.7에서 수정)
- **원인**: `db.ref('rooms/'+rid).set(data)` 는 async → Firebase 응답 전에 `enterRoom()` → `renderMembers()` 실행됨
- **수정**: `confirmCreate()` 내에서 `members = data.members` 로 로컬 즉시 반영 후 `enterRoom()` 호출
- **증상 B**: 인원 입장/퇴장 시 카운트 부정확
- **원인**: `onDisconnect().remove()`가 즉시 실행이 아닌 연결 끊김 시 실행 → 네트워크 지연 시 카운트 불일치
- **수정 시 반드시 확인**: `renderMembers()`가 Firebase 스냅샷 기준으로 렌더링하는지, 로컬 `members` 객체와 동기화 타이밍 확인

---

## 📋 작업 원칙
- 사용자가 **같은 요청을 두 번 하면 구현이 불완전한 것** — 수정 후 반드시 실제 동작 확인 후 완료 보고
- 버그 수정 시 **증상만 고치지 말고 원인 파악 후 수정**
- 기능 추가 시 **기존 3중 검증 구조(8분 제한 등) 우회하는 코드 절대 추가 금지**
- 수정한 함수와 **연관된 함수들도 함께 점검** (예: enterRoom 수정 시 attachListener, syncHostPanel 동작 확인)
