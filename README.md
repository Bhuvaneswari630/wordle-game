This app contains code for the wordle game
Rules:
1, Guess the word in 6 tries
2, Each guess must be a valid 5-letter word
3, The color of the tiles will change to show how close your guess to the word

Logic:
Random word is selected from list of words array.
Add event listeners to keyboard buttons.
Find the position of each letter of guessed word to give clues to user when a valid 5-letter word is entered.
Tile color changes accordingly:
1, Letter in correct position - green color
2, Letter exists - orange color
3, Letter not matched - gray color

Functionalities in the game.
refreshPage - resets the game board
getRandommWord - gets random word from list of words
validateWord - calls dictionary api to check the input word is a vlaid english word

Citations
To find indeces of all occurence of a letter :
https://stackoverflow.com/questions/3410464/how-to-find-indices-of-all-occurrences-of-one-string-in-another-in-javascript 

To add key press event and to find pressed key is a letter
https://www.freecodecamp.org/news/build-a-wordle-clone-in-javascript/

API used to find out entered word is a valid english word
https://api.dictionaryapi.dev/api/v2/entries/en/


