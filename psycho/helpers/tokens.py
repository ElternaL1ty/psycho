from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status
from dotenv import load_dotenv
from jose import JWTError, jwt
from database.database import get_db
from sqlalchemy.orm import Session
from database.models import User as UserModel
import os

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY =os.getenv("SECRET_KEY")
ALGORITHM=os.getenv("ALGORITHM")
def verify_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        db_user = db.query(UserModel).filter(UserModel.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=400, detail="Bad user id")
        return user_id
        
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")