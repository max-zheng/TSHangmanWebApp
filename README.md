Instructions:
- You can play locally or host your own web server.
- In order to play locally, simply clone this repo and within the directory, open HangmanWebsite.html

HangmanGameLogic:
- We use querySelector in order to access the class elements of HangmanWebsite within our JS code.
- There are 3 variables that we keep track of: incorrectGuessesLeft, lettersRevealed, displayImage
  - incorrectGuessesLeft: very simple, keeps track of incorrect guesses the player has left. If this
    value hits 0, then the player loses
  - lettersRevealed: how many letters the player has guessed correctly. If lettersRevealed equals
    the length of the secretWord, then the player has won
  - displayImage: number corresponding to index of image we should display on the right corresponding
    to the <div> array in the HTML. Increment this each time the player guesses incorrectly, which will
    cause the stick figure to grow more body parts
- also we use guessCharSet in order to keep track of letters we've already guessed so that there are no
  repeats

- We also provide a 1 player option, where a random word is given. The random word is chosen from a dictionary
  text document of over 400,000 English words.
- In order to read in this text document, we make a XMLHttpRequest to load a local text file containing
  the words. We split along "\n" and store the result into an array
- Then, we use Math.random() to choose a random index of the array which corresponds to the word we want.
