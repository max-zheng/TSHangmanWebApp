"use strict";
var HangmanGameLogic = (function () {
    function HangmanGameLogic(guessesLeftMessage, displayWord, lettersGuessed, displayMessage, errorMessage, guessPics, wordSubmitButton, randomWordButton, guessButton, resetButton, introPage, gameStartPage, letterGuess, wordDictionary, secretWord, wordToDisplay, incorrectGuessesLeft, lettersRevealed, displayImage, guessCharSet) {
        if (guessesLeftMessage === void 0) { guessesLeftMessage = document.querySelector('.guessesLeftMessage'); }
        if (displayWord === void 0) { displayWord = document.querySelector('.displayWord'); }
        if (lettersGuessed === void 0) { lettersGuessed = document.querySelector('.lettersGuessed'); }
        if (displayMessage === void 0) { displayMessage = document.querySelector('.displayMessage'); }
        if (errorMessage === void 0) { errorMessage = document.querySelector('.errorMessage'); }
        if (guessPics === void 0) { guessPics = document.querySelector('.pics'); }
        if (wordSubmitButton === void 0) { wordSubmitButton = document.querySelector('.wordSubmitButton'); }
        if (randomWordButton === void 0) { randomWordButton = document.querySelector('.randomWordButton'); }
        if (guessButton === void 0) { guessButton = document.querySelector('.guessButton'); }
        if (resetButton === void 0) { resetButton = document.querySelector('.resetButton'); }
        if (introPage === void 0) { introPage = document.querySelector('.intro'); }
        if (gameStartPage === void 0) { gameStartPage = document.querySelector('.gameStart'); }
        if (letterGuess === void 0) { letterGuess = document.querySelector('.letterGuess'); }
        if (wordDictionary === void 0) { wordDictionary = []; }
        if (secretWord === void 0) { secretWord = ""; }
        if (wordToDisplay === void 0) { wordToDisplay = ""; }
        if (incorrectGuessesLeft === void 0) { incorrectGuessesLeft = 5; }
        if (lettersRevealed === void 0) { lettersRevealed = 0; }
        if (displayImage === void 0) { displayImage = 1; }
        if (guessCharSet === void 0) { guessCharSet = new Set(); }
        this.guessesLeftMessage = guessesLeftMessage;
        this.displayWord = displayWord;
        this.lettersGuessed = lettersGuessed;
        this.displayMessage = displayMessage;
        this.errorMessage = errorMessage;
        this.guessPics = guessPics;
        this.wordSubmitButton = wordSubmitButton;
        this.randomWordButton = randomWordButton;
        this.guessButton = guessButton;
        this.resetButton = resetButton;
        this.introPage = introPage;
        this.gameStartPage = gameStartPage;
        this.letterGuess = letterGuess;
        this.wordDictionary = wordDictionary;
        this.secretWord = secretWord;
        this.wordToDisplay = wordToDisplay;
        this.incorrectGuessesLeft = incorrectGuessesLeft;
        this.lettersRevealed = lettersRevealed;
        this.displayImage = displayImage;
        this.guessCharSet = guessCharSet;
    }
    HangmanGameLogic.prototype.run = function () {
        var _this = this;
        this.wordSubmitButton.addEventListener('click', function (e) { return _this.setUp2PlayerGame(); });
        this.randomWordButton.addEventListener('click', function (e) { return _this.setUpRandomGame(); });
        this.guessButton.addEventListener('click', function (e) { return _this.guessLetter(); });
        this.resetButton.addEventListener('click', function (e) { return _this.resetGame(); });
        this.populateDictionary('files/words.txt');
        this.resetGame();
    };
    HangmanGameLogic.prototype.populateDictionary = function (filePath) {
        var _this = this;
        var request = new XMLHttpRequest();
        request.onload = function () {
            _this.wordDictionary = request.responseText.split('\n');
        };
        request.open('GET', filePath);
        request.overrideMimeType('text/plain');
        request.send();
    };
    HangmanGameLogic.prototype.resetGame = function () {
        this.displayMessage.style.display = 'none';
        this.guessButton.disabled = false;
        this.incorrectGuessesLeft = 5;
        this.guessCharSet = new Set();
        this.lettersRevealed = 0;
        this.displayImage = 1;
        this.wordToDisplay = "";
        this.gameStartPage.style.display = 'none';
        this.introPage.style.display = 'initial';
        this.errorMessage.style.display = 'none';
        document.querySelector('.secretWord').focus();
    };
    HangmanGameLogic.prototype.setUp2PlayerGame = function () {
        this.secretWord = document.querySelector('.secretWord').value;
        if (!String.prototype.containsOnlyAlphas(this.secretWord)) {
            this.errorMessage.style.display = 'initial';
            return;
        }
        this.setupGame();
    };
    HangmanGameLogic.prototype.setUpRandomGame = function () {
        var index = Math.floor(Math.random() * this.wordDictionary.length);
        this.secretWord = this.wordDictionary[index];
        this.setupGame();
    };
    HangmanGameLogic.prototype.setupGame = function () {
        this.introPage.style.display = 'none';
        for (var i = 0; i < this.secretWord.length; i++) {
            this.wordToDisplay += "_ ";
        }
        this.guessesLeftMessage.textContent = "You have " + this.incorrectGuessesLeft + " incorrect guesses remaining.";
        this.displayWord.textContent = this.wordToDisplay;
        this.lettersGuessed.textContent = "Letters guessed: ";
        this.displayMessage.style.display = 'none';
        this.gameStartPage.style.display = 'initial';
        for (var i = 1; i <= 11; i += 2) {
            this.guessPics.childNodes[i].style.display = 'none';
        }
        this.guessPics.childNodes[this.displayImage].style.display = 'initial';
        this.resetButton.style.display = 'none';
        document.querySelector('.letterGuess').focus();
    };
    HangmanGameLogic.prototype.guessLetter = function () {
        if (!String.prototype.containsOnlyAlphas(this.letterGuess.value)) {
            this.displayMessage.textContent = "Please guess a letter from a-z!";
            this.displayMessage.style.display = 'initial';
            this.letterGuess.focus();
            return;
        }
        if (this.guessCharSet.has(this.letterGuess.value)) {
            this.displayMessage.textContent = "You have already guessed that letter!";
            this.displayMessage.style.display = 'initial';
            this.letterGuess.focus();
            return;
        }
        this.guessCharSet.add(this.letterGuess.value);
        this.displayMessage.style.display = 'none';
        var letterFound = false;
        for (var i = 0; i < this.secretWord.length; i++) {
            if (this.letterGuess.value === this.secretWord[i]) {
                letterFound = true;
                this.lettersRevealed++;
                this.wordToDisplay = String.prototype.setCharAt(this.wordToDisplay, i * 2, this.letterGuess.value);
                this.displayWord.textContent = this.wordToDisplay;
            }
        }
        if (letterFound === false) {
            this.incorrectGuessesLeft--;
            this.guessPics.childNodes[this.displayImage].style.display = 'none';
            this.displayImage += 2;
            this.guessPics.childNodes[this.displayImage].style.display = 'initial';
        }
        this.lettersGuessed.textContent += this.letterGuess.value + ' ';
        this.guessesLeftMessage.textContent = "You have " + this.incorrectGuessesLeft + " incorrect guesses remaining.";
        if (this.checkWinOrLoss() === false) {
            this.letterGuess.focus();
        }
    };
    HangmanGameLogic.prototype.checkWinOrLoss = function () {
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
    };
    return HangmanGameLogic;
}());
String.prototype.setCharAt = function (str, index, char) {
    if (index > str.length - 1)
        return str;
    return str.substr(0, index) + char + str.substr(index + 1);
};
String.prototype.containsOnlyAlphas = function (str) {
    return str.length > 0 && !/[^a-zA-Z]/.test(str);
};
var game = new HangmanGameLogic();
game.run();
