import json

import jwt
from django.conf import settings
from django.contrib.auth.models import User
from django.test import TestCase
from ninja.testing import TestClient

from users.api import router


class AuthAPITestCase(TestCase):
    def setUp(self):
        self.client = TestClient(router)
        self.test_user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
            first_name="Test",
            last_name="User",
        )

    def test_register_success(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "newpass123",
        }
        response = self.client.post("/register", json=data)

        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertIn("access_token", response_data)
        self.assertIn("refresh_token", response_data)
        self.assertEqual(response_data["token_type"], "bearer")

        self.assertTrue(User.objects.filter(username="newuser").exists())

    def test_register_duplicate_username(self):
        data = {
            "username": "testuser",
            "email": "different@example.com",
            "password": "newpass123",
        }
        response = self.client.post("/register", json=data)

        self.assertEqual(response.status_code, 400)
        self.assertIn("Username already exists", response.json()["detail"])

    def test_register_duplicate_email(self):
        data = {
            "username": "differentuser",
            "email": "test@example.com",
            "password": "newpass123",
        }
        response = self.client.post("/register", json=data)

        self.assertEqual(response.status_code, 400)
        self.assertIn("Email already exists", response.json()["detail"])

    def test_login_success(self):
        data = {"username": "testuser", "password": "testpass123"}
        response = self.client.post("/login", json=data)

        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertIn("access_token", response_data)
        self.assertIn("refresh_token", response_data)
        self.assertEqual(response_data["token_type"], "bearer")

    def test_login_invalid_credentials(self):
        data = {"username": "testuser", "password": "wrongpass"}
        response = self.client.post("/login", json=data)

        self.assertEqual(response.status_code, 401)
        self.assertIn("Invalid credentials", response.json()["detail"])

    def test_get_profile_success(self):
        login_data = {"username": "testuser", "password": "testpass123"}
        login_response = self.client.post("/login", json=login_data)
        token = login_response.json()["access_token"]

        response = self.client.get(
            "/profile", headers={"Authorization": f"Bearer {token}"}
        )

        self.assertEqual(response.status_code, 200)
        profile = response.json()
        self.assertEqual(profile["username"], "testuser")
        self.assertEqual(profile["email"], "test@example.com")
        self.assertEqual(profile["first_name"], "Test")
        self.assertEqual(profile["last_name"], "User")
        self.assertEqual(profile["bio"], "")
        self.assertEqual(profile["mobile"], "")
        self.assertEqual(profile["role"], "default_user")

    def test_get_profile_no_token(self):
        response = self.client.get("/profile")
        self.assertEqual(response.status_code, 401)

    def test_get_profile_invalid_token(self):
        response = self.client.get(
            "/profile", headers={"Authorization": "Bearer invalid_token"}
        )
        self.assertEqual(response.status_code, 401)

    def test_update_profile_success(self):
        login_data = {"username": "testuser", "password": "testpass123"}
        login_response = self.client.post("/login", json=login_data)
        token = login_response.json()["access_token"]

        update_data = {
            "email": "updated@example.com",
            "first_name": "Updated",
            "last_name": "Name",
            "bio": "Updated bio",
            "mobile": "+1234567890",
            "role": "manager",
        }
        response = self.client.put(
            "/profile", json=update_data, headers={"Authorization": f"Bearer {token}"}
        )

        self.assertEqual(response.status_code, 200)
        profile = response.json()
        self.assertEqual(profile["email"], "updated@example.com")
        self.assertEqual(profile["first_name"], "Updated")
        self.assertEqual(profile["last_name"], "Name")
        self.assertEqual(profile["bio"], "Updated bio")
        self.assertEqual(profile["mobile"], "+1234567890")
        self.assertEqual(profile["role"], "manager")

        user = User.objects.get(username="testuser")
        self.assertEqual(user.email, "updated@example.com")
        self.assertEqual(user.first_name, "Updated")
        self.assertEqual(user.last_name, "Name")
        self.assertEqual(user.profile.bio, "Updated bio")
        self.assertEqual(user.profile.mobile, "+1234567890")
        self.assertEqual(user.profile.role, "manager")

    def test_update_profile_duplicate_email(self):
        User.objects.create_user(
            username="otheruser", email="other@example.com", password="otherpass123"
        )

        login_data = {"username": "testuser", "password": "testpass123"}
        login_response = self.client.post("/login", json=login_data)
        token = login_response.json()["access_token"]

        update_data = {"email": "other@example.com"}
        response = self.client.put(
            "/profile", json=update_data, headers={"Authorization": f"Bearer {token}"}
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("Email already exists", response.json()["detail"])

    def test_refresh_token_success(self):
        login_data = {"username": "testuser", "password": "testpass123"}
        login_response = self.client.post("/login", json=login_data)
        refresh_token = login_response.json()["refresh_token"]

        refresh_data = {"refresh_token": refresh_token}
        response = self.client.post("/refresh", json=refresh_data)

        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertIn("access_token", response_data)
        self.assertIn("refresh_token", response_data)
        self.assertEqual(response_data["token_type"], "bearer")

    def test_refresh_token_invalid(self):
        refresh_data = {"refresh_token": "invalid_token"}
        response = self.client.post("/refresh", json=refresh_data)

        self.assertEqual(response.status_code, 401)
        self.assertIn("Invalid refresh token", response.json()["detail"])

    def test_refresh_token_wrong_type(self):
        access_payload = {
            "user_id": self.test_user.id,
            "username": self.test_user.username,
        }
        access_token = jwt.encode(
            access_payload, settings.SECRET_KEY, algorithm="HS256"
        )

        refresh_data = {"refresh_token": access_token}
        response = self.client.post("/refresh", json=refresh_data)

        self.assertEqual(response.status_code, 401)
        self.assertIn("Invalid token type", response.json()["detail"])

    def test_logout_success(self):
        login_data = {"username": "testuser", "password": "testpass123"}
        login_response = self.client.post("/login", json=login_data)
        token = login_response.json()["access_token"]

        response = self.client.post(
            "/logout", headers={"Authorization": f"Bearer {token}"}
        )

        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertEqual(response_data["message"], "Successfully logged out")

    def test_logout_no_token(self):
        response = self.client.post("/logout")
        self.assertEqual(response.status_code, 401)

    def test_logout_invalid_token(self):
        response = self.client.post(
            "/logout", headers={"Authorization": "Bearer invalid_token"}
        )
        self.assertEqual(response.status_code, 401)

    def test_user_role_functionality(self):
        login_data = {"username": "testuser", "password": "testpass123"}
        login_response = self.client.post("/login", json=login_data)
        token = login_response.json()["access_token"]

        response = self.client.get(
            "/profile", headers={"Authorization": f"Bearer {token}"}
        )
        profile = response.json()
        self.assertEqual(profile["role"], "default_user")


class RoleBasedAccessTestCase(TestCase):
    def setUp(self):
        self.client = TestClient(router)

        self.regular_user = User.objects.create_user(
            username="regular_user",
            email="regular@example.com",
            password="regularpass123",
            first_name="Regular",
            last_name="User",
        )
        self.regular_user.profile.role = "default_user"
        self.regular_user.profile.save()

        self.manager_user = User.objects.create_user(
            username="manager_user",
            email="manager@example.com",
            password="managerpass123",
            first_name="Manager",
            last_name="User",
        )
        self.manager_user.profile.role = "manager"
        self.manager_user.profile.save()

    def test_manager_only_access(self):
        login_data = {"username": "manager_user", "password": "managerpass123"}
        login_response = self.client.post("/login", json=login_data)
        manager_token = login_response.json()["access_token"]

        with self.subTest("Manager should able to view all users"):
            response = self.client.get(
                "/users", headers={"Authorization": f"Bearer {manager_token}"}
            )
            self.assertEqual(response.status_code, 200)
            users_data = response.json()
            self.assertIsInstance(users_data, list)

        with self.subTest("Regular users should not be able to view all users"):
            login_data = {"username": "regular_user", "password": "regularpass123"}
            login_response = self.client.post("/login", json=login_data)
            user_token = login_response.json()["access_token"]

            response = self.client.get(
                "/users", headers={"Authorization": f"Bearer {user_token}"}
            )
            self.assertEqual(response.status_code, 401)

    def test_get_current_user_info(self):
        login_data = {"username": "regular_user", "password": "regularpass123"}
        login_response = self.client.post("/login", json=login_data)
        user_token = login_response.json()["access_token"]

        response = self.client.get(
            "/user/me", headers={"Authorization": f"Bearer {user_token}"}
        )
        self.assertEqual(response.status_code, 200)
        self.assertIn("regular_user", response.json()["username"])
