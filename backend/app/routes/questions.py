from fastapi import APIRouter, Depends, HTTPException
from .. import schemas
from ..services.google_sheets import GoogleSheetsService

router = APIRouter()
gs_service = GoogleSheetsService()

@router.get("/questions", response_model=schemas.QuestionsResponse)
def get_questions():
    questions_data = gs_service.get_questions()
    if not questions_data:
        # Fallback or empty list
        return {"questions": []}
    
    # Map to Question schema
    questions = []
    for item in questions_data:
        try:
            questions.append(schemas.Question(
                id=str(item.get("id", "")),
                assessment=str(item.get("assessment", "")),
                category=str(item.get("category", "")),
                text=str(item.get("text", "")),
                question_text_korean=str(item.get("question_text_korean", "")),
                question_code=str(item.get("question_code", "")),
                dimension_code=str(item.get("dimension_code", "")),
                reverse_scored=bool(item.get("reverse_scored", False)),
                weight=float(item.get("weight", 1.0))
            ))
        except Exception as e:
            print(f"Error parsing question: {item.get('id', 'unknown')} - {e}")
            continue
            
    return {"questions": questions}
