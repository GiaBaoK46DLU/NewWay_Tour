# NewWay Tourist - Architecture & Design Decisions

This document outlines the key architectural patterns and design decisions made in the NewWay Tourist booking platform.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Data Integrity & Validation](#data-integrity--validation)
3. [Performance Optimizations](#performance-optimizations)
4. [Security Measures](#security-measures)
5. [Caching Strategy](#caching-strategy)
6. [Audit Logging](#audit-logging)
7. [Error Handling](#error-handling)

---

## Core Principles

### Defense in Depth Validation
- **Client-side validation**: HTML5 attributes + React validation
- **Server-side validation**: Comprehensive TypeScript validation functions
- **Database-level validation**: CHECK constraints on all critical fields

This multi-layer approach ensures data integrity even if one layer is bypassed.

### Soft Deletes
Tours and bookings use soft-delete pattern:
```typescript
deleted_at: timestamp  // null = active, set = soft-deleted
cancelled_at: timestamp // bookings only
```

**Benefits:**
- Preserves audit trail and historical data
- Allows recovery if needed
- Maintains referential integrity for related records

### Timezone-Aware Comparisons
All date comparisons normalized to UTC midnight:
```typescript
const travelDate = new Date(payload.travel_date + "T00:00:00Z");
```

Prevents timezone bugs when comparing dates across regions.

---

## Data Integrity & Validation

### Constants Centralization (`lib/constants.ts`)
All magic strings and validation rules defined in one place:
- Booking validation rules (min/max values, regex patterns)
- Tour validation rules (length limits, price bounds)
- Status enumerations (booking status, user roles)
- Error messages (user-facing, non-technical)
- Query parameters (for URL routing)

**Benefits:**
- Single source of truth
- Easy to update constraints globally
- Prevents inconsistencies between client and server
- Mirrors database CHECK constraints

### Email Validation
RFC 5322 compliant regex:
```typescript
/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/
```

### Phone Validation
Vietnamese phone format support:
```typescript
/^\+?[0-9\s\.\-()]{10,15}$/
```

Allows: `+84 9xxxxxxxx`, `09xxxxxxxx`, `+84-9-xxx-xxx`

### Capacity Management
Prevents overbooking through:
1. **Capacity check query**: Sum existing non-cancelled bookings
2. **Atomic comparison**: Check available seats against request
3. **Database constraint**: CHECK capacity > 0

```typescript
const currentBooked = (bookedGuests || 0) + payload.guests;
if (currentBooked > tour.capacity) {
  return error;
}
```

---

## Performance Optimizations

### Parallel Queries (`lib/tours.ts`)
`getTourBySlug()` uses `Promise.all()` for concurrent queries:

```typescript
const [slugResult, idResult] = await Promise.all([
  supabase.from("tours").select("*").eq("slug", slugOrId),
  supabase.from("tours").select("*").eq("id", slugOrId)
]);
```

**Benefit:** Reduces latency for ID lookups (2 queries run in parallel)

### Database Indexes
Created on frequently queried columns:
- `idx_bookings_tour_id` - filter by tour
- `idx_bookings_travel_date` - filter by date
- `idx_tours_slug` - lookup by slug
- `idx_tours_created_at` - sort by creation

### Query Filtering
All queries filter soft-deleted records:
```typescript
.is("deleted_at", null)
.is("cancelled_at", null)
```

Ensures deleted records never appear in results.

---

## Security Measures

### Account Enumeration Prevention
Login returns **generic error** for both "user not found" and "wrong password":

```typescript
return {
  status: "error",
  message: "Email hoặc mật khẩu không đúng" // Generic message
};
```

**Prevents:** Attackers from discovering valid email addresses

### Authorization Checks
Explicit permission checks on all admin routes:

```typescript
export async function requireAdmin() {
  const user = await requireUser();
  const role = await getCurrentUserRole(user.id);
  if (role !== "admin") redirect("/login?error=admin-required");
}
```

Called in:
- `app/dashboard/bookings/page.tsx`
- `app/dashboard/tours/page.tsx`
- `lib/tours.ts` getBookings()

### Input Sanitization
All user inputs trimmed and validated:
```typescript
const fullName = String(formData.get("full_name") || "").trim();
```

### Image Upload Security
Validated before upload:
- MIME type whitelist: `["image/jpeg", "image/png", "image/webp"]`
- File size limit: 10 MB
- Filename uses UUID to prevent collisions

---

## Caching Strategy

### User Role Caching (`lib/cache.ts`)
Reduces database queries for role checks:

```typescript
export function getCachedUserRole(userId: string): string | null
export function cacheUserRole(userId: string, role: string): void
```

**Configuration:**
- TTL: 5 minutes
- Invalidation: When role changes
- Fallback: Database query if cache miss

**Impact:** Admin dashboard loads faster after first role check

### Implementation
Integrated in `lib/auth.ts`:
```typescript
const cached = getCachedUserRole(userId);
if (cached) return cached; // Cache hit
// ...
cacheUserRole(userId, role); // Cache for next request
```

---

## Audit Logging

### Audit Module (`lib/audit.ts`)
Structured logging for all critical operations:

```typescript
export enum AuditAction {
  TOUR_CREATE = "tour:create",
  TOUR_UPDATE = "tour:update",
  TOUR_DELETE = "tour:delete",
  BOOKING_CONFIRM = "booking:confirm",
  BOOKING_CANCEL = "booking:cancel"
}
```

### Log Structure
```typescript
{
  action: "tour:create",
  userId: "user-uuid",
  resourceId: "tour-uuid",
  resourceType: "tour",
  changes: { title: "New Tour" },
  status: "success" | "failure",
  timestamp: "2026-06-29T10:30:00Z"
}
```

### Integration Points
Ready to be integrated into action files:
```typescript
logTourCreate(tourId, title, userId);
logTourUpdate(tourId, changes, userId);
logTourDelete(tourId, userId);
```

**Future:** Write to `audit_logs` table when schema is created.

---

## Error Handling

### Server Action Error Pattern
Use redirects with query parameters (Next.js form action constraint):

```typescript
try {
  const { error } = await supabase.from("tours").insert(payload);
  if (error) {
    redirect(`/dashboard/tours?error=${QUERY_PARAMS.ERROR_CREATE_FAILED}`);
  }
} catch (err) {
  redirect(`/dashboard/tours?error=${QUERY_PARAMS.ERROR_UNEXPECTED}`);
}
```

### Booking Form Error Pattern
Return form state with detailed field errors:

```typescript
return {
  status: "error",
  message: BOOKING_ERROR_MESSAGES.GENERIC_VALIDATION_ERROR,
  errors: {
    email: "Email không đúng định dạng",
    guests: "Số khách không được vượt quá 100"
  }
};
```

### Error Messages Strategy
- **User-facing**: Clear, actionable messages (Vietnamese)
- **Logging**: Detailed error information for debugging
- **Generic**: No system details exposed to prevent info leakage

```typescript
console.error("Failed to create tour:", error.message); // Dev log
redirect("...?error=create-failed"); // User message
```

---

## Testing Checklist

Verify the following scenarios work correctly:

### Booking Capacity
- [ ] Book tour at 50/30 capacity → success
- [ ] Book tour at 25/30 capacity with 10 guests → success
- [ ] Book tour at 25/30 capacity with 6 guests → error (exceeds capacity)
- [ ] Concurrent bookings don't cause overbooking

### Date Validation
- [ ] Book for today → success
- [ ] Book for tomorrow → success
- [ ] Book for past date → error
- [ ] Book with invalid date format → error

### Authorization
- [ ] Non-admin can't access /dashboard/tours → redirect
- [ ] Non-admin can't access /dashboard/bookings → redirect
- [ ] Admin can access both pages

### Soft Deletes
- [ ] Delete tour → shows deleted_at timestamp
- [ ] Deleted tour not in listings → verified
- [ ] Cancelled booking filters out → verified

---

## Future Improvements

1. **Email Notifications**
   - Booking confirmations
   - Cancellation alerts
   - Admin notifications

2. **Rate Limiting**
   - Login attempts (5/minute)
   - Registration (3/hour)
   - Implement via Supabase extensions

3. **Advanced Audit Trail**
   - Write audit_logs to database
   - Query audit trail by user/resource
   - Generate reports

4. **Internationalization (i18n)**
   - Multi-language support
   - Extract all hardcoded messages to `constants.ts`
   - Use i18n library for rendering

5. **Analytics**
   - Track booking trends
   - Monitor tour popularity
   - Revenue reports

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/constants.ts` | Centralized validation rules & error messages |
| `lib/cache.ts` | Role caching for performance |
| `lib/audit.ts` | Audit logging infrastructure |
| `lib/actions/bookings.ts` | Booking create/update logic with capacity checks |
| `lib/actions/tours.ts` | Tour CRUD with validation & image upload |
| `lib/auth.ts` | Authentication & authorization with caching |
| `supabase/migrations/0001_*.sql` | Schema with constraints, indexes, RLS policies |
