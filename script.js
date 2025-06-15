let bugs = [];
let collectedBugs = JSON.parse(localStorage.getItem('collectedBugs')) || [];
let currentSoundBug = null;

async function fetchBugs() {
  try {
    const response = await fetch('http://localhost:3000/bugs');
    bugs = await response.json();
  } catch (error) {
    console.error('Error fetching bugs:', error);
    bugs = [
      { id: 'ladybug', name: 'Ladybug', fact: 'Ladybugs have 7 spots!', image: 'assets/images/ladybug.png', sound: 'assets/sounds/ladybug.mp3' },
      { id: 'butterfly', name: 'Butterfly', fact: 'Butterflies taste with their feet!', image: 'assets/images/butterfly.png', sound: 'assets/sounds/butterfly.mp3' },
      { id: 'bee', name: 'Bee', fact: 'Bees dance to communicate!', image: 'assets/images/bee.png', sound: 'assets/sounds/bee.mp3' },
    ];
  }
}

function startGame() {
  document.getElementById('start-screen').classList.remove('active');
  document.getElementById('game-screen').classList.add('active');
  setupInteractions();
}

function showStartScreen() {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById('start-screen').classList.add('active');
}

function showGameScreen() {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById('game-screen').classList.add('active');
}

function setupInteractions() {
  document.querySelectorAll('.interactive').forEach(element => {
    element.addEventListener('click', () => revealBug(element));
    element.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') revealBug(element);
    });
  });
}

function revealBug(element) {
  const bugId = element.dataset.bug;
  const bug = bugs.find(b => b.id === bugId);
  if (bug) {
    document.getElementById('bug-name').textContent = bug.name;
    document.getElementById('bug-fact').textContent = bug.fact;
    document.getElementById('bug-image').src = bug.image;
    document.getElementById('fact-card').style.display = 'flex';
    element.style.display = 'none';
  }
}

function collectBug() {
  const bugName = document.getElementById('bug-name').textContent;
  const bug = bugs.find(b => b.name === bugName);
  if (bug && !collectedBugs.some(cb => cb.id === bug.id)) {
    collectedBugs.push(bug);
    localStorage.setItem('collectedBugs', JSON.stringify(collectedBugs));
    alert(`${bug.name} added to your jar!`);
  }
  closeFactCard();
}

function closeFactCard() {
  document.getElementById('fact-card').style.display = 'none';
}

function showSoundMatch() {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById('sound-match').classList.add('active');
  setupSoundMatch();
}

function setupSoundMatch() {
  currentSoundBug = bugs[Math.floor(Math.random() * bugs.length)];
  const options = [currentSoundBug, ...getRandomBugs(2, currentSoundBug)];
  shuffleArray(options);

  const optionsDiv = document.getElementById('bug-options');
  optionsDiv.innerHTML = '';
  options.forEach(bug => {
    const img = document.createElement('img');
    img.src = bug.image;
    img.alt = bug.name;
    img.addEventListener('click', () => checkSoundMatch(bug));
    optionsDiv.appendChild(img);
  });

  document.getElementById('play-sound').onclick = () => {
    const audio = new Audio(currentSoundBug.sound);
    audio.play();
  };
}

function checkSoundMatch(bug) {
  const feedback = document.getElementById('sound-feedback');
  if (bug.id === currentSoundBug.id) {
    feedback.textContent = 'Correct! Great job!';
    feedback.style.color = 'green';
  } else {
    feedback.textContent = 'Try again!';
    feedback.style.color = 'red';
  }
}

function getRandomBugs(count, excludeBug) {
  const available = bugs.filter(b => b.id !== excludeBug.id);
  const result = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * available.length);
    result.push(available.splice(randomIndex, 1)[0]);
  }
  return result;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function showBugBook() {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById('bug-book').classList.add('active');
  const content = document.getElementById('book-content');
  content.innerHTML = '';
  collectedBugs.forEach(bug => {
    const card = document.createElement('div');
    card.className = 'bug-card';
    card.innerHTML = `
      <h3>${bug.name}</h3>
      <img src="${bug.image}" alt="${bug.name}">
      <p>${bug.fact}</p>
    `;
    content.appendChild(card);
  });
}

function showJar() {
  document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
  document.getElementById('bug-jar').classList.add('active');
  const content = document.getElementById('jar-content');
  content.innerHTML = '';
  collectedBugs.forEach(bug => {
    const card = document.createElement('div');
    card.className = 'bug-card';
    card.innerHTML = `
      <img src="${bug.image}" alt="${bug.name}">
      <p>${bug.name}</p>
    `;
    content.appendChild(card);
  });
  document.getElementById('jar-count').textContent = `You have ${collectedBugs.length} bugs in your jar!`;
}

window.onload = async () => {
  await fetchBugs();
  showStartScreen();
};
