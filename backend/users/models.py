from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserRole(models.TextChoices):
    MANAGER = "manager", "Manager"
    DEFAULT_USER = "default_user", "Default User"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    mobile = models.CharField(max_length=20, blank=True)
    role = models.CharField(
        max_length=20, choices=UserRole.choices, default=UserRole.DEFAULT_USER
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"  # type: ignore

    class Meta:
        ordering = ["-created_at"]

    @property
    def is_manager(self):
        return self.role == UserRole.MANAGER


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
