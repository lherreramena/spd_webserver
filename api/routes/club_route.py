from fastapi import APIRouter, HTTPException
from schemas.device_schema import DeviceCreate, DeviceOut
from services.device_service import *

router = APIRouter()
