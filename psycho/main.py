from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import modules.auth as authRouter
import modules.topics as topicHandler
import modules.messages as msgHandler
import database.models as models
from database.database import engine
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)

models.Base.metadata.create_all(bind=engine)

app.include_router(authRouter.router)
app.include_router(topicHandler.router)
app.include_router(msgHandler.router)