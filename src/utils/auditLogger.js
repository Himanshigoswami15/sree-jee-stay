export class AuditLogger {
  constructor(tenantId, locationId = 'main') {
    this.tenantId = tenantId;
    this.locationId = locationId;
    this.storageKey = `reviewpulse_audit_log_${tenantId}`;
  }

  getLogs() {
    try {
      const logs = localStorage.getItem(this.storageKey);
      return logs ? JSON.parse(logs) : [];
    } catch (e) {
      return [];
    }
  }

  logEvent(eventType, details = {}) {
    const logEntry = {
      id: 'log-' + Date.now().toString(36),
      tenantId: this.tenantId,
      locationId: this.locationId,
      eventType, // e.g., 'FEEDBACK_SUBMITTED', 'MANAGER_ALERTED', 'PROVIDER_CLICKED'
      details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    try {
      const currentLogs = this.getLogs();
      currentLogs.unshift(logEntry);
      // Keep only last 1000 events to prevent localStorage overflow
      if (currentLogs.length > 1000) {
        currentLogs.length = 1000;
      }
      localStorage.setItem(this.storageKey, JSON.stringify(currentLogs));
      console.log(`[AuditLog][${this.tenantId}] ${eventType}`, details);
    } catch (e) {
      console.error('Failed to write audit log', e);
    }
  }

  clearLogs() {
    localStorage.removeItem(this.storageKey);
  }
}
