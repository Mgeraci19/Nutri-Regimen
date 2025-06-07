import os
from typing import Optional
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from sqlalchemy.orm import Session
from dotenv import load_dotenv

import models
from database import get_db

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not all([SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY]):
    raise ValueError("Missing required Supabase environment variables")

# Create Supabase clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
supabase_admin: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Security scheme
security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> models.User:
    """
    Validate Supabase JWT token and return the current user.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Verify the JWT token with Supabase
        token = credentials.credentials
        user_response = supabase.auth.get_user(token)
        
        if not user_response.user:
            raise credentials_exception
            
        supabase_user = user_response.user
        
        # Get or create user in our database
        db_user = db.query(models.User).filter(
            models.User.supabase_user_id == supabase_user.id
        ).first()
        
        if not db_user:
            # Create new user in our database
            db_user = models.User(
                supabase_user_id=supabase_user.id,
                email=supabase_user.email,
                full_name=supabase_user.user_metadata.get("full_name"),
                avatar_url=supabase_user.user_metadata.get("avatar_url")
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            
        return db_user
        
    except Exception as e:
        print(f"Authentication error: {e}")
        raise credentials_exception

def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[models.User]:
    """
    Optional authentication - returns user if authenticated, None otherwise.
    """
    if not credentials:
        return None
    
    try:
        return get_current_user(credentials, db)
    except HTTPException:
        return None

def create_user_from_supabase(supabase_user_id: str, email: str, db: Session) -> models.User:
    """
    Create a new user in our database from Supabase user data.
    """
    db_user = models.User(
        supabase_user_id=supabase_user_id,
        email=email
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
