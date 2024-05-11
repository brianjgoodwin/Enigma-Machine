// Global game state variables
let gameRunning = false;
let timerInterval = null;
let elapsedTime = 0;
let cipherText = "EXAMPLE CIPHER"; // Replace with dynamic cipher generation
let decipheredText = ""; // The correct solution to check against
let cipherInputs = []; // Will hold the input fields corresponding to the cipher characters

// Start or pause the game
function togglePlayPause() {
    const button = document.getElementById('play-pause-button');
    if (gameRunning) {
        clearInterval(timerInterval);
        button.textContent = 'Play';
    } else {
        timerInterval = setInterval(updateTimer, 1000);
        button.textContent = 'Pause';
    }
    gameRunning = !gameRunning;
}

// Reset the game
function resetGame() {
    gameRunning = false;
    clearInterval(timerInterval);
    document.getElementById('play-pause-button').textContent = 'Play';
    elapsedTime = 0;
    updateTimer();
    clearFeedback();
    cipherInputs.forEach(input => input.value = '');
}

// Update the timer display
function updateTimer() {
    elapsedTime++;
    const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
    const seconds = String(elapsedTime % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `Time: ${minutes}:${seconds}`;
}

// Check if the user's input matches the solution
function checkAnswers() {
    let userAnswer = cipherInputs.map(input => input.value.toUpperCase()).join('');
    if (userAnswer === decipheredText) {
        setFeedback('Congratulations! You solved it!', 'success');
    } else {
        setFeedback('Incorrect! Keep trying.', 'error');
    }
}

// Show feedback to the user
function setFeedback(message, status) {
    const feedback = document.getElementById('feedback-message');
    feedback.textContent = message;
    feedback.className = status;
}

// Clear the feedback area
function clearFeedback() {
    const feedback = document.getElementById('feedback-message');
    feedback.textContent = '';
    feedback.className = '';
}

// Provide a hint by revealing a letter
function giveHint() {
    // Find the first empty input field and reveal the correct character
    for (let i = 0; i < cipherInputs.length; i++) {
        if (cipherInputs[i].value === '') {
            cipherInputs[i].value = decipheredText[i];
            break;
        }
    }
}

// Initialize the game with specific character handling
function initializeGame() {
    decipheredText = "How now, brown cow?"; // Example static cipher for illustration
    const display = document.getElementById('cipher-display');
    display.innerHTML = '';

    decipheredText.split('').forEach(char => {
        const characterContainer = document.createElement('div');
        characterContainer.className = 'character-container';

        const p = document.createElement('p');
        p.className = 'cipher-character';
        p.textContent = char;
        characterContainer.appendChild(p);

        if (char.match(/[A-Za-z]/)) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'cipher-input';
            input.maxLength = 1;
            characterContainer.appendChild(input);
        } else {
            const span = document.createElement('span');
            span.className = 'non-editable';
            span.textContent = char === ' ' ? '_' : char; // Replace spaces with underscores
            characterContainer.appendChild(span);
        }

        display.appendChild(characterContainer);
    });
}

// Event listeners
document.getElementById('play-pause-button').addEventListener('click', togglePlayPause);
document.getElementById('reset-button').addEventListener('click', resetGame);
document.getElementById('check-answers-button').addEventListener('click', checkAnswers);
document.getElementById('hint-button').addEventListener('click', giveHint);

// Start the game initialization
initializeGame();
