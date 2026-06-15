from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, database
from ..services.report_generator import ReportGenerator
from ..services.email_service import EmailService

router = APIRouter()
email_service = EmailService()

@router.get("/report/{submission_id}", response_model=schemas.ReportResponse)
def get_report(submission_id: str, db: Session = Depends(database.get_db)):
    submission = db.query(models.FormSubmission).filter(models.FormSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    if submission.status not in ["paid", "completed"]:
        raise HTTPException(status_code=402, detail="Payment required")
    
    report = db.query(models.Report).filter(models.Report.submission_id == submission_id).first()
    if not report:
        # Fallback generation if for some reason it wasn't generated at payment
        report_data = ReportGenerator.generate_report(submission.answers)
        report = models.Report(
            submission_id=submission_id,
            report_data=report_data
        )
        db.add(report)
        submission.status = "completed"
        db.commit()
        db.refresh(report)
    
    return report

@router.post("/send-report")
def send_report(req: schemas.EmailRequest, db: Session = Depends(database.get_db)):
    submission = db.query(models.FormSubmission).filter(models.FormSubmission.id == req.submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
        
    if submission.status not in ["paid", "completed"]:
         raise HTTPException(status_code=402, detail="Payment required")

    report = db.query(models.Report).filter(models.Report.submission_id == req.submission_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    report_url = f"http://localhost:3000/report/{req.submission_id}"
    success = email_service.send_report_email(req.email, report_url)
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send email")
    
    return {"status": "sent"}
