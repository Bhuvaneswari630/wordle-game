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
    'check'
]

function main() {
    let letterBoxNo = 0;
    let randomNo = Math.floor(Math.random() * listOfWords.length);
    console.log(randomNo);
    let guessingWord = listOfWords[randomNo]
    console.log('guessing word', guessingWord.toUpperCase().split(''));
    const guessContainer = document.querySelectorAll('.letter-box')
    console.log(guessContainer.length);
    const keyLetter = document.querySelectorAll('.keyboard-btn')
    let wordGuess = {
        word: [],
        position: []
    };
    // Refresh page
    document.querySelector('#refresh').addEventListener('click', (e) => {
        guessContainer.forEach((div) => {
            div.textContent = ''
            div.classList.remove('orange')
            div.classList.remove('green')
            div.classList.remove('gray')
            letterBoxNo = 0;
            document.getElementById('refresh').style.display = 'none';
        })
        keyLetter.forEach((key) => {
            key.classList.remove('gray');
        })
        randomNo = Math.floor(Math.random() * listOfWords.length);
        guessingWord = listOfWords[randomNo]
        console.log('guessing word', guessingWord.toUpperCase().split(''));
    })
    // Adding event listener for keyboard buttons
    keyLetter.forEach((char) => char.addEventListener('click', (e) => {
        console.log(letterBoxNo);
        const letter = e.target.id

        if (letter !== 'delete' && letter !== 'enter') {
            guessContainer[letterBoxNo].textContent = letter;
            guessContainer[letterBoxNo].classList.add('gray')
            letterBoxNo += 1;
            wordGuess.word.push(letter)
            wordGuess.position.push(letterBoxNo)
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
            console.log('first guess', wordGuess.word.join(''));
            console.log('first guess position', wordGuess.position);

            if (wordGuess.word.length < 5) {
                console.log('Guess a 5 letters word');
                return
            }
            let answer = guessingWord.toUpperCase().split('')
            // if letter not found in answer
            for (let i = 0; i < wordGuess.word.length; i++) {
                let guessLetterIndex = answer.indexOf(wordGuess.word[i])
                console.log('guess letter index',guessLetterIndex);
                if (guessLetterIndex === -1) {
                    console.log(wordGuess.word[i])
                    document.getElementById(wordGuess.word[i]).classList.add('gray')
                }
                if (guessLetterIndex !== -1) {
                    if(guessLetterIndex === i) {
                        console.log('same position as answer for ', wordGuess.word[i]);
                    } else {
                        console.log('different position as answer for ', wordGuess.word[i]);
                    }
                }
            }
            
            for (let i = 0; i < answer.length; i++) {
                console.log('inside for loop', wordGuess.word.includes(answer[i]));

                // if letter found in answer
                if (wordGuess.word.includes(answer[i])) {
                    // const charPosition = wordGuess.word.indexOf(answer[i].toUpperCase());
                    const letterBoxPos = wordGuess.position[wordGuess.word.indexOf(answer[i])];
                    // document.getElementById(letterBoxPos).style.backgroundColor = 'orange';
                    document.getElementById(letterBoxPos).classList.remove('gray');
                    document.getElementById(letterBoxPos).classList.add('orange');
                    console.log(`first guess has ${answer[i]} at position ${wordGuess.word.indexOf(answer[i])} i = ${i}`);
                    console.log(`letter-box position ${wordGuess.position[wordGuess.word.indexOf(answer[i])]}`);
                    if (wordGuess.word.indexOf(answer[i]) == i) {
                        console.log(`position of ${answer[i]} is same`);
                        // document.getElementById(letterBoxPos).style.backgroundColor = 'green';
                        document.getElementById(letterBoxPos).classList.remove('orange');
                        document.getElementById(letterBoxPos).classList.add('green');
                    }
                }
            }
            if (wordGuess.word.join('').toLowerCase() == guessingWord) {
                console.log('You win');
                document.getElementById('refresh').style.display = 'block';
                letterBoxNo = 0;
                wordGuess.word = [];
                wordGuess.position = [];
                return
            }
            wordGuess.word = [];
            wordGuess.position = [];
        }
        if (letterBoxNo > guessContainer.length - 1) {
            console.log('End of guesses');
            return
        }
    }))
}
main()