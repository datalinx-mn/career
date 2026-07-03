from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    submissions = relationship("FormSubmission", back_populates="user")

class FormSubmission(Base):
    __tablename__ = "form_submissions"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    phone = Column(String)
    last_name = Column(String)
    first_name = Column(String)
    gender = Column(String)
    age = Column(Integer)
    school_class = Column(String)
    email = Column(String)
    career_interest = Column(String)
    answers = Column(JSON)
    status = Column(String, default="pending") # pending, paid, completed
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="submissions")
    payment = relationship("Payment", back_populates="submission", uselist=False)
    report = relationship("Report", back_populates="submission", uselist=False)

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(String, ForeignKey("form_submissions.id"))
    transaction_id = Column(String, unique=True, nullable=True)
    amount = Column(Float)
    status = Column(String) # succeeded, pending, failed
    created_at = Column(DateTime, default=datetime.utcnow)

    submission = relationship("FormSubmission", back_populates="payment")

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(String, ForeignKey("form_submissions.id"))
    report_data = Column(JSON)
    generated_at = Column(DateTime, default=datetime.utcnow)

    submission = relationship("FormSubmission", back_populates="report")
