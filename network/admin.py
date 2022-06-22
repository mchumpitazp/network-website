from django.contrib import admin

# Register your models here.
from .models import User, Post, UserFollowers, PostLikes

class UserAdmin(admin.ModelAdmin):
  list_display = ("id", "username", "email")

class PostAdmin(admin.ModelAdmin):
    list_display = ("user", "body", "timestamp")

admin.site.register(User, UserAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(UserFollowers)
admin.site.register(PostLikes)