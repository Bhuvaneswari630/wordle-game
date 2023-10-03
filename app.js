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
let wordGuess = {
    word: [],
    position: []
};
let letterBoxNo = 0;
// Get a random word from list of words
let guessingWord = getRandomWord();
// let guessingWord = 'rooms'
console.log('guessing word', guessingWord.toUpperCase().split(''));


// Refresh page when refresh button clicked
document.querySelector('#refresh').addEventListener('click', (e) => refreshPage())

// Adding event listener for keyboard buttons
keyLetter.forEach((char) => char.addEventListener('click', async (e) => {
    // console.log(letterBoxNo);
    const letter = e.target.id

    if (letter !== 'delete' && letter !== 'enter') {
        if (wordGuess.word.length < 5) {
            // console.log(wordGuess.word.length);
            guessContainer[letterBoxNo].textContent = letter;
            // guessContainer[letterBoxNo].classList.add('gray')
            letterBoxNo += 1;
            wordGuess.word.push(letter)
            wordGuess.position.push(letterBoxNo)
        }
        console.log(wordGuess.word);

    }
    if (letter === 'delete') {
        guessContainer[letterBoxNo - 1].textContent = '';
        guessContainer[letterBoxNo - 1].classList.remove('gray')
        letterBoxNo -= 1;
        wordGuess.word.pop()
        wordGuess.position.pop()
    }
   
    // when user clicks enter button
    if (letter === 'enter') {
        console.log('Guess', wordGuess.word.join(''));
        // Check if entered word is 5-letter word
        if (wordGuess.word.length < 5) {
            console.log('Guess a 5 letters word');
            return
        }
        // check if word entered is a valid word
        const validateStatus = await validateWord(wordGuess.word.join(''))
        console.log('not a valid word', validateStatus);
        if (validateStatus) {
            let validStatusDiv = document.createElement('div')
            validStatusDiv.classList.add('popup-content')
            validStatusDiv.classList.add('alert')
            validStatusDiv.classList.add('alert-warning')
            validStatusDiv.textContent = 'Enter a valid word'
            document.querySelector('.grid-container').append(validStatusDiv)
            setTimeout(() => {
                validStatusDiv.classList.add('hide')
            }, 1000);
            return
        }

        // let answer = guessingWord.toUpperCase().split('')
        var letterColor = '';
        // Iterate thru guess word 
        for (let i = 0; i < wordGuess.word.length; i++) {
            let guessLetter = wordGuess.word[i]
            let letterBoxPos = wordGuess.position[i]
            // console.log('letter box position', letterBoxPos);
            // console.log(document.getElementById(letterBoxPos));
            let guessLetterIndex = i;
            // To find indeces of all occurence of a letter 
            // https://stackoverflow.com/questions/3410464/how-to-find-indices-of-all-occurrences-of-one-string-in-another-in-javascript 
            const arrayOfIndices = [...guessingWord.matchAll(new RegExp(guessLetter, 'gi'))].map(a => a.index);
            // console.log(arrayOfIndices);
            // console.log([...guessingWord.matchAll(new RegExp(guessLetter, 'gi'))]);

            // Check for letter not found
            if (arrayOfIndices.length === 0) {
                console.log(`${guessLetter} not found in answer`);
                letterColor = 'gray'
                document.getElementById(guessLetter.toUpperCase()).classList.add('gray')
            }
            // check for one time occurrance of letter
            else if (arrayOfIndices.length === 1) {
                let guessArrayOfIndices = [...wordGuess.word.join('').matchAll(new RegExp(guessLetter, 'gi'))].map(a => a.index);
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
            // document.getElementById(guessLetter).classList.add(letterColor);
        }

        //All letters found 
        if (wordGuess.word.join('').toLowerCase() == guessingWord) {
            console.log('You win');
            // document.getElementById('refresh').style.display = 'block';
            winStatus.textContent = 'You Win!!!'
            winStatus.style.display = 'block'
            winStatus.classList.add('animate')
            winStatus.classList.add('green')
            letterBoxNo = 0;
            wordGuess.word = [];
            wordGuess.position = [];
            return
        }
        if (letterBoxNo > guessContainer.length - 1) {
            console.log('End of guesses');
            // document.getElementById('refresh').style.display = 'block';
            // refreshPage()
            winStatus.innerHTML = `<p>You Lost!</p><p>Correct answer is ${guessingWord.toUpperCase()}</p>`
            winStatus.style.display = 'block'
            winStatus.classList.add('animate')
            winStatus.classList.add('orange')
            return
        }
        wordGuess.word = [];
        wordGuess.position = [];
    }

}))

function refreshPage() {
    guessContainer.forEach((div) => {
        div.textContent = ''
        div.classList.remove('orange')
        div.classList.remove('green')
        div.classList.remove('gray')
        div.classList.remove('white-font')
        div.classList.remove('flip-animate')
        letterBoxNo = 0;
    })
    keyLetter.forEach((key) => {
        key.classList.remove('gray');
    })
    winStatus.textContent = ''
    winStatus.style.display = 'none'
    wordGuess.word = [];
    wordGuess.position = [];
    guessingWord = getRandomWord()
    console.log('guessing word', guessingWord.toUpperCase().split(''));
}

function getRandomWord() {
    let randomNo = Math.floor(Math.random() * listOfWords.length);
    // console.log(randomNo);
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
