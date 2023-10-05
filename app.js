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
    "yeast", "zoned", "cause", "quick"
]
const guessContainer = document.querySelectorAll('.letter-box')
const keyLetter = document.querySelectorAll('.keyboard-btn')
const winStatus = document.querySelector('#winning-status')
const message = document.querySelector('.message')
let currentGuess = {
    word: [],
    position: []
};
let letterBoxNo = 0;
let word = ''
// Get a random word from list of words
let randomWord = getRandomWord();
// let randomWord = 'rooms'
console.log('guessing word', randomWord.toUpperCase());


// Refresh page when refresh button clicked
document.querySelector('#refresh').addEventListener('click', () => refreshPage())

// Adding event listener for keyboard buttons
keyLetter.forEach((char) => char.addEventListener('click', async (e) => handleInput(e)))

async function handleInput(e) {
    const letter = e.target.id
    writeInput(letter)
    validateInput(letter)
}

function refreshPage() {
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
    console.log('guessing word', randomWord.toUpperCase().split(''));
    document.getElementById('enter').disabled = false
    document.getElementById('delete').disabled = false
    word = ''
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
            // console.log(currentGuess.word.length);
            guessContainer[letterBoxNo].value = letter;
            guessContainer[letterBoxNo].classList.add('highlight');
            letterBoxNo += 1;
            currentGuess.word.push(letter)
            currentGuess.position.push(letterBoxNo)
        }
        if (currentGuess.word.length == 5) {
            console.log(currentGuess.word);
        }
    }

    if (letter === 'delete' && letterBoxNo > word.length) {
        guessContainer[letterBoxNo - 1].value = '';
        guessContainer[letterBoxNo - 1].classList.remove('highlight');
        letterBoxNo -= 1;
        currentGuess.word.pop()
        currentGuess.position.pop()
    }
}

async function validateInput(letter) {
    // when user clicks enter button
    if (letter === 'enter') {
        console.log('Guess', currentGuess.word.join(''));
        
        // Check if entered word is 5-letter word
        if (currentGuess.word.length < 5) {
            createMessage('Guess a 5 letter word')
            return
        }
        
        // check if word entered is a valid word
        const validateStatus = await validateWord(currentGuess.word.join(''))
        if (validateStatus) {
            createMessage('Enter a valid word')
            return
        }
        
        word += currentGuess.word.join('')
        console.log('word: ', word);
        // let answer = randomWord.toUpperCase().split('')
        var letterColor = '';
        // Iterate thru guess word 
        for (let i = 0; i < currentGuess.word.length; i++) {
            let guessLetter = currentGuess.word[i]
            let letterBoxPos = currentGuess.position[i]
            let guessLetterIndex = i;

            // To find indeces of all occurence of a letter 
            // https://stackoverflow.com/questions/3410464/how-to-find-indices-of-all-occurrences-of-one-string-in-another-in-javascript 
            const randomLetterIndices = [...randomWord.matchAll(new RegExp(guessLetter, 'gi'))].map(a => a.index);

            // Check for letter not found
            if (randomLetterIndices.length === 0) {
                console.log(`${guessLetter} not found in answer`);
                letterColor = 'gray'

                document.getElementById(guessLetter.toUpperCase()).classList.add('keyboard-gray')
                document.getElementById(guessLetter.toUpperCase()).classList.add('white-font')
            }
            // check for one time occurrance of letter
            else if (randomLetterIndices.length === 1) {
                let guessLetterIndices = [...currentGuess.word.join('').matchAll(new RegExp(guessLetter, 'gi'))].map(a => a.index);
                let tempPosition = 0
                let isAtSamePosition = false
                // checking if letter occurred once in guess word
                if (guessLetterIndices === 1) {
                    if (guessLetterIndex === randomLetterIndices[0]) {
                        console.log(`${guessLetter} is at same position as answer`);
                        letterColor = 'green';
                    } else {

                        console.log(`${guessLetter} is at different position as answer`);
                        letterColor = 'orange';
                    }
                } else {
                    // iterate duplicate letter in guess word to find correct position
                    for (let i = 0; i < guessLetterIndices.length; i++) {
                        if (guessLetterIndices[i] === randomLetterIndices[0]) {
                            tempPosition = i
                            isAtSamePosition = true
                        }
                    }
                    // same position check
                    if (guessLetterIndex === randomLetterIndices[0] && isAtSamePosition === true) {
                        console.log(`${guessLetter} is at same position as answer`);
                        letterColor = 'green'
                    }
                    if (guessLetterIndex !== randomLetterIndices[0] && isAtSamePosition === true) {
                        console.log(`${guessLetter} is at different and duplicate as answer`);
                        letterColor = 'gray'
                    }
                    if (guessLetterIndex !== randomLetterIndices[0] && isAtSamePosition === false) {
                        console.log(`${guessLetter} is at different as answer`);
                        if (guessLetterIndex === guessLetterIndices[0]) {
                            letterColor = 'orange'
                        } else {
                            letterColor = 'gray'
                        }
                    }
                }
            }
            // check for more than one occurrance of letter
            else if (randomLetterIndices.length > 1) {
                let isAtSamePosition = false;
                let tempIndex = 0
                for (let i = 0; i < randomLetterIndices.length; i++) {
                    if (guessLetterIndex === randomLetterIndices[i]) {
                        isAtSamePosition = true
                        tempIndex = guessLetterIndex
                    }
                }
                if (isAtSamePosition) {
                    console.log(`${guessLetter} at ${tempIndex} same as answer`);
                    letterColor = 'green';
                } else {
                    console.log(`${guessLetter} is at different position as answer`);
                    letterColor = 'orange'
                }
                tempIndex = 0
            }
            // color the letter according to position is correct or not
            console.log('letter color', letterColor + 'guessletter ', guessLetter);
            colorLetter(letterBoxPos, letterColor)
        }

        //All letters found 
        if (currentGuess.word.join('').toLowerCase() == randomWord) {
            console.log('You win');
            winStatus.textContent = 'You Won!!!'
            createWinStatus('green', 'orange')
            letterBoxNo = 0;
            currentGuess.word = [];
            currentGuess.position = [];
            document.getElementById('enter').disabled = true
            return
        }
        if (letterBoxNo > guessContainer.length - 1) {
            console.log('End of guesses');
            winStatus.textContent = `You Lost! Correct answer is ${randomWord.toUpperCase()}`
            createWinStatus('orange', 'green')
            return
        }
        currentGuess.word = [];
        currentGuess.position = [];
    }
}
function createMessage(text) {
    message.textContent = text
    message.classList.remove('hide')
    setTimeout(() => {
        message.classList.add('hide')
    }, 2000);
}
function createWinStatus(addColor, removeColor){
    winStatus.style.display = 'block'
    winStatus.classList.add('animate')
    winStatus.classList.add(addColor)
    winStatus.classList.remove(removeColor)
}
function colorLetter(position, letterColor){
    const letterPosition =  document.getElementById(position)
    letterPosition.classList.add(letterColor);
    letterPosition.classList.add('white-font');
    letterPosition.classList.add('flip-animate');
    letterPosition.classList.remove('highlight');
}