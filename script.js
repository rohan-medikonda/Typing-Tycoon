document.addEventListener('DOMContentLoaded', function() {
    const difficultyButtons = document.querySelectorAll('.difficulty-button');
    const paragraphElement = document.getElementById('paragraph');
    const typingArea = document.getElementById('typingArea');
    const gameSection = document.getElementById('gameSection');
    const gameOverSection = document.getElementById('gameOverSection');
    const scoreMessage = document.getElementById('scoreMessage');
    const playAgainButton = document.getElementById('playAgain');
    
    let paragraph = '';
    let currentLetterIndex = 0; // Track the index of the current letter
    let startTime;
    let endTime;

// Function to generate random paragraph with line breaks for readability
function generateRandomParagraph(difficulty) {
    const easyChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const mediumChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const hardChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';
    const paragraphLength = 100; // Desired paragraph length including spaces
    const charactersPerLine = 50; // Number of characters per line

    let selectedChars;
    switch (difficulty) {
        case 'easy':
            selectedChars = easyChars;
            break;
        case 'medium':
            selectedChars = mediumChars;
            break;
        case 'hard':
            selectedChars = hardChars;
            break;
        default:
            selectedChars = easyChars; // Default to easy level if difficulty is invalid
    }

    let result = '';
    for (let i = 0; i < paragraphLength; i++) {
        result += selectedChars.charAt(Math.floor(Math.random() * selectedChars.length));
        // Insert line break after every charactersPerLine characters
        if ((i + 1) % charactersPerLine === 0 && i !== paragraphLength - 1) {
            result += '\n';
        }
    }

    return result;
}

    // Function to update the displayed paragraph
    function updateParagraph(difficulty) {
        paragraph = generateRandomParagraph(difficulty);
        paragraphElement.textContent = paragraph;
        currentLetterIndex = 0; // Reset letter index to start highlighting from the beginning
        highlightCurrentLetter();
    }

    // Function to calculate words per minute (WPM)
    function calculateWPM() {
        const elapsedTime = (endTime - startTime) / 1000; // in seconds
        const wordsTyped = typingArea.value.trim().split(/\s+/).length;
        return Math.round((wordsTyped / elapsedTime) * 60);
    }

   function highlightCurrentLetter() {
    let highlightedText = '';
    for (let i = 0; i < paragraph.length; i++) {
        if (i === currentLetterIndex) {
            highlightedText += '<span class="highlight">' + paragraph.charAt(i) + '</span>';
        } else {
            highlightedText += paragraph.charAt(i);
        }
    }
    paragraphElement.innerHTML = highlightedText;
}

    // Event listeners for difficulty buttons
    difficultyButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const difficulty = button.id;
            updateParagraph(difficulty);
            typingArea.disabled = false; // Enable typing area
            typingArea.focus();
            startTime = new Date(); // Start tracking time
        });
    });

    // Event listener for typing area
    typingArea.addEventListener('input', function() {
        const typedChar = typingArea.value.charAt(typingArea.value.length - 1);
        const currentChar = paragraph.charAt(currentLetterIndex);
        
        if (typedChar === currentChar) {
            currentLetterIndex++; // Move to the next letter
            highlightCurrentLetter();

            // Check if the user has completed typing the entire paragraph
            if (currentLetterIndex >= paragraph.length) {
                finishGame(); // Call function to calculate score and display it
            } else {
                updateTypingFeedback(true); // Provide visual feedback for correct typing
            }
        } else {
            updateTypingFeedback(false); // Provide visual feedback for incorrect typing
            
            // Incorrect input, remove the last typed character
            typingArea.value = typingArea.value.slice(0, -1);
        }
    });

    // Function to provide visual feedback for correct/incorrect typing
    function updateTypingFeedback(isCorrect) {
        if (isCorrect) {
            typingArea.classList.remove('incorrect');
            typingArea.classList.add('correct');
        } else {
            typingArea.classList.remove('correct');
            typingArea.classList.add('incorrect');
        }
    }

   // Function to update the game over section with a fade-in effect
    function finishGame() {
        endTime = new Date(); // End tracking time
        const WPM = calculateWPM();
        scoreMessage.textContent = `Your score: ${WPM} WPM`;
        
        // Fade out the game section
        gameSection.style.opacity = '0';
        setTimeout(function() {
            gameSection.style.display = 'none';
            
            // Fade in the game over section
            gameOverSection.style.opacity = '1';
            gameOverSection.style.display = 'block';
        }, 500);
    }

// Event listener for Play Again button
playAgainButton.addEventListener('click', function() {
    // Reload the page
    location.reload();
});});