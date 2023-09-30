const listOfWords = [
    'about',
    'above',
    'actor',
    'acute',
    'brown',
    'build',
    'built',
    'chain',
    'chair',
    'chart',
    'chase',
    'cheap',
    'check',
    'rooms',
    'sleek'
]
function getRandomWord() {
    let randomNo = Math.floor(Math.random() * listOfWords.length);
    // console.log(randomNo);
    return listOfWords[randomNo]
}
function main() {
    let letterBoxNo = 0;
    // Get a random word from list of words
    let guessingWord = getRandomWord();
    // let guessingWord = 'rooms'
    console.log('guessing word', guessingWord.toUpperCase().split(''));
    const guessContainer = document.querySelectorAll('.letter-box')
    // console.log(guessContainer.length);
    const keyLetter = document.querySelectorAll('.keyboard-btn')
    let wordGuess = {
        word: [],
        position: []
    };
    function refreshPage() {
        document.querySelectorAll('.keyboard-btn').forEach((btn) => btn.disabled = false)
        guessContainer.forEach((div) => {
            div.textContent = ''
            div.classList.remove('orange')
            div.classList.remove('green')
            div.classList.remove('gray')
            letterBoxNo = 0;
            // document.getElementById('refresh').style.display = 'block';
        })
        keyLetter.forEach((key) => {
            key.classList.remove('gray');
        })
        wordGuess.word = [];
        wordGuess.position = [];
        guessingWord = getRandomWord()
        console.log('guessing word', guessingWord.toUpperCase().split(''));
    }
    // Refresh page when refresh button clicked
    document.querySelector('#refresh').addEventListener('click', (e) => refreshPage())
    // Adding event listener for keyboard buttons
    keyLetter.forEach((char) => char.addEventListener('click', (e) => {
        // console.log(letterBoxNo);
        const letter = e.target.id

        if (letter !== 'delete' && letter !== 'enter') {
            if (wordGuess.word.length < 5) {
                // console.log(wordGuess.word.length);
                guessContainer[letterBoxNo].textContent = letter;
                // guessContainer[letterBoxNo].classList.add('gray')
                // disable letter from keyboard if occurrence is one time
                let noOccurrence = [...guessingWord.matchAll(new RegExp(letter, 'gi'))].map(a => a.index)
                if (noOccurrence.length === 1) {
                    // console.log(`no of occurrence of letter ${letter} is 1`);
                    document.getElementById(letter).disabled = true
                }
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
        if (letter === 'enter') {
            console.log('Guess', wordGuess.word.join(''));
            // console.log('Guess position', wordGuess.position);
            document.querySelectorAll('.keyboard-btn').forEach((btn) => btn.disabled = false)
            if (wordGuess.word.length < 5) {
                console.log('Guess a 5 letters word');
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
                const arrayOfIndexes = [...guessingWord.matchAll(new RegExp(guessLetter, 'gi'))].map(a => a.index);
                // console.log(arrayOfIndexes);
                // console.log([...guessingWord.matchAll(new RegExp(guessLetter, 'gi'))]);

                // Check for letter not found
                if (arrayOfIndexes.length === 0) {
                    console.log(`${guessLetter} not found in answer`);
                    letterColor = 'gray'
                    document.getElementById(guessLetter.toUpperCase()).classList.add('gray')
                }
                // check for one time occurrance of letter
                else if (arrayOfIndexes.length === 1) {
                    if (guessLetterIndex === arrayOfIndexes[0]) {
                        console.log(`${guessLetter} is at same position as answer`);
                        letterColor = 'green';
                    } else {
                        
                        console.log(`${guessLetter} is at different position as answer`);
                        letterColor = 'orange';
                    }
                }

                // check for more than one occurrance of letter
                else if (arrayOfIndexes.length > 1) {
                    isAtSamePosition = false;
                    let tempIndex = 0
                    for (let i = 0; i < arrayOfIndexes.length; i++) {
                        if (guessLetterIndex === arrayOfIndexes[i]) {
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
                console.log('letter color', letterColor);
                document.getElementById(letterBoxPos).classList.add(letterColor);
            }
            //All letters found 
            if (wordGuess.word.join('').toLowerCase() == guessingWord) {
                console.log('You win');
                document.getElementById('refresh').style.display = 'block';
                letterBoxNo = 0;
                wordGuess.word = [];
                wordGuess.position = [];
                return
            }
            if (letterBoxNo > guessContainer.length - 1) {
                console.log('End of guesses');
                document.getElementById('refresh').style.display = 'block';
                // refreshPage()
                return
            }
            wordGuess.word = [];
            wordGuess.position = [];
        }

    }))
}
main()