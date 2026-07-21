# 🏨 Sree Jee Stay — Smart Guest Review & Analytics Platform

A policy-compliant, full-featured Guest Review & Feedback Web Application for **Sree Jee Stay - Homestay in Varanasi**.

---

## ✨ Features

- **Policy-Compliant Dual-Path Routing (Anti-Review Gating)**:
  - **4–5 Star Ratings**: Automatically copies auto-written review text to clipboard, fires celebration confetti, and connects directly to the official Google Business review link (`https://share.google/A2R9wcQuxsaISXwnn`).
  - **1–3 Star Ratings**: Dispatches direct internal alerts to the Duty Manager + keeps the secondary public Google review link unhidden to comply 100% with Google & TripAdvisor policies.
- **Dynamic Keyword Engine & Auto-Written Sentence Assembly**: Guests tap sentiment keyword chips (*✨ Spotless Room*, *🍳 Superb Breakfast*, *⚡ Fast Wi-Fi*, etc.) and human-sounding review text auto-assembles in real-time.
- **Hotel-Branded Thank You Screen**: Displays a warm appreciation card specifically for Sree Jee Stay upon review completion.
- **Privacy & Security Gate (Manager PIN Protection)**: Manager Dashboard and Settings are secured behind a 4-digit Security PIN (`1234`), keeping guest QR scans private.
- **Manager Insights Dashboard**:
  - Executive KPIs (Avg Rating, NPS, Alert Count, Conversion Rate).
  - Keyword & Sentiment Tag Studio (Add/Edit custom tags live).
  - Tag Frequency Analytics over time.
  - Submissions Feed Table with search & status resolution.
  - Printable Room Tent Card & QR Code Studio.

---

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/Himanshigoswami15/sree-jee-stay.git
cd sree-jee-stay

# Install dependencies
npm install

# Start local development server
npm run dev
```

The app runs on `http://localhost:7890/`.

---

## 🛠️ Built With

- **Core**: React 19, Vite
- **Icons & Effects**: Lucide React, Canvas Confetti, QRCode
- **Styling**: Modern Vanilla CSS (Glassmorphism, Dark Mode, Fully Responsive for All Devices)
