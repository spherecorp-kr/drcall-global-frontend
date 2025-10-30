# DrCall Global - CI/CD Configuration

This directory contains GitHub Actions workflows and deployment scripts for automated CI/CD.

## Quick Start

### 1. Setup GitHub Secrets

Run the automated setup script:

```bash
cd /path/to/drcall-global
./.github/scripts/setup-github-secrets.sh
```

Or manually configure secrets at:
`https://github.com/YOUR_ORG/drcall-global/settings/secrets/actions`

See [DEPLOYMENT_SETUP.md](./DEPLOYMENT_SETUP.md) for detailed instructions.

### 2. Deploy Frontend Apps

#### Automatic Deployment

Push to branches to trigger automatic deployment:

- `develop` branch → DEV environment
- `staging` branch → STG environment
- `main` branch → PROD environment

#### Manual Deployment

1. Go to [Actions tab](../../actions)
2. Select workflow (e.g., "Deploy Patient App")
3. Click "Run workflow"
4. Choose environment
5. Click "Run workflow"

## Workflows

| Workflow | File | Trigger | Description |
|----------|------|---------|-------------|
| Deploy Patient App | [deploy-patient-app.yml](./workflows/deploy-patient-app.yml) | Push to `frontend/apps/patient-app/**` | Build and deploy Patient App to S3/CloudFront |
| Deploy Hospital App | [deploy-hospital-app.yml](./workflows/deploy-hospital-app.yml) | Push to `frontend/apps/hospital-app/**` | Build and deploy Hospital App to S3/CloudFront |

## Architecture

```
┌─────────────┐
│   GitHub    │
│  Repository │
└──────┬──────┘
       │
       │ Push/PR
       ▼
┌─────────────────────────────────────────┐
│         GitHub Actions                   │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │  Checkout│→ │   Build  │→ │ Deploy ││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────┬───────────────────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │      AWS S3          │
       │  (Static Hosting)    │
       └──────────┬───────────┘
                  │
                  ▼
       ┌──────────────────────┐
       │   AWS CloudFront     │
       │  (Global CDN + WAF)  │
       └──────────────────────┘
```

## Environment Configuration

### DEV Environment

- **Patient App**: https://patient.dev.drcall.global
  - S3: `dev-patient-app-frontend`
  - CloudFront: `E3H7FZ2DSAAT1`

- **Hospital App**: https://hospital.dev.drcall.global
  - S3: `dev-hospital-app-frontend`
  - CloudFront: `E738FDGXZ1WIZ`

### STG Environment (To be configured)

- **Patient App**: https://patient.stg.drcall.global
- **Hospital App**: https://hospital.stg.drcall.global

### PROD Environment (To be configured)

- **Patient App**: https://patient.drcall.global
- **Hospital App**: https://hospital.drcall.global

## Required Secrets

| Secret Name | Description | Example |
|------------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | AWS Access Key | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS Secret Key | `wJalrXUt...` |
| `PATIENT_APP_{ENV}_API_URL` | Backend API URL | `https://api.dev.drcall.global` |
| `PATIENT_APP_{ENV}_CLOUDFRONT_ID` | CloudFront Distribution ID | `E3H7FZ2DSAAT1` |
| `HOSPITAL_APP_{ENV}_API_URL` | Backend API URL | `https://api.dev.drcall.global` |
| `HOSPITAL_APP_{ENV}_CLOUDFRONT_ID` | CloudFront Distribution ID | `E738FDGXZ1WIZ` |

Replace `{ENV}` with: `DEV`, `STG`, or `PROD`

## Deployment Process

Each deployment follows these steps:

1. **Checkout**: Clone repository code
2. **Setup**: Install Node.js 20 and pnpm 9.0.0
3. **Install**: Run `pnpm install --frozen-lockfile`
4. **Build**: Build app with environment variables
5. **Deploy**: Sync to S3 with optimized cache headers
6. **Invalidate**: Clear CloudFront cache

### Cache Strategy

- **Static Assets** (JS, CSS, images): 1 year cache
- **index.html**: No cache (always fresh)

## Monitoring

### GitHub Actions Dashboard

View workflow runs and deployment status:
```
https://github.com/YOUR_ORG/drcall-global/actions
```

### AWS CloudFront Invalidations

Check invalidation status:
```bash
aws cloudfront list-invalidations --distribution-id E3H7FZ2DSAAT1
```

## Troubleshooting

### Build Fails

1. Check workflow logs in Actions tab
2. Verify dependencies in `pnpm-lock.yaml`
3. Test build locally: `pnpm build:patient`

### Deployment Fails

1. Verify AWS credentials are set correctly
2. Check S3 bucket exists and is accessible
3. Verify CloudFront Distribution ID is correct

### Changes Not Visible

1. Wait 5-10 minutes for CloudFront invalidation
2. Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
3. Check CloudFront invalidation status

## Security

- AWS credentials use IAM user with minimal permissions
- Secrets are encrypted by GitHub
- Branch protection rules prevent direct pushes to `main`
- All PRs require review before merge

## Additional Resources

- [Deployment Setup Guide](./DEPLOYMENT_SETUP.md)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS S3 Static Website](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
