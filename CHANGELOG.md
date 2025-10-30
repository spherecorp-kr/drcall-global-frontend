# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v1.0.0] - 2025-10-30

### Added
- Initial release with Patient App and Hospital App
- React + TypeScript + Vite setup
- TailwindCSS styling
- Monorepo structure with pnpm workspaces
- GitHub Actions CI/CD for automated deployment
- CloudFront + S3 hosting for DEV environment
- Mocking data and skeleton UI

### Infrastructure
- S3 buckets for frontend hosting
- CloudFront distributions with WAF
- GitHub Actions workflows for automatic deployment
- Environment-specific configurations (DEV/STG/PROD)

### Security
- HTTPS-only with CloudFront
- Cache optimization strategies
- Environment variable management

---

[Unreleased]: https://github.com/spherecorp-kr/drcall-global-frontend/compare/v1.0.0...HEAD
[v1.0.0]: https://github.com/spherecorp-kr/drcall-global-frontend/releases/tag/v1.0.0
