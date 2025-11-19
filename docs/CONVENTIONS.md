# Frontend Conventions

## Naming
- **Component**: PascalCase (e.g., `UserProfile.tsx`)
- **Function**: camelCase (e.g., `handleSubmit`)
- **Interface/Type**: PascalCase (e.g., `UserResponse`)
- **File**: 컴포넌트는 PascalCase, 그 외(유틸, 훅)는 camelCase

## Component Structure
```tsx
// Imports
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// Interface
interface Props {
  userId: string;
}

// Component Definition
export default function UserProfile({ userId }: Props) {
  // Hooks
  const { data } = useQuery(...);

  // Event Handlers
  const handleClick = () => { ... };

  // Render
  return (
    <div className="p-4">
      ...
    </div>
  );
}
```

## Git Commit Message
```
feat: 새로운 기능 추가
fix: 버그 수정
style: 스타일 변경 (로직 없음)
refactor: 리팩토링
docs: 문서 수정
```
