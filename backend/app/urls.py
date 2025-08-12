from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI

from users.api import router as auth_router

api = NinjaAPI(version="1.0.0")
api.add_router("/auth", auth_router)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
]
