import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import LoginRequest, Token, UserResponse
from ..auth import verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.email.strip().lower()).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # If role was selected in login UI, verify role compatibility or adapt
    if credentials.role and credentials.role != user.role:
        # In demo environment, allow role switching if user requests demo role
        user.role = credentials.role
        db.commit()

    access_token = create_access_token(
        data={"sub": user.email, "role": user.role, "name": user.full_name}
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role
    )

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return current_user
