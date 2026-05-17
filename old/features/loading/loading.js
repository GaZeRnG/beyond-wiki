import { animate, svg } from 'https://cdn.jsdelivr.net/npm/animejs@4.0.0/lib/anime.esm.min.js';

const loadingScreen = document.getElementById('loading-screen');
const finalLogo = document.getElementById('final-logo');
const loadingText = document.getElementById('loading-text');

document.body.style.overflow = 'hidden';

function startLoading() {
    animate(svg.createDrawable('.line'), {
        draw: ['0 0', '0 1', '1 1'],
        ease: 'inOutQuad',
        duration: 2500,
        loop: true,
        oncomplete: waitLoadAssets
    });
}

function waitLoadAssets() {
    const images = Array.from(document.querySelectorAll('img:not(#final-logo)')).filter(img => !img.complete);
    const total = images.length;

    loadingText.textContent = total > 0 ? 'Loading Resources' : 'Ready';

    let loaded = 0;
    
    images.forEach(img => {
        const done = () => {
            loaded++;
            if (loaded >= total) {
                loadingText.textContent = 'Ready';
                setTimeout(finishLoading, 500);
            }
        };
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
    });
}

function finishLoading() {
    loadingScreen.style.display = 'none';
    document.body.style.overflow = 'auto';
}

document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', startLoading) : startLoading();