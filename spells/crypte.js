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
  const sound = document.getElementById("failSound");
  if (sound) sound.play().catch(() => {});
  const err = document.getElementById("err");
  if (err) err.innerText = "❌ Tatouage non activé. Revenez plus tard.";
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
