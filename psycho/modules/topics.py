from fastapi import APIRouter, Depends, HTTPException, status, Request
from database.database import get_db
from sqlalchemy.orm import Session
from helpers.tokens import verify_token
from database.models import Topic as TopicModel
from database.schemas import Topic as TopicSchema, TopicCreate as TopicCreateSchema

router = APIRouter(
    prefix="/topics",
    tags=["topics"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
def get_all_topics(user_id: str = Depends(verify_token), db: Session = Depends(get_db)):
    db_topics = db.query(TopicModel).filter(TopicModel.user_id == user_id).all()
    # Добавьте здесь свою логику для защищенного эндпоинта
    return {
        "data": db_topics
    }

@router.get("/{id}")
def get_one_topic(id: str, user_id: str = Depends(verify_token), db: Session = Depends(get_db)):
    #TODO check for uuid
    if (not id) or (not isinstance(id, str)):
        raise HTTPException(status_code=400, detail="Bad id")

    db_topic = db.query(TopicModel).filter(TopicModel.id == id).filter(TopicModel.user_id == user_id).first()
    if not db_topic:
        raise HTTPException(status_code=404, detail="Not found")
    
    # Добавьте здесь свою логику для защищенного эндпоинта
    return {
        "data": db_topic
    }

@router.post("/")
def post_topic(data: TopicCreateSchema, user_id: str = Depends(verify_token), db: Session = Depends(get_db)):
    db_topic = TopicModel(name=data.name, user_id=user_id, model_type=data.model_type, bot_name=data.bot_name)
    db.add(db_topic)
    db.commit()
    db.refresh(db_topic)
    return db_topic