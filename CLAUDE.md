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

## 현재 버전: v1.6.0

## 버전 히스토리
- v1.6.0: PC 신청곡 목록 사이드바 참여자 아래 이동 + AdSense 코드 삽입
- v1.5.0: 방→플레이룸 명칭 변경 + 7가지 개선
- v1.4.0: 9가지 UI/UX 개선 및 버그 수정

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
