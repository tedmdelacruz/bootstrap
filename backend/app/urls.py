from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI

api = NinjaAPI()
# Add your own API routers here

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),
]
