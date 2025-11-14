#!/bin/bash

# ====================================================================
# GitHub Secrets Setup Script for Frontend Deployment
# ====================================================================
# This script helps you set up GitHub Secrets for automated deployment
# ====================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# GitHub CLI check
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed${NC}"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if logged in
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}Please log in to GitHub CLI first:${NC}"
    echo "gh auth login"
    exit 1
fi

echo -e "${GREEN}=====================================================================${NC}"
echo -e "${GREEN}GitHub Secrets Setup for DrCall Global Frontend${NC}"
echo -e "${GREEN}=====================================================================${NC}"
echo ""

# Get repository info
REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
echo -e "Repository: ${GREEN}${REPO}${NC}"
echo ""

# ====================================================================
# AWS Credentials
# ====================================================================
echo -e "${YELLOW}[1/3] AWS Credentials${NC}"
echo "These credentials are used to deploy to S3 and invalidate CloudFront"
echo ""

read -p "AWS Access Key ID: " AWS_ACCESS_KEY_ID
read -sp "AWS Secret Access Key: " AWS_SECRET_ACCESS_KEY
echo ""
echo ""

gh secret set AWS_ACCESS_KEY_ID --body "$AWS_ACCESS_KEY_ID"
gh secret set AWS_SECRET_ACCESS_KEY --body "$AWS_SECRET_ACCESS_KEY"

echo -e "${GREEN}✓ AWS credentials set${NC}"
echo ""

# ====================================================================
# DEV Environment Secrets
# ====================================================================
echo -e "${YELLOW}[2/3] DEV Environment Configuration${NC}"
echo ""

# Patient App - DEV
echo -e "${GREEN}Patient App (DEV)${NC}"
PATIENT_APP_DEV_CLOUDFRONT_ID="E3H7FZ2DSAAT1"
PATIENT_APP_DEV_API_URL="https://api.dev.drcall.global"

echo "CloudFront Distribution ID: $PATIENT_APP_DEV_CLOUDFRONT_ID (auto-detected)"
read -p "API URL [$PATIENT_APP_DEV_API_URL]: " input
PATIENT_APP_DEV_API_URL="${input:-$PATIENT_APP_DEV_API_URL}"

gh secret set PATIENT_APP_DEV_CLOUDFRONT_ID --body "$PATIENT_APP_DEV_CLOUDFRONT_ID"
gh secret set PATIENT_APP_DEV_API_URL --body "$PATIENT_APP_DEV_API_URL"

echo -e "${GREEN}✓ Patient App DEV secrets set${NC}"
echo ""

# Hospital App - DEV
echo -e "${GREEN}Hospital App (DEV)${NC}"
HOSPITAL_APP_DEV_CLOUDFRONT_ID="E738FDGXZ1WIZ"
HOSPITAL_APP_DEV_API_URL="https://api.dev.drcall.global"

echo "CloudFront Distribution ID: $HOSPITAL_APP_DEV_CLOUDFRONT_ID (auto-detected)"
read -p "API URL [$HOSPITAL_APP_DEV_API_URL]: " input
HOSPITAL_APP_DEV_API_URL="${input:-$HOSPITAL_APP_DEV_API_URL}"

gh secret set HOSPITAL_APP_DEV_CLOUDFRONT_ID --body "$HOSPITAL_APP_DEV_CLOUDFRONT_ID"
gh secret set HOSPITAL_APP_DEV_API_URL --body "$HOSPITAL_APP_DEV_API_URL"

echo -e "${GREEN}✓ Hospital App DEV secrets set${NC}"
echo ""

# ====================================================================
# Summary
# ====================================================================
echo -e "${YELLOW}[3/3] Summary${NC}"
echo ""
echo -e "${GREEN}All secrets have been set successfully!${NC}"
echo ""
echo "Secrets configured:"
echo "  - AWS_ACCESS_KEY_ID"
echo "  - AWS_SECRET_ACCESS_KEY"
echo "  - PATIENT_APP_DEV_CLOUDFRONT_ID = $PATIENT_APP_DEV_CLOUDFRONT_ID"
echo "  - PATIENT_APP_DEV_API_URL = $PATIENT_APP_DEV_API_URL"
echo "  - HOSPITAL_APP_DEV_CLOUDFRONT_ID = $HOSPITAL_APP_DEV_CLOUDFRONT_ID"
echo "  - HOSPITAL_APP_DEV_API_URL = $HOSPITAL_APP_DEV_API_URL"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Push code to 'develop' branch to trigger deployment"
echo "2. Monitor deployment: https://github.com/${REPO}/actions"
echo "3. Access deployed apps:"
echo "   - Patient: https://patient.dev.drcall.global"
echo "   - Hospital: https://hospital.dev.drcall.global"
echo ""
echo -e "${YELLOW}Note:${NC} For STG and PROD environments, manually add secrets via:"
echo "  https://github.com/${REPO}/settings/secrets/actions"
echo ""
