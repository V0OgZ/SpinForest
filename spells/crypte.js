const historyStack = [];

function navigate(id) {
  const scenes = document.querySelectorAll('.scene');
  scenes.forEach(scene => {
    scene.style.opacity = 0;
    setTimeout(() => scene.style.display = 'none', 800);
  });

  const target = document.getElementById(id);
  if (target) {
    target.style.display = 'flex';
    setTimeout(() => target.style.opacity = 1, 20);
    historyStack.push(id);
    window.history.pushState({ scene: id }, '', '#' + id);
  }
}

function rejectCode() {
  const code = document.getElementById('code').value.trim();
  const errorDiv = document.getElementById('err');
  const audio = document.getElementById('failSound');
  const digipad = document.querySelector('.digipad');

  if (code === 'GRUUM') {
    window.location.href = 'https://v0ogz.github.io/Heroes-of-Time/';
  } else {
    errorDiv.textContent = '✖ Rune incorrecte';
    audio.currentTime = 0;
    audio.play();
    digipad.classList.add('shake');
    setTimeout(() => digipad.classList.remove('shake'), 500);
  }
}


window.addEventListener("DOMContentLoaded", () => {
  const sceneId = window.location.hash.replace('#', '') || 'scene-H';
  const initial = document.getElementById(sceneId);
  if (initial) {
    initial.style.display = 'flex';
    setTimeout(() => initial.style.opacity = 1, 20);
    historyStack.push(sceneId);
  }
});

window.addEventListener('popstate', (event) => {
  const id = (event.state && event.state.scene) || 'scene-H';
  navigate(id);
});
