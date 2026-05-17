document.addEventListener('DOMContentLoaded', dropfunction);
function dropfunction() {
    document.querySelectorAll(".drop").forEach(b => 
    b.onclick = () => b.nextElementSibling.classList.toggle("active")
    );
}