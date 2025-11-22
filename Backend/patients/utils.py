from cryptography.fernet import Fernet
from django.conf import settings

def get_fernet():
    return Fernet(settings.ENCRYPTION_KEY.encode())

def encrypt_data(data):
    if not data:
        return None
    f = get_fernet()
    return f.encrypt(data.encode()).decode()

def decrypt_data(data):
    if not data:
        return None
    f = get_fernet()
    return f.decrypt(data.encode()).decode()
