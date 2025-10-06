from flask import Blueprint, request, jsonify
from services.user_service import *
from schemas.user_schema import serialize_user

import logging
logger = logging.getLogger(__name__)

user_bp = Blueprint('user_bp', __name__)

@user_bp.route('/', methods=['GET'])
def list_users():
    return jsonify([serialize_user(u) for u in get_all_users()])

@user_bp.route('/<user_id>', methods=['GET'])
def get_user_by_id(user_id):
    user = get_user(user_id)
    return jsonify(serialize_user(user)) if user else ('User not found', 404)

@user_bp.route('/', methods=['POST'])
def add_user():
    user = create_user(request.json)
    return jsonify(serialize_user(user)), 201

@user_bp.route('/<user_id>', methods=['PUT'])
def modify_user(user_id):
    user = update_user(user_id, request.json)
    return jsonify(serialize_user(user)) if user else ('User not found', 404)

@user_bp.route('/<user_id>', methods=['DELETE'])
def remove_user(user_id):
    return ('User deleted', 204) if delete_user(user_id) else ('User not found', 404)
