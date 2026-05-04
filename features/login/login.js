// Rotating background images

(function () {
    const box = document.getElementById("remember-link");
    const googleLink = document.getElementById("google-link");
    const discordLink = document.getElementById("discord-link");

    function updateRememberState() {
        const ischecked = box.checked ? '1' : '0';
        sessionStorage.setItem('remember_me', ischecked);

        updateOathLinks(ischecked);
    }

    function updateOathLinks(State) {
        const baseGoogle = googleLink.href.split('?')[0];
        const baseDiscord = discordLink.href.split('?')[0];

        googleLink.href = baseGoogle + '?remember=' + State;
        discordLink.href = baseDiscord + '?remember=' + State;
    }

    box.addEventListener('change', updateRememberState);
    
    googleLink.addEventListener('mouseenter', () => {
        updateOathLinks(sessionStorage.getItem('remember_me') || '0');
    });

    discordLink.addEventListener('mouseenter', () => {
        updateOathLinks(sessionStorage.getItem('remember_me') || '0');
    });

    updateRememberState();
})();

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