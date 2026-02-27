# State Components Documentation

## Overview

This directory contains reusable state components for handling common UI states: loading (spinner + skeletons), errors, empty states, and inline error messages. The app also uses a global **Snackbar (Toast)** for success/error alerts via `ToastProvider` and `useToast()` in `components/Toast.tsx`.

## Components

### LoadingState

Displays a loading spinner with an optional message during data fetching operations.

**Props:** `message` (optional). Default: "Loading..."

---

### LoadingSkeleton

Full-page loading state with optional **skeleton** or **spinner** variant. Use for consistent loading UX.

**Props:**

- `variant`: `'cards'` | `'table'` | `'spinner'`. Default: `'cards'`
- `message` (optional): Shown above skeleton
- `cardCount`, `tableRows`, `tableColumns`: For cards/table variants

**Usage:**

```tsx
import { LoadingSkeleton } from '../../components/states';

<LoadingSkeleton variant="cards" message="Loading data models..." cardCount={6} />;
<LoadingSkeleton variant="table" tableRows={6} tableColumns={4} />;
<LoadingSkeleton variant="spinner" message="Loading..." />;
```

---

### Skeleton / CardSkeleton / TableSkeleton

- **Skeleton**: Base shimmer block (width, height, borderRadius).
- **CardSkeleton**: Grid of card-shaped placeholders (`count`).
- **TableSkeleton**: Table with header + rows (`rows`, `columns`).

Use for inline loading placeholders or build custom layouts with `Skeleton`.

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

**Props:** `title`, `message` (required), `onRetry`, `retryLabel`

---

### ApiErrorState

Placeholder for when an **API request fails** (e.g. list failed to load). Same as ErrorState with defaults: title "Something went wrong", message about loading content, and "Try again" button.

**Props:** `message` (optional), `onRetry` (optional)

**Usage:**

```tsx
import { ApiErrorState } from '../../components/states';

<ApiErrorState onRetry={() => refetch()} message="We couldn't load entries. Please try again." />;
```

---

### ErrorMessage

**Inline** error message (e.g. under a form field). Not a full-page state.

**Props:** `message` (required), `className`, `style`

---

### Snackbar (Toast)

Use `useToast()` from `components/Toast` for success/error alerts. App must be wrapped with `ToastProvider` (see `App.tsx`).

```tsx
import { useToast } from '../../components/Toast';

const { showToast } = useToast();
showToast('Saved successfully', 'success');
showToast('Something went wrong', 'error');
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
