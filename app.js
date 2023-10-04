const listOfWords = [
    'about', 'above', 'actor', 'acute',
    'brown', 'build', 'built', 'chain',
    'chair', 'chart', 'chase', 'cheap',
    'check', 'rooms', 'sleek', "alert",
    "check", "roast", "toast", "shred",
    "cheek", "shock", "czech", "woman",
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
let guessingWord = getRandomWord();
// let guessingWord = 'rooms'
console.log('guessing word', guessingWord.toUpperCase());


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
    guessContainer.forEach((div) => {
        div.textContent = ''
        div.classList.remove('orange')
        div.classList.remove('green')
        div.classList.remove('gray')
        div.classList.remove('white-font')
        div.classList.remove('flip-animate')
        div.classList.remove('highlight')
        letterBoxNo = 0;
    })
    guessContainer[1].focus();
    keyLetter.forEach((key) => {
        key.classList.remove('keyboard-gray');
        key.classList.remove('white-font');
    })
    winStatus.innerHTML = ''
    winStatus.textContent = ''
    winStatus.style.display = 'none'
    currentGuess.word = [];
    currentGuess.position = [];
    guessingWord = getRandomWord()
    console.log('guessing word', guessingWord.toUpperCase().split(''));
    document.getElementById('enter').disabled = false
    document.getElementById('delete').disabled = false
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
        if(currentGuess.word.length == 5) {
            console.log(currentGuess.word);
        }
        // guessContainer[letterBoxNo].disabled = true
    }

    if (letter === 'delete' && letterBoxNo > word.length) {
        if (letterBoxNo <= 0) {
            document.getElementById('delete').disabled = true
            return
        }
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
            message.textContent = 'Guess a 5 letter word'
            message.classList.remove('hide')
            // message.classList.add('animate')
            console.log('Guess a 5 letters word');
            setTimeout(() => {
                message.classList.add('hide')
                // message.classList.remove('animate')
            }, 1000);
            return
        }
        // check if word entered is a valid word
        const validateStatus = await validateWord(currentGuess.word.join(''))
        console.log('not a valid word', validateStatus);
        if (validateStatus) {
            message.textContent = 'Enter a valid word'
            message.classList.remove('hide')
            console.log('Guess a 5 letters word');
            setTimeout(() => {
                message.classList.add('hide')
            }, 2000);
            return
        }
        word += currentGuess.word.join('')
        console.log('word: ', word);
        // let answer = guessingWord.toUpperCase().split('')
        var letterColor = '';
        // Iterate thru guess word 
        for (let i = 0; i < currentGuess.word.length; i++) {
            let guessLetter = currentGuess.word[i]
            let letterBoxPos = currentGuess.position[i]
            let guessLetterIndex = i;

            // To find indeces of all occurence of a letter 
            // https://stackoverflow.com/questions/3410464/how-to-find-indices-of-all-occurrences-of-one-string-in-another-in-javascript 
            const arrayOfIndices = [...guessingWord.matchAll(new RegExp(guessLetter, 'gi'))].map(a => a.index);

            // Check for letter not found
            if (arrayOfIndices.length === 0) {
                console.log(`${guessLetter} not found in answer`);
                letterColor = 'gray'

                document.getElementById(guessLetter.toUpperCase()).classList.add('keyboard-gray')
                document.getElementById(guessLetter.toUpperCase()).classList.add('white-font')
            }
            // check for one time occurrance of letter
            else if (arrayOfIndices.length === 1) {
                let guessArrayOfIndices = [...currentGuess.word.join('').matchAll(new RegExp(guessLetter, 'gi'))].map(a => a.index);
                let tempPosition = 0
                let isAtSamePosition = false
                // checking if letter occurred once in guess word
                if (guessArrayOfIndices === 1) {
                    if (guessLetterIndex === arrayOfIndices[0]) {
                        console.log(`${guessLetter} is at same position as answer`);
                        letterColor = 'green';
                    } else {

                        console.log(`${guessLetter} is at different position as answer`);
                        letterColor = 'orange';
                    }
                } else {
                    // iterate duplicate letter in guess word to find correct position
                    for (let i = 0; i < guessArrayOfIndices.length; i++) {
                        if (guessArrayOfIndices[i] === arrayOfIndices[0]) {
                            tempPosition = i
                            console.log('temp pos', tempPosition);
                            console.log('array index', arrayOfIndices);
                            isAtSamePosition = true
                        }
                    }
                    // same position
                    if (guessLetterIndex === arrayOfIndices[0] && isAtSamePosition === true) {
                        console.log(`${guessLetter} is at same position as answer`);
                        letterColor = 'green'
                    }
                    if (guessLetterIndex !== arrayOfIndices[0] && isAtSamePosition === true) {
                        console.log(`${guessLetter} is at different and duplicate as answer`);
                        letterColor = 'gray'
                    }
                    if (guessLetterIndex !== arrayOfIndices[0] && isAtSamePosition === false) {
                        console.log(`${guessLetter} is at different as answer`);
                        if (guessLetterIndex === guessArrayOfIndices[0]) {
                            letterColor = 'orange'
                        } else {
                            letterColor = 'gray'
                        }
                    }
                }
            }
            // check for more than one occurrance of letter
            else if (arrayOfIndices.length > 1) {
                let isAtSamePosition = false;
                let tempIndex = 0
                for (let i = 0; i < arrayOfIndices.length; i++) {
                    if (guessLetterIndex === arrayOfIndices[i]) {
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
            document.getElementById(letterBoxPos).classList.add(letterColor);
            document.getElementById(letterBoxPos).classList.add('white-font');
            document.getElementById(letterBoxPos).classList.add('flip-animate');
            document.getElementById(letterBoxPos).classList.remove('highlight');
        }

        //All letters found 
        if (currentGuess.word.join('').toLowerCase() == guessingWord) {
            console.log('You win');
            // document.getElementById('refresh').style.display = 'block';
            winStatus.textContent = 'You Won!!!'
            winStatus.style.display = 'block'
            winStatus.classList.add('animate')
            winStatus.classList.add('green')
            winStatus.classList.remove('orange')
            letterBoxNo = 0;
            currentGuess.word = [];
            currentGuess.position = [];
            document.getElementById('enter').disabled = true
            return
        }
        if (letterBoxNo > guessContainer.length - 1) {
            console.log('End of guesses');
            winStatus.textContent = `You Lost! Correct answer is ${guessingWord.toUpperCase()}`
            winStatus.style.display = 'block'
            winStatus.classList.add('animate')
            winStatus.classList.add('orange')
            winStatus.classList.remove('green')
            return
        }
        currentGuess.word = [];
        currentGuess.position = [];
    }
}