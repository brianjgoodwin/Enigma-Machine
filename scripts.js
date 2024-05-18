let timer = null;
let elapsedTime = 0;
let decipheredText = '';
let cipherInputs = [];

function startTimer() {
    elapsedTime = 0;  // Reset the timer each time the game starts
    if (timer === null) {
        timer = setInterval(() => {
            elapsedTime++;
            displayTime();  // Update the timer display every second
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
        setActionButtonsDisabled(false); // Enable buttons
    } else {
        pauseTimer();
        playPauseButton.textContent = 'Play';
        coverPuzzle();
        setActionButtonsDisabled(true); // Disable buttons
    }
}

function setActionButtonsDisabled(disabled) {
    document.getElementById('check-answers-button').disabled = disabled;
    document.getElementById('reset-button').disabled = disabled;
}

function revealPuzzle() {
    document.getElementById('cipher-display').classList.remove('blurred');
    document.querySelector('.action-buttons').classList.remove('blurred');
}

function coverPuzzle() {
    document.getElementById('cipher-display').classList.add('blurred');
    document.querySelector('.action-buttons').classList.add('blurred');
}

function initializeGame() {
    const samplePuzzle = "To be or not to be, that is the question.";
    const shiftAmount = 5;
    const encryptedText = encrypt(samplePuzzle, shiftAmount); // Encrypted for display
    decipheredText = createCipherText(samplePuzzle); // Cipher text for logical comparison
    console.log("Game is being initialized...");

    renderEncryptedText(encryptedText);
}

function createCipherText(text) {
    return text.toUpperCase().replace(/[^A-Z]/g, ''); // Removes non-alphabetic characters
}

function encrypt(text, shift) {
    return text.toUpperCase().replace(/[A-Z]/g, char => {
        const charCode = char.charCodeAt(0);
        const shiftedCode = ((charCode - 65 + shift) % 26) + 65;
        return String.fromCharCode(shiftedCode);
    });
}

function renderEncryptedText(encryptedText) {
    const display = document.getElementById('cipher-display');
    display.innerHTML = ''; // Clear previous content
    encryptedText.split(' ').forEach((word, wordIndex) => {
        const wordContainer = document.createElement('div');
        wordContainer.className = 'word-container';

        word.split('').forEach(char => {
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

function checkAnswers() {
    const userInput = Array.from(document.getElementsByClassName('cipher-input'))
        .map(input => input.value.toUpperCase())
        .join('');

    if (userInput === decipheredText) {
        updateFeedback("Congratulations! You solved it!", 'success');
    } else {
        updateFeedback("Incorrect, please try again.", 'error');
    }
}

function updateFeedback(message, type) {
    const feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = message;
    feedbackElement.className = 'feedback ' + type;
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

function startGame() {
    // Hide the landing cover
    document.getElementById('landing-cover').style.display = 'none';
    
    // Show the game container
    document.getElementById('game-container').style.display = 'block';
    
    // Start the timer
    startTimer();

    // Initialize the game (this function should prepare everything needed to start the game)
    initializeGame();  // Assume this function sets up the puzzle and resets any needed game state
}


function toggleHowToPlay() {
    var modal = document.getElementById('how-to-play-modal');
    if (modal.style.display === "none") {
        modal.style.display = "block";
    } else {
        modal.style.display = "none";
    }
}

function toggleSettings() {
    var modal = document.getElementById('settings-modal');
    modal.style.display = modal.style.display === "none" ? "block" : "none";
}

function toggleTimerVisibility() {
    var timer = document.getElementById('timer');
    timer.style.display = timer.style.display === "none" ? "block" : "none";
}

function toggleDummy() {
    console.log("Dummy function for showing similar characters toggled.");
}

function toggleDarkMode() {
    console.log("Dummy function for dark mode toggled.");
}
