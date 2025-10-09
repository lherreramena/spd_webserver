from fastapi import APIRouter, HTTPException
from schemas.user_schema import UserCreate, UserOut
from services.user_service import *

router = APIRouter()

@router.get("/", response_model=list[UserOut])
def list_users():
    return get_all_users()

@router.get("/{user_id}", response_model=UserOut)
def get_user_by_id(user_id: str):
    user = get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/", response_model=UserOut, status_code=201)
def add_user(user_data: UserCreate):
    return create_user(user_data)

@router.put("/{user_id}", response_model=UserOut)
def modify_user(user_id: str, user_data: UserCreate):
    user = update_user(user_id, user_data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{user_id}", status_code=204)
def remove_user(user_id: str):
    if not delete_user(user_id):
        raise HTTPException(status_code=404, detail="User not found")
