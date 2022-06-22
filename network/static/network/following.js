document.addEventListener('DOMContentLoaded', function() {
    navbar_following_icon();
});

function navbar_following_icon() {
    document.querySelector('#btn-home')
            .querySelector('i').className = "bi-house"

    document.querySelector('#btn-following')
            .querySelector('i').className = "bi-box2-heart-fill"

    document.querySelector('#btn-profile')
            .querySelector('i').className = "bi-person"
}
