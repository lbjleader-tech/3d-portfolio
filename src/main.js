const scene = document.querySelector('.orbital-scene');

if (scene) {
  window.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 18;
    const y = (event.clientY / window.innerHeight - 0.5) * -18;

    scene.style.setProperty('--tilt-x', `${y}deg`);
    scene.style.setProperty('--tilt-y', `${x}deg`);
  });
}
