function togglePassword() {
    const input = document.getElementById('password');
    const close = document.getElementById('close-eye');
    const open = document.getElementById('open-eye');

    input.type = input.type === 'password' ? 'text' : 'password';

    if (input.type === 'password') {
        open.style.display = "none";
        close.style.display = "block";
    } else {
        close.style.display = "none";
        open.style.display = "block";
    }
}

function toggleConfirmPassword() {
    const input = document.getElementById('confirm-password');
    const close = document.getElementById('confirm-close-eye');
    const open = document.getElementById('confirm-open-eye');

    input.type = input.type === 'password' ? 'text' : 'password';

    if (input.type === 'password') {
        open.style.display = "none";
        close.style.display = "block";
    } else {
        close.style.display = "none";
        open.style.display = "block";
    }
}