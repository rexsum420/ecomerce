from cryptography.fernet import Fernet
import base64
import os
from dotenv import load_dotenv

load_dotenv()

if 'ENCRYPTION_KEY' not in os.environ:
    ENCRYPTION_KEY = Fernet.generate_key()
    os.environ['ENCRYPTION_KEY'] = ENCRYPTION_KEY.decode()
else:
    ENCRYPTION_KEY = os.environ.get('ENCRYPTION_KEY')

cipher_suite = Fernet(ENCRYPTION_KEY.encode())

def encrypt(string):
    if not isinstance(string, bytes):
        string = string.encode()
    encrypted_bytes = cipher_suite.encrypt(string)
    encrypted_string = base64.urlsafe_b64encode(encrypted_bytes).decode()
    return encrypted_string

def decrypt(encrypted_string):
    encrypted_bytes = base64.urlsafe_b64decode(encrypted_string)
    decrypted_bytes = cipher_suite.decrypt(encrypted_bytes)
    decrypted_string = decrypted_bytes.decode()
    return decrypted_string
