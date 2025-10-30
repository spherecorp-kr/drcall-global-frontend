# DrCall Global Frontend Monorepo

Frontend monorepo for DrCall Global applications using pnpm workspaces.

## Structure

```
drcall-global-frontend/
├── apps/                     # Applications
│   ├── hospital-app/        # Hospital management application (Desktop)
│   └── patient-app/         # Patient mobile application
├── packages/                 # Shared packages
│   └── shared-lib/          # Shared utilities, services, and types
├── package.json             # Root package.json with workspace config
└── pnpm-workspace.yaml      # pnpm workspace configuration
```

## Setup

### Prerequisites
- Node.js >= 18
- pnpm >= 9

### Installation

```bash
# Install all dependencies
pnpm install
```

## Development

### Run Applications

```bash
# Run hospital app
pnpm dev:hospital

# Run patient app
pnpm dev:patient
```

### Build Applications

```bash
# Build hospital app
pnpm build:hospital

# Build patient app
pnpm build:patient

# Build all apps
pnpm build:all
```

### Lint

```bash
# Lint hospital app
pnpm lint:hospital

# Lint patient app
pnpm lint:patient

# Lint all apps
pnpm lint:all
```

## Shared Library (@drcall/shared-lib)

The shared library contains:

- **API Client**: Axios instance with interceptors
- **Services**: Chat service (SendBird integration)
- **Utils**:
  - Error handling
  - Validation utilities
  - Date formatting
  - Sorting utilities
  - Country codes
  - Tailwind class merging (cn)
- **Types**: Shared TypeScript types
- **Config**: i18n and React Query configurations

### Usage in Apps

```typescript
// Import from shared-lib
import { apiClient, cn, formatDate } from '@drcall/shared-lib';
import { chatService } from '@drcall/shared-lib/services';
import { handleError } from '@drcall/shared-lib/utils';
```

## Apps Overview

### Hospital App
- **Purpose**: Hospital staff management interface
- **Platform**: Desktop (responsive web)
- **Key Features**:
  - Patient management
  - Appointment scheduling
  - Medical records
  - Analytics dashboard
- **Tech Stack**: React 19, TypeScript, Vite, TailwindCSS, React Query, Zustand

### Patient App
- **Purpose**: Patient mobile application
- **Platform**: Mobile-first web application
- **Key Features**:
  - Book appointments
  - Chat with doctors
  - View medical records
  - Multi-channel support (LINE, Telegram, WhatsApp)
- **Tech Stack**: React 19, TypeScript, Vite, TailwindCSS, React Query, MSW

## Development Workflow

1. Make changes in apps or shared-lib
2. If shared code is modified, rebuild shared-lib: `cd packages/shared-lib && pnpm build`
3. Apps will automatically pick up changes via workspace linking
4. Test changes in respective apps
5. Commit and push

## Notes

- Each app maintains its own git history from migration
- Shared code should only contain truly reusable utilities
- App-specific code (UI components, business logic) stays in respective apps
- channel-specific utilities (LINE, Telegram, etc.) remain in patient-app only
