document.addEventListener('DOMContentLoaded', function() {

    // Like button
    document.querySelectorAll('.post-btn-like').forEach( btn_like => {

        if (user_is_authenticated()) {
            const post_container = btn_like.closest('.post-container')
            const post_id        = post_container.querySelector('.post-id').innerHTML
            const post_likes     = post_container.querySelector('.post-likes')

            // GET if post is liked
            fetch('/posts/' + post_id)
            .then(response => response.json())
            .then(post => {
                if (post.liked) {
                    post_container.querySelector('i').className = 'bi-heart-fill'
                    post_container.querySelector('i').style.color = '#f46d75'
                }
            });
            
            // PUT switch like state
            btn_like.addEventListener('click', (event) => {
                event.preventDefault();
                fetch('/posts/' + post_id, {
                    method: 'PUT'
                })

                likes = parseInt(post_likes.innerHTML);
                
                if (post_container.querySelector('i').className.includes('fill')) {
                    likes--;
                    post_container.querySelector('i').className = 'bi-heart'
                    post_container.querySelector('i').style.color = 'black'
                } else {
                    likes++;
                    post_container.querySelector('i').className = 'bi-heart-fill'
                    post_container.querySelector('i').style.color = '#f46d75'
                }
                post_likes.innerHTML = likes;
            });
        } else {
            btn_like.addEventListener('mouseover', () => {
                btn_like.style.backgroundColor = 'inherit'
            });
        }
        
        
    });

    // Edit button
    document.querySelectorAll('.post-edit').forEach( btn_edit => {
        btn_edit.addEventListener('click', (event) => {
            event.preventDefault(); 
            const post_container = btn_edit.closest('.post-container')
            const post_id        = post_container.querySelector('.post-id')
            const post_footer    = post_container.querySelector('.post-footer')
            const post_body      = post_container.querySelector('.post-body')
            
            btn_edit.style.display = 'none';
            post_body.style.display = 'none';

            const post_body_container = document.createElement('form');
            const post_btn_edit_done  = document.createElement('button');
            const new_post_body = document.createElement('textarea');
            post_body_container.className = 'post-edit-form'
            post_btn_edit_done.className  = 'btn btn-primary btn-sm mt-2 mb-2'
            post_btn_edit_done.type       = 'submit'
            post_btn_edit_done.innerHTML  = 'Edit'
            new_post_body.className       = 'post-edit-body form-control mt-1'
            new_post_body.innerHTML       = post_body.innerHTML
            
            post_body_container.append(new_post_body);
            post_body_container.append(post_btn_edit_done);
            post_container.insertBefore(post_body_container, post_footer);

            // Edit new body
            new_post_body.addEventListener('click', e => e.preventDefault());
            edit_form_filled(new_post_body, post_btn_edit_done);
            
            post_body_container.addEventListener('submit', event => {
                event.preventDefault();

                fetch('/posts/edit/' + parseInt(post_id.innerHTML), {
                    method: 'PUT',
                    body: JSON.stringify({
                        body: new_post_body.value
                    })
                })
                .then(response => response.json())
                .then(_ => {
                    post_body.innerHTML = new_post_body.value
                    post_body.style.display = 'block'
                    btn_edit.style.display  = 'block'
                    post_container.querySelector('.post-edit-form').remove()
                })

            })
        });
    });
    
});

function user_is_authenticated() {
    return document.querySelector('#user-id')
}

function edit_form_filled(textarea, btn_submit) {
    // Ensure body is filled 
    textarea.onkeyup = () => {
        if (textarea.value.length > 0) {
            btn_submit.disabled = false;
        } else {
            btn_submit.disabled = true;
        }
    }
} 