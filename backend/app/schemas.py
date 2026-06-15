from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class FormSubmissionBase(BaseModel):
    id: str
    answers: Dict[str, Any]

class FormSubmissionCreate(FormSubmissionBase):
    user: UserCreate

class FormSubmission(FormSubmissionBase):
    user_id: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class ReportResponse(BaseModel):
    submission_id: str
    report_data: Dict[str, Any]
    generated_at: datetime

class EmailRequest(BaseModel):
    submission_id: str
    email: EmailStr
