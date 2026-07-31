import { apiClient } from '../services/apiClient';

export class AuditLogger {
  constructor(hotelId = 'demo', locationId = 'main') {
    this.hotelId = hotelId;
    this.locationId = locationId;
  }

  getLogs() {
    // Audit logs now read from backend MongoDB audit_logs collection
    return [];
  }

  logEvent(eventType, details = {}) {
    const logEntry = {
      hotelId: this.hotelId,
      locationId: this.locationId,
      eventType, // e.g., 'FEEDBACK_SUBMITTED', 'MANAGER_ALERTED', 'PROVIDER_CLICKED'
      details,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    };

    console.log(`[AuditLog][${this.hotelId}] ${eventType}`, details);

    // Fire-and-forget log POST to backend
    apiClient('/api/audit', {
      method: 'POST',
      body: JSON.stringify(logEntry),
    }).catch(() => {});
  }

  clearLogs() {}
}
