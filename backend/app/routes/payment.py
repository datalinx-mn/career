from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas, database
from ..services.report_generator import ReportGenerator
from ..services.email_service import EmailService

router = APIRouter()
email_service = EmailService()

@router.post("/confirm-payment/{submission_id}")
def confirm_payment(submission_id: str, db: Session = Depends(database.get_db)):
    submission = db.query(models.FormSubmission).filter(models.FormSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Mark as paid
    submission.status = "paid"
    
    # Auto-generate report
    report = db.query(models.Report).filter(models.Report.submission_id == submission_id).first()
    if not report:
        report_data = ReportGenerator.generate_report(submission.answers)
        report = models.Report(
            submission_id=submission_id,
            report_data=report_data
        )
        db.add(report)
    
    submission.status = "completed"
    db.commit()
    
    # Auto-send email
    user = db.query(models.User).filter(models.User.id == submission.user_id).first()
    if user:
        # In a real app, this URL should point to the frontend's report page
        report_url = f"http://localhost:3000/report/{submission.id}"
        email_service.send_report_email(user.email, report_url)
    
    return {"status": "success", "message": "Payment confirmed and report generated/sent"}
