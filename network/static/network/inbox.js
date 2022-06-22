document.addEventListener('DOMContentLoaded', function() {
    
    navbar_home_icon()

    if (user_is_authenticated()) {
        compose_form_filled();
        document.querySelector('#compose-body').value = "";
        document.querySelector('#compose-form').addEventListener('submit', send_post);
    }


});

function user_is_authenticated() {
    return document.querySelector('#user-username') != null
}

function navbar_home_icon() {
    document.querySelector('#btn-home')
            .querySelector('i').className = "bi-house-fill"

    if (user_is_authenticated()) {
        document.querySelector('#btn-following')
            .querySelector('i').className = "bi-box2-heart"

        document.querySelector('#btn-profile')
                .querySelector('i').className = "bi-person"
    } else {
        document.querySelector('#btn-register')
            .querySelector('i').className = "bi-person-plus"
    }

    
}

function compose_form_filled() {
    // Ensure new post is filled in order to post it
    document.querySelector('#compose-body').onkeyup = () => {
        if (document.querySelector('#compose-body').value.length > 0) {
            document.querySelector('#compose-submit').disabled = false;
        } else {
            document.querySelector('#compose-submit').disabled = true;
        }
    }
}

function send_post() {
    fetch('/posts', {
        method: 'POST',
        body: JSON.stringify({
            body: document.querySelector('#compose-body').value
        })
    })
    .then(response => response.json())
    .then(_ => {document.querySelector('#btn-home').click()})
}