// Audit logging utilities for tracking admin operations
// This module provides structured logging for all critical operations

export enum AuditAction {
  TOUR_CREATE = "tour:create",
  TOUR_UPDATE = "tour:update",
  TOUR_DELETE = "tour:delete",
  BOOKING_CONFIRM = "booking:confirm",
  BOOKING_CANCEL = "booking:cancel",
  USER_LOGIN = "user:login",
  USER_REGISTER = "user:register"
}

export interface AuditLog {
  action: AuditAction;
  userId?: string;
  resourceId?: string;
  resourceType?: string;
  changes?: Record<string, any>;
  status: "success" | "failure";
  error?: string;
  timestamp: string;
  ipAddress?: string;
}

/**
 * Log an audit event for critical operations.
 * In production, this should write to a database audit_logs table.
 * For now, we log to console for development visibility.
 */
export function logAudit(log: Omit<AuditLog, "timestamp">): void {
  const auditLog: AuditLog = {
    ...log,
    timestamp: new Date().toISOString()
  };

  console.log("[AUDIT]", JSON.stringify(auditLog));

  // TODO: Write to database when audit_logs table is available
  // await supabase.from("audit_logs").insert(auditLog);
}

export function logTourCreate(tourId: string, title: string, userId?: string): void {
  logAudit({
    action: AuditAction.TOUR_CREATE,
    userId,
    resourceId: tourId,
    resourceType: "tour",
    changes: { title },
    status: "success"
  });
}

export function logTourUpdate(tourId: string, changes: Record<string, any>, userId?: string): void {
  logAudit({
    action: AuditAction.TOUR_UPDATE,
    userId,
    resourceId: tourId,
    resourceType: "tour",
    changes,
    status: "success"
  });
}

export function logTourDelete(tourId: string, userId?: string): void {
  logAudit({
    action: AuditAction.TOUR_DELETE,
    userId,
    resourceId: tourId,
    resourceType: "tour",
    status: "success"
  });
}

export function logBookingConfirm(bookingId: string, userId?: string): void {
  logAudit({
    action: AuditAction.BOOKING_CONFIRM,
    userId,
    resourceId: bookingId,
    resourceType: "booking",
    status: "success"
  });
}

export function logBookingCancel(bookingId: string, userId?: string): void {
  logAudit({
    action: AuditAction.BOOKING_CANCEL,
    userId,
    resourceId: bookingId,
    resourceType: "booking",
    status: "success"
  });
}

export function logError(action: AuditAction, error: Error, userId?: string): void {
  logAudit({
    action,
    userId,
    status: "failure",
    error: error.message
  });
}
