import pyotp

def generate_mfa_secret():
    return pyotp.random_base32()