from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI(title="Enterprise Digital Trust Platform API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CopilotQuery(BaseModel):
    question: str

@app.get("/")
def read_root():
    return {"message": "EEF AI-236 Trust & Deepfake Detection Engine Online"}

@app.post("/api/verify")
async def verify_identity(
    user_id: str = Form(...),
    id_document: UploadFile = File(...),
    selfie_video: UploadFile = File(...)
):
    """
    Simulates the Identity Verification, Liveness, Deepfake & Trust Scoring Pipeline.
    """
    # Simulate processing checks
    liveness_score = round(random.uniform(0.85, 0.99), 2)
    deepfake_probability = round(random.uniform(0.01, 0.15), 2)
    ocr_valid = True
    
    # Calculate real-time trust score
    trust_score = int((liveness_score * 50) + ((1 - deepfake_probability) * 50))
    
    status = "APPROVED" if trust_score > 75 else "FLAGGED_HIGH_RISK"

    return {
        "status": status,
        "user_id": user_id,
        "metrics": {
            "trust_score": trust_score,
            "liveness_confidence": liveness_score,
            "deepfake_probability": deepfake_probability,
            "ocr_document_valid": ocr_valid,
            "device_anomaly": False
        },
        "audit_message": "Verification completed successfully via multimodal biometric pipeline."
    }

@app.post("/api/copilot")
def security_copilot(query: CopilotQuery):
    """
    AI Identity Copilot for Security Analysts.
    """
    q = query.question.lower()
    if "fail" in q or "why" in q:
        response = "Verification failed primarily due to a high deepfake probability detected in frame 42, indicating a potential AI face-swap injection attack."
    elif "dashboard" in q or "metrics" in q:
        response = "Current system load: 15.2M verifications today. Success rate is at 94.2%, with 12 active deepfake alerts."
    else:
        response = f"Analyzed query regarding '{query.question}'. No anomalous cross-border graph connections or device rings detected for this user profile."
    
    return {"copilot_response": response}

@app.get("/api/dashboard-stats")
def get_dashboard_stats():
    return {
        "total_registered_users": "180M",
        "annual_verifications": "600M",
        "success_rate": "94.8%",
        "active_deepfake_alerts": 14,
        "trust_distribution": {"high": "88%", "medium": "9%", "low": "3%"}
    }