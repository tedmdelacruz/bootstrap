from ninja import Schema


class LoginSchema(Schema):
    username: str
    password: str


class RegisterSchema(Schema):
    username: str
    email: str
    password: str


class TokenSchema(Schema):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshSchema(Schema):
    refresh_token: str


class UserProfileSchema(Schema):
    id: int
    username: str
    email: str
    first_name: str = ""
    last_name: str = ""
    bio: str = ""
    mobile: str = ""
    role: str = "default_user"


class UpdateProfileSchema(Schema):
    email: str = None
    first_name: str = None
    last_name: str = None
    bio: str = None
    mobile: str = None
    role: str = None


class MessageSchema(Schema):
    message: str
