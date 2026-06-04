from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.schemas import AnomalyEvent
from db.database import get_db
from services.anomaly_handler import AnomalyHandler

router = APIRouter(prefix="/events", tags=["events"])

@router.post("/anomaly")
async def report_anomaly(event: AnomalyEvent, db: Session = Depends(get_db)):
    handler = AnomalyHandler(db)
    await handler.handle_anomaly(event.model_dump())
    return {"status": "received"}
