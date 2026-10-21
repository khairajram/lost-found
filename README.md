# Find & Lost — AI-Powered Mobile Item Matching Application

[![React Native](https://img.shields.io/badge/React%20Native-0.86-blue.svg)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-SDK%2057-black.svg)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org)
[![Local AI](https://img.shields.io/badge/AI%20Vision-Ollama%20Ready-purple.svg)](https://ollama.com)

A modern, production-grade mobile application built with **React Native**, **Expo (Expo Router)**, and **TypeScript** for reporting and reuniting lost and found items through local **Ollama** vision analysis and intelligent multi-signal matching.

> 📖 **Architecture & Workflow Documentation**: See [WORKFLOW.md](WORKFLOW.md) for full system diagrams, Mermaid sequence flows, AI matching logic, and state lifecycles.

---

## 🌟 Core Features Built

### 1. 🔐 Interactive Auth & One-Tap Demo Persona Switcher
- **Zero Friction Testing**: Test both sides of the lost/found transaction immediately.
  - **User A (Alex Rivera)**: The owner who lost a black Samsung Galaxy S23 Ultra near the University Library.
  - **User B (Sarah Chen)**: The finder who discovered a black Samsung Galaxy phone on a campus bench.
- Full registration & login with **Zod** validation and cross-platform persistent storage (**Expo SecureStore**).

### 2. 📱 Home Dashboard
- Prominent dual hero action cards: **"I Lost Something"** (Coral) and **"I Found Something"** (Emerald).
- High-priority **AI Match Alert Banner** showing active match percentages (e.g., 91%).
- Real-time statistics counters (Lost Reports, Found Reports, AI Matches).
- Campus feed showing recent reports with **privacy-preserving approximate locations**.

### 3. 🔍 Multi-Step Reporting Wizards (5 Steps)
Both `/lost/create` and `/found/create` provide progressive step-by-step reporting:
1. **Photo Upload**: Multi-photo camera & gallery selector with preview, removal, and cover tags (`expo-image-picker`).
2. **Item Details**: Category picker, Brand, Model, Primary Color, Description, and Distinctive Features tags.
3. **Date & Time**: Relative presets ("Just now", "Today morning", "Yesterday") or custom timestamp.
4. **Location**: Auto-detect current coordinates with `expo-location` and reverse geocode to approximate landmarks.
5. **Review & Private Verification**:
   - Owners provide **hidden identifying proof** (e.g. lockscreen wallpaper, engraving, secret stickers) that is **never exposed publicly**.
- **AI Processing Radar Modal**: Interactive simulated visual feature extraction animation representing local Ollama processing.

### 4. 🧠 AI Matching & Comparison Engine
- Tabbed Match Feed: **Potential**, **Accepted**, **In Progress**, **Returned**, and **Rejected**.
- Side-by-side photo comparison view (Reported Lost vs. Reported Found).
- **Match Confidence Gauge** (0–100% score).
- **Multi-Signal Breakdown Bars**:
  - Visual Similarity (88%)
  - Category Similarity (100%)
  - Color Similarity (95%)
  - Brand & Model Similarity (92%)
  - Location Proximity (86%)
  - Date Proximity (94%)
  - Description Similarity (85%)
- **AI Reasoning Explanation Card**: Bullet points detailing why the vision model flagged this potential match.
- **Ownership Verification Workflow**: Owner submits private identifying features; finder verifies without exposing secrets.
- **Safe Return Protocol**: "Accept Match", "Contact Finder/Owner", and "Mark Returned Successfully".

### 5. 💬 In-App Secure Chat & Safety
- Coordinated 1-on-1 messaging connected to specific matches.
- **Match Context Header**: Keeps item thumbnail, title, and match score visible while chatting.
- **Safety Warning Banner**: Advises users to meet only in well-lit public campus locations and never transfer money.
- **Quick Reply Chips**: One-tap suggested questions ("Does the case have a sticker?", "Can we meet at the library desk?").
- **Safety Actions**: Report Suspicious Report and Block User modals.

### 6. 🔎 Explore & Filters
- Segmented control: **All Reports**, **Lost Items**, **Found Items**.
- Live search bar with instant debounce across title, description, color, and brand.
- Horizontal category filter pills (Phones, Laptops, Wallets, Bags, Keys, Earphones, Watches, etc.).

### 7. 🛡️ Privacy Center & Geolocation Safety
- Comprehensive guide on how approximate location masking shields users' home addresses.
- Explanation of zero-knowledge ownership verification.
- Safe meetup recommendations and AI suggestions disclaimers.

---

## 📁 Project Structure

```text
mobile app/
├── mobile/                             # Complete Expo React Native Application
│   ├── app/
│   │   ├── _layout.tsx                 # Root layout (QueryClient, Auth, Navigation)
│   │   ├── index.tsx                   # Auth & Splash redirector
│   │   ├── (auth)/
│   │   │   ├── _layout.tsx
│   │   │   ├── login.tsx               # Login with 1-Tap Demo Switcher
│   │   │   ├── register.tsx            # Sign up with form validation
│   │   │   └── forgot-password.tsx     # Password recovery
│   │   ├── (tabs)/
│   │   │   ├── _layout.tsx             # Bottom Tab Bar with dynamic badges
│   │   │   ├── home.tsx                # Dashboard
│   │   │   ├── explore.tsx             # Search & Category Filters
│   │   │   ├── matches.tsx             # Tabbed AI Match Feed
│   │   │   ├── messages.tsx            # Conversations List
│   │   │   └── profile.tsx             # Profile & Persona Switcher
│   │   ├── lost/
│   │   │   ├── create.tsx              # 5-step Report Lost flow + AI animation
│   │   │   └── [id].tsx                # Lost Item details
│   │   ├── found/
│   │   │   ├── create.tsx              # 5-step Report Found flow + AI animation
│   │   │   └── [id].tsx                # Found Item details
│   │   ├── matches/
│   │   │   └── [id].tsx                # Detailed AI Match Comparison & Verification
│   │   ├── chat/
│   │   │   └── [id].tsx                # Real-Time Chat with Safety Warnings
│   │   ├── my-reports/
│   │   │   └── index.tsx               # Report management hub
│   │   └── settings/
│   │       ├── index.tsx               # Notification & Backend Server URL settings
│   │       └── privacy.tsx             # Privacy Center & Geolocation safeguards
│   ├── components/
│   │   ├── common/                     # Button, Input, Card, Badge, EmptyState, LoadingSkeleton, OfflineNotice
│   │   ├── items/                      # ItemCard, CategoryPills
│   │   ├── matching/                   # ScoreMeter, AIReasoningCard, MatchCard, OwnershipVerificationModal
│   │   ├── chat/                       # MessageBubble, ChatInput, MatchContextBanner, SafetyDisclaimerBanner
│   │   └── report/                     # StepIndicator, ImagePickerGrid
│   ├── services/
│   │   ├── api.ts                      # Axios client with JWT interceptors
│   │   ├── itemsService.ts             # Lost & Found CRUD with in-memory persistence
│   │   ├── matchService.ts             # AI matches, acceptance, verification, returns
│   │   ├── chatService.ts              # Messages and conversation feeds
│   │   ├── locationService.ts          # Expo Location integration & distance calculation
│   │   ├── notificationService.ts      # Push notifications & in-app alerts
│   │   └── mockData.ts                 # Rich seed data (User A & User B scenario)
│   ├── store/
│   │   └── authStore.ts                # Zustand authentication & session store
│   ├── types/                          # TypeScript types for User, Item, Match, Chat, Notification
│   ├── utils/                          # Validators (Zod), Formatters, Storage (SecureStore)
│   ├── constants/                      # Themes, Colors, Categories, Spacing
│   ├── app.json                        # Expo app manifest & permissions
│   ├── package.json
│   └── tsconfig.json                   # Strict TypeScript configuration
├── package.json                        # Root monorepo workspace scripts
├── .env.example                        # Root environment variables
├── WORKFLOW.md                         # Complete End-to-End System Workflow & Mermaid Architecture Diagrams
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18+ (Tested on Node.js v24)
- **npm** or **pnpm**
- **Expo Go** app on your physical mobile device (Android or iOS) OR a browser / Android Studio emulator.

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd "f:\mobile app"
   ```

2. Install dependencies for the mobile app:
   ```bash
   cd mobile
   npm install --legacy-peer-deps
   ```

3. Type-check to verify:
   ```bash
   npx tsc --noEmit
   ```
   *(Compiles with 0 errors)*

---

## 📲 Running the App

You can run the app from either the root folder or inside `mobile/`:

### From Root:
```bash
npm start
```

### From `mobile/`:
```bash
cd mobile
npx expo start
```

### Options inside the Expo CLI:
- Press **`a`** to open in Android Emulator
- Press **`w`** to open in Web Browser
- Scan the displayed QR code with the **Expo Go** app on your physical phone!

---

## 📱 Testing on a Physical Phone

When testing on a physical phone using **Expo Go**, your phone needs to communicate over your local Wi-Fi network:

1. Find your computer's local IP address:
   - **Windows (PowerShell)**: Run `ipconfig` (look for `IPv4 Address`, e.g., `192.168.1.105`)
   - **Mac / Linux**: Run `ifconfig` or `ip a`
2. Open `mobile/.env` (or configure it in **Settings > API Base URL** in the app):
   ```env
   EXPO_PUBLIC_API_URL=http://192.168.1.105:5000/api
   ```
3. The app is equipped with an interactive in-memory fallback layer: **all screens, forms, camera uploads, chats, and matches work seamlessly even without a running backend server**.

---

## 🧪 End-to-End Scenario Walkthrough

To experience the full design flow:

1. **Sign In**: Launch the app. On the Login screen, tap **"Quick Login: User A (Alex - Lost Item)"**.
2. **Review Match**: You'll see an alert on the Home screen: **"Potential Match Found! 91% Match"**. Tap it.
3. **Analyze**: In the Match Details screen:
   - Compare the photo of Alex's lost Samsung Galaxy S23 against the photo of Sarah's found phone.
   - Inspect the **AI Signals Breakdown** (Visual 88%, Category 100%, Color 95%, Location 86%).
   - Read the **AI Reasoning** bullets.
4. **Chat**: Tap **"Chat with Finder"**. Send a message. You will receive an automated reply from Sarah.
5. **Verify Ownership**: Tap **"Submit Private Identifying Proof"** and submit the secret detail (e.g., "watercolor cat picture").
6. **Mark Returned**: Tap **"Mark Item Returned Successfully"**. The match status transitions to `RETURNED`.
7. **Create a Report**: Tap **"Report Lost Item"** or **"Report Found Item"** on Home to test the 5-step wizard with camera selection and GPS location.
8. **Switch to Finder**: Go to **Profile**, tap **"Switch Persona"** to switch instantly to Sarah (Finder) and see the finder's perspective!

---

## 🛠️ Complete Backend & Infrastructure

- **Node.js + Express + TypeScript backend** in `backend/` running on port `5000`
- **Persistent PostgreSQL 16 Container** (`findlost-postgres`) running via `docker-compose.yml` on port `5434` with volume persistence
- **Prisma ORM** type-safe schema and migrations
- **Google Gemini 1.5 Flash** vision multimodal AI engine for:
  - Single-image structured visual feature extraction
  - Multimodal side-by-side comparison of lost vs. found photos with confidence scoring and forensic reasoning bullets
  - Intelligent fallback heuristic when running offline or testing
- **Socket.IO** server for instant real-time in-app chat and push notifications
- **End-to-End Workflow**: Fully operational from user signup/login to lost/found reporting, AI matching, ownership verification, and safe return handover.

### Running Backend & Database

```bash
# 1. Start Docker PostgreSQL Container (Persistent Volume)
docker compose up -d

# 2. Run Database Migrations & Seeds
cd backend
npx prisma db push
npm run seed

# 3. Start Backend Server
npm run dev
```
