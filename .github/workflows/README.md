# CI/CD Workflows

DrCall Global Frontend의 CI/CD 파이프라인입니다.

## 📋 파이프라인 구조

```
PR 생성
  ↓
build.yml 실행 (lint + build 체크)
  ↓
✅ 통과 → PR 머지 가능
  ↓
develop/main 머지
  ↓
자동 배포 (deploy-{app}.yml)
```

## 🔧 Workflows

### 1️⃣ build.yml
**트리거:** PR → `main`, `develop`

**작업:**
- pnpm install
- lint 체크
- build 체크

**Status:** `build / build`

### 2️⃣ deploy-patient-app.yml
**트리거:**
- Push → `main` (PROD), `develop` (DEV)
- 수동 실행

**작업:**
- 버전 자동 증가 (main: minor, develop: patch)
- 태그 생성
- 빌드 + S3 배포 + CloudFront 무효화
- PROD 배포 시 GitHub Release 생성

### 3️⃣ deploy-hospital-app.yml
**트리거:**
- Push → `main` (PROD), `develop` (DEV)
- 수동 실행

**작업:**
- 빌드 + S3 배포 + CloudFront 무효화

## 🔐 Required Secrets

### AWS
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

### Patient App
- `PATIENT_APP_DEV_API_URL`
- `PATIENT_APP_PROD_API_URL`
- `PATIENT_APP_DEV_CLOUDFRONT_ID`
- `PATIENT_APP_PROD_CLOUDFRONT_ID`

### Hospital App
- `HOSPITAL_APP_DEV_API_URL`
- `HOSPITAL_APP_PROD_API_URL`
- `HOSPITAL_APP_DEV_CLOUDFRONT_ID`
- `HOSPITAL_APP_PROD_CLOUDFRONT_ID`

## ⚙️ Branch Protection

### develop
- ✅ Require status checks: `build / build`
- ✅ Require pull request reviews

### main
- ✅ Require status checks: `build / build`
- ✅ Require pull request reviews

## 🚀 배포 흐름

### DEV 배포
```bash
feature/xxx → PR → develop 머지 → 자동 DEV 배포
```

### PROD 배포
```bash
develop → PR → main 머지 → 자동 PROD 배포 + Release 생성
```

## 🐛 Troubleshooting

### "build — Waiting for status to be reported"
**원인:** Branch protection 설정 불일치

**해결:** GitHub Settings → Branches → develop/main → Required status check를 `build / build`로 설정

### 배포 실패
1. AWS credentials 확인
2. S3 bucket 존재 확인
3. CloudFront ID 확인
4. Secrets 설정 확인
