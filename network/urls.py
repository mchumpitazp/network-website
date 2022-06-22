
from django.urls import path

from . import views

urlpatterns = [
    # Navbar routes
    path("", views.index, name="index"),
    path("following", views.following, name="following"),
    path("profile/<int:profile_id>", views.profile, name="profile"),

    # User account routes
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("posts", views.compose, name="compose"),
    path("posts/<int:post_id>", views.post_likes, name="post_likes"),
    path("posts/edit/<int:post_id>", views.edit, name="edit"),
    path("users/<int:user_id>", views.user_followers, name="user_followers"),
]
