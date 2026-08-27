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


@app.get("/api/test-openai")
def test_openai():
    import socket
    import urllib.request
    import traceback
    from openai import OpenAI
    from app.config import settings

    results = {}
    # 1. Test DNS resolution
    try:
        ip = socket.gethostbyname("api.openai.com")
        results["dns"] = f"Success: {ip}"
    except Exception as e:
        results["dns"] = f"Failed: {str(e)}"
        
    # 2. Test TCP connection
    try:
        s = socket.create_connection(("api.openai.com", 443), timeout=5)
        s.close()
        results["tcp"] = "Success"
    except Exception as e:
        results["tcp"] = f"Failed: {str(e)}"
        
    # 3. Test simple HTTP GET
    try:
        req = urllib.request.Request(
            "https://api.openai.com/v1/models",
            headers={"Authorization": f"Bearer {settings.openai_api_key}"}
        )
        with urllib.request.urlopen(req, timeout=5) as response:
            results["http"] = f"Success: {response.status}"
    except Exception as e:
        results["http"] = f"Failed: {str(e)}"
        
    # 4. Test OpenAI client call
    try:
        client = OpenAI(api_key=settings.openai_api_key)
        models = client.models.list()
        results["openai_client"] = f"Success: {len(models.data)} models found"
    except Exception as e:
        results["openai_client"] = f"Failed: {str(e)}"
        results["openai_client_traceback"] = traceback.format_exc()
        
    return results