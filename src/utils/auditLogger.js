import { apiClient } from '../services/apiClient';

export class AuditLogger {
  constructor(tenantId = 'demo', locationId = 'main') {
    this.tenantId = tenantId;
    this.locationId = locationId;
  }

  getLogs() {
    // Audit logs now read from backend MongoDB audit_logs collection
    return [];
  }

  logEvent(eventType, details = {}) {
    const logEntry = {
      tenantId: this.tenantId,
      locationId: this.locationId,
      eventType, // e.g., 'FEEDBACK_SUBMITTED', 'MANAGER_ALERTED', 'PROVIDER_CLICKED'
      details,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    };

    console.log(`[AuditLog][${this.tenantId}] ${eventType}`, details);

    // Fire-and-forget log POST to backend
    apiClient('/api/audit', {
      method: 'POST',
      body: JSON.stringify(logEntry),
    }).catch(() => {});
  }

  clearLogs() {}
}
