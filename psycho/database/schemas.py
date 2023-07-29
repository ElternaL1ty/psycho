import uuid
from typing import List
from pydantic import BaseModel
from datetime import datetime


class UserBase(BaseModel):
    email: str
class UserCreate(UserBase):
    password: str
class User(UserBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        orm_mode = True

class TopicCreate(BaseModel):
    name: str
    model_type: str
    bot_name: str
    
class Topic(TopicCreate):
    id: uuid.UUID
    created_at: datetime
    user_id: str
    class Config:
        orm_mode = True


class MessageCreate(BaseModel):
    
    message: str
    topic_id: str

class Message(BaseModel):
    id: uuid.UUID
    role: str
    created_at: datetime

    class Config:
        orm_mode = True


class Prompt(BaseModel):
    topic_id: str




