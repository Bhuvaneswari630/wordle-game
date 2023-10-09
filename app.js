const listOfWords = [
    'about', 'above', 'actor', 'acute',
    'brown', 'build', 'built', 'chain',
    'chair', 'chart', 'chase', 'cheap',
    'check', 'rooms', 'sleek', "alert",
    "check", "roast", "toast", "shred",
    "cheek", "shock", "think", "woman",
    "wreck", "court", "coast", "flake",
    "think", "smoke", "unrig", "slant",
    "ultra", "vague", "pouch", "radix",
    "yeast", "zoned", "cause", "quick",
    "still", "never", "sound", "hello",
    "world", "alloy", "allot", "baker",
    "borne", "broke", "charm", "candy",
    "depot", "debut", "early", "dwell",
    "gauze", "guest", "civic", "hover",
    "image", "argue", "adieu", "dream",
    "minor", "canoe", "audio", "twist"
]
const guessContainer = document.querySelectorAll('.letter-box')
const keyLetter = document.querySelectorAll('.keyboard-btn')
const winStatus = document.querySelector('#winning-status')
const message = document.querySelector('.message')
let guessSuccess = false
let winstatus = false
var currentGuess = {
    word: [],
    position: []
};
let letterBoxNo = 0;
let tryCount = 0;
let word = ''
let randomWord
// Get a random word from list of words
randomWord = getRandomWord();
console.log('guessing word', randomWord.toUpperCase());

// Refresh page when refresh button clicked
document.querySelector('#refresh').addEventListener('click', () => {
    refreshPage()
    return
})

// Adding event listener for keyboard button click
keyLetter.forEach((char) => char.addEventListener('click', async (e) => handleInput(e.target.id)))

// add event listener for key pressed in keyboard
document.addEventListener('keyup', async (e) => {
    // To add key press event and to find pressed key is a letter
    // https://www.freecodecamp.org/news/build-a-wordle-clone-in-javascript/
    let validKey = e.key.match(/[a-z]/gi)
    if (e.key === 'Backspace') {
        handleInput('delete')
        return
    } else if (e.key === 'Enter') {
        if (guessSuccess || tryCount > 6) {
            console.log('inside game end condition');
            return
        } else {
            handleInput('enter')
        }
    } else if (!validKey || validKey.length > 1) {
        return
    } else {
        handleInput(e.key.toUpperCase())
    }

})

async function handleInput(letter) {

    writeInput(letter)
    await validateInput(letter)
}

function getRandomWord() {
    let randomNo = Math.floor(Math.random() * listOfWords.length);
    return listOfWords[randomNo]
}
async function validateWord(word) {
    let failed = false;
    let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    if (response.status == '404') {
        failed = true
        console.log('Please enter valid english word');
    }
    return failed
}

function writeInput(letter) {
    // if alphabets entered
    if (letter !== 'delete' && letter !== 'enter' && letter !== 'refresh') {
        // Write only words length is less than 5
        if (currentGuess.word.length < 5) {
            displayLetter(letter)
        }
        if (currentGuess.word.length == 5) {
            console.log(currentGuess.word);
        }
    }
    // When user clicks delete button 
    if (letter === 'delete' && letterBoxNo > word.length) {
        deleteLetter()
    }
}
function displayLetter(letter) {
    guessContainer[letterBoxNo].value = letter;
    guessContainer[letterBoxNo].classList.add('highlight');
    letterBoxNo += 1;
    currentGuess.word.push(letter)
    currentGuess.position.push(letterBoxNo)
}
function deleteLetter() {
    guessContainer[letterBoxNo - 1].value = '';
    guessContainer[letterBoxNo - 1].classList.remove('highlight');
    letterBoxNo -= 1;
    currentGuess.word.pop()
    currentGuess.position.pop()
}
async function validateInput(letter) {
    // when user clicks enter button
    if (letter === 'enter') {
        console.log('Guess', currentGuess.word.join(''));
        document.querySelector('#enter').disabled = true
        document.querySelector('#enter').disabled = false
        // Check if entered word is 5-letter word
        if (currentGuess.word.length < 5) {
            showMessage('Guess a 5 letter word')
            return
        }

        // check if word entered is a valid word
        const validateStatus = await validateWord(currentGuess.word.join(''))
        if (validateStatus) {
            showMessage('Enter a valid word')
            return
        }

        word += currentGuess.word.join('')
        tryCount += 1;
        console.log('word: ', word + 'guess count number ', tryCount);
        var letterColor = '';

        validateLetter()

        //All letters found 
        allLettersMatch()
        //End of game and all letters incorrect
        endGame()
        currentGuess.word = [];
        currentGuess.position = [];

    }
}

function validateLetter() {
    // Iterate thru guess word 
    for (let i = 0; i < currentGuess.word.length; i++) {
        let guessLetter = currentGuess.word[i]
        let letterBoxPos = currentGuess.position[i]
        let guessLetterIndex = i;

        // To find indeces of all occurence of a letter 
        // https://stackoverflow.com/questions/3410464/how-to-find-indices-of-all-occurrences-of-one-string-in-another-in-javascript 
        const randomLetterIndices = [...randomWord.matchAll(new RegExp(guessLetter, 'gi'))].map(a => a.index);
        // Check for letter not found
        letterColor = letterNotFound(guessLetter, randomLetterIndices)
        // check for one time occurrance of letter
        if (randomLetterIndices.length === 1) {
            letterColor = oneTimeOccurrenceCheck(guessLetter, guessLetterIndex, randomLetterIndices)
        }
        // check for more than one occurrance of letter
        if (randomLetterIndices.length > 1) {
            letterColor = manyTimesOccurrenceCheck(guessLetterIndex, randomLetterIndices)
        }
        // color the letter according to position is correct or not
        console.log('letter color', letterColor + 'guessletter ', guessLetter);
        colorLetter(letterBoxPos, letterColor)
    }
}

function letterNotFound(guessLetter, randomLetterIndices) {
    // letterNotFound(randomLetterIndices)
    if (randomLetterIndices.length === 0) {
        letterColor = 'gray'
        const posNotFound = document.getElementById(guessLetter.toUpperCase())
        posNotFound.classList.add('keyboard-gray')
        posNotFound.classList.add('white-font')
        return letterColor
    }
}

function oneTimeOccurrenceCheck(guessLetter, guessLetterIndex, randomLetterIndices) {
    let guessLetterIndices = [...currentGuess.word.join('').matchAll(new RegExp(guessLetter, 'gi'))].map(a => a.index);
    let isAtSamePosition = false
    // checking if letter occurred once in guess word
    if (guessLetterIndices === 1) {
        if (guessLetterIndex === randomLetterIndices[0]) {
            letterColor = 'green';
        } else {
            letterColor = 'orange';
        }
    } else {
        // iterate duplicate letter in guess word to find correct position
        guessLetterIndices.forEach(index => {
            if (index === randomLetterIndices[0]) isAtSamePosition = true
        });

        // same position check
        if (guessLetterIndex === randomLetterIndices[0] && isAtSamePosition === true) {
            letterColor = 'green'
        }
        if (guessLetterIndex !== randomLetterIndices[0] && isAtSamePosition === true) {
            letterColor = 'gray'
        }
        if (guessLetterIndex !== randomLetterIndices[0] && isAtSamePosition === false) {
            if (guessLetterIndex === guessLetterIndices[0]) {
                letterColor = 'orange'
            } else {
                letterColor = 'gray'
            }
        }
    }
    return letterColor
}

function manyTimesOccurrenceCheck(guessLetterIndex, randomLetterIndices) {
    let isAtSamePosition = false;
    let tempIndex = 0
    for (let i = 0; i < randomLetterIndices.length; i++) {
        if (guessLetterIndex === randomLetterIndices[i]) {
            isAtSamePosition = true
            tempIndex = guessLetterIndex
        }
    }
    if (isAtSamePosition) {
        letterColor = 'green';
    } else {
        letterColor = 'orange'
    }
    tempIndex = 0
    return letterColor
}

function allLettersMatch() {
    if (currentGuess.word.join('').toLowerCase() == randomWord) {
        console.log('You win');
        winStatus.innerHTML = `<p>You Won!!! <i class="bi bi-trophy-fill"></i></p><p>Answer found in ${tryCount} ${tryCount > 1 ? 'guesses' : 'guess'}</p>`
        showWinStatus('green', 'orange')
        letterBoxNo = 0;
        currentGuess.word = [];
        currentGuess.position = [];
        document.getElementById('enter').disabled = true
        document.querySelector('#refresh').disabled = false
        guessSuccess = true
        return
    }
}

function endGame() {
    if (tryCount >= 6 && !guessSuccess) {
        console.log('End of guesses');
        tryCount += 1
        winStatus.textContent = `You Lost! Correct answer is ${randomWord.toUpperCase()}`
        showWinStatus('orange', 'green')
        document.getElementById('enter').disabled = true
        document.querySelector('#refresh').disabled = false
        return
    }
}

function showMessage(text) {
    console.log(text);
    message.textContent = text
    message.classList.remove('hide')
    setTimeout(() => {
        message.classList.add('hide')
    }, 1000)
}

function showWinStatus(addColor, removeColor) {
    winStatus.style.display = 'block'
    winStatus.classList.add('animate')
    winStatus.classList.add(addColor)
    winStatus.classList.remove(removeColor)
}

function colorLetter(position, letterColor) {
    const letterPosition = document.getElementById(position)
    letterPosition.classList.add(letterColor);
    letterPosition.classList.add('white-font');
    letterPosition.classList.add('flip-animate');
    letterPosition.classList.remove('highlight');
}

function refreshPage() {
    console.log('inside refresh');
    guessContainer.forEach((input) => {
        input.value = ''
        input.classList.remove('orange')
        input.classList.remove('green')
        input.classList.remove('gray')
        input.classList.remove('white-font')
        input.classList.remove('flip-animate')
        input.classList.remove('highlight')
        letterBoxNo = 0;
    })
    // guessContainer[0].focus();
    keyLetter.forEach((key) => {
        key.classList.remove('keyboard-gray');
        key.classList.remove('white-font');
    })
    winStatus.innerHTML = ''
    winStatus.textContent = ''
    winStatus.style.display = 'none'
    currentGuess.word = [];
    currentGuess.position = [];
    randomWord = getRandomWord()
    console.log('guessing word', randomWord.toUpperCase());
    document.getElementById('enter').disabled = false
    document.getElementById('delete').disabled = false
    word = ''
    tryCount = 0
    guessSuccess = false
    document.querySelector('#refresh').disabled = true
    document.querySelector('#refresh').disabled = false
}
