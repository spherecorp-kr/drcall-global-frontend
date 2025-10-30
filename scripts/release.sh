#!/bin/bash
# ====================================================================
# DrCall Frontend Release Script
# ====================================================================
# Semantic Versioning 기반 릴리스 자동화
# ====================================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;36m'
NC='\033[0m' # No Color

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not a git repository${NC}"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}Error: You have uncommitted changes${NC}"
    echo "Please commit or stash your changes first"
    git status --short
    exit 1
fi

# Get current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}Current version: ${CURRENT_VERSION}${NC}"

# Parse version type
VERSION_TYPE=${1:-patch}  # patch, minor, major
ENVIRONMENT=${2:-stg}     # dev, stg, prod

# Validate version type
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo -e "${RED}Error: Invalid version type '${VERSION_TYPE}'${NC}"
    echo "Usage: $0 [patch|minor|major] [dev|stg|prod]"
    exit 1
fi

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(dev|stg|prod)$ ]]; then
    echo -e "${RED}Error: Invalid environment '${ENVIRONMENT}'${NC}"
    echo "Usage: $0 [patch|minor|major] [dev|stg|prod]"
    exit 1
fi

# Parse current version
IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"
MAJOR="${VERSION_PARTS[0]}"
MINOR="${VERSION_PARTS[1]}"
PATCH="${VERSION_PARTS[2]}"

# Calculate new version
case $VERSION_TYPE in
    major)
        MAJOR=$((MAJOR + 1))
        MINOR=0
        PATCH=0
        ;;
    minor)
        MINOR=$((MINOR + 1))
        PATCH=0
        ;;
    patch)
        PATCH=$((PATCH + 1))
        ;;
esac

NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"

# Add environment suffix for non-prod
if [ "$ENVIRONMENT" != "prod" ]; then
    TAG_VERSION="v${NEW_VERSION}-${ENVIRONMENT}"
else
    TAG_VERSION="v${NEW_VERSION}"
fi

echo -e "${GREEN}New version: ${NEW_VERSION}${NC}"
echo -e "${GREEN}Git tag: ${TAG_VERSION}${NC}"
echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"

# Confirmation
read -p "Create release ${TAG_VERSION}? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Release cancelled"
    exit 0
fi

# Update package.json version
echo -e "${BLUE}Updating package.json...${NC}"
npm version ${NEW_VERSION} --no-git-tag-version

# Generate changelog entry
CHANGELOG_FILE="CHANGELOG.md"
if [ ! -f "$CHANGELOG_FILE" ]; then
    echo "# Changelog" > "$CHANGELOG_FILE"
    echo "" >> "$CHANGELOG_FILE"
    echo "All notable changes to this project will be documented in this file." >> "$CHANGELOG_FILE"
    echo "" >> "$CHANGELOG_FILE"
fi

# Get commits since last tag
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
if [ -z "$LAST_TAG" ]; then
    COMMITS=$(git log --oneline --pretty=format:"- %s (%h)" HEAD)
else
    COMMITS=$(git log --oneline --pretty=format:"- %s (%h)" ${LAST_TAG}..HEAD)
fi

# Prepare changelog entry
CHANGELOG_ENTRY="## [${TAG_VERSION}] - $(date +%Y-%m-%d)

### Changes
${COMMITS}

---
"

# Insert at the beginning of changelog (after header)
if [ -f "$CHANGELOG_FILE" ]; then
    # Create temp file with new entry
    {
        head -n 4 "$CHANGELOG_FILE"
        echo ""
        echo "$CHANGELOG_ENTRY"
        tail -n +5 "$CHANGELOG_FILE"
    } > "${CHANGELOG_FILE}.tmp"
    mv "${CHANGELOG_FILE}.tmp" "$CHANGELOG_FILE"
fi

echo -e "${BLUE}Committing changes...${NC}"
git add package.json CHANGELOG.md
git commit -m "chore: release ${TAG_VERSION}

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Create git tag
echo -e "${BLUE}Creating git tag ${TAG_VERSION}...${NC}"
git tag -a "${TAG_VERSION}" -m "Release ${TAG_VERSION}

Environment: ${ENVIRONMENT}
Version: ${NEW_VERSION}

$(echo "$COMMITS" | head -10)"

# Push to remote
echo -e "${BLUE}Pushing to remote...${NC}"
git push origin $(git branch --show-current)
git push origin "${TAG_VERSION}"

echo ""
echo -e "${GREEN}✓ Release ${TAG_VERSION} created successfully!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. GitHub Actions will automatically build and deploy"
echo "2. Monitor deployment: https://github.com/spherecorp-kr/drcall-global-frontend/actions"
if [ "$ENVIRONMENT" == "stg" ]; then
    echo "3. Access STG: https://patient.stg.drcall.global"
elif [ "$ENVIRONMENT" == "prod" ]; then
    echo "3. Access PROD: https://patient.drcall.global"
else
    echo "3. Access DEV: https://patient.dev.drcall.global"
fi
echo ""
