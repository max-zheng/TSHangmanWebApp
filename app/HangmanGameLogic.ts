class HangmanGameLogic {

    constructor(
        private guessesLeftMessage = <HTMLElement>document.querySelector('.guessesLeftMessage'),
        private displayWord = <HTMLElement>document.querySelector('.displayWord'),
        private lettersGuessed = <HTMLElement>document.querySelector('.lettersGuessed'),
        private displayMessage = <HTMLElement>document.querySelector('.displayMessage'),
        private errorMessage = <HTMLElement>document.querySelector('.errorMessage'),
        private guessPics = <HTMLElement>document.querySelector('.pics'),
        private wordSubmitButton = <HTMLElement>document.querySelector('.wordSubmitButton'),
        private randomWordButton = <HTMLElement>document.querySelector('.randomWordButton'),
        private guessButton = <HTMLInputElement>document.querySelector('.guessButton'),
        private resetButton = <HTMLElement>document.querySelector('.resetButton'),
        private introPage = <HTMLElement>document.querySelector('.intro'),
        private gameStartPage = <HTMLElement>document.querySelector('.gameStart'),
        private letterGuess = <HTMLInputElement>document.querySelector('.letterGuess'),
        private wordDictionary: string[] = [],
        private secretWord: string = "",
        // The blanks that display showing which letters are known and which are unknown
        // example: a _ _ l _ = a p p l e
        private wordToDisplay: string = "",
        private incorrectGuessesLeft = 5, // how many guesses player has left
        private lettersRevealed = 0, // how many letters are known through guesses
        private displayImage = 1, // cycles through right side hangman graphic, corresponding to incorrectGuessesLeft
        private guessCharSet: Set<string> = new Set<string>(), // stores set of characters so there are no duplicate guesses
    ) {}

    public run(): void {
        this.wordSubmitButton.addEventListener('click', (e:Event) => this.setUp2PlayerGame());
        this.randomWordButton.addEventListener('click', (e:Event) => this.setUpRandomGame());
        this.guessButton.addEventListener('click', (e:Event) => this.guessLetter());
        this.resetButton.addEventListener('click', (e:Event) => this.resetGame());

        this.populateDictionary('files/words.txt');
        this.resetGame();
    }

    private populateDictionary(filePath: string): void {
        const request = new XMLHttpRequest();
        request.onload = () => {
            this.wordDictionary = request.responseText.split('\n');
        };
        request.open('GET', filePath);
        request.overrideMimeType('text/plain');
        request.send();
    }

    private resetGame(): void {
        this.displayMessage.style.display = 'none';
        this.guessButton.disabled = false;
        this.incorrectGuessesLeft = 5;
        this.guessCharSet = new Set<string>();
        this.lettersRevealed = 0;
        this.displayImage = 1;
        this.wordToDisplay = "";
        this.gameStartPage.style.display = 'none';
        this.introPage.style.display = 'initial';
        this.errorMessage.style.display = 'none';
        (<HTMLInputElement>document.querySelector('.secretWord')).focus();
    }

    // set up game in event that user enters own word
    private setUp2PlayerGame(): void {
        this.secretWord = (<HTMLInputElement>document.querySelector('.secretWord')).value;
        if (!String.prototype.containsOnlyAlphas(this.secretWord)) {
            this.errorMessage.style.display = 'initial';
            return;
        }
        this.setupGame();
    }

    // set up game in event that random word option is chosen
    private setUpRandomGame(): void {
        let index = Math.floor(Math.random() * this.wordDictionary.length);
        this.secretWord = this.wordDictionary[index];
        this.setupGame();
    }

    // general game setup, toggle between into page and game page
    private setupGame(): void {
        this.introPage.style.display = 'none';
        for (let i = 0; i < this.secretWord.length; i++) {
            this.wordToDisplay += "_ ";
        }
        this.guessesLeftMessage.textContent = "You have " + this.incorrectGuessesLeft + " incorrect guesses remaining.";
        this.displayWord.textContent = this.wordToDisplay;
        this.lettersGuessed.textContent = "Letters guessed: ";
        this.displayMessage.style.display = 'none';
        this.gameStartPage.style.display = 'initial';
        // start with 1 and skip 2 each time, every other node is a text and we only want images
        for (let i = 1; i <= 11; i += 2) {
            (<HTMLImageElement>this.guessPics.childNodes[i]).style.display = 'none';
        }
        (<HTMLImageElement>this.guessPics.childNodes[this.displayImage]).style.display = 'initial';
        this.resetButton.style.display = 'none';
        (<HTMLInputElement>document.querySelector('.letterGuess')).focus();
    }

    // function to evaluate letter guess
    private guessLetter() {
        // make sure letter is a-z
        if (!String.prototype.containsOnlyAlphas(this.letterGuess.value)) {
            this.displayMessage.textContent = "Please guess a letter from a-z!";
            this.displayMessage.style.display = 'initial';
            this.letterGuess.focus();
            return;
        }
        // if letter is has already been guessed before
        if (this.guessCharSet.has(this.letterGuess.value)) {
            this.displayMessage.textContent = "You have already guessed that letter!";
            this.displayMessage.style.display = 'initial';
            this.letterGuess.focus();
            return;
        }
        // add letter guessed to set
        this.guessCharSet.add(this.letterGuess.value);
        this.displayMessage.style.display = 'none';
        // loop through secretWord to fill in corresponding matching letters
        let letterFound = false;
        for (let i = 0; i < this.secretWord.length; i++) {
            if (this.letterGuess.value === this.secretWord[i]) {
                letterFound = true;
                this.lettersRevealed++;
                this.wordToDisplay = String.prototype.setCharAt(this.wordToDisplay, i * 2, this.letterGuess.value);
                this.displayWord.textContent = this.wordToDisplay;
            }
        }
        // if letter is not in the word
        if (letterFound === false) {
            this.incorrectGuessesLeft--;
            (<HTMLImageElement>this.guessPics.childNodes[this.displayImage]).style.display = 'none';
            this.displayImage += 2;
            (<HTMLImageElement>this.guessPics.childNodes[this.displayImage]).style.display = 'initial';
        }
        this.lettersGuessed.textContent += this.letterGuess.value + ' ';
        this.guessesLeftMessage.textContent = "You have " + this.incorrectGuessesLeft + " incorrect guesses remaining.";
        // after every letter guess, check if the user has won or lost
        if (this.checkWinOrLoss() === false) {
            this.letterGuess.focus();
        }
    }

    private checkWinOrLoss() {
        if (this.lettersRevealed === this.secretWord.length) {
            alert("You win!!!");
            this.guessButton.disabled = true;
            this.resetButton.style.display = 'initial';
            return true;
        }
        if (this.incorrectGuessesLeft === 0) {
            alert("You lose!!! The secret word was: " + this.secretWord);
            this.guessButton.disabled = true;
            this.resetButton.style.display = 'initial';
            return true;
        }
        return false;
    }
}
// -----------------------------------------------------------------------------

// helper method similar to str[index] = newChar
String.prototype.setCharAt = function(str: string, index: number, char: string): string {
    if (index > str.length - 1)
        return str;
    return str.substr(0, index) + char + str.substr(index + 1);
}

String.prototype.containsOnlyAlphas = function(str: string): boolean {
    return str.length > 0 && !/[^a-zA-Z]/.test(str);
}

// -----------------------------------------------------------------------------

const game = new HangmanGameLogic();
game.run();
