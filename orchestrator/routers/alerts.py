from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from db.models import Alert
from db.schemas import AlertSchema
from db.database import get_db

router = APIRouter(prefix="/alerts", tags=["alerts"])

@router.get("/", response_model=List[AlertSchema])
async def get_alerts(db: Session = Depends(get_db)):
    return db.query(Alert).order_by(Alert.timestamp.desc()).limit(50).all()
