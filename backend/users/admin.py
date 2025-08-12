from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

from .models import Profile


class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = "Profile"
    fields = ("bio", "mobile", "role", "created_at", "updated_at")
    readonly_fields = ("created_at", "updated_at")


class CustomUserAdmin(UserAdmin):
    inlines = (ProfileInline,)
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "is_staff",
        "get_role",
        "get_is_manager",
    )
    list_filter = UserAdmin.list_filter + ("profile__role",)

    def get_role(self, obj):
        return (
            obj.profile.get_role_display() if hasattr(obj, "profile") else "No Profile"
        )

    get_role.short_description = "Role"

    def get_is_manager(self, obj):
        return obj.profile.is_manager if hasattr(obj, "profile") else False

    get_is_manager.boolean = True
    get_is_manager.short_description = "Is Manager"


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role", "mobile", "is_manager", "created_at", "updated_at")
    list_filter = ("role", "created_at")
    search_fields = ("user__username", "user__email", "mobile")
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        (None, {"fields": ("user", "role")}),
        ("Profile Information", {"fields": ("bio", "mobile")}),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )


# Unregister the original User admin and register our custom one
admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
