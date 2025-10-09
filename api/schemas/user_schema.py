from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str

class UserOut(BaseModel):
    id: str
    name: str
    email: str
