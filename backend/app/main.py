from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routes import form, payment, report
from dotenv import load_dotenv
import os

load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CareerMind AI Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(form.router, prefix="/api", tags=["Form"])
app.include_router(payment.router, prefix="/api", tags=["Payment"])
app.include_router(report.router, prefix="/api", tags=["Report"])

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "CareerMind AI Backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
