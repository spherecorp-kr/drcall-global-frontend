# DrCall 프론트엔드 DEV 환경 배포 완료

안녕하세요,

DrCall 프론트엔드 앱들이 DEV 환경에 자동 배포되었습니다.

## 접속 URL

### 환자 앱 (Patient App)
https://patient.dev.drcall.global

### 병원 앱 (Hospital App)
https://hospital.dev.drcall.global

## 주의사항

⚠️ **회사 네트워크에서만 접속 가능합니다**
- VPN 또는 사무실 네트워크에서만 접근할 수 있습니다
- 외부 네트워크에서는 접속이 불가능합니다

⚠️ **현재 백엔드 미연결 상태**
- 스켈레톤 UI + 모킹(Mocking) 데이터로만 동작합니다
- 실제 API 호출 및 데이터베이스 연동은 아직 되지 않았습니다
- 화면 구성 및 사용자 흐름 확인 용도입니다

## 자동 배포

`develop` 브랜치에 푸시하면 자동으로 DEV 환경에 배포됩니다:
- Patient App: `apps/patient-app/` 수정 시
- Hospital App: `apps/hospital-app/` 수정 시
- 공유 라이브러리: `packages/` 수정 시 → 모든 앱 재배포

배포 상태 확인: https://github.com/spherecorp-kr/drcall-global-frontend/actions

## 기술 스택

- React + TypeScript
- Vite
- TailwindCSS
- AWS S3 + CloudFront
- GitHub Actions (CI/CD)

문의사항이나 버그 발견 시 말씀해주세요!
