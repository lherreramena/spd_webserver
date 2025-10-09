from pydantic import BaseModel

class DeviceCreate(BaseModel):
    type: str
    location: str

class DeviceOut(BaseModel):
    id: str
    type: str
    location: str
