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
    id: Optional[str] = None
    answers: Dict[str, Any]

class UserInfo(BaseModel):
    phone: str
    last_name: str
    first_name: str
    gender: str
    age: int
    school_class: str
    email: EmailStr
    career_interest: str

class FormSubmissionCreate(FormSubmissionBase):
    user_info: UserInfo

class FormSubmission(FormSubmissionBase):
    user_id: int
    phone: Optional[str] = None
    last_name: Optional[str] = None
    first_name: Optional[str] = None
    gender: Optional[str] = None
    age: Optional[int] = None
    school_class: Optional[str] = None
    email: Optional[str] = None
    career_interest: Optional[str] = None
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class ReportResponse(BaseModel):
    submission_id: str
    report_data: Dict[str, Any]
    generated_at: datetime

class Question(BaseModel):
    id: str
    assessment: str
    category: str
    text: str
    question_text_korean: Optional[str] = ""
    question_code: Optional[str] = ""
    dimension_code: Optional[str] = ""
    reverse_scored: Optional[bool] = False
    weight: Optional[float] = 1.0

class QuestionsResponse(BaseModel):
    questions: List[Question]

class EmailRequest(BaseModel):
    submission_id: str
    email: EmailStr
