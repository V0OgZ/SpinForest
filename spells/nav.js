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

  if (code === 'GRUUM') {
    window.location.href = 'https://v0ogz.github.io/Heroes-of-Time/';
  } else {
    errorDiv.textContent = '✖ Rune incorrecte';
    audio.currentTime = 0;
    audio.play();
  }
}

// Affiche la scène d’intro au chargement
window.onload = () => navigate('scene-H');
