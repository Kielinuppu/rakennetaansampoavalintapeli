const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const feedbackScreen = document.getElementById('feedback');
const startButton = document.getElementById('start-button');
const playAgainButton = document.getElementById('play-again-button');
const gameBoard = document.querySelector('.game-board');
const replayButton = document.getElementById('replay-sound');

const fruits = ['1', '2', '3', '4', '5', '6', '7'];
let currentFruit;
let score = 0;
let totalQuestions = 0;
let counters = {};
let previousFruit;

fruits.forEach(fruit => {
    counters[fruit] = 0;
});

function playSound(sound) {
    return new Promise(resolve => {
        const audio = new Audio(sound);
        audio.onended = resolve;
        audio.play();
    });
}

function showRandomFruit() {
    let newFruit;
    do {
        newFruit = fruits[Math.floor(Math.random() * fruits.length)];
    } while (newFruit === previousFruit);

    currentFruit = newFruit;
    previousFruit = currentFruit;
    totalQuestions++;
}

async function playFruitSound() {
    await playSound(`${currentFruit}.mp3`);
}

async function startGame() {
    document.getElementById('main-title').style.display = 'none';
    document.getElementById('game-title').style.display = 'block';
    startScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    showRandomFruit();
    await playSound('valitse.mp3');
    await playFruitSound();
}

function replayCurrentSound() {
    if (currentFruit) {
        playFruitSound();
    }
}

function checkAnswer(selectedFruit) {
    const selectedButton = document.querySelector(`.fruit-button[data-fruit="${selectedFruit}"]`);
    if (selectedFruit === currentFruit) {
        score++;
        counters[currentFruit]++;
        document.querySelector(`.counter[data-fruit="${currentFruit}"]`).textContent = counters[currentFruit];
        playSound('oikein.mp3');
    } else {
        playSound('vaarin.mp3');
        selectedButton.classList.add('incorrect');
        setTimeout(() => {
            selectedButton.classList.remove('incorrect');
        }, 300);
    }

    if (totalQuestions < 10) {
        setTimeout(async () => {
            showRandomFruit();
            await playFruitSound();
        }, 1000);
    } else {
        setTimeout(showFeedback, 1000);
    }
}

function showFeedback() {
    gameScreen.style.display = 'none';
    feedbackScreen.style.display = 'block';
    document.getElementById('score').textContent = `OIKEIN: ${score}/${totalQuestions}`;
    const starsContainer = document.getElementById('stars');
    starsContainer.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const star = document.createElement('img');
        star.src = 'tahti.png';
        star.alt = 'Tähti';
        starsContainer.appendChild(star);
    }
}

function resetGame() {
    document.getElementById('main-title').style.display = 'block';
    document.getElementById('game-title').style.display = 'none';
    score = 0;
    totalQuestions = 0;
    fruits.forEach(fruit => {
        counters[fruit] = 0;
        document.querySelector(`.counter[data-fruit="${fruit}"]`).textContent = '0';
    });
    feedbackScreen.style.display = 'none';
    startScreen.style.display = 'block';
    gameScreen.style.display = 'none';
    currentFruit = null;
    previousFruit = null;
}

startButton.addEventListener('click', startGame);
playAgainButton.addEventListener('click', resetGame);
replayButton.addEventListener('click', replayCurrentSound);

gameBoard.addEventListener('click', (e) => {
    if (e.target.classList.contains('fruit-button')) {
        checkAnswer(e.target.dataset.fruit);
    }
});