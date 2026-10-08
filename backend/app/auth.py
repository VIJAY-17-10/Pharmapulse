import os
import datetime
from typing import Optional, List
import jwt
import hashlib
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .database import get_db
from .models import User
from .schemas import TokenData

SECRET_KEY = os.getenv("SECRET_KEY", "pharmapulse_sih_secret_super_key_2026_jwt_auth_decision_support")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies password using SHA-256 with salt or bcrypt style"""
    try:
        # Standard salt-hash check or direct match for seeded accounts
        if hashed_password.startswith("sha256$"):
            salt, h = hashed_password.split("$")[1], hashed_password.split("$")[2]
            computed = hashlib.sha256((salt + plain_password).encode("utf-8")).hexdigest()
            return computed == h
        # Fallback for plain demo comparison
        return plain_password == hashed_password
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    salt = "sih2026salt"
    h = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
    return f"sha256${salt}${h}"

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        role: str = payload.get("role")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email, role=role)
    except Exception:
        raise credentials_exception

    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

def require_roles(allowed_roles: List[str]):
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Requires one of roles: {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker
