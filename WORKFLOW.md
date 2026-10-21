# Complete Project Workflow & System Architecture: Find & Lost

> **AI-Powered Mobile Lost & Found Reunion Platform**  
> *Built with React Native (0.86), Expo SDK 57 (Expo Router v4), TypeScript, Zustand, and Local Vision AI (Ollama/LLaVA).*

---

## 📑 Table of Contents
1. [Executive Overview & Core Concepts](#1-executive-overview--core-concepts)
2. [High-Level System Architecture](#2-high-level-system-architecture)
3. [User Persona Journeys (Alex vs. Sarah)](#3-user-persona-journeys-alex-vs-sarah)
4. [5-Step Item Reporting Wizard Flow](#4-5-step-item-reporting-wizard-flow)
5. [AI Vision & Multi-Signal Matching Engine](#5-ai-vision--multi-signal-matching-engine)
6. [State Machine & Entity Lifecycles](#6-state-machine--entity-lifecycles)
7. [Zero-Knowledge Ownership Verification Protocol](#7-zero-knowledge-ownership-verification-protocol)
8. [Secure In-App Chat & Safe Return Protocol](#8-secure-in-app-chat--safe-return-protocol)
9. [Screen Navigation & Routing Hierarchy](#9-screen-navigation--routing-hierarchy)
10. [End-to-End Sequence Diagram](#10-end-to-end-sequence-diagram)
11. [Data Models & API Contracts](#11-data-models--api-contracts)
12. [Running & Testing the Workflow](#12-running--testing-the-workflow)

---

## 1. Executive Overview & Core Concepts

**Find & Lost** solves the friction, distrust, and privacy concerns in traditional lost-and-found systems (bulletin boards, social media groups, campus desks) by combining:
1. **Local Vision AI (Ollama / LLaVA)**: Automatic visual feature extraction (category, brand, colors, text, marks) directly from phone cameras.
2. **Multi-Signal Comparison Engine**: Algorithmic scoring that compares visual embeddings, categorical hierarchy, spatial proximity, and temporal decay.
3. **Zero-Knowledge Ownership Proofs**: Private verification details hidden from public feeds so only legitimate owners can claim high-value items.
4. **Resilient Dual-Mode Execution**: Full native functionality with automated in-memory persistence and simulation, backed by REST API integration.

```mermaid
graph TD
    subgraph CorePillars["Find & Lost Architecture Pillars"]
        direction TB
        P1["1. Local Vision AI<br/>Feature Extraction"]
        P2["2. Multi-Signal Scoring<br/>Visual + Geo + Time"]
        P3["3. Zero-Knowledge Proof<br/>Anti-Fraud Verification"]
        P4["4. Privacy Masking<br/>Approximate Geofencing"]
    end
    P1 --> Solution["Safe & Fast Item Reunion"]
    P2 --> Solution
    P3 --> Solution
    P4 --> Solution
```

---

## 2. High-Level System Architecture

The following diagram illustrates the client-side architecture, local device APIs, background state, networking interceptors, and backend/AI infrastructure.

```mermaid
flowchart TB
    subgraph Client["Mobile Client (React Native 0.86 / Expo SDK 57)"]
        direction TB
        subgraph UI["Presentation Layer (Expo Router)"]
            AuthScreens["Auth & Persona Switcher<br/>(login, register, forgot)"]
            TabsScreens["Bottom Tab Navigator<br/>(home, explore, matches, messages, profile)"]
            ReportScreens["Multi-Step Wizard<br/>(lost/create, found/create)"]
            ActionScreens["Details & Interaction<br/>(matches/[id], chat/[id], settings)"]
        end

        subgraph Device["Native Device Hardware APIs"]
            Camera["Expo ImagePicker<br/>(Camera & Photo Library)"]
            GPS["Expo Location<br/>(GPS & Reverse Geocoding)"]
            SecureStore["Expo SecureStore<br/>(Tokens & Encrypted Keys)"]
            Push["Expo Notifications<br/>(Push & In-App Alerts)"]
        end

        subgraph StateLayer["Client State & Utilities"]
            ZustandStore["Zustand Store<br/>(Auth, Session, Persona)"]
            ZodValid["Zod Validation Schemas<br/>(Forms & Payloads)"]
            ThemeTokens["Design System<br/>(Colors, Typography, Spacing)"]
        end

        subgraph ServiceLayer["Services Layer"]
            ItemsService["itemsService<br/>(Lost & Found CRUD)"]
            MatchService["matchService<br/>(Match Queries & Actions)"]
            ChatService["chatService<br/>(Messages & Conversations)"]
            LocService["locationService<br/>(Haversine & Geocoding)"]
        end

        subgraph DataFallbacks["Network & Fallback Bridge"]
            AxiosClient["Axios Client<br/>(JWT Bearer Interceptors)"]
            InMemoryCache["In-Memory Reactive Cache<br/>(Zero-Config Offline Support)"]
        end
    end

    subgraph BackendSystem["Backend & AI Infrastructure"]
        ExpressAPI["Node.js / Express REST API (Port 5000)"]
        PostgresDB[("Docker PostgreSQL 16 (Port 5434)<br/>Prisma Client ORM")]
        GeminiServer["Google Gemini 1.5 Flash<br/>(Multimodal Vision & Comparison)"]
        SocketServer["Socket.IO Server<br/>(Real-Time Messaging)"]
    end

    UI --> StateLayer
    UI --> ServiceLayer
    ReportScreens --> Camera
    ReportScreens --> GPS
    AuthScreens --> SecureStore
    ServiceLayer --> AxiosClient
    AxiosClient -.->|Network Success| ExpressAPI
    AxiosClient -.->|Network Error / Standalone| InMemoryCache
    ExpressAPI --> PostgresDB
    ExpressAPI --> GeminiServer
    ExpressAPI --> SocketServer
    ActionScreens --> Push
```

---

## 3. User Persona Journeys (Alex vs. Sarah)

The application provides a zero-friction dual-persona test bed allowing seamless switching between **User A (Alex - Item Owner)** and **User B (Sarah - Item Finder)**.

```mermaid
journey
    title Complete Reunion Journey: Alex (Owner) & Sarah (Finder)
    section 1. Loss & Discovery
      Alex loses Galaxy S23 Ultra at Library: 1: Alex
      Sarah spots Galaxy S23 Ultra on bench: 5: Sarah
    section 2. Multi-Step Reporting
      Sarah opens app & reports Found Item (5 steps): 5: Sarah
      Ollama extracts visual features: 4: Sarah
      Alex opens app & reports Lost Item (5 steps): 3: Alex
      Alex adds private secret proof: 4: Alex
    section 3. AI Matching
      Engine calculates 91% composite match: 5: Alex, Sarah
      Alex receives High Match alert banner: 5: Alex
      Sarah sees Potential Match in feed: 5: Sarah
    section 4. Verification & Chat
      Alex reviews side-by-side comparison: 5: Alex
      Alex accepts match & submits private proof: 4: Alex
      Sarah verifies secret detail against phone: 5: Sarah
      Both coordinate meetup in Secure Chat: 5: Alex, Sarah
    section 5. Safe Handover
      Meet at University Library Info Desk: 5: Alex, Sarah
      Handover completed & marked RETURNED: 5: Alex, Sarah
```

---

## 4. 5-Step Item Reporting Wizard Flow

Both `/lost/create` and `/found/create` guide users through a progressive 5-step wizard to maximize report accuracy without cognitive fatigue.

```mermaid
flowchart LR
    Step1["Step 1<br/>Upload Photos"] --> Step2["Step 2<br/>Item Details"]
    Step2 --> Step3["Step 3<br/>Date & Time"]
    Step3 --> Step4["Step 4<br/>Location"]
    Step4 --> Step5["Step 5<br/>Review & Proof"]
    Step5 --> AIRadar["AI Radar Animation<br/>Feature Extraction"]
    AIRadar --> Published["Report Live &<br/>Matching Engine Triggered"]
```

### Step-by-Step Detail Matrix

| Step | Action & UI Components | Inputs Captured | System Validations & Protections |
| :--- | :--- | :--- | :--- |
| **1. Upload Photos** | `ImagePickerGrid`<br/>Camera & Gallery actions | Up to 5 high-res photos, primary cover image | Minimum 1 image required. Images compressed and converted to URIs. |
| **2. Item Details** | `CategoryPills`<br/>Input text fields | Title, Category (14 choices), Brand, Model, Color, Distinctive Features | Title min 3 chars, Description min 10 chars, Category & Color mandatory. |
| **3. Date & Time** | Quick Preset Chips & Custom Picker | "Just now", "Today morning", "Yesterday", or custom timestamp | ISO-8601 formatting. Prevents future dates. |
| **4. Location** | GPS Auto-Detect Button & Area Input | Latitude, Longitude, City, State, Approximate Area Landmark | Reverse-geocoded to landmark (e.g., *"University Library Campus Center"*). Exact GPS coordinates are masked from public browse. |
| **5. Review & Proof** | Summary Card & Secret Proof Input | Hidden verification detail (Lost only), Terms agreement | **Zero-Knowledge field**: Stored securely; never displayed on public feeds or shared with unverified users. |
| **AI Radar Modal** | Simulated Ollama Vision Modal | Image payload dispatched for visual embedding | Extract color histogram, brand tags, OCR text, and feature tokens. |

---

## 5. AI Vision & Multi-Signal Matching Engine

The core matching algorithm evaluates **7 distinct similarity vectors** between every active Lost Item and Found Item.

```mermaid
flowchart TD
    subgraph Inputs["Item Inputs"]
        L_Img["Lost Item Images"]
        F_Img["Found Item Images"]
        L_Meta["Lost Metadata<br/>(Category, Brand, Color, Location, Time)"]
        F_Meta["Found Metadata<br/>(Category, Brand, Color, Location, Time)"]
    end

    subgraph VisionPipeline["Google Gemini 1.5 Flash Multimodal Vision Pipeline"]
        V_Extract["Visual Feature Extraction & Tagging"]
        V_Compare["Side-by-Side Photo Comparison & Forensic Reasoning"]
        L_Img --> V_Extract
        F_Img --> V_Extract
        L_Img & F_Img --> V_Compare
        V_Extract & V_Compare --> V_Tags["Visual Similarity % & Detailed Reasoning Bullets"]
    end

    subgraph Signals["7-Signal Similarity Breakdown"]
        S1["Visual Similarity (30%)<br/>Cosine metric on visual attributes"]
        S2["Category Similarity (20%)<br/>Exact/hierarchical taxonomy match"]
        S3["Color Similarity (15%)<br/>Primary & secondary palette matching"]
        S4["Location Proximity (15%)<br/>Haversine formula on geocoordinates"]
        S5["Brand & Model (10%)<br/>Fuzzy text token matching"]
        S6["Date Proximity (5%)<br/>Temporal decay window"]
        S7["Description Semantics (5%)<br/>Distinctive feature overlap"]
    end

    V_Tags --> S1
    L_Meta & F_Meta --> S2
    L_Meta & F_Meta --> S3
    L_Meta & F_Meta --> S4
    L_Meta & F_Meta --> S5
    L_Meta & F_Meta --> S6
    L_Meta & F_Meta --> S7

    subgraph WeightedSum["Weighted Confidence Calculator"]
        Calc["Score = Sum(Weight_i * Signal_i)"]
    end

    S1 & S2 & S3 & S4 & S5 & S6 & S7 --> Calc

    subgraph Outcome["Match Score Tiering"]
        High["Score >= 85%<br/>High Priority Match Alert Banner"]
        Med["60% <= Score < 85%<br/>Listed in Potential Matches Feed"]
        Low["Score < 60%<br/>Discarded / Low Confidence"]
    end

    Calc -->|">= 85%"| High
    Calc -->|"60% - 84%"| Med
    Calc -->|"< 60%"| Low
```

### Mathematical Formula

$$\text{MatchScore} = \sum_{i=1}^{7} w_i \cdot S_i$$

Where:
* $w_{vis} = 0.30$ (Visual Similarity)
* $w_{cat} = 0.20$ (Category Exact/Parent Match)
* $w_{col} = 0.15$ (Color Palette Overlap)
* $w_{loc} = 0.15$ (Spatial Decay: $e^{-\frac{\Delta km}{5}}$)
* $w_{brand} = 0.10$ (Brand/Model Fuzzy Match)
* $w_{date} = 0.05$ (Temporal Decay: $e^{-\frac{\Delta days}{7}}$)
* $w_{desc} = 0.05$ (Distinctive Feature Keyword Match)

---

## 6. State Machine & Entity Lifecycles

The application manages two interdependent state machines: the **Item Lifecycle** and the **Match Lifecycle**.

### Item Status Lifecycle

```mermaid
stateDiagram-v2
    [*] --> ACTIVE: Report Created (Lost / Found)
    ACTIVE --> MATCHED: Accepted AI Match
    ACTIVE --> CLOSED: User Cancels Report
    MATCHED --> RETURNED: Mutual Return Confirmation
    MATCHED --> ACTIVE: Match Rejected / Disputed
    RETURNED --> [*]
    CLOSED --> [*]
```

### Match Status Lifecycle

```mermaid
stateDiagram-v2
    [*] --> POTENTIAL: AI Engine Detects Overlap (Score >= 60%)
    POTENTIAL --> REJECTED: User Dismisses Match
    POTENTIAL --> ACCEPTED: User A or B Clicks "Accept Match"
    
    ACCEPTED --> CONTACTED: Secure Chat Started
    ACCEPTED --> RETURN_IN_PROGRESS: Ownership Proof Submitted & Verified
    CONTACTED --> RETURN_IN_PROGRESS: Ownership Proof Submitted & Verified
    
    RETURN_IN_PROGRESS --> RETURNED: Physical Handover Confirmed
    RETURN_IN_PROGRESS --> DISPUTED: Verification Mismatch / Conflict
    DISPUTED --> CLOSED: Admin or User Termination
    REJECTED --> [*]
    RETURNED --> [*]
    CLOSED --> [*]
```

---

## 7. Zero-Knowledge Ownership Verification Protocol

To prevent opportunistic scammers from falsely claiming items found by others, the platform implements a **Private Verification Gate**.

```mermaid
sequenceDiagram
    autonumber
    actor Owner as Alex (Owner)
    participant App as Find & Lost App
    participant Vault as Secure Storage
    actor Finder as Sarah (Finder)

    Note over Owner,App: Report Creation Phase
    Owner->>App: Submits Lost Item Details
    Owner->>App: Enters Private Secret: "Lockscreen is watercolor cat picture"
    App->>Vault: Stores secret in privateVerificationDetails (Flagged Confidential)
    App-->>Owner: Report Active (Secret hidden from public feed)

    Note over Finder,App: Discovery & Match Phase
    Finder->>App: Reports Found Samsung Galaxy S23
    App->>App: AI Engine flags 91% Match
    App-->>Owner: Alert: Potential Match with Sarah's Found Item
    App-->>Finder: Alert: Potential Match with Alex's Lost Item

    Note over Owner,Finder: Verification Flow
    Owner->>App: Opens Match Details (/matches/[id])
    Owner->>App: Clicks "Submit Private Identifying Proof"
    Owner->>App: Enters proof text: "Lockscreen is watercolor cat picture"
    App->>Finder: Sends Verification Request Notification
    Finder->>App: Views submitted proof
    Finder->>Finder: Checks physical phone lockscreen in hand
    Finder->>App: Clicks "Verify Proof Matches Physical Item"
    App->>App: Status updates to RETURN_IN_PROGRESS
    App-->>Owner: Ownership Confirmed! Next step: Arrange Safe Handover
```

---

## 8. Secure In-App Chat & Safe Return Protocol

The chat system is uniquely tied to specific matches to maintain contextual safety and prevent harassment.

```mermaid
flowchart TD
    subgraph ChatInterface["Chat Screen (/chat/[id])"]
        ContextBanner["Sticky Match Context Header<br/>(Thumbnail, Score %, Status Badge)"]
        SafetyBanner["Safety Warning Card<br/>(Public places only, no money requests)"]
        MessageList["Message History Bubble Feed<br/>(Incoming / Outgoing / Timestamps)"]
        QuickReplies["One-Tap Prompt Chips<br/>('Does it have a sticker?', 'Meet at Library desk?')"]
        ChatInputBar["Chat Input + Photo Attachment Action"]
        SafetyActionsModal["Safety Actions Modal<br/>(Report Suspicious Report / Block User)"]
    end

    ContextBanner --> MessageList
    SafetyBanner --> MessageList
    QuickReplies --> ChatInputBar
    ChatInputBar --> MessageList
    MessageList -.-> SafetyActionsModal
```

### Safe Return Handover Checklist

```mermaid
flowchart LR
    C1["1. Campus Info Desk<br/>Public Meeting Location"] --> C2["2. Daylit Hours<br/>Between 9 AM - 5 PM"]
    C2 --> C3["3. In-Person Inspection<br/>Confirm unlock or serial"]
    C3 --> C4["4. Mutual Tap in App<br/>'Mark Item Returned'"]
    C4 --> C5["5. Safe Reunion Complete"]
```

---

## 9. Screen Navigation & Routing Hierarchy

The app uses **Expo Router v4** file-based routing. The screen tree and navigation transitions are structured as follows:

```mermaid
graph TD
    Root["app/_layout.tsx (Root Layout & Providers)"]
    Index["app/index.tsx (Splash & Auth Redirector)"]
    Root --> Index

    subgraph AuthGroup["app/(auth)/"]
        Login["login.tsx<br/>1-Tap Demo Switcher"]
        Register["register.tsx<br/>User Signup"]
        Forgot["forgot-password.tsx<br/>Password Recovery"]
    end

    subgraph TabsGroup["app/(tabs)/ Bottom Tab Bar"]
        TabHome["home.tsx<br/>Dashboard & Match Alerts"]
        TabExplore["explore.tsx<br/>Search & Filter Pills"]
        TabMatches["matches.tsx<br/>Tabbed Match Feed"]
        TabMessages["messages.tsx<br/>Active Conversations"]
        TabProfile["profile.tsx<br/>User & Persona Switcher"]
    end

    subgraph LostGroup["app/lost/"]
        LostCreate["create.tsx<br/>5-Step Lost Wizard"]
        LostDetail["[id].tsx<br/>Lost Item Details"]
    end

    subgraph FoundGroup["app/found/"]
        FoundCreate["create.tsx<br/>5-Step Found Wizard"]
        FoundDetail["[id].tsx<br/>Found Item Details"]
    end

    subgraph ActionRoutes["app/ & Modal Routes"]
        MatchDetail["matches/[id].tsx<br/>AI Breakdown & Verification"]
        ChatScreen["chat/[id].tsx<br/>In-App Safety Chat"]
        MyReports["my-reports/index.tsx<br/>User Report Management"]
        Settings["settings/index.tsx<br/>API URL & Preferences"]
        Privacy["settings/privacy.tsx<br/>Privacy Center & Masking"]
    end

    Index -->|Not Authenticated| Login
    Index -->|Authenticated| TabHome
    Login --> Register
    Login --> Forgot
    Login --> TabHome

    TabHome --> LostCreate
    TabHome --> FoundCreate
    TabHome --> MatchDetail
    TabHome --> MyReports

    TabExplore --> LostDetail
    TabExplore --> FoundDetail

    TabMatches --> MatchDetail
    MatchDetail --> ChatScreen
    TabMessages --> ChatScreen

    TabProfile --> MyReports
    TabProfile --> Settings
    Settings --> Privacy
```

---

## 10. End-to-End Sequence Diagram

This sequence diagram depicts the complete chronological lifecycle of an item reunion from first loss to final handover.

```mermaid
sequenceDiagram
    autonumber
    actor Alex as Alex (Owner)
    participant UI_A as Alex's App
    participant Service as App Services Layer
    participant AI as Vision Matching Engine
    participant UI_B as Sarah's App
    actor Sarah as Sarah (Finder)

    Note over Alex,Sarah: Phase 1: Incident & Reporting
    Alex->>UI_A: Reports Lost Samsung Galaxy S23 (Uploads photo, GPS, secret proof)
    UI_A->>Service: itemsService.createLostItem(payload)
    Service-->>UI_A: Lost item created (Status: ACTIVE)

    Sarah->>UI_B: Reports Found Samsung Galaxy S23 (Uploads photo, GPS)
    UI_B->>Service: itemsService.createFoundItem(payload)
    Service-->>UI_B: Found item created (Status: ACTIVE)

    Note over Service,AI: Phase 2: AI Multi-Signal Analysis
    Service->>AI: Trigger matchEvaluation(lostItem, foundItem)
    AI->>AI: Local Ollama analyzes image features & embeddings
    AI->>AI: Compute 7 signals (Visual: 88%, Category: 100%, Color: 95%, Loc: 86%, Date: 94%)
    AI-->>Service: Overall Match Score: 91% (Status: POTENTIAL)

    Note over Alex,Sarah: Phase 3: Notification & Comparison
    Service-->>UI_A: High Match Banner (91%)
    Service-->>UI_B: Match Added to Potential Feed
    Alex->>UI_A: Taps Match Banner -> Opens /matches/[id]
    UI_A->>UI_A: Renders side-by-side photos & AI reasoning points
    Alex->>UI_A: Taps "Accept Match"
    UI_A->>Service: matchService.acceptMatch(matchId)

    Note over Alex,Sarah: Phase 4: Secure Communication & Verification
    Alex->>UI_A: Taps "Chat with Finder" -> Opens /chat/[id]
    Alex->>UI_A: Sends: "Hi Sarah! I think this is my phone. Can we verify?"
    UI_A->>Service: chatService.sendMessage(text)
    Service-->>UI_B: Incoming message notification
    Sarah->>UI_B: Replies: "Yes! Submit the private detail you have."
    Alex->>UI_A: Submits secret: "Lockscreen has a watercolor cat picture"
    UI_A->>Service: matchService.submitVerification(matchId, answer)
    Service-->>UI_B: Verification proof delivered
    Sarah->>UI_B: Inspects lockscreen -> Confirms watercolor cat -> Approves
    Service->>Service: Status updates to RETURN_IN_PROGRESS

    Note over Alex,Sarah: Phase 5: Safe Campus Handover
    Alex->>Sarah: Meet at University Library Info Desk
    Sarah->>Alex: Hands over physical Samsung Galaxy S23
    Alex->>UI_A: Taps "Mark Item Returned Successfully"
    UI_A->>Service: matchService.confirmReturned(matchId)
    Service->>Service: Item status = RETURNED, Match status = RETURNED
    Service-->>UI_A: Success Alert & Celebration
    Service-->>UI_B: Match marked complete
```

---

## 11. Data Models & API Contracts

### Core Domain Entities

```mermaid
classDiagram
    class User {
        +string _id
        +string name
        +string email
        +string phone
        +string avatar
        +boolean isVerified
        +string createdAt
    }

    class ItemLocation {
        +number latitude
        +number longitude
        +string address
        +string city
        +string state
        +string country
        +string approximateArea
    }

    class AIVisualAnalysis {
        +string category
        +string brand
        +string model
        +string primaryColor
        +string[] secondaryColors
        +string[] visibleText
        +string[] distinctiveFeatures
        +string objectDescription
        +number confidence
    }

    class LostItem {
        +string _id
        +string userId
        +string title
        +string description
        +ItemCategory category
        +string brand
        +string model
        +string color
        +string[] distinctiveFeatures
        +string lostDate
        +ItemLocation lostLocation
        +string[] images
        +ItemStatus status
        +AIVisualAnalysis aiAnalysis
        +string privateVerificationDetails
    }

    class FoundItem {
        +string _id
        +string userId
        +string title
        +string description
        +ItemCategory category
        +string brand
        +string model
        +string color
        +string[] distinctiveFeatures
        +string foundDate
        +ItemLocation foundLocation
        +string[] images
        +ItemStatus status
        +AIVisualAnalysis aiAnalysis
    }

    class SimilarityBreakdown {
        +number visualSimilarity
        +number categorySimilarity
        +number colorSimilarity
        +number brandSimilarity
        +number locationSimilarity
        +number dateSimilarity
        +number descriptionSimilarity
    }

    class Match {
        +string _id
        +string lostItemId
        +string foundItemId
        +string lostUserId
        +string foundUserId
        +number matchScore
        +SimilarityBreakdown similarityBreakdown
        +string[] aiReasoning
        +MatchStatus status
        +string verificationStatus
        +string verificationAnswerProvided
        +ReturnDetails returnDetails
    }

    class ChatMessage {
        +string _id
        +string chatId
        +string senderId
        +string text
        +string imageUri
        +string createdAt
        +boolean read
    }

    LostItem --> ItemLocation
    LostItem --> AIVisualAnalysis
    FoundItem --> ItemLocation
    FoundItem --> AIVisualAnalysis
    Match --> SimilarityBreakdown
    Match --> LostItem
    Match --> FoundItem
    Match --> User
```

### Key API Endpoints & Contract Matrix

| Method | Endpoint | Description | Request Body / Query | Response Payload |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticates user & returns JWT | `{ email, password }` | `{ user, token }` |
| `GET` | `/api/lost` | Query filtered lost items | `?category=&search=` | `LostItem[]` |
| `POST` | `/api/lost` | Creates new lost item report | `CreateLostItemPayload` | `LostItem` |
| `GET` | `/api/found` | Query filtered found items | `?category=&search=` | `FoundItem[]` |
| `POST` | `/api/found` | Creates new found item report | `CreateFoundItemPayload` | `FoundItem` |
| `GET` | `/api/matches` | Retrieve user AI matches | `?status=POTENTIAL` | `Match[]` |
| `POST` | `/api/matches/:id/accept` | Accept a potential match | None | `Match (ACCEPTED)` |
| `POST` | `/api/matches/:id/verify` | Submit private proof | `{ answer: string }` | `Match (RETURN_IN_PROGRESS)` |
| `POST` | `/api/matches/:id/returned` | Confirm handover | `{ handoverCompleted: true }` | `Match (RETURNED)` |
| `GET` | `/api/chats` | Retrieve conversation list | None | `ChatConversation[]` |
| `GET` | `/api/chats/:id/messages` | Load message thread | None | `ChatMessage[]` |
| `POST` | `/api/chats/:id/messages` | Send message in match thread | `{ text, imageUri? }` | `ChatMessage` |

---

## 12. Running & Testing the Workflow

1. **Launch App**:
   ```bash
   cd mobile
   npx expo start
   ```
2. **One-Tap Persona Flow**:
   - Tap **"Quick Login: User A (Alex - Owner)"** on login screen.
   - Tap the **"Potential Match Found! 91% Match"** alert banner on Home.
   - Review side-by-side comparison, 7-signal breakdown, and AI reasoning.
   - Tap **"Chat with Finder"** and coordinate.
   - Tap **"Submit Private Identifying Proof"** to simulate zero-knowledge verification.
   - Tap **"Mark Item Returned Successfully"**.
   - Switch persona to **Sarah (Finder)** from Profile to view the other perspective!
