import uuid
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from database.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(String, default=lambda: datetime.now())

class Topic(Base):
    __tablename__ = "topics"

    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    name = Column(String)
    user_id = Column(String(36), ForeignKey("users.id"))
    model_type = Column(String(36), default="default")
    bot_name = Column(String(36), default="Cоня")
    created_at = Column(String, default=lambda: datetime.now())

class Message(Base):
    __tablename__ = "messages"

    id = Column(String(36), primary_key=True, index=True, default=lambda: str(uuid.uuid4()))
    role = Column(String)
    message = Column(String)
    created_at = Column(String, default=lambda: datetime.now())
    topic_id = Column(String(36), ForeignKey("topics.id"))
