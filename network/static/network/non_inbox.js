document.addEventListener('DOMContentLoaded', function() {

    if (document.querySelector('.non-inbox-title').innerHTML === "Register") {
        document.querySelector('#btn-register').querySelector('i').className = "bi-person-plus-fill"
    } else {
        document.querySelector('#btn-register').querySelector('i').className = "bi-person-plus"
    }
});