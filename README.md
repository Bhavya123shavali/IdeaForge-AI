<div align="center">

# 🚀 IdeaForge AI

### *Validate Smarter. Build Better. Fail Less.*

**An AI-powered startup idea validation platform that helps entrepreneurs evaluate business ideas, analyze market potential, and improve concepts using intelligent insights and historical learning.**



---

</div>

## 🧠 Overview

> **The Problem:** Most startup ideas fail not because they're bad — but because they were never properly validated.

**IdeaForge AI** solves this by providing structured, data-driven feedback using Large Language Models combined with a Memento-style memory system. Submit an idea, get scored across key dimensions, understand your strengths and weaknesses, and receive actionable improvement suggestions — all within seconds.

```
Submit Idea → AI Analysis → Memory Comparison → Structured Insights → Smarter Decisions
```

---

## ✨ Features

### 🔍 Idea Validation Engine
Evaluates startup ideas across three critical dimensions with AI-generated scores and in-depth analysis:

| Dimension | What It Measures |
|-----------|-----------------|
| 📈 **Market Potential** | TAM/SAM sizing, demand signals, growth trajectory |
| ⚔️ **Competition Level** | Market saturation, differentiation gap, competitive moat |
| 🛠️ **Feasibility** | Technical complexity, resource needs, time-to-market |

### 🧠 Memory-Based Learning (Memento System)
The platform gets smarter with every idea submitted:
- Stores all previously analyzed ideas in a persistent JSON store
- Compares incoming ideas against historical patterns
- Surfaces similarities to past successes and failures
- Generates improvement suggestions grounded in prior learnings

### ❤️ Liked Ideas Dashboard
- Bookmark and revisit your most promising concepts
- View scores and insights in a unified dashboard
- Track your idea evolution over time

### 🎯 Smart Filter System

| Filter Tier | Score Range | Interpretation |
|-------------|-------------|----------------|
| 🔴 **Low** | 0 – 5 | Needs significant rethinking |
| 🟡 **Medium** | 6 – 8 | Promising with refinements |
| 🟢 **High** | 9 – 10 | Strong validation signal |

### 🧭 Step-by-Step Flow UI
A guided experience that removes cognitive overload:

```
[Step 1] Idea Input  →  [Step 2] Score Evaluation  →  [Step 3] Strengths & Weaknesses  →  [Step 4] Improvement Suggestions
```

### 🎨 Premium UI/UX
- Framer Motion-powered animations and transitions
- Unique animated landing experience
- Interactive visual feedback on scores
- Responsive design across all devices

---

## 🏗️ Architecture

### System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐     │
│   │              React.js Frontend                        │     │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────────────┐    │     │
│   │  │ Landing  │  │ Validate │  │ Results /         │    │     │
│   │  │ Page     │  │ Page     │  │ LikedIdeas /      │    │     │
│   │  └──────────┘  └──────────┘  │ History Pages    │    │     │
│   │                               └──────────────────┘    │     │
│   │       Tailwind CSS  +  Framer Motion                  │     │
│   └───────────────────────────────────────────────────────┘     │
└─────────────────────────┬───────────────────────────────────────┘
                          │  REST API (HTTP/JSON)
┌─────────────────────────▼───────────────────────────────────────┐
│                       SERVER LAYER                              │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐     │
│   │              FastAPI Backend (Python)                  │     │
│   │  ┌─────────────────┐    ┌────────────────────────┐    │     │
│   │  │  app.py          │    │  memory.py             │    │     │
│   │  │  (API Routes &   │    │  (Memento System)      │    │     │
│   │  │   Validation)    │    └──────────┬─────────────┘    │     │
│   │  └────────┬────────┘               │                   │     │
│   │           │         ┌──────────────┘                   │     │
│   │           │         │                                   │     │
│   │  ┌────────▼─────────▼──────┐                           │     │
│   │  │  llm_utils.py           │                           │     │
│   │  │  (LLM Prompt & Analysis)│                           │     │
│   │  └─────────────────────────┘                           │     │
│   │  ┌──────────────────────────┐                          │     │
│   │  │  firecrawl_utils.py      │                          │     │
│   │  │  (Competitor Web Data)   │                          │     │
│   │  └──────────────────────────┘                          │     │
│   └───────────────────────────────────────────────────────┘     │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                      STORAGE LAYER                              │
│              JSON File Storage (ideas_memory.json)             │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
User Input
    │
    ▼
┌───────────────────┐
│  Input Validation  │  ← Sanitize & format idea text
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Memory Module     │  ← Query past ideas for context
│  (Memento)         │     (similarity matching)
└────────┬──────────┘
         │  Historical context
         ▼
┌───────────────────┐
│  LLM Analysis      │  ← Combined prompt: idea + history
│  Engine            │     → Market, Competition, Feasibility
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Score Calculator  │  ← Weighted scoring (0–10)
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  Memory Persist    │  ← Save new idea + insights to JSON
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  API Response      │  → Scores, strengths, weaknesses,
└───────────────────┘     suggestions, similar past ideas
```

### Project Structure

```
IDEAFORGE-AI/
│
├── backend/                        # FastAPI Python Backend
│   ├── __pycache__/                # Python bytecode cache
│   ├── .venv/                      # Virtual environment
│   ├── data/                       # Persistent storage (JSON memory)
│   ├── .env                        # Environment variables (private)
│   ├── .env.example                # Environment variable template
│   ├── app.py                      # Main FastAPI entry point & routes
│   ├── backend-dev.log             # Development log file
│   ├── firecrawl_utils.py          # Web scraping / competitor data utils
│   ├── llm_utils.py                # LLM API integration & prompt logic
│   ├── memory.py                   # Memento memory system (read/write)
│   └── requirements.txt            # Python dependencies
│
├── frontend/                       # React.js Frontend
│   ├── dist/                       # Production build output
│   ├── node_modules/               # Node.js dependencies
│   ├── public/                     # Static assets
│   └── src/
│       ├── components/             # Reusable UI components
│       ├── pages/
│       │   ├── HistoryPage.jsx     # Past ideas & memory browser
│       │   ├── LandingPage.jsx     # Animated hero / entry screen
│       │   ├── LikedIdeasPage.jsx  # Saved / bookmarked ideas
│       │   ├── ResultsPage.jsx     # Score + insights display
│       │   └── ValidatePage.jsx    # Idea submission & validation flow
│       ├── services/               # API client & service layer
│       ├── App.jsx                 # Root component & routing
│       └── index.css               # Global styles
│
└── README.md
```

---

## ⚙️ Installation

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | ≥ 18.x | Frontend runtime |
| **Python** | ≥ 3.10 | Backend runtime |
| **npm** | ≥ 9.x | Package manager |
| **pip** | latest | Python packages |

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ideaforge-ai.git
cd ideaforge-ai
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your LLM API key:
# LLM_API_KEY=your_api_key_here
# LLM_MODEL=your_preferred_model

# Start the backend server
python -m uvicorn app:app --reload --port 8000
```

✅ Backend runs at: `http://localhost:8000`
📄 API Docs at: `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

✅ Frontend runs at: `http://localhost:5173`

---

## 📖 Usage

### Step-by-Step Walkthrough

**Step 1 — Submit Your Idea**
> Enter a description of your startup idea. Be specific: include the problem you solve, your target audience, and your proposed solution.

**Step 2 — Review Your Score**
> The AI returns a composite score (0–10) broken down by Market Potential, Competition Level, and Feasibility.

**Step 3 — Analyze Strengths & Weaknesses**
> Read through the structured insights that explain *why* your idea scored the way it did.

**Step 4 — Apply Improvement Suggestions**
> Act on AI-generated, memory-informed recommendations to sharpen your concept.

**Bonus — Like & Track Ideas**
> Heart your best ideas to save them to your dashboard. Use filters to compare ideas across score tiers.

---

## 📊 API Reference

### Base URL
```
http://localhost:8000
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/validate` | Submit an idea for AI validation |
| `GET` | `/ideas` | Retrieve all stored ideas |
| `GET` | `/ideas/{id}` | Retrieve a specific idea by ID |
| `DELETE` | `/ideas/{id}` | Delete a stored idea |
| `GET` | `/health` | Health check |

### `POST /validate`

**Request Body:**
```json
{
  "idea": "An AI-powered platform that helps students find personalized study schedules based on their learning style and exam timeline."
}
```

**Response:**
```json
{
  "id": "abc123",
  "idea": "An AI-powered platform...",
  "scores": {
    "market_potential": 8.2,
    "competition_level": 6.5,
    "feasibility": 7.8,
    "overall": 7.5
  },
  "strengths": [
    "Large and growing addressable market (EdTech)",
    "Clear pain point with measurable outcome"
  ],
  "weaknesses": [
    "High competition from established players (Notion, Quizlet)",
    "Requires significant personalization data to be effective"
  ],
  "suggestions": [
    "Niche down to a specific exam type (e.g., UPSC, GMAT) to reduce competition",
    "Partner with coaching centers for early user acquisition and data"
  ],
  "similar_past_ideas": [
    {
      "idea": "AI tutor for college students",
      "overall_score": 6.9,
      "lesson": "Generic AI tutoring struggled without a niche focus"
    }
  ],
  "timestamp": "2025-07-15T10:30:00Z"
}
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | React.js 18 | Component-based UI |
| **Styling** | Tailwind CSS | Utility-first responsive design |
| **Animations** | Framer Motion | Smooth transitions & micro-interactions |
| **Backend Framework** | FastAPI (Python) | High-performance REST API |
| **AI Layer** | LLM APIs | Natural language idea analysis |
| **Memory System** | JSON File Storage | Memento-style historical learning |
| **API Validation** | Pydantic | Request/response schema enforcement |
| **Dev Server** | Uvicorn | ASGI server for FastAPI |

---

## 🔢 Scoring Methodology

Each idea is evaluated on three weighted dimensions:

| Dimension | Weight | Criteria |
|-----------|--------|----------|
| 📈 Market Potential | 40% | Market size, demand signals, growth trend, timing |
| ⚔️ Competition Level | 30% | Competitive density, differentiation, moat strength |
| 🛠️ Feasibility | 30% | Technical complexity, resource requirements, execution risk |

**Overall Score** = (Market × 0.4) + (Competition × 0.3) + (Feasibility × 0.3)

---

## 📊 Example Use Cases

| Use Case | How IdeaForge Helps |
|----------|---------------------|
| 🆕 **Validate a new idea** | Get an unbiased AI score before investing time or money |
| 🔁 **Improve an existing concept** | Use targeted suggestions to pivot or sharpen your idea |
| ⚖️ **Compare multiple ideas** | Score several concepts side-by-side and filter by tier |
| 📚 **Learn from past attempts** | Understand why similar ideas succeeded or failed historically |
| 🎯 **Pre-pitch preparation** | Identify and address weaknesses before presenting to investors |

---

## 🗺️ Roadmap

### ✅ Current (v1.0)
- [x] AI-powered idea validation engine
- [x] Memento-style memory system
- [x] Liked ideas dashboard
- [x] Score-based filter system
- [x] Step-by-step flow UI
- [x] Premium animated interface

### 🔜 Upcoming (v2.0)
- [ ] **Real-time competitor scraping** — Live web data for competitive analysis
- [ ] **Advanced analytics dashboard** — Trend charts, idea evolution tracking
- [ ] **User authentication system** — Accounts, profiles, private idea vaults
- [ ] **Cloud-based storage** — PostgreSQL / Firebase for scalable persistence
- [ ] **Idea comparison mode** — Side-by-side multi-idea analysis view
- [ ] **Export to PDF** — Shareable validation reports for investors/teams
- [ ] **Team collaboration** — Share ideas and insights with co-founders

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes and commit
git commit -m "feat: add your feature description"

# 4. Push to your fork
git push origin feature/your-feature-name

# 5. Open a Pull Request
```

### Contribution Guidelines
- Follow the existing code style and structure
- Write clear, descriptive commit messages
- Add comments for complex logic
- Test your changes before submitting a PR

---

## 📜 License

This project is for **educational and demonstration purposes**.

---

<div align="center">

Built with ❤️ to help entrepreneurs validate ideas before it's too late.

**⭐ Star this repo if IdeaForge AI helped you think better!**

</div>