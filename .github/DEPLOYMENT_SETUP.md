# Frontend Deployment Setup Guide

## Overview

This guide explains how to set up GitHub Actions for automated frontend deployment to AWS S3 and CloudFront.

## Architecture

```
GitHub Push → GitHub Actions → Build → S3 Upload → CloudFront Invalidation
```

## Prerequisites

1. AWS Account with appropriate permissions
2. GitHub repository with Actions enabled
3. Terraform infrastructure already deployed (S3 buckets, CloudFront distributions)

## Required GitHub Secrets

Navigate to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

### AWS Credentials

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `AWS_ACCESS_KEY_ID` | AWS Access Key for deployment | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Access Key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |

**How to get AWS credentials:**
```bash
# Use the terraform-deploy IAM user credentials
# Already created with AdministratorAccess
aws iam create-access-key --user-name terraform-deploy
```

### Environment Configuration Files

API URL은 각 앱의 `.env.{env}` 파일에 설정되어 있습니다:

#### Patient App
- `apps/patient-app/.env.dev` - `VITE_API_BASE_URL=https://api.patients.dev.drcall.global`
- `apps/patient-app/.env.stg` - `VITE_API_BASE_URL=https://api.patients.stg.drcall.global`
- `apps/patient-app/.env.prod` - `VITE_API_BASE_URL=https://api.patients.drcall.global`

#### Hospital App
- `apps/hospital-app/.env.dev` - `VITE_API_BASE_URL=https://api.hospitals.dev.drcall.global`
- `apps/hospital-app/.env.stg` - `VITE_API_BASE_URL=https://api.hospitals.stg.drcall.global`
- `apps/hospital-app/.env.prod` - `VITE_API_BASE_URL=https://api.hospitals.drcall.global`

#### Admin App
- `apps/admin-app/.env.dev` - `VITE_API_BASE_URL=https://api.admin.dev.drcall.global`
- `apps/admin-app/.env.stg` - `VITE_API_BASE_URL=https://api.admin.stg.drcall.global`
- `apps/admin-app/.env.prod` - `VITE_API_BASE_URL=https://api.admin.drcall.global`

### GitHub Secrets (CloudFront만 필요)

CloudFront Distribution ID만 GitHub Secrets에 설정하면 됩니다:

| Secret Name | Environment | Description | Example Value |
|------------|-------------|-------------|---------------|
| `PATIENT_APP_DEV_CLOUDFRONT_ID` | DEV | CloudFront Distribution ID | `E3H7FZ2DSAAT1` |
| `PATIENT_APP_STG_CLOUDFRONT_ID` | STG | CloudFront Distribution ID | `E2XXXXXXXXXXX` |
| `PATIENT_APP_PROD_CLOUDFRONT_ID` | PROD | CloudFront Distribution ID | `E1XXXXXXXXXXX` |
| `HOSPITAL_APP_DEV_CLOUDFRONT_ID` | DEV | CloudFront Distribution ID | `E738FDGXZ1WIZ` |
| `HOSPITAL_APP_STG_CLOUDFRONT_ID` | STG | CloudFront Distribution ID | `E2XXXXXXXXXXX` |
| `HOSPITAL_APP_PROD_CLOUDFRONT_ID` | PROD | CloudFront Distribution ID | `E1XXXXXXXXXXX` |

## Getting CloudFront Distribution IDs

### From AWS Console
1. Go to CloudFront Console: https://console.aws.amazon.com/cloudfront/v3/home
2. Find your distribution (e.g., `dev-patient-app-distribution`)
3. Copy the Distribution ID (e.g., `E3H7FZ2DSAAT1`)

### From Terraform Output
```bash
cd infra/terraform/environments/dev
terraform output

# Output shows:
# patient_app_url = "https://ddxaj8urzop64.cloudfront.net"
# The ID is in the domain: ddxaj8urzop64 → E3H7FZ2DSAAT1
```

### Using AWS CLI
```bash
# List all CloudFront distributions
aws cloudfront list-distributions \
  --query "DistributionList.Items[].{ID:Id,Origin:Origins.Items[0].DomainName,Comment:Comment}" \
  --output table

# Get specific distribution by S3 bucket origin
aws cloudfront list-distributions \
  --query "DistributionList.Items[?Origins.Items[0].DomainName=='dev-patient-app-frontend.s3.ap-northeast-2.amazonaws.com'].Id" \
  --output text
```

## Environment Files

각 앱의 `.env.{env}` 파일에 API URL이 설정되어 있습니다:

```bash
# Patient App
apps/patient-app/.env.dev    # VITE_API_BASE_URL=https://api.patients.dev.drcall.global
apps/patient-app/.env.stg    # VITE_API_BASE_URL=https://api.patients.stg.drcall.global
apps/patient-app/.env.prod   # VITE_API_BASE_URL=https://api.patients.drcall.global

# Hospital App
apps/hospital-app/.env.dev    # VITE_API_BASE_URL=https://api.hospitals.dev.drcall.global
apps/hospital-app/.env.stg   # VITE_API_BASE_URL=https://api.hospitals.stg.drcall.global
apps/hospital-app/.env.prod  # VITE_API_BASE_URL=https://api.hospitals.drcall.global

# Admin App
apps/admin-app/.env.dev       # VITE_API_BASE_URL=https://api.admin.dev.drcall.global
apps/admin-app/.env.stg       # VITE_API_BASE_URL=https://api.admin.stg.drcall.global
apps/admin-app/.env.prod      # VITE_API_BASE_URL=https://api.admin.drcall.global
```

**참고**: `.env` 파일들은 `.gitignore`에 포함되어 있지 않으므로 Git에 커밋됩니다.

## Deployment Workflow

### Automatic Deployment

Deployments are triggered automatically based on branch and file changes:

| Branch | Environment | Trigger |
|--------|-------------|---------|
| `develop` | DEV | Push to `frontend/apps/*` or `frontend/packages/*` |
| `staging` | STG | Push to `frontend/apps/*` or `frontend/packages/*` |
| `main` | PROD | Push to `frontend/apps/*` or `frontend/packages/*` |

### Manual Deployment

You can also trigger deployments manually:

1. Go to Actions tab in GitHub
2. Select the workflow (e.g., "Deploy Patient App")
3. Click "Run workflow"
4. Select the environment (dev/stg/prod)
5. Click "Run workflow"

## Deployment Process

Each deployment follows these steps:

1. **Checkout**: Clone the repository
2. **Setup**: Install Node.js and pnpm
3. **Install**: Install dependencies with `pnpm install --frozen-lockfile`
4. **Build**: Build the app with environment variables
5. **Deploy**: Upload to S3 with cache headers
   - Static assets: `max-age=31536000` (1 year)
   - `index.html`: `max-age=0, must-revalidate` (no cache)
6. **Invalidate**: Invalidate CloudFront cache (`/*`)

## Cache Strategy

### Static Assets (JS, CSS, Images)
- Cache-Control: `public, max-age=31536000, immutable`
- Filename includes hash (e.g., `main.abc123.js`)
- Can be cached forever

### index.html
- Cache-Control: `public, max-age=0, must-revalidate`
- Always fetched fresh to get latest asset references

## Monitoring Deployments

### GitHub Actions
- View workflow runs: `https://github.com/YOUR_ORG/drcall-global/actions`
- Each run shows:
  - Build logs
  - Deployment summary
  - S3 sync output
  - CloudFront invalidation status

### AWS CloudFront Invalidations
```bash
# List recent invalidations
aws cloudfront list-invalidations \
  --distribution-id E3H7FZ2DSAAT1

# Get invalidation status
aws cloudfront get-invalidation \
  --distribution-id E3H7FZ2DSAAT1 \
  --id INVALIDATION_ID
```

## Troubleshooting

### Build Failures

**Error**: `pnpm: command not found`
- Solution: Ensure `pnpm/action-setup@v4` is in workflow

**Error**: `Module not found: @drcall/shared-lib`
- Solution: Check `pnpm install --frozen-lockfile` ran successfully
- Verify workspace configuration in `pnpm-workspace.yaml`

### Deployment Failures

**Error**: `Access Denied` when uploading to S3
- Solution: Check AWS credentials have S3 write permissions
- Verify bucket name is correct

**Error**: `Distribution not found` for CloudFront
- Solution: Verify CLOUDFRONT_ID secret is set correctly
- Check distribution exists in AWS Console

### Cache Issues

**Problem**: Changes not visible after deployment
- Solution: Wait 5-10 minutes for CloudFront invalidation
- Or, create manual invalidation for `/*`

**Problem**: Old assets still loading
- Solution: Check `index.html` has `max-age=0`
- Verify asset filenames include hash

## Security Notes

1. **AWS Credentials**: Use IAM user with minimal required permissions
2. **Secrets**: Never commit secrets to repository
3. **Branch Protection**: Enable branch protection for `main` and `staging`
4. **Review**: Require PR reviews before merging to protected branches

## Next Steps

1. Set up GitHub Secrets (see above)
2. Push to `develop` branch to test DEV deployment
3. Verify deployment at `https://patient.dev.drcall.global`
4. Set up STG and PROD environments when ready

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront Invalidation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html)
- [pnpm Workspaces](https://pnpm.io/workspaces)
