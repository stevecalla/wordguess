
let animateConfetti = document.querySelector('#confetti');
let lottiPlayerConfetti = document.querySelector('.confetti-lottiplayer-wrapper');

export function createConfetti() {
  for (let i = 0; i < 20; i++) {
    animateConfetti.innerHTML += `<div class='confetti'></div>`;
  }
  lottiPlayerConfetti.innerHTML = `
    <lottie-player
      src="https://assets8.lottiefiles.com/datafiles/U1I3rWEyksM9cCH/data.json"  
      background="transparent"  
      speed="1"  
      style="width: 300px; height: 300px"
      loop 
      autoplay>
    </lottie-player>`
  lottiPlayerConfetti.classList.remove('hidden');
  setTimeout(() => {
    animateConfetti.innerHTML = ``;
    // lottiPlayerConfetti.classList.add('hidden');
    lottiPlayerConfetti.innerHTML = ``;
  }, 5000);
}