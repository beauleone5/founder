# Portfolio Radar - Quick Start Guide

Get Portfolio Radar up and running in 5 minutes!

## Prerequisites

- Python 3.9+ installed
- Node.js 18+ installed
- PostgreSQL installed and running
- OpenAI API key

## Setup Steps

### 1. Database (1 minute)

```bash
createdb portfolio_radar
```

### 2. Backend (2 minutes)

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your OpenAI API key
# DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/portfolio_radar
# OPENAI_API_KEY=sk-your-key-here
# SECRET_KEY=your-random-secret-key

# Seed database with 50 AI companies
python -m app.seed_data

# Start backend
python run.py
```

Backend will run on http://localhost:8000

### 3. Frontend (1 minute)

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Start frontend
npm run dev
```

Frontend will run on http://localhost:3000

### 4. Use the App (1 minute)

1. Open http://localhost:3000
2. Click "Sign Up" and create an account
3. Select companies you want to track
4. Click "Save My Dashboard"
5. View your personalized portfolio dashboard!

## Next Steps

- Explore company deep dives
- Wait for daily insights (or manually trigger the pipeline)
- Customize your company selections

## Troubleshooting

**Can't connect to database?**
- Make sure PostgreSQL is running
- Check your DATABASE_URL in backend/.env

**OpenAI errors?**
- Verify your OPENAI_API_KEY is correct
- Check you have API credits available

**Frontend can't reach backend?**
- Make sure backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in frontend/.env.local

## Getting Help

See the full README.md for detailed documentation, API reference, and deployment guides.
