This app contains code for the wordle game
Rules:
1. Guess the word in 6 tries
2. Each guess must be a valid 5-letter word
3. The color of the tiles will change to show how close your guess to the word

Logic:
Random word is selected from list of words array.
Added event listeners to on-screen keyboard and computer keyboard.
Display letter when letter key pressed or clicked.
When user clicks enter button, check if user entered 5 letter word and validate if the word is valid dictionary word using api.
Highlight the letters of guessed word to give clues to user when a valid word is entered.
Tile color and Description:
1. Letter in correct position - green color
2. Letter exists but in wrong position - orange color
3. Letter not present in actual work - gray color
When user guesses the correct work, display win status
When uses make 6 wrong guesses, display lose status

Citations:
To find indeces of all occurence of a letter :
https://stackoverflow.com/questions/3410464/how-to-find-indices-of-all-occurrences-of-one-string-in-another-in-javascript 

To add key press event and to find pressed key is a letter
https://www.freecodecamp.org/news/build-a-wordle-clone-in-javascript/

API used to find out entered word is a valid english word
https://api.dictionaryapi.dev/api/v2/entries/en/


