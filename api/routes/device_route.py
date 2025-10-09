from fastapi import APIRouter, HTTPException
from schemas.device_schema import DeviceCreate, DeviceOut
from services.device_service import *

router = APIRouter()

@router.get("/", response_model=list[DeviceOut])
def list_devices():
    return get_all_devices()

@router.get("/{device_id}", response_model=DeviceOut)
def get_device_by_id(device_id: str):
    device = get_device(device_id)
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device

@router.post("/", response_model=DeviceOut, status_code=201)
def add_device(device_data: DeviceCreate):
    return create_device(device_data)

@router.put("/{device_id}", response_model=DeviceOut)
def modify_device(device_id: str, device_data: DeviceCreate):
    device = update_device(device_id, device_data)
    if not device:
        raise HTTPException(status_code=404, detail="Device not found")
    return device

@router.delete("/{device_id}", status_code=204)
def remove_device(device_id: str):
    if not delete_device(device_id):
        raise HTTPException(status_code=404, detail="Device not found")
