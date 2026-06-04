import pytest
from orchestrator.services.auth import create_access_token, verify_password, get_password_hash
from jose import jwt
import os

def test_password_hashing():
    password = "secret_password"
    hashed = get_password_hash(password)
    assert verify_password(password, hashed)
    assert not verify_password("wrong_password", hashed)

def test_jwt_generation_and_decode():
    data = {"sub": "admin"}
    token = create_access_token(data)
    
    SECRET_KEY = os.getenv("JWT_SECRET", "change_me_to_a_secure_random_string")
    ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    assert payload.get("sub") == "admin"
