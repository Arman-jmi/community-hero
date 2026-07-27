# 🏙️ Civic Hero

> **AI-Powered Civic Issue Reporting & Smart Governance Platform**

Civic Hero is an AI-powered platform that empowers citizens to report civic issues while helping authorities prioritize, verify, and resolve them faster using artificial intelligence and community participation.

---

# 🔗 Project Links

- 🌐 **Live Demo:** https://civichero-hrnd.vercel.app/
- 🎥 **Demo Video:**https://drive.google.com/file/d/1dyf1FD2gKvsf8QkqX83Tn-7_p4A1-0Nf/view


---

# 📖 Overview

Urban civic issues such as potholes, overflowing garbage, broken streetlights, water leakage, and damaged public infrastructure often remain unresolved because of inefficient reporting systems, duplicate complaints, and poor communication between citizens and authorities.

**Civic Hero** modernizes this process by combining Artificial Intelligence, Computer Vision, Geolocation, and Gamification into a single platform.

Citizens can report issues by uploading an image and description, while AI automatically classifies the issue, predicts its severity, detects duplicate reports, and routes it to the appropriate authority. Authorities receive an intelligent dashboard to manage complaints efficiently, while citizens stay engaged through XP, badges, and leaderboards.

---

# 🎯 Problem Statement

Traditional civic complaint systems face several challenges:

- Manual complaint categorization
- Duplicate reports for the same issue
- Lack of prioritization
- Slow response times
- Low citizen engagement
- Limited transparency during issue resolution

---

# 💡 Our Solution

Civic Hero introduces an AI-assisted civic reporting system that:

- Automatically classifies reported issues
- Detects duplicate complaints
- Predicts issue severity
- Prioritizes reports for authorities
- Encourages citizen participation through gamification
- Provides analytics for better governance

---

# ✨ Features

## 👤 Citizen Portal

Anyone can register and start contributing to their community.

### Features

- Secure User Authentication
- AI-assisted Issue Reporting
- Image Upload
- Automatic Issue Classification
- AI Severity Prediction
- Duplicate Detection
- Community Verification
- XP & Rewards
- Achievement Badges
- Leaderboard
- Profile Dashboard
- Track Complaint Status

---

## 🏛️ Authority Portal

The Authority Dashboard is available only to authorized officials.

### Features

- Secure Authority Login
- Complaint Review Dashboard
- AI-based Issue Prioritization
- Verification Workflow
- Status Management
- Resolution Tracking
- Analytics Dashboard
- Performance Monitoring

---

# 🤖 AI Architecture

The AI pipeline processes every reported issue before it reaches the authority dashboard.

```text
Citizen Uploads Image + Description
                │
                ▼
      Image Analysis (Computer Vision)
                │
                ▼
      AI Issue Classification (NLP)
                │
                ▼
      Severity Prediction
                │
                ▼
      Duplicate Detection
(Image + Description + Location)
                │
                ▼
      Smart Priority Assignment
                │
                ▼
      Authority Dashboard
                │
                ▼
      Verification & Resolution
```

---

# 🧠 AI Components

## 📷 Computer Vision

Analyzes uploaded images to identify the reported civic issue.

Examples include:

- Potholes
- Garbage accumulation
- Water leakage
- Broken streetlights
- Damaged roads
- Drainage issues

---

## 📝 AI Classification

Uses Natural Language Processing together with image analysis to automatically categorize reported issues.

Categories include:

- Roads
- Sanitation
- Water Supply
- Electricity
- Infrastructure
- Public Safety

---

## ⚠️ Severity Prediction

AI predicts the urgency of every complaint based on:

- Visual condition
- Issue category
- Number of nearby reports
- Community verification

Severity Levels

- 🟢 Low
- 🟡 Medium
- 🟠 High
- 🔴 Critical

---

## 📍 Duplicate Detection

Duplicate complaints are identified using:

- GPS Location
- Uploaded Images
- Text Similarity

Instead of creating multiple complaints, users contribute verification to an existing issue.

---

## 📊 Smart Analytics

Authorities receive insights such as:

- Most reported categories
- Resolution statistics
- Civic issue hotspots
- Citizen engagement
- Department performance

---

# 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS, shadcn/ui |
| Backend | Firebase |
| Database | Cloud Firestore |
| Authentication | Firebase Authentication |
| Storage | Firebase Storage |
| AI | Google Gemini API |
| Maps | Google Maps API |
| Deployment | Vercel |

---


# 📂 Project Structure

```text
civic-hero/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Authentication pages
│   ├── citizen/                # Citizen Portal
│   ├── authority/              # Authority Dashboard
│   ├── api/                    # API routes
│   ├── leaderboard/            # Community leaderboard
│   ├── profile/                # User profile
│   └── layout.tsx
│
├── components/                 # Reusable UI components
│   ├── ui/                     # shadcn/ui components
│   ├── dashboard/              # Dashboard components
│   ├── forms/                  # Forms & inputs
│   ├── cards/                  # Feature & issue cards
│   └── maps/                   # Map components
│
├── lib/                        # Utility libraries
│   ├── firebase/               # Firebase configuration
│   ├── ai/                     # Gemini AI integration
│   ├── utils.ts
│   └── constants.ts
│
├── services/                   # Business logic
│   ├── issue.service.ts
│   ├── user.service.ts
│   ├── leaderboard.service.ts
│   └── authority.service.ts
│
├── hooks/                      # Custom React hooks
│
├── types/                      # TypeScript interfaces
│
├── public/                     # Static assets
│   ├── images/
│   ├── icons/
│   └── logo.svg
│
├── styles/                     # Global styles
│
├── .env.local                  # Environment variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md

```

---

# 🚀 Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Arman-jmi/civichero
```

```bash
cd civic-hero
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file.

```env
NEXT_PUBLIC_FIREBASE_API_KEY=

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=

NEXT_PUBLIC_FIREBASE_PROJECT_ID=

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=

NEXT_PUBLIC_FIREBASE_APP_ID=

GOOGLE_GEMINI_API_KEY=

GOOGLE_MAPS_API_KEY=
```


# 🌐 Demo Access

Civic Hero provides two different portals.

## 👤 Citizen Portal

The Citizen Portal is open to everyone.

Simply create a new account to:

- Report civic issues
- Verify existing reports
- Earn XP
- Unlock badges
- Track complaint status

No special credentials are required.

---

## 🏛️ Authority Portal

The Authority Dashboard is protected and accessible only through authorized credentials.

### Authority Login

**Portal**

```
https://civichero-hrnd.vercel.app/admin/login
```

**Email**

```
officer@communityhero.org
```

**Password**

```
Officer@123
```

> Authority accounts cannot be created through public registration.

---

# 🎮 Gamification

Citizen participation is rewarded through a gamified reputation system.

Users can:

- Earn XP for reporting genuine issues
- Verify community reports
- Unlock achievement badges
- Climb the leaderboard
- Build a trusted community profile

---

# 🔒 Security

- Firebase Authentication
- Role-Based Access Control
- Protected Authority Dashboard
- Secure Firestore Rules
- Input Validation
- Secure Image Storage

---

# 🚀 Future Enhancements

- AI Chat Assistant
- Predictive Infrastructure Maintenance
- IoT Sensor Integration
- Multilingual Support
- Push Notifications
- Mobile Application
- Government API Integration
- Smart City Analytics

---

# 👥 Team

**Project Name:** Civic Hero

Developed as an AI-powered smart governance platform for modern cities, enabling faster issue resolution through intelligent automation and active citizen participation.

---

# 📜 License

This project was developed for educational and hackathon purposes.
