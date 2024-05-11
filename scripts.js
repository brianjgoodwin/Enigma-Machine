let timer = null;
let elapsedTime = 0;
let decipheredText = '';
let cipherInputs = [];

function startTimer() {
    if (timer === null) {
        timer = setInterval(() => {
            elapsedTime++;
            displayTime();
        }, 1000);
    }
}

function pauseTimer() {
    if (timer !== null) {
        clearInterval(timer);
        timer = null;
    }
}

function resetTimer() {
    pauseTimer();
    elapsedTime = 0;
    displayTime();
}

function displayTime() {
    const timerElement = document.getElementById('timer');
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function togglePlayPause() {
    const playPauseButton = document.getElementById('play-pause-button');
    if (playPauseButton.textContent === 'Play') {
        startTimer();
        playPauseButton.textContent = 'Pause';
        revealPuzzle();
    } else {
        pauseTimer();
        playPauseButton.textContent = 'Play';
        coverPuzzle();
    }
}

function revealPuzzle() {
    document.getElementById('cipher-display').style.filter = 'none';
}

function coverPuzzle() {
    document.getElementById('cipher-display').style.filter = 'blur(5px)';
}

function initializeGame() {
    const samplePuzzle = "To be or not to be, that is the question.";
    const shiftAmount = 5; // Example shift amount for Caesar cipher
    const encryptedText = encrypt(samplePuzzle, shiftAmount);
    decipheredText = samplePuzzle.toUpperCase(); // Store the solution
    const display = document.getElementById('cipher-display');
    display.innerHTML = '';
    cipherInputs = [];

    encryptedText.split(' ').forEach((word, wordIndex) => {
        const wordContainer = document.createElement('div');
        wordContainer.className = 'word-container';

        word.split('').forEach((char, index) => {
            const characterContainer = document.createElement('div');
            characterContainer.className = 'character-container';

            const p = document.createElement('p');
            p.className = 'cipher-character';
            p.textContent = char;
            characterContainer.appendChild(p);

            if (char.match(/[A-Z]/)) {
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'cipher-input';
                input.maxLength = 1;
                input.addEventListener('input', function () {
                    if (this.value.length === this.maxLength) {
                        const nextInput = this.parentNode.nextElementSibling ? this.parentNode.nextElementSibling.querySelector('input') : null;
                        if (nextInput) {
                            nextInput.focus();
                        }
                    }
                });
                cipherInputs.push(input); // Store reference to inputs
                characterContainer.appendChild(input);
            } else {
                const span = document.createElement('span');
                span.className = 'non-editable';
                span.textContent = char === ' ' ? '_' : char; // Display spaces as underscores
                cipherInputs.push(null); // Align index without input
                characterContainer.appendChild(span);
            }

            wordContainer.appendChild(characterContainer);
        });

        display.appendChild(wordContainer);

        // Add space between words except for the last one
        if (wordIndex !== encryptedText.split(' ').length - 1) {
            const space = document.createElement('span');
            space.className = 'space';
            space.innerHTML = '&nbsp;';
            display.appendChild(space);
        }
    });
}

function encrypt(text, shift) {
    return text.toUpperCase().replace(/[A-Z]/g, char => {
        const charCode = char.charCodeAt(0);
        const shiftedCode = ((charCode - 65 + shift) % 26) + 65;
        return String.fromCharCode(shiftedCode);
    });
}

function checkAnswers() {
    let isCorrect = true;

    // Clear previous answers
    const correctAnswerDisplay = document.getElementById('correct-answer-display');
    const userAnswerDisplay = document.getElementById('user-answer-display');
    correctAnswerDisplay.innerHTML = '';
    userAnswerDisplay.innerHTML = '';

    // Concatenate cipher text and user input to ensure spaces are included
    let cipherText = '';
    let userInput = '';
    cipherInputs.forEach((input, index) => {
        const correctAnswer = decipheredText[index];
        cipherText += correctAnswer;
        if (input !== null) {
            const userAnswer = input.value.toUpperCase();
            userInput += userAnswer;
        } else {
            cipherText += ' '; // Add space to the cipher text for empty input (non-editable characters)
            userInput += ' '; // Add space for empty input (non-editable characters)
        }
    });

    // Update correct answer display
    const correctAnswerSpan = document.createElement('span');
    correctAnswerSpan.textContent = cipherText;
    correctAnswerDisplay.appendChild(correctAnswerSpan);

    // Update user's answer display
    const userAnswerSpan = document.createElement('span');
    userAnswerSpan.textContent = userInput;
    userAnswerDisplay.appendChild(userAnswerSpan);

    // Check if the user's answer matches the cipher text
    if (userInput !== cipherText) {
        isCorrect = false;
    }

    const feedbackElement = document.getElementById('feedback');
    if (isCorrect) {
        feedbackElement.textContent = "You solved it!";
        feedbackElement.className = 'feedback success';
    } else {
        feedbackElement.textContent = "Some letters are incorrect. Keep trying!";
        feedbackElement.className = 'feedback error';
    }
}

document.getElementById('check-answers-button').addEventListener('click', checkAnswers);
document.getElementById('reset-button').addEventListener('click', () => {
    resetTimer();
    initializeGame();
    const playPauseButton = document.getElementById('play-pause-button');
    playPauseButton.textContent = 'Play';
    coverPuzzle();
});

document.addEventListener('DOMContentLoaded', () => {
    resetTimer();
    coverPuzzle();
    initializeGame();
});
