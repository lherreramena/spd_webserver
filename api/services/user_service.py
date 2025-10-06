from models.user import User

import logging
logger = logging.getLogger(__name__)

users = {}

def get_all_users():
    return list(users.values())

def get_user(user_id):
    return users.get(user_id)

def create_user(data):
    user_id = str(len(users) + 1)
    user = User(user_id, data['name'], data['email'])
    users[user_id] = user
    return user

def update_user(user_id, data):
    if user_id in users:
        users[user_id].name = data['name']
        users[user_id].email = data['email']
        return users[user_id]
    return None

def delete_user(user_id):
    return users.pop(user_id, None)
