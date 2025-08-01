function navigate(id) {
  document.querySelectorAll('.scene').forEach(scene => {
    scene.style.display = 'none';
  });
  const target = document.getElementById(id);
  if (target) target.style.display = 'block';
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

    // Animation de tremblement
    digipad.classList.add('shake');
    setTimeout(() => {
      digipad.classList.remove('shake');
    }, 500);
  }
}



// Affiche la scène d’intro au chargement
window.onload = () => navigate('scene-H');
function navigate(sceneId) {
  const scenes = document.querySelectorAll(".scene");
  scenes.forEach(scene => scene.style.display = "none");
  const target = document.getElementById(sceneId);
  if (target) target.style.display = "block";
}


function navigate(sceneId) {
  document.querySelectorAll('.scene').forEach(scene => {
    scene.style.display = 'none';
  });
  document.getElementById(sceneId).style.display = 'block';
}
window.onload = () => navigate('scene-H');
