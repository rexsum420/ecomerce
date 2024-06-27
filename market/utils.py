from django.contrib.auth.tokens import PasswordResetTokenGenerator

class EmailVerificationTokenGenerator(PasswordResetTokenGenerator):
    pass

email_verification_token = EmailVerificationTokenGenerator()

def trim_and_case(input_str):
    result = []
    for char in input_str:
        if char != ' ':
            result.append(char.lower())
    return ''.join(result)
