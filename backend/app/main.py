from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import Lead, Conversation, Appointment

from app.api.leads import router as leads_router
from app.api.chat import router as chat_router
from app.api.appointments import router as appointments_router
from app.api.properties import router as properties_router
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="AI Real Estate Lead Qualification POC",
    description="Backend for AI-powered real estate lead qualification and appointment automation",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(leads_router)
app.include_router(chat_router)
app.include_router(properties_router)
app.include_router(appointments_router)
@app.get("/")
def root():
    return {
        "message": "AI Real Estate POC Backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }