# State Components Documentation

## Overview

This directory contains reusable state components for handling common UI states in the FountainCMS application.

## Components

### LoadingState

Displays a loading spinner with an optional message during data fetching operations.

**Props:**

- `message` (optional): Custom loading message. Default: "Loading..."

**Usage:**

```tsx
import { LoadingState } from '../../components/states';

<LoadingState message="Loading users..." />;
```

---

### EmptyState

Displays a friendly message when no data is available.

**Props:**

- `title` (optional): Main heading. Default: "No Data Available"
- `message` (optional): Descriptive text. Default: "There are no items to display at this time."
- `icon` (optional): Emoji or icon to display. Default: "📭"
- `actionLabel` (optional): Text for action button
- `onAction` (optional): Callback function for action button

**Usage:**

```tsx
import { EmptyState } from '../../components/states';

<EmptyState
  title="No Users Found"
  message="There are no users in the system yet."
  icon="👥"
  actionLabel="Add User"
  onAction={handleAddUser}
/>;
```

---

### ErrorState

Displays error information with optional retry functionality.

**Props:**

- `title` (optional): Error title. Default: "Something Went Wrong"
- `message` (required): Error description
- `onRetry` (optional): Callback function for retry button
- `retryLabel` (optional): Text for retry button. Default: "Try Again"

**Usage:**

```tsx
import { ErrorState } from '../../components/states';

<ErrorState
  title="Failed to Load Data"
  message="Unable to connect to the server. Please try again."
  onRetry={handleRetry}
/>;
```

---

## Design Principles

1. **Consistency**: All components follow the same design language and use CSS variables for theming
2. **Accessibility**: Components include proper semantic HTML and styling
3. **Reusability**: Generic components that can be used across the application
4. **User Experience**: Clear messaging and actionable recovery options
5. **Type Safety**: Full TypeScript support with proper interfaces

## Testing

All components have comprehensive unit tests covering:

- Default behavior
- Custom props
- User interactions
- Edge cases
- Accessibility features

Run tests with:

```bash
npm test
```

## Integration Example

See [UsersList.tsx](../../pages/admin/UsersList.tsx) for a complete implementation example showing:

- Loading state during data fetch
- Error state with retry functionality
- Empty state when no data exists
- Successful data display
