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
    user = db.query(models.User).filter(models.User.email == submission.user_info.email).first()
    if not user:
        user = models.User(
            name=f"{submission.user_info.first_name} {submission.user_info.last_name}", 
            email=submission.user_info.email
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Create submission
    db_submission = models.FormSubmission(
        id=submission.id or str(uuid.uuid4()),
        user_id=user.id,
        phone=submission.user_info.phone,
        last_name=submission.user_info.last_name,
        first_name=submission.user_info.first_name,
        gender=submission.user_info.gender,
        age=submission.user_info.age,
        school_class=submission.user_info.school_class,
        email=submission.user_info.email,
        career_interest=submission.user_info.career_interest,
        answers=submission.answers,
        status="pending"
    )
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    
    # Push to Google Sheets (background)
    gs_service.append_submission(db_submission)
    
    return db_submission
