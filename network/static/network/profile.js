document.addEventListener('DOMContentLoaded', function() {
    navbar_profile_icon();
    profile_follow();
    
});

function user_is_authenticated() {
    return document.querySelector('#user-id')
}

function navbar_profile_icon() {
    document.querySelector('#btn-home')
            .querySelector('i').className = "bi-house"

    document.querySelector('#btn-following')
            .querySelector('i').className = "bi-box2-heart"

    if (document.querySelector('#user-username').innerHTML 
        == document.querySelector('#profile-username').innerHTML ) {
            document.querySelector('#btn-profile')
            .querySelector('i').className = "bi-person-fill"
        } else {
            document.querySelector('#btn-profile')
            .querySelector('i').className = "bi-person"
        }   
}

function profile_follow() {
    if (user_id = user_is_authenticated()) {
        const profile_id = document.querySelector('#profile-id').innerHTML;
        
        if (profile_id !== user_id.innerHTML) {

            document.querySelector('#profile-follow').style.display = 'none';
            document.querySelector('#profile-unfollow').style.display = 'none';
            
            fetch('/users/' + profile_id)
            .then(response => response.json())
            .then(profile_user => {
                if (profile_user.followed) {
                    document.querySelector('#profile-unfollow').style.display = 'block';
                } else {
                    document.querySelector('#profile-follow').style.display = 'block';
                } 
            })

            document.querySelector('#profile-unfollow').addEventListener('click', _ => {
                const profile_id = document.querySelector('#profile-id').innerHTML
                fetch('/users/' + profile_id, {
                    method: 'PUT'
                })
                .then(() => {
                    document.querySelector('#profile-unfollow').style.display = 'none';
                    document.querySelector('#profile-follow').style.display = 'block';
                })
                .then(() => {
                    let followers = parseInt(document.querySelector('#profile-followers').innerHTML);
                    followers--;
                    document.querySelector('#profile-followers').innerHTML = followers;
                });
            });

            document.querySelector('#profile-follow').addEventListener('click', _ => {
                const profile_id = document.querySelector('#profile-id').innerHTML
                fetch('/users/' + profile_id, {
                    method: 'PUT'
                })
                .then(() => {
                    document.querySelector('#profile-follow').style.display = 'none';
                    document.querySelector('#profile-unfollow').style.display = 'block';
                })
                .then(() => {
                    let followers = parseInt(document.querySelector('#profile-followers').innerHTML);
                    followers++;
                    document.querySelector('#profile-followers').innerHTML = followers;
                });
            });
        }
    }
}