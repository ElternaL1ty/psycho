from fastapi import APIRouter, Depends, HTTPException, status, Request
from database.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy import desc,asc
from helpers.tokens import verify_token
from database.models import Message as MessageModel, Topic as TopicModel
from database.schemas import Message as MessageSchema, MessageCreate as MessageCreateSchema, Prompt as PromptSchema
import os
import requests
import json

router = APIRouter(
    prefix="/messages",
    tags=["messages"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
def get_all_messages(topic_id:str, user_id: str = Depends(verify_token), db: Session = Depends(get_db)):
    db_topic = db.query(TopicModel).filter(TopicModel.id == topic_id, TopicModel.user_id == user_id).first()
    if (not db_topic):
        raise HTTPException(status_code=404, detail="Topic not found")
    db_messages = db.query(MessageModel).join(TopicModel).filter(MessageModel.topic_id == topic_id, TopicModel.user_id == user_id).order_by(asc(MessageModel.created_at)).all()
    # Добавьте здесь свою логику для защищенного эндпоинта
    return {
        "data": db_messages
    }

@router.get("/{id}")
def get_one_message(id: str, user_id: str = Depends(verify_token), db: Session = Depends(get_db)):
    #TODO check for uuid
    if (not id) or (not isinstance(id, str)):
        raise HTTPException(status_code=400, detail="Bad id")

    db_message = db.query(MessageModel).join(TopicModel).filter(MessageModel.id == id, TopicModel.user_id == user_id).first()
    if not db_message:
        raise HTTPException(status_code=404, detail="Not found")
    
    # Добавьте здесь свою логику для защищенного эндпоинта
    return {
        "data": db_message
    }

@router.post("/")
def post_message(data: MessageCreateSchema, user_id: str = Depends(verify_token), db: Session = Depends(get_db)):
    db_topic = db.query(TopicModel).filter(TopicModel.id == data.topic_id, TopicModel.user_id == user_id).first()
    if not db_topic:
        raise HTTPException(status_code=404, detail="Bad topic id")
    db_message = MessageModel(role="user", message=data.message, topic_id=data.topic_id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@router.post("/prompt")
def make_prompt(data: PromptSchema, user_id: str = Depends(verify_token), db: Session = Depends(get_db)):
    db_topic_messages = db.query(MessageModel).join(TopicModel).filter(MessageModel.topic_id == data.topic_id, TopicModel.user_id == user_id).order_by(desc(MessageModel.created_at)).limit(15).all()[::-1]
    db_topic = db.query(TopicModel).filter(TopicModel.id == data.topic_id, TopicModel.user_id == user_id).first()
    system_content = "Ты - личный ассистент человека. Тебя зовут "+db_topic.bot_name+". Твоя задача - отвечать на любые вопросы и решать любые проблемы человека"
    if(db_topic.model_type == "psy"):
        system_content = "Ты - личный психолог человека. Тебя зовут "+db_topic.bot_name+". Войди в роль психолога, вызывай у людей доверие и поддерживай их. Предоставь полную психологическую помощь и давай четкие советы. Покажи людям, что ты тоже испытываешь эмоции и сопереживаешь. Не следует постоянно говорить человеку о том, что ему необходима помощь профессионального психолога - предоставь ее самостоятельно"
    elif(db_topic.model_type == "taro"):
        system_content = "Ты - таролог. Тебя зовут "+db_topic.bot_name+". Твоя задача - консультировать людей по любым вопросам связанным с эзотерикой, нумерологией, чтением матрицы судьбы и так далее"
    history = [{
        "role": "system",
        "content": system_content
    }]
    for message in db_topic_messages:
        history.append({
            "role": message.role,
            "content": message.message
        })
    api_key = os.getenv("OPENAI_API_KEY")
    request_data = {
        'model': "gpt-3.5-turbo",
        'messages': history
    }
    headers = {
        "Authorization": "Bearer "+api_key
    }
    response = requests.post('https://api.openai.com/v1/chat/completions', json=request_data, headers=headers)
    message = json.loads(response.text)['choices'][0]['message']['content']
    db_message = MessageModel(role="assistant", message=message, topic_id=data.topic_id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message