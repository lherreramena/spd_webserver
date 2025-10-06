def serialize_device(device):
    return {
        'id': device.id,
        'type': device.type,
        'location': device.location
    }
