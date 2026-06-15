from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, database
from ..services.google_sheets import GoogleSheetsService
import uuid

router = APIRouter()
gs_service = GoogleSheetsService()

@router.post("/submit-form", response_model=schemas.FormSubmission)
def submit_form(submission: schemas.FormSubmissionCreate, db: Session = Depends(database.get_db)):
    # Check if user exists
    user = db.query(models.User).filter(models.User.email == submission.user.email).first()
    if not user:
        user = models.User(name=submission.user.name, email=submission.user.email)
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Create submission
    db_submission = models.FormSubmission(
        id=submission.id or str(uuid.uuid4()),
        user_id=user.id,
        answers=submission.answers,
        status="pending"
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    
    # Push to Google Sheets (background)
    gs_service.append_submission(db_submission.id, user.name, user.email, db_submission.answers)
    
    return db_submission
