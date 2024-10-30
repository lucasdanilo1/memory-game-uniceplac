const grid = document.querySelector('.grid');
const spanPlayer = document.querySelector('.player');
const timer = document.querySelector('.timer');
const scoreDisplay = document.querySelector('.score'); // Seleciona o elemento de pontuação

const characters = [
  'cachorro',
  'cavalo',
  'cobra',
  'coruja',
  'esquilo',
  'macaco',
  'ovelha',
  'sapo',
  'tartaruga',
  'tubarao',
];

const createElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

let firstCard = '';
let secondCard = '';
let consecutiveHits = 0; // Contador para acertos consecutivos
let score = 0; // Variável para armazenar a pontuação

const updateScore = () => {
  if (consecutiveHits === 0) {
    score += 1; // Aumenta a pontuação em 1 pelo primeiro acerto
  } else if (consecutiveHits === 1) {
    score += 2; // Aumenta a pontuação em 2 por 2 acertos consecutivos
  } else if (consecutiveHits >= 2) {
    score += 3; // Aumenta a pontuação em 3 por 3 ou mais acertos consecutivos
  }
  consecutiveHits++; // Aumenta o contador de acertos consecutivos

  scoreDisplay.innerHTML = score; // Atualiza a pontuação na interface
  console.log(`Pontuação: ${score}`); // Para debug
}

const checkEndGame = () => {
  const disabledCards = document.querySelectorAll('.disabled-card');

  if (disabledCards.length === 20) {
    clearInterval(this.loop);

    // Armazenar pontuação e tempo no localStorage
    localStorage.setItem('finalScore', score);
    localStorage.setItem('finalTime', timer.innerHTML);

    // Redirecionar para a página de resultados
    window.location.href = 'resultado.html'; // Troque pelo nome do arquivo da nova página
  }
}

const checkCards = () => {
  const firstCharacter = firstCard.getAttribute('data-character');
  const secondCharacter = secondCard.getAttribute('data-character');

  if (firstCharacter === secondCharacter) {
    firstCard.firstChild.classList.add('disabled-card');
    secondCard.firstChild.classList.add('disabled-card');

    updateScore(); // Atualiza a pontuação

    firstCard = '';
    secondCard = '';

    checkEndGame();
  } else {
    consecutiveHits = 0; // Resetar o contador de acertos em caso de erro
    setTimeout(() => {
      firstCard.classList.remove('reveal-card');
      secondCard.classList.remove('reveal-card');

      firstCard = '';
      secondCard = '';
    }, 500);
  }
}

const revealCard = ({ target }) => {
  if (target.parentNode.className.includes('reveal-card')) {
    return;
  }

  if (firstCard === '') {
    target.parentNode.classList.add('reveal-card');
    firstCard = target.parentNode;
  } else if (secondCard === '') {
    target.parentNode.classList.add('reveal-card');
    secondCard = target.parentNode;

    checkCards();
  }
}

const createCard = (character) => {
  const card = createElement('div', 'card');
  const front = createElement('div', 'face front');
  const back = createElement('div', 'face back');

  front.style.backgroundImage = `url('../images/${character}.png')`;

  card.appendChild(front);
  card.appendChild(back);

  card.addEventListener('click', revealCard);
  card.setAttribute('data-character', character);

  return card;
}

const loadGame = () => {
  const duplicateCharacters = [...characters, ...characters];

  const shuffledArray = duplicateCharacters.sort(() => Math.random() - 0.5);

  shuffledArray.forEach((character) => {
    const card = createCard(character);
    grid.appendChild(card);
  });
}

const startTimer = () => {
  this.loop = setInterval(() => {
    const currentTime = +timer.innerHTML;
    timer.innerHTML = currentTime + 1;
  }, 1000);
}
const resetGame = () => {
  // Limpar o grid
  grid.innerHTML = '';

  // Redefinir variáveis de estado
  firstCard = '';
  secondCard = '';
  consecutiveHits = 0;
  score = 0;
  scoreDisplay.innerHTML = score; // Reinicia a pontuação na interface
  timer.innerHTML = '0'; // Reinicia o timer
}

const resetLocalStorage = () => {
  localStorage.removeItem('finalScore');
  localStorage.removeItem('finalTime');
}

// Adicione isso ao iniciar um novo jogo
const startNewGame = () => {
  resetLocalStorage(); // Limpa os dados do jogo anterior
  resetGame();
  startTimer();
  loadGame();
}
function goBack() {
  window.location.href = 'index.html'; // Redireciona para a página inicial do jogo
}



// Modifique a função window.onload
window.onload = () => {
  spanPlayer.innerHTML = localStorage.getItem('player');
  startNewGame(); // Chama a nova função para iniciar o jogo
}
