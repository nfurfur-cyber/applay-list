# 백업 로그

날짜, 시간, 버전, 변경사항을 기록합니다.

## 백업 내역

| 날짜 | 시간 | 버전 | 파일 | 변경사항 |
|------|------|------|------|---------|
| 2026-03-26 | 03:59:03 | v1.6.0 | index.html | [INFO] 배지 배경색 추가 (초록색 배경, 테두리 스타일링) |
| 2026-03-26 | 11:49:26 | v1.7.0 | index.html | 모바일QR수정, INFO배지 괄호삭제/오른쪽이동/회색, 후원배너삭제, 말풍선그리드, 호스트참여자고정, 삭제버튼색상 |
| 2026-03-26 | 13:44:14 | v1.19.1 | index.html | 설정 숫자 입력칸/무제한 버튼 높이 통일 (28px, flex 정렬) |
| 2026-03-26 | 16:06:58 | v1.26.0 | index.html | 홈페이지 8분이하 음악 안내 삽입, 볼륨·모바일삭제·8분차단·서버폴백 등 v1.22~v1.26 종합 |
| 2026-03-26 | 20:28:26 | **v1.27.4** | **index.html** | **🎯 AdSense 심사 제출 체크포인트** — 검색초기화(v1.27.3) + sitemap정리 + 소유권메타태그 |

---

### 2026-03-26 v1.6.0
**시간**: 03:59:03
**파일**: `2026-03-26_03-59-03_v1.6.0_index.html`
**변경사항**:
- UI 개선: `[INFO]` 배지에 배경색 추가
- 색상: 초록색 배경 (rgba(16,185,129,.12))
- 테두리: rgba(16,185,129,.3)
- 패딩, 보더라디우스, 폰트 가중치 추가
- 게스트용 플레이룸 설정 섹션에 시각적 강조 추가

**git commit**: `77e32f3`

---

### 2026-03-26 v1.7.0
**시간**: 11:49:26
**파일**: `2026-03-26_11-49-26_v1.7.0_index.html`
**변경사항**:
- fix: 모바일 QR 코드 표시 안 되는 버그 수정 (CSS `display:none!important` 제거)
- ui: INFO 배지 괄호`[]` 제거 → `INFO`, 위치 오른쪽으로 이동, 회색 배경
- ui: INFO 토글 화살표 배경 제거 (`▼/▶` 심플하게)
- ui: 후원 배너(`home-bottom`) 완전 삭제
- ui: 말풍선 `flex-wrap` → `grid` 정렬 (모바일 균등 2열)
- ui: 참여자 배너 호스트 항상 맨 왼쪽 고정
- ui: 메인 삭제 버튼 원복, 룸 내 삭제 버튼 반투명 빨강

**git commit**: `a9874ad`

---

### 2026-03-26 v1.19.1
**시간**: 13:44:14
**파일**: `2026-03-26_13-44-14_v1.19.1_index.html`
**변경사항**:
- ui: 설정 모달에서 입력칸(숫자)과 무제한 버튼 높이 통일 (28px)
- ui: `.limit-sel` 컨테이너 높이 28px로 고정, flex 정렬 개선
- ui: `.limit-btn`에 `display:flex; align-items:center` 추가
- fix: 게스트 곡 제한, 신청곡 최대 수, 최대 입장 인원 설정 모두 동일 높이로 정렬

**git commit**: `d7845bb`

---

### 2026-03-26 v1.26.0
**시간**: 16:06:58
**파일**: `2026-03-26_16-06-58_v1.26.0_index.html`
**변경사항**:
- content: 홈페이지 메인에 '8분 이하 음악 컨텐츠만 신청 가능' 안내 삽입 (3곳)
- feat: /api/duration.js 서버 엔드포인트 (YouTube API 쿼터 무관 duration 체크)
- feat: checkVideoInfo 서버 폴백 (_checkVideoInfoServer)
- feat: iframe getDuration 폴링 런타임 8분 차단
- fix: 제목 오버플로우, 볼륨 음소거+슬라이더, 모바일 삭제버튼
- fix: 승인대기 배너 OFF시 숨김, 방설정 순서 변경
- fix: 검색 키워드 MV 복원, 필터링 제거 (v1.7.0 방식)
- ui: 토스트 메시지 전체 통일 ('8분 이하 음악 컨텐츠만 신청/재생 가능')

**git commit**: (push 후 확인)

---

## 복구 예시

만약 새로운 변경사항에서 문제가 생기면:

```bash
# 이전 버전으로 복구
cp .backups/2026-03-26_03-59-03_v1.6.0_index.html index.html

# 변경사항 확인
git diff index.html

# 커밋
git add index.html
git commit -m "restore: 2026-03-26 v1.6.0 백업으로 복구"

# 배포
git push
```

---

### 2026-03-26 v1.27.4 ⭐ AdSense 심사 제출 체크포인트

**시간**: 20:28:26
**파일**: `2026-03-26_20-28-26_v1.27.4_index.html`
**git commit**: `40ac296`

**변경사항**:

**1. 검색 초기화 강화 (v1.27.3 → v1.27.4)**
   - 방 나가기(`goHome()`), 방 삭제(`confirmDeleteRoom()`)에도 검색창 초기화 추가
   - `searchTimer` 대기 중인 검색도 함께 취소
   - 새 방 생성 시 이전 검색 결과가 남는 버그 완전 해결

**2. AdSense 심사 최적화 (v1.27.4)**
   - `sitemap.xml`: noindex 페이지(privacy/terms) 제거 → 메인 페이지만 포함
   - `index.html`: `<meta name="google-adsense-account" content="ca-pub-2061027569183097">` 추가
   - `ads.txt`: 정상 확인 (google.com, pub-2061027569183097, DIRECT)
   - `robots.txt`: 정상 확인

**심사 제출 전 콘솔 설정 3가지 (코드 외)**:
   1. Google Cloud Console → YouTube API 키 HTTP 리퍼러 제한 (`applaylist.com/*`)
   2. Firebase Console → Realtime Database Rules 확인
   3. Vercel Dashboard → www → non-www 301 리다이렉트

**상태**: ✅ 코드 레벨 모든 항목 완료, AdSense 제출 준비 완료
**다음 단계**: 콘솔 설정 3가지 + AdSense 심사 대기

---

**마지막 업데이트**: 2026-03-26
**최신 버전**: v1.27.4 (AdSense 심사 체크포인트)
