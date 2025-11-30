from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db.base import init_db
from app.routes import auth, companies, selections, dashboard
from app.services.scheduler import start_scheduler, stop_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan events for the FastAPI application.
    """
    # Startup
    print("Initializing database...")
    await init_db()
    print("Database initialized")

    print("Starting scheduler...")
    start_scheduler()
    print("Scheduler started")

    yield

    # Shutdown
    print("Stopping scheduler...")
    stop_scheduler()
    print("Application shutdown complete")


app = FastAPI(
    title="Portfolio Radar API",
    description="AI-powered portfolio intelligence dashboard for VCs",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(companies.router)
app.include_router(selections.router)
app.include_router(dashboard.router)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "ok",
        "message": "Portfolio Radar API is running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Health check for monitoring."""
    return {"status": "healthy"}
