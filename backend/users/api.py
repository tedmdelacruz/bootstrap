"""
User Authentication and Authorization API

This module provides comprehensive user authentication, profile management,
and role-based access control using JWT tokens.

## Authentication Classes:
- AuthBearer: Basic JWT authentication for any authenticated user
- ManagerAuthBearer: JWT authentication that only allows users with Manager role
- DefaultUserAuthBearer: JWT authentication that only allows users with DefaultUser role

## Role-Based Access Control:
Users have roles defined in UserRole enum (Manager, DefaultUser).
Use the appropriate auth class based on required access level:

Example usage:
    @router.get("/admin-only", auth=manager_auth)
    def admin_endpoint(request: HttpRequest):
        return {"message": "Manager access granted"}

    @router.get("/user-data", auth=default_user_auth)
    def user_endpoint(request: HttpRequest):
        return {"message": "Default user access granted"}

## Utility Functions:
- check_user_role(user, role): Check if user has specific role (returns bool)
- require_manager_role(user): Require manager role or raise HttpError
- require_role(user, role): Require specific role or raise HttpError
"""

import uuid
from datetime import datetime, timedelta

import jwt
from django.conf import settings
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import HttpRequest
from ninja import Router
from ninja.errors import HttpError
from ninja.security import HttpBearer

from .models import Profile, UserRole
from .schema import (
    LoginSchema,
    MessageSchema,
    RefreshSchema,
    RegisterSchema,
    TokenSchema,
    UpdateProfileSchema,
    UserProfileSchema,
)

router = Router()


class AuthBearer(HttpBearer):
    """Base authentication class that validates JWT tokens and returns the user."""

    def authenticate(self, request, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
            if user_id:
                user = User.objects.get(id=user_id)
                return user
        except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
            pass
        return None


class ManagerAuthBearer(HttpBearer):
    """Authentication class that only allows users with Manager role access."""

    def authenticate(self, request, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
            if user_id:
                user = User.objects.get(id=user_id)
                if user.profile.is_manager:
                    return user
        except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
            pass
        return None


class DefaultUserAuthBearer(HttpBearer):
    """Authentication class that only allows users with DefaultUser role access."""

    def authenticate(self, request, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user_id = payload.get("user_id")
            if user_id:
                user = User.objects.get(id=user_id)
                if not user.profile.is_manager:
                    return user
        except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
            pass
        return None


# Authentication instances
auth_bearer = AuthBearer()
manager_auth = ManagerAuthBearer()
default_user_auth = DefaultUserAuthBearer()


def check_user_role(user, required_role: UserRole) -> bool:
    """Check if user has the required role."""
    if not user:
        return False
    profile, _ = Profile.objects.get_or_create(user=user)
    return profile.role == required_role


def require_manager_role(user) -> bool:
    """Check if user has manager role, raise HttpError if not."""
    if not user:
        raise HttpError(401, "Authentication required")

    profile, _ = Profile.objects.get_or_create(user=user)
    if not profile.is_manager:
        raise HttpError(403, "Manager role required")
    return True


def require_role(user, required_role: UserRole) -> bool:
    """Check if user has specific role, raise HttpError if not."""
    if not user:
        raise HttpError(401, "Authentication required")

    profile, _ = Profile.objects.get_or_create(user=user)
    if profile.role != required_role:
        raise HttpError(403, f"{required_role.label} role required")
    return True


def generate_tokens(user):
    access_payload = {
        "user_id": user.id,
        "username": user.username,
        "exp": datetime.utcnow() + timedelta(hours=1),
        "iat": datetime.utcnow(),
    }

    refresh_payload = {
        "user_id": user.id,
        "type": "refresh",
        "exp": datetime.utcnow() + timedelta(days=7),
        "iat": datetime.utcnow(),
        "jti": str(uuid.uuid4()),
    }

    access_token = jwt.encode(access_payload, settings.SECRET_KEY, algorithm="HS256")
    refresh_token = jwt.encode(refresh_payload, settings.SECRET_KEY, algorithm="HS256")

    return TokenSchema(access_token=access_token, refresh_token=refresh_token)


@router.post("/login", response=TokenSchema)
def login_user(request: HttpRequest, data: LoginSchema):
    user = authenticate(username=data.username, password=data.password)
    if not user:
        raise HttpError(401, "Invalid credentials")

    return generate_tokens(user)


@router.post("/register", response=TokenSchema)
def register_user(request: HttpRequest, data: RegisterSchema):
    if User.objects.filter(username=data.username).exists():
        raise HttpError(400, "Username already exists")

    if User.objects.filter(email=data.email).exists():
        raise HttpError(400, "Email already exists")

    user = User.objects.create_user(
        username=data.username, email=data.email, password=data.password
    )

    Profile.objects.get_or_create(user=user)

    return generate_tokens(user)


@router.get("/profile", response=UserProfileSchema, auth=auth_bearer)
def get_profile(request: HttpRequest):
    user = request.auth

    profile, created = Profile.objects.get_or_create(user=user)

    return UserProfileSchema(
        id=user.id,
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        bio=profile.bio,
        mobile=profile.mobile,
        role=profile.role,
    )


@router.put("/profile", response=UserProfileSchema, auth=auth_bearer)
def update_profile(request: HttpRequest, data: UpdateProfileSchema):
    user = request.auth

    if data.email:
        if User.objects.filter(email=data.email).exclude(id=user.id).exists():
            raise HttpError(400, "Email already exists")
        user.email = data.email

    if data.first_name:
        user.first_name = data.first_name

    if data.last_name:
        user.last_name = data.last_name

    user.save()

    profile, _ = Profile.objects.get_or_create(user=user)

    if data.bio:
        profile.bio = data.bio

    if data.mobile:
        profile.mobile = data.mobile

    if data.role:
        profile.role = data.role

    profile.save()

    return UserProfileSchema(
        id=user.id,
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        bio=profile.bio,
        mobile=profile.mobile,
        role=profile.role,
    )


@router.post("/refresh", response=TokenSchema)
def refresh_token(request: HttpRequest, data: RefreshSchema):
    try:
        payload = jwt.decode(
            data.refresh_token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        if payload.get("type") != "refresh":
            raise HttpError(401, "Invalid token type")

        user_id = payload.get("user_id")
        user = User.objects.get(id=user_id)
        return generate_tokens(user)
    except (jwt.ExpiredSignatureError, jwt.DecodeError, User.DoesNotExist):
        raise HttpError(401, "Invalid refresh token")


@router.post("/logout", response=MessageSchema, auth=auth_bearer)
def logout_user(request: HttpRequest):
    return MessageSchema(message="Successfully logged out")


@router.get("/users", response=list[UserProfileSchema], auth=manager_auth)
def list_all_users(request: HttpRequest):
    users = User.objects.select_related("profile").all()
    return [
        UserProfileSchema(
            id=user.id,
            username=user.username,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            bio=user.profile.bio,
            mobile=user.profile.mobile,
            role=user.profile.role,
        )
        for user in users
    ]


@router.get("/user/me", response=UserProfileSchema, auth=auth_bearer)
def get_current_user_info(request: HttpRequest):
    user = request.auth
    return UserProfileSchema(
        id=user.id,
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        bio=user.profile.bio,
        mobile=user.profile.mobile,
        role=user.profile.role,
    )
