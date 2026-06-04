from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from db.models import Device
from db.schemas import DeviceSchema
from db.database import get_db
from services.auth import get_current_user

router = APIRouter(prefix="/devices", tags=["devices"])

@router.get("/", response_model=List[DeviceSchema])
async def get_devices(db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    return db.query(Device).all()

@router.get("/{device_id}", response_model=DeviceSchema)
async def get_device(device_id: str, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.device_id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device

@router.post("/{device_id}/quarantine")
async def manual_quarantine(device_id: str, db: Session = Depends(get_db)):
    from services.anomaly_handler import AnomalyHandler
    device = db.query(Device).filter(Device.device_id == device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    
    handler = AnomalyHandler(db)
    await handler.quarantine_device(device)
    return {"status": "success", "message": f"Device {device_id} isolated."}
