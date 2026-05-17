function autoGrow(input, shadow) {
    shadow.textContent = input.value || input.placeholder;
  // clamp between min-width (6 rem) and Tailwind max-w utility
  const minW  = 15 * 16;
  const maxW  = input.classList.contains('title-input')  ? input.parentElement.clientWidth * 0.90
                                                       : input.parentElement.clientWidth * 0.30;
    const newW  = Math.max(minW, Math.min(shadow.offsetWidth + 8, maxW));
    input.style.width = newW + 'px';
}

document.querySelectorAll('.title-input, .author-input').forEach(inp => {
    const shadow = document.getElementById(inp.id + '-shadow');
    inp.addEventListener('input', () => autoGrow(inp, shadow));
  autoGrow(inp, shadow);
});