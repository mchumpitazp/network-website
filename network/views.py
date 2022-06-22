import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from .models import PostLikes, User, Post, UserFollowers


def index(request):
    posts = Post.objects.all()
    posts = posts.order_by("-timestamp").all()

    paginator = Paginator([post.serialize() for post in posts], 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    
    return render(request, "network/index.html", {'page_obj': page_obj})

@login_required
def following(request):
    following = UserFollowers.objects.filter(follower=request.user).values('user')
    posts = Post.objects.filter( user__in=following)
    posts = posts.order_by("-timestamp").all()

    paginator = Paginator([post.serialize() for post in posts], 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, "network/following.html", {'page_obj': page_obj})

@login_required
def profile(request, profile_id):
    profile_user = User.objects.get(pk=profile_id)
    posts = Post.objects.filter(user=profile_user)
    posts = posts.order_by("-timestamp").all()

    paginator = Paginator([post.serialize() for post in posts], 10)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Find out whether username is followed by current user
    followed  = None
    try:
        followed = UserFollowers.objects.get(user=profile_user, follower=request.user)
    except UserFollowers.DoesNotExist:
        pass

    if request.user.is_authenticated:
        return render(request, "network/profile.html", {
            'page_obj': page_obj,
            'profile_user': profile_user.serialize(),
            'profile_followed': (followed != None)
            })
    else:
        pass


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
@login_required
def compose(request):

    # Composing a new post must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # Get body of new post
    data = json.loads(request.body)
    body = data.get("body", "")

    # Create new post 
    new_post = Post(
        user=request.user,
        body=body,
    )
    new_post.save()

    return JsonResponse({"message": "New Post sent successfully."}, status=201)

@csrf_exempt
@login_required
def edit(request, post_id):

    # Composing a new post must be via POST
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required."}, status=400)

    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=400)

    # Get body of new post
    data = json.loads(request.body)
    body = data.get("body", "")

    # Get post object
    post.body = body
    post.save()
        
    return JsonResponse({"message": "Post edited successfully."}, status=201)
  

@csrf_exempt
def user_followers(request, user_id):

    # Get user object
    try:
        user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)

    # Find out whether profile user is followed by request user
    followed  = None
    if request.user.is_authenticated:
        try:
            followed = UserFollowers.objects.get(user=user, follower=request.user)
        except UserFollowers.DoesNotExist:
            pass

    # Return if is followed
    if request.method == "GET":
        return JsonResponse({
            "followed": (followed != None)
        }, status=201)

    # Switch between follow and unfollow
    elif request.method == "PUT":
        if None != followed:
            followed.delete()
        elif request.user.is_authenticated:
            UserFollowers(user=user, follower=request.user).save()
        return HttpResponse(status=204)

    # Must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)

@csrf_exempt
def post_likes(request, post_id):

    # Get post object
    try:
        post = Post.objects.get(pk=post_id)
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)

    # Find out whether user likes post
    liked = None
    if request.user.is_authenticated:
        try:
            liked = PostLikes.objects.get(user=request.user, post=post)
        except PostLikes.DoesNotExist: 
            pass
        
    # Return post likes and if liked
    if request.method == "GET":
        return JsonResponse({
            "liked": (liked != None)
        })

    # Switch between liked or not
    elif request.method == "PUT":
        if None != liked:
            liked.delete()
        else:
            PostLikes(user=request.user, post=post).save()
        return HttpResponse(status=204)

    # Must be via GET or PUT
    else:
        return JsonResponse({
            "error": "GET or PUT request required."
        }, status=400)
            

