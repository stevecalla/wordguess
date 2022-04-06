import { wordList, wordListv1 } from "./data";
import { createConfetti } from "./confetti";

//query selector variables go here 👇
var displaySolution = document.querySelector('#solution');
var inputTilesRow1 = document.querySelector('#inputTilesRow1');

//global variables go here 👇
var currentInput = [];
// var currentTile = 0;
var allInput = [];
var solution = [];
var currentEmojiBoard = "";
var currentEmojiBoard2 = "";
let elementaryDefinition = 'Placeholder';
let collegeDefinition = 'Placeholder';
let displayDefinition = 'Sorry, definition not available';
let audioPronounciation = './assets/pronunce_not_available.mp3';
let gameStats = {
  'gameCount': 0, //calc using calcGameCount reduce function 
  'winCount': 0, 
  'winPercent': '', 
  'darkMode': false,
  'contrastMode': false,
  'allInput': [], //todo code add allInput array
  'winStreak': 0, //todo code add count of 1 for each consecutive win... so if prior value !== 0 then get prior value plus 1; if lose = 0
  'maxWins': 0, //todo code create array of win streak and take max
  'wordPlayed': [], //todo DONE; todo update wincount if played
}

//SECTION TEST NPM RANDOM COLORS
// var randomColor = require('randomcolor'); // import the script
// import randomColor from 'randomcolor';
// import randomColor from './node_modules/randomcolor/randomColor.js'
// var color = randomColor();
// console.log(color);
// import lodash from 'lodash';

//SECTION event listeners go here 👇
window.addEventListener('load', loadTasks);
document.addEventListener('keydown', inputText);
// document.addEventListener('focus', function(e) {
//   console.log('focused: ', document.activeElement)
//   console.log('focus:', e, 'target:', e.target, e.target.id)
//   e.target.style.color = 'red';
//   e.target.blur();
// }, true);

// document.addEventListener('blur', (e) => {
//   e.target.style.color = 'green';
//   console.log('blur:', e, 'target:', e.target, e.target.id)
// }, true);

//SECTION test doubleclick prevent zoom
document.addEventListener('dblclick', function (e) {
  console.log(e)
  console.log(e.screenX, e.screenY)
  e.preventDefault();
});

//functions and event handlers go here 👇
// SECTION LOAD TASKS
function loadTasks() {
  document.getElementById('header').scrollIntoView({behavior: "auto", block: "end", inline: "nearest"});
  createGameInstruction();
  createOnscreenKeyboard();
  createHamburgerMenu();
  
  // console.log('0=', gameStats, localStorage.getItem('gameStats'));
  // console.log('0=', gameStats);
  populateGameStatsFromLocalStorage();

  // reduceGameCount();

  createGameSolution();

  // reduceGameCount();

  // console.log('1=', gameStats);
  toggleDarkMode(gameStats.darkMode);
  toggleContrastMode(gameStats.contrastMode);
  createGameTiles();

  // createRowStats2();

  // createHistoryTable();
  // document.getElementById('tableHeaderRow').classList.remove('hidden');

  // focusCurrentTile();
  // let currentElement = document.getElementById('id0');
  // document.activeElement = currentElement;
  // document.getElementById('id0').focus();
  // createGameStatsMenu();
}

// SECTION  CREATE INSTRUCTIONS
function createGameInstruction() {
  injectInstructionText();
  createIntructionTiles();
  populateInstructionTiles();
}

function injectInstructionText() {
  document.getElementById('instructionWrapper').innerHTML = `
    <div class='instx-title'>
      <p class='cloak'>x</p>
      <p class='title'>HOW TO PLAY</p>
      <p class='click-to-hide-x'>X</p>
    </div>
    <p>Guess the WORD in six tries.</p>
    <p>Each guess must be a valid five-letter word. Hit the enter button to submit.</p>
    <p>After each guess, the color of the tiles will change to show how close your guess was to the word.</p>
    <div class='example-border'>
      <p>Examples</p>
      <div class='instrx-wrapper'></div>
      <p>The letter W is in the word and in the correct spot.</p>
      <div class='instrx-wrapper'></div>
      <p>The letter I is in the word but in the wrong spot.</p>
      <div class='instrx-wrapper'></div>
      <p>The letter U is not in the word in any spot.</p>
    </div>
    <p>LET'S PLAY!!</p>
  `
}

function createIntructionTiles() {
  for (let x = 0; x < 3; x++)
    for (let i = 0; i < 5; i++) {
      document.querySelectorAll('.instrx-wrapper')[x].innerHTML += 
      `   
        <div>
          <input type="text" 
                  id=${`tile${x}${i}`}
                  maxlength="1"
                  name="selection" 
                  value=""
                  size="1"
                  style="text-transform:uppercase">
        </div>
      `;
  }
}

function populateInstructionTiles() {
  const letters = ['W','A','C','K','Y','F','I','L','E','S','V','A','G','U','E'];
  for (let i = 0; i < 5; i++) {
    document.getElementById('tile' + 0 + i).value = letters[i];
    document.getElementById('tile' + 1 + i).value = letters[i + 5];
    document.getElementById('tile' + 2 + i).value = letters[i + 10];


    document.getElementById('tile' + 0 + i).setAttribute('value', letters[i]);
    document.getElementById('tile' + 1 + i).setAttribute('value', letters[i + 5]);
    document.getElementById('tile' + 2 + i).setAttribute('value', letters[i + 10]);

    document.getElementById('tile' + 0 + i).setAttribute('disabled', 'disabled');
    document.getElementById('tile' + 1 + i).setAttribute('disabled', 'disabled');
    document.getElementById('tile' + 2 + i).setAttribute('disabled', 'disabled');
  }
  document.getElementById('tile00').classList.add('contrast-toggle--exactMatch');
  document.getElementById('tile11').classList.add('contrast-toggle--match');
  document.getElementById('tile23').classList.add('contrast-toggle--noMatch');
}

function hideInstructions() {
  // document.getElementById('instructionWrapper').innerHTML = ``;
  document.getElementById('instructionWrapper').classList.toggle('hidden');

  allowInputCurrentGame();
  // if (gameStats.wordPlayed[gameStats.wordPlayed.length - 1].winCount === 0) {
  //   for (let i = 0; i < 30; i++) {
  //     document.getElementById('id' + (i)).removeAttribute('disabled');
  //   }  //todo disabled //section
  // }

  // document.querySelector('.input-wrapper').classList.remove('hidden');
  // document.querySelector('.keyboard-wrapper').classList.remove('hidden');

  document.getElementById('toggleInstructionsOffIcon').classList.toggle('hidden');
  document.getElementById('toggleInstructionsOnIcon').classList.toggle('hidden');
  // document.getElementById('id0').focus();
  // document.getElementById('id0').blur();
  // focusCurrentTile();
  document.getElementById('hamburgerPopupMenu').classList.add('hidden');
  document.getElementById('tableHeaderRow').classList.add('hidden');

  document.getElementById('historyBoardWrapper').classList.add('hidden');
  document.getElementById('historyTable').classList.add('hidden');
  document.getElementById('tableHeaderRow').classList.add('hidden');

}

// SECTION CREATE SOLUTION
function getRandomNumber() {
  let randomNumber = Math.floor(Math.floor(Math.random() * wordList.length));
  // let randomNumber = Math.floor(Math.floor(Math.random() * 10));
  return randomNumber;
}

function getCurrentDate() {
  let dateString = Date();
  let date = new Date(dateString).toLocaleDateString('en-US', {month: 'numeric', day: 'numeric', year: '2-digit'}); //'2/22/22'
  let time = new Date(dateString).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit'}); //'7:38' or '15:50'
  let timeZone = /.*\(([^)]*)\)/.exec(dateString)[1].match(/[A-Z]/g).join(''); //'MDT'
  let dateShort = date + ' ' + time + ' ' + timeZone; // '2/22/22 7:38 MDT' or '3/22/22 15:51 MDT'
  let dateOnly = date; //'2/22/22'
  // console.log(dateString, dateShort);
  return {'dateString': dateString, 'date': date, 'time': time, 'timeZone': timeZone, 'dateShort': dateShort, 'dateOnly': dateOnly};
}

function createGameSolution() {
  let randomNumber = getRandomNumber();
  // console.log([getRandomNumber()]);
  // test = [wordList[randomNumber].toUpperCase()];
  // console.log(test)
  solution = Array.from(wordList[randomNumber].toUpperCase());
  console.log('solution=', solution, 'random=', randomNumber);
  createWordPlayedData(randomNumber, solution);
}

function createWordPlayedData(randomNumber, solution) {
  let getDate = getCurrentDate();
  // setLocalStorage('gameCount', gameStats.gameCount + 1); 

  gameStats.wordPlayed.push({'orderPlayed': gameStats.wordPlayed.length + 1, 'solutionNumber': randomNumber, 'solution': solution, 'word': solution.join(''), 'datePlayed': getDate.dateString, 'datePlayedShort': getDate.dateOnly, 'selectedCount': 0, 'playedCount': 0, 'winCount': 0, 'boardInput': [], 'rowSolved': 0});
  previousSolution(randomNumber, solution);

  // if (gameStats.wordPlayed.length >= 1) {
  //   console.log('1')
    // gameStats.wordPlayed.push({'orderPlayed': gameStats.wordPlayed.length + 1, 'solutionNumber': randomNumber, 'solution': solution, 'word': solution.join(''), 'datePlayed': getDate.dateString, 'datePlayedShort': getDate.dateOnly, 'selectedCount': 1, 'playedCount': 1, 'winCount': 0, 'boardInput': [], 'rowSolved': 0});
    // previousSolution(randomNumber, solution);
  // } else {
  //   console.log('2')
    // gameStats.wordPlayed.push({'orderPlayed': gameStats.wordPlayed.length + 1, 'solutionNumber': randomNumber, 'solution': solution, 'word': solution.join(''), 'datePlayed': getDate.dateString, 'datePlayedShort': getDate.dateOnly, 'selectedCount': 0, 'playedCount': 0, 'winCount': 0, 'boardInput': [], 'rowSolved': 0});
    // gameStats.wordPlayed[0].selectedCount ++;
    // gameStats.wordPlayed[0].playedCount ++;

    // setLocalStorage('gameCount', gameStats.gameCount + 1); 
    // setLocalStorage('wordPlayed');
  // }
}

function previousSolution(randomNumber, solution) {
  // console.log('findIndex=', gameStats.wordPlayed.findIndex(element => element.word === solution.join('')));
  let findCurrentSolutionIndex = gameStats.wordPlayed.findIndex(element => element.word === solution.join('')); //find index
  let currentLengthIndex = gameStats.wordPlayed.length - 1; //determine current length; "- 1" to match with findCurrentSolutionIndex starting at 0 //todo redefine
  let playedBefore = findCurrentSolutionIndex !== currentLengthIndex; //true || false; when true remove last element from array and determine if okay to play again
  let evaluationSelectedCountThreeTimes = gameStats.wordPlayed[findCurrentSolutionIndex].selectedCount % 3 === 0; //true || false; when false find another solution

  // console.log('index=', findCurrentSolutionIndex, 'length=', currentLengthIndex, 'playedBefore=', playedBefore, 'selectedThree=', evaluationSelectedCountThreeTimes, 'module3=', gameStats.wordPlayed[findCurrentSolutionIndex].selectedCount % 3, 'selectedCount=', gameStats.wordPlayed[findCurrentSolutionIndex].selectedCount);

  if (playedBefore && !evaluationSelectedCountThreeTimes) {
    console.log('3')
    gameStats.wordPlayed[findCurrentSolutionIndex].selectedCount ++;
    gameStats.wordPlayed.pop();
    setLocalStorage('wordPlayed');
    createGameSolution();
    return;
  } else if (playedBefore && evaluationSelectedCountThreeTimes) {
    console.log('4')
    // setLocalStorage('gameCount', gameStats.gameCount + 1); 
    // gameStats.wordPlayed[currentSolutionIndex].selectedCount ++;
    // gameStats.wordPlayed[currentSolutionIndex].playedCount ++;
    gameStats.wordPlayed.pop();
    // setLocalStorage('wordPlayed');
    // return;
  }
  gameStats.wordPlayed[findCurrentSolutionIndex].selectedCount ++;
  gameStats.wordPlayed[findCurrentSolutionIndex].playedCount ++;
  // setLocalStorage('gameCount', gameStats.gameCount + 1);
  setLocalStorage('gameCount', calcGameCount());
  setLocalStorage('wordPlayed');

  // for (let i = 0; i < gameStats.wordPlayed.length - 1; i++) {
  //   let evaluationPlayedBefore = (gameStats.wordPlayed.length > 1 && solution.join('') === gameStats.wordPlayed[i].word) ? 'played before' : 'not played before';
  //   let evaluationSelectedCountThreeTimes = gameStats.wordPlayed[i].selectedCount % 3 === 0;
  //   // let getNewSolution = evaluationPlayedBefore === 'played before' && !evaluationSelectedCountThreeTimes;
  //   // console.log(evaluationPlayedBefore === 'played before', evaluationSelectedCountThreeTimes, evaluationPlayedBefore === 'played before' && evaluationSelectedCountThreeTimes);
  //   console.log(randomNumber, gameStats.wordPlayed[i].solutionNumber, evaluationPlayedBefore, gameStats.wordPlayed[i].selectedCount, gameStats.wordPlayed[i].selectedCount % 3); 
  //   // if (evaluationPlayedBefore === 'played before' && gameStats.wordPlayed[i].selectedCount % 3 !== 0) { 
  //   if (evaluationPlayedBefore === 'played before' && !evaluationSelectedCountThreeTimes) {
  //   // if (getNewSolution) {
  //     console.log('3')
  //     gameStats.wordPlayed[i].selectedCount ++;
  //     gameStats.wordPlayed.pop();
  //     setLocalStorage('wordPlayed');
  //     createGameSolution();
  //     return;
  //   // } else if (evaluationPlayedBefore === 'played before' && gameStats.wordPlayed[i].selectedCount % 3 === 0) {
  //   } else if (evaluationPlayedBefore === 'played before' && evaluationSelectedCountThreeTimes) {
  //   // } else if (!getNewSolution) {
  //     console.log('4')
  //     setLocalStorage('gameCount', gameStats.gameCount + 1); 
  //     gameStats.wordPlayed[i].selectedCount ++;
  //     gameStats.wordPlayed[i].playedCount ++;
  //     gameStats.wordPlayed.pop();
  //     setLocalStorage('wordPlayed');
  //     return;
  //   }
  // }
  // console.log('set')
}

//SECTION POPULATE FROM LOCAL STORAGE ON LOAD

function populateGameStatsFromLocalStorage() {
  if (localStorage.getItem('gameStats') === null) {
    // console.log('1');
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
  } else {
    // console.log('2 localstorage', gameStats, localStorage.getItem('gameStats'));

    // gameStats = JSON.parse(localStorage.getItem('gameStats'));
    // console.log('b=', gameStats)

    // console.log('2');
    let localStats = JSON.parse(localStorage.getItem('gameStats'));
    // console.log('localStats=', localStats, localStats.wordPxlayed.length);
    // console.log('gameStats=', gameStats);

    gameStats.gameCount = localStats.gameCount; //todo change to reduce of wordPlayed.playedCount
    gameStats.winCount = localStats.winCount;
    gameStats.winPercent = localStats.winPercent;
    gameStats.darkMode = localStats.darkMode;
    gameStats.contrastMode = localStats.contrastMode;
    // gameStats.allInput = localStats.allInput;
    gameStats.winStreak = localStats.winStreak;
    gameStats.maxWins = localStats.maxWins;

    for (let i = 0; i < localStats.wordPlayed.length; i++) {
      // console.log(localStats.wordPlayed[i].datePlayed === 'tbd');
      gameStats.wordPlayed.push({
        'orderPlayed': i + 1 ?? localStats.wordPlayed[i].orderPlayed,
        'solutionNumber': localStats.wordPlayed[i].solutionNumber ?? 'data missing',
        'solution': localStats.wordPlayed[i].solution ?? 'data missing',
        'word': localStats.wordPlayed[i].word ?? 'data missing',
        'datePlayed': localStats.wordPlayed[i].datePlayed ?? 'data missing',
        // 'datePlayedShort': new Date(localStats.wordPlayed[i].datePlayed).toLocaleDateString('en-US', {month: 'numeric', day: 'numeric', year: '2-digit'}) || new Date(localStats.wordPlayed[i].datePlayed).toLocaleDateString('en-US'),
        'datePlayedShort': new Date(localStats.wordPlayed[i].datePlayed).toLocaleDateString('en-US', {month: 'numeric', day: 'numeric', year: '2-digit'}) ?? 'data missing',
        'selectedCount': localStats.wordPlayed[i].selectedCount ?? 'data missing',
        'playedCount': localStats.wordPlayed[i].playedCount ?? 'data missing',
        'winCount': localStats.wordPlayed[i].winCount ?? 0,
        'boardInput': localStats.wordPlayed[i].boardInput ?? 'data missing',
        'rowSolved': localStats.wordPlayed[i].winCount >= 1 ? Math.floor(localStats.wordPlayed[i].boardInput.length / 5) : 0,
      });
    }
  }
}

// SECTION CREATE GAME TILES
function createGameTiles() {
  for (let i = 0; i < 30; i++) {
    inputTilesRow1.innerHTML +=
    `   
      <input  type='text' 
              id=${`id${i}`}
              maxlength='1'
              name='selection'
              value=''
              size='1'
              disabled='disabled'
              data-status='start'
              style='text-transform:uppercase'>
    `;
  }  
  // document.getElementById('id0').autofocus = true; //todo autofocus id0
}

// SECTION CREATE ONSCREEN KEYBOARD
function createOnscreenKeyboard() {
  // const alphabetKeys = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','ENTER','U','V','W','X','Y','Z','⌫'];
  // const qwertyKeys = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','ENTER','Z','X','C','V','B','N','M','⌫'];
  const alphabetKeys = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','ENTER','U','V','W','X','Y','Z','BACK'];
  const qwertyKeys = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','ENTER','Z','X','C','V','B','N','M','BACK'];
  document.getElementById('keyboardWrapper').innerHTML = '';
  for (let i = 0; i < 28; i++) {
    document.getElementById('keyboardWrapper').innerHTML += `
      <button 
        class='keyboard-button' 
        id='keyboard${[i]}' 
        type='button' 
        value=${qwertyKeys[i]}
        onClick=inputText(this)>
        ${qwertyKeys[i]}
      </button>
    `
  }
  document.getElementById('keyboard10').style.marginLeft = '0.5rem';
  document.getElementById('keyboard19').classList.add('enter-button');
  document.getElementById('keyboard27').classList.add('back-button');

  document.getElementById('keyboard19').value = 13;
  document.getElementById('keyboard19').setAttribute('onclick', 'eventKeyBoardButton()');
  document.getElementById('keyboard27').setAttribute('onclick', 'deleteInputText()');

  // document.getElementById('keyboard27').innerHTML = '<svg class="backspace-svg-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M5.83 5.146a.5.5 0 0 0 0 .708L7.975 8l-2.147 2.146a.5.5 0 0 0 .707.708l2.147-2.147 2.146 2.147a.5.5 0 0 0 .707-.708L9.39 8l2.146-2.146a.5.5 0 0 0-.707-.708L8.683 7.293 6.536 5.146a.5.5 0 0 0-.707 0z"/><path d="M13.683 1a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7.08a2 2 0 0 1-1.519-.698L.241 8.65a1 1 0 0 1 0-1.302L5.084 1.7A2 2 0 0 1 6.603 1h7.08zm-7.08 1a1 1 0 0 0-.76.35L1 8l4.844 5.65a1 1 0 0 0 .759.35h7.08a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1h-7.08z"/></svg>'
  // document.getElementById('keyboard27').innerHTML = '<svg class="backspace-svg-icon" viewBox="0 0 44.18 44.18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"><g><path d="M10.625,5.09L0,22.09l10.625,17H44.18v-34H10.625z M42.18,37.09H11.734l-9.375-15l9.375-15H42.18V37.09z"/><polygon points="18.887,30.797 26.18,23.504 33.473,30.797 34.887,29.383 27.594,22.09 34.887,14.797 33.473,13.383 26.18,20.676 18.887,13.383 17.473,14.797 24.766,22.09 17.473,29.383 	"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>'
}

function eventKeyBoardButton() {
  console.log('enter key pressed');
  event.key = '13';
  inputText(event.key);
}

// SECTION GET INPUT CHARACTERS
function inputText(event) {
  // console.log(event);
  // console.log(a)
  let key = event.key ? event.key : event.value ? event.value : event;
  let keyCode = event.keyCode;
  // console.log(event.key, event.value, event);
  if ((event.keyCode >=65 && event.keyCode <=90 || event.value) && currentInput.length !== 5 && allInput.length < 30 && !document.getElementById('id' + allInput.length).disabled) {
    // let test2 = allInput.length;
    // console.log(test2);
    // let test = 'length=' + test2 + ', a= id' + allInput.length + ', b1 =' + test2 + ', b=' + allInput[0] + ', c=' + key;
    // console.log(test)
    // window.alert(test);
    // window.alert('move update on screen out of the if statement');
    createInputString(key);
    assignTileValue(key);

    // setTimeout(() => { //todo autofocus id0
      updateOnscreenKeyboardOnInput(key);
    // }, 100);

    // focusCurrentTile();
    // currentFocus();

    // console.trace();
  } else if (key && 'Backspace' === key || keyCode && 8 === keyCode || key && 'ArrowLeft' === key || keyCode && 37 === keyCode) {
    // if (key && 'Backspace' === key || keyCode && 8 === keyCode) {
    // console.log('backspace')
    // console.log('2')
    deleteInputText();
  } else if (currentInput.length === 5 && (key && 'Enter' === key || keyCode && 13 === keyCode || event === '13')) {
    // console.log('3')
    evaluateCurrentInput(event);
  } else if (event.keyCode <65 || event.keyCode >90) {
    // console.log('4')
    event.preventDefault();
  }
}

function createInputString(key) {
  // alert('1');
  currentInput.push(key.toUpperCase());
  allInput.push(key.toUpperCase());
  
  // console.log(allInput);
  // let test = allInput + ' ' + allInput[0]
  // window.alert(test);
  // alert(currentInput);

  setLocalStorage('allInput', allInput);
  // gameStats.wordPlayed[i].boardInput = allInput;
  // setLocalStorage('wordPlayed');
  for (let i = 0; i < gameStats.wordPlayed.length; i++) {
    if (gameStats.wordPlayed[i].word === solution.join('')) {
      gameStats.wordPlayed[i].boardInput = allInput;
      // gameStats.wordPlayed[i].rowSolved = Math.floor(gameStats.wordPlayed[i].boardInput.length / 5);
      setLocalStorage('wordPlayed');
    }
  }

  // assignTileValue(key);
  // determineCurrentTile(allInput);
}

function assignTileValue(key) {
  // alert('4');
  // console.log(allInput.length)

  // focusCurrentTile();

  document.getElementById('id' + (allInput.length - 1)).value = key;
  document.getElementById('id' + (allInput.length - 1)).setAttribute('value', key);


  // document.getElementById('id' + (allInput.length - 1)).focus();
  // setTimeout(() => {
  //   document.getElementById('id' + (allInput.length - 1)).blur();
  // }, 0001);
  // alert('5');
  // alert(console.trace())
}

function evaluateCurrentInput(event) {
  let key = event.key,
  keyCode = event.keyCode;
  let currentGuess = currentInput.join('').toLowerCase();
  if ((key && 'Enter' === key || keyCode && 13 === keyCode || event) && (currentInput.length === 5) && ((wordListv1.includes(currentGuess) || wordList.includes(currentGuess)))) {
    // if (key && 'Enter' === key || keyCode && 13 === keyCode) {
      evaluateString();
      createEmojiRow();
      setColorContrast(); 
      createGameStatsMenu(); 
      // console.trace();
  } else {
    // console.log('Not a word');
    displayMessage('NOT IN WORD LIST');
  }
}

function clearStorage() {
  localStorage.clear();
  displayMessage('GAME HISTORY DELETED. GAME WILL RESET.');
  setTimeout(() => {
    refreshButton();
  }, 2000);
}

function displayMessage(message) {
  document.getElementById('copyNotification').classList.remove('hidden');
  document.getElementById('copyNotification').innerText = message;
  setTimeout(() => {
    document.getElementById('copyNotification').classList.add('hidden');
  }, 3000);
}

function deleteInputText() {
  let status = allInput.length !== 0 ? document.getElementById('id' + (allInput.length - 1)).dataset.status : '';
  let deleteTile = allInput.length !== 0 ? document.getElementById('id' + (allInput.length - 1)) : '';

  for (let i = 0; i < 28; i++) {
    // console.log(document.getElementById('keyboard' + i).value, allInput[allInput.length - 1])
    if (document.getElementById('keyboard' + i).value === allInput[allInput.length - 1]) {
      document.getElementById('keyboard' + i).classList.remove('contrast-toggle--keySelected');
    }
    // document.getElementById('keyboard' + i).blur(); //todo new blur()
    // body.focus();
  }

  if ((status !== 'noMatch' && status !== 'match' && status !== 'exactMatch') && allInput.length !== 0) {
    deleteTile.setAttribute('data-status', 'start'); //remove color
    deleteTile.removeAttribute('disabled'); //remove disabled
    deleteTile.value = '';
    deleteTile.setAttribute('value', '');

    // console.log(allInput.length)
    // console.log(document.getElementById('id' + allInput.length));
    if (allInput.length < 30) {
      document.getElementById('id' + allInput.length).setAttribute('value', '');
    }
    // console.trace();

    // deleteTile.focus();//todo
    currentInput.pop();
    allInput.pop();
    setLocalStorage('allInput', allInput);
    // gameStats.wordPlayed[i].boardInput = allInput;
    // setLocalStorage('wordPlayed');
    for (let i = 0; i < gameStats.wordPlayed.length; i++) {
      if (gameStats.wordPlayed[i].word === solution.join('')) {
        gameStats.wordPlayed[i].boardInput = allInput;
        // gameStats.wordPlayed[i].rowSolved = Math.floor(gameStats.wordPlayed[i].boardInput.length / 5);
        setLocalStorage('wordPlayed');
      }
    }
    // determineCurrentTile(allInput);
  }
}

// SECTION DETERMINE EACH ROW / WIN
function evaluateString(event) {
  determineCurrentRow();
}

function determineCurrentRow() {
  let startRowTile = ((allInput.length - 1) * 1 - 4);
  let endRowTile = (startRowTile + 4); //FIX delete endrow variable
  // let currentRow = ((allInput.length) / 5); //todo remove row stats global variable
  // if ((startRowTile + 5) < 29) {
  //   document.getElementById('id' + (startRowTile + 5)).focus();
  // } //todo
  // assignMatchStatus(startRowTile, endRowTile, currentRow);
  assignMatchStatus(startRowTile, endRowTile); //todo remove row stats global variable
}

// function assignMatchStatus(startRowTile, endRowTile, currentRow) {
function assignMatchStatus(startRowTile, endRowTile) { //todo remove row stats global variable
  let dataStatus = [];
  for (let i = 0; i < 5; i++) {
    if (allInput[startRowTile + i] === solution[i]) {
      document.getElementById('id' + (startRowTile + i)).setAttribute('data-status', 'exactMatch');
      dataStatus.push('exactMatch');
    } else if (solution.includes(allInput[startRowTile + i])) {
      document.getElementById('id' + (startRowTile + i)).setAttribute('data-status', 'match');
      dataStatus.push('match');
    } else {
      document.getElementById('id' + (startRowTile + i)).setAttribute('data-status', 'noMatch');
      dataStatus.push('noMatch');
    }
    // console.log('status=', i, startRowTile, startRowTile + 5, currentInput[i], solution[i], document.getElementById('id' + (startRowTile + i)).dataset.status)
  }
  updateOnscreenKeyboard();
  // determineWinStatus(startRowTile, endRowTile, dataStatus, currentRow);
  determineWinStatus(startRowTile, endRowTile, dataStatus); //todo remove row stats global variable
}

function updateOnscreenKeyboard() {
  const alphabetKeys = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','ENTER','U','V','W','X','Y','Z','BACK'];
  const qwertyKeys = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','ENTER','X','C','V','B','N','M','BACK'];
  let exactMatchInput = [];
  let matchInput = [];
  for (let i = 0; i < allInput.length; i++) {
    // console.log('solution=', solution, 'allInput[i]=', allInput[i])
    if (solution.includes(allInput[i]) && document.getElementById('id' + i).dataset.status === 'exactMatch') {
      exactMatchInput.push(allInput[i]);
      // console.log('matchInput=', exactMatchInput);
      // console.log(document.getElementById('id' + i))
    } else if (solution.includes(allInput[i]) && document.getElementById('id' + i).dataset.status === 'match') {
        matchInput.push(allInput[i]);
        // console.log('matchInput=', matchInput);
        // console.log(document.getElementById('id' + i));
    }
  }

  for (let i = 0; i < 28; i++) {
    // document.getElementById('keyboard' + i).classList.remove('contrast-toggle-selected--exactMatch');
    // document.getElementById('keyboard' + i).classList.remove('contrast-toggle-selected--match');
    // document.getElementById('keyboard' + i).classList.remove('contrast-toggle-selected--noMatch');
    document.getElementById('keyboard' + i).classList.remove('contrast-toggle--keySelected');
  }

  for (let i = 0; i < 28; i++) {
    if (exactMatchInput.includes(qwertyKeys[i])) {
      document.getElementById('keyboard' + i).classList.add('contrast-toggle--exactMatch');
    } else if (matchInput.includes(qwertyKeys[i])) {
      document.getElementById('keyboard' + i).classList.add('contrast-toggle--match');
    } else if (allInput.includes(qwertyKeys[i])) {
     document.getElementById('keyboard' + i).classList.add('contrast-toggle--noMatch');
    }
  }
}

function updateOnscreenKeyboardOnInput(key) {
  // alert('2')
  const qwertyKeys = ['Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','ENTER','X','C','V','B','N','M','BACK'];
  for (let i = 0; i < 28; i++) {    
    if (key.toUpperCase() === qwertyKeys[i]) {
      document.getElementById('keyboard' + i).classList.add('contrast-toggle--keySelected');
      // document.getElementById('keyboard' + i).blur();
      return;
    }
  }
  // focusCurrentTile();
}

// function determineWinStatus(startRowTile, endRowTile, dataStatus, currentRow) { //todo remove row stats global variable
function determineWinStatus(startRowTile, endRowTile, dataStatus) { //todo remove row stats global variable
  let winningCondition = !dataStatus.includes('match') && !dataStatus.includes('noMatch');
  let gameOverCondition = startRowTile + 4 === 29;
  // let currentRow2 = `row${currentRow}`; //todo remove row stats global variable

  if (winningCondition) {
    //TODO POPUP BOX WITH WINNER AND INFO... GAME BOARD
    // setLocalStorage('gameCount', gameStats.gameCount + 1); 

    for (let i = startRowTile + 5; i < 30; i++) {
      document.getElementById('id' + (i)).setAttribute('data-status', 'gameOver');
      document.getElementById('id' + (i)).setAttribute('disabled', 'disabled');
      document.getElementById('id' + (i)).blur();
    }
    if (gameStats.winCount === null) {
      // setLocalStorage('winCount', 1);
      setLocalStorage('winStreak', 1); 
    } else {
      // console.trace();

      // setLocalStorage('winCount', (gameStats.winCount + 1)); //todo win count
      // let rowStats = createRowStats();
      // console.log(rowStats, rowStats.winCount);
      // setLocalStorage('winCount', rowStats.winCount);

      // setLocalStorage(currentRow2, (gameStats[currentRow2] + 1)); //todo remove row stats global variable
      setLocalStorage('winStreak', gameStats.winStreak + 1); 
      setLocalStorage('maxWins', gameStats.winStreak < gameStats.maxWins ? gameStats.maxWins : gameStats.winStreak); 
    }

    // for (let i = 0; i < gameStats.wordPlayed.length; i++) {
    //   // console.log(gameStats.wordPlayed[i].word === solution.join(''))
    //   if (gameStats.wordPlayed[i].word === solution.join('')) {
    //     // setLocalStorage('winCount', gameStats.wordPlayed[i].winCount + 1);
    //     gameStats.wordPlayed[i].winCount = gameStats.wordPlayed[i].winCount + 1;
    //     gameStats.wordPlayed[i].rowSolved = Math.floor(gameStats.wordPlayed[i].boardInput.length / 5);
    //     setLocalStorage('wordPlayed'); 

    //     let rowStats = createRowStats();
    //     console.log(rowStats, rowStats.winCount);
    //     setLocalStorage('winCount', rowStats.winCount);
    //   }
    // }

    let findCurrentSolutionIndex = gameStats.wordPlayed.findIndex(element => element.word === solution.join('')); //find index
    gameStats.wordPlayed[findCurrentSolutionIndex].winCount = gameStats.wordPlayed[findCurrentSolutionIndex].winCount + 1;
    gameStats.wordPlayed[findCurrentSolutionIndex].rowSolved = Math.floor(gameStats.wordPlayed[findCurrentSolutionIndex].boardInput.length / 5);
    setLocalStorage('wordPlayed'); 
    let rowStats = createRowStats();
    console.log(rowStats, rowStats.winCount);
    setLocalStorage('winCount', rowStats.winCount);

    document.getElementById('id29').blur();
    createConfetti();
  } else if (gameOverCondition) {
    //TODO POPUP BOX WITH PLAY AGAIN, WINNING WORD, DEFINITION... GAME BOARD
    document.getElementById('id29').blur();
    // setLocalStorage('gameCount', gameStats.gameCount + 1);
    setLocalStorage('gameCount', calcGameCount());
    setLocalStorage('winStreak', 0); 
    getWebsterDictionaryAPI();
  } else {
        //TODO KEEP PLAYING ANIMATION
        console.log('keep playing')
  }

  let percentage = calculateWinPercentage();
  setLocalStorage('winPercent', percentage);    
  createGameStatsMenu(); 
  resetCurrentInput();
  // createHistoryTable();
}

function calculateWinPercentage() {
  let percentage = Math.round(gameStats.winCount / gameStats.gameCount * 100) ? Math.round(gameStats.winCount / gameStats.gameCount * 100).toFixed(0) + '%' : '0%';
  return percentage;
}

function resetCurrentInput() {
  currentInput = [];
}

// SECTION SET LOCAL STORAGE
function setLocalStorage(variable, value) {
  // gameStats[variable] = value;
  // localStorage.setItem('gameStats', JSON.stringify(gameStats));

  if (variable === 'wordPlayed') {
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
  } else {
    gameStats[variable] = value;
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
  }
}

// SECTION EMOJI BOARD
function createEmojiRow() {
  let startRowTile = (allInput.length - 1) * 1 - 4;
  let tileEmoji = '';
  let tileEmoji2 = '';
  for (let i = 0; i < 5; i++) {
    if (allInput[startRowTile + i] === solution[i]) {
      // tileEmoji += '🟩';
      tileEmoji += '\uD83D\uDFE9';
      // tileEmoji += '\uD83D\uDC04'
      // tileEmoji2 += '🟦';
      tileEmoji2 += '\uD83D\uDFE6';
    } else if (solution.includes(allInput[startRowTile + i])) {
      // tileEmoji += '🟨';
      tileEmoji += '\uD83D\uDFE8';
      // tileEmoji2 += '🟧';
      tileEmoji2 += '\uD83D\uDFE7';
    } else {
      tileEmoji += '\u2B1B';
      tileEmoji2 += '\u2B1B';
      // tileEmoji += '⬛';
      // tileEmoji2 += '⬛';
    }
  }
  createEmojiBoard(tileEmoji, tileEmoji2);
}

function createEmojiBoard(tileEmoji, tileEmoji2) {
  // currentEmojiBoard += tileEmoji + '\n';
  // currentEmojiBoard2 += tileEmoji2 + '\n';

  // currentEmojiBoard += tileEmoji + '<br>';
  // currentEmojiBoard2 += tileEmoji2 + '<br>';

  currentEmojiBoard += `<p class='game-board'>${tileEmoji}</p>`;
  currentEmojiBoard2 += `<p class='game-board'>${tileEmoji2}</p>`;

  // console.log('currentMiniBoard=\n', currentEmojiBoard);
  // console.log('currentMiniBoard2=\n', currentEmojiBoard2);
}

// SECTION API CODE
async function getWebsterDictionaryAPI() {
  let word = solution.join('').toLowerCase();
  // let wordAudio = '';
  console.log(word);
  let urlElementary = '';
  let urlCollege = '';
  // let audioPronounciation = './assets/pronunce_not_available.mp3';
  // let audioPronounciation = '';

  // let audioPronounciation = '';
  if (document.location.origin === "file://") {
    urlElementary = `https://www.dictionaryapi.com/api/v3/references/sd2/json/${word}?key=8a8c06ea-289c-450d-90f1-cf98924da140`;
    urlCollege = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=d6ad76fd-5324-4925-834b-17a06efafce6`;
    // urlWordnik = `https://api.wordnik.com/v4/word.json/hello/definitions?limit=200&includeRelated=false&useCanonical=false&includeTags=false&api_key=yh6m0pne71140ovktya1nw7ufczqyp1q3lwtzp95yqh4j6fvd`
    // urlWordnik = `https://api.wordnik.com/v4/word.json/${word}/definitions?limit=200&includeRelated=false&useCanonical=false&includeTags=false&api_key=yh6m0pne71140ovktya1nw7ufczqyp1q3lwtzp95yqh4j6fvd`;
    // urlWordnik = `https://api.wordnik.com/v4/word.json/hello/audio?useCanonical=false&limit=50&api_key=yh6m0pne71140ovktya1nw7ufczqyp1q3lwtzp95yqh4j6fvd`;
    urlWordnik = `https://api.wordnik.com/v4/word.json/${word}/audio?useCanonical=false&limit=50&api_key=yh6m0pne71140ovktya1nw7ufczqyp1q3lwtzp95yqh4j6fvd`;
  } else {
    urlElementary = `https://node-api-relay-v3.glitch.me/definition-elementary/${word}`;
    urlCollege = `https://node-api-relay-v3.glitch.me/definition-college/${word}`;
    urlWordnik = `https://node-api-relay-v3.glitch.me/audio-wordnik/${word}`;
  }

  //FIX HIDE API KEYS!!
  console.log('api#1=', elementaryDefinition === 'Placeholder', 'api#2', collegeDefinition === 'Placeholder')
  if (elementaryDefinition === 'Placeholder' && collegeDefinition === 'Placeholder') {
    // fetch(`https://www.dictionaryapi.com/api/v3/references/sd2/json/${solution}?key=8a8c06ea-289c-450d-90f1-cf98924da140`) //elementary dictionary
    // await fetch(`https://node-api-relay2.glitch.me/definition-elementary/${solution.join('')}`)
    await fetch (urlElementary)
    // fetch(elementary_url)
        .then((response) => response.json())
        .then(function (definition) {
          elementaryDefinition = definition[0].shortdef[0];
          console.log('api run 1');
          })
        .catch(err => {
          console.error('API #1 failed:', 'message:', err.message, 'stack:', err.stack);
        })  
        // fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${solution}?key=d6ad76fd-5324-4925-834b-17a06efafce6`) //college dictionary
    // setTimeout(() => {
      // fetch(`https://node-api-relay2.glitch.me/definition-college/${solution.join('')}`)
    await fetch (urlCollege)
          .then((response) => response.json())
          .then(function (definition) {
            collegeDefinition = definition[0].shortdef[0];
            // console.log(definition[0].hwi.prs[0].sound.audio);
            console.log('api run 2');
            })
          .catch(err => {
            console.error('API #2 failed:', 'message:', err.message, 'stack:', err.stack);
          }) 
    // }, 1000);

    // setTimeout(() => {
      // fetch (`https://api.wordnik.com/v4/word.json/hello/definitions?limit=200&includeRelated=false&useCanonical=false&includeTags=false&api_key=yh6m0pne71140ovktya1nw7ufczqyp1q3lwtzp95yqh4j6fvd`)
    await fetch (urlWordnik)
          .then((response) => response.json())
          .then(function (definition) {
            console.log(definition);
            console.log('#1=', definition[0].fileUrl);
            audioPronounciation = definition[0].fileUrl;
            console.log('#2', audioPronounciation)
            // console.log(definition[0].hwi.prs[0].sound.audio);
            console.log('api run 3');
            })
          .catch(err => {
            // audioPronounciation = './assets/pronunce_not_available.mp3';
            console.error('API #3 failed:', 'message:', err.message, 'stack:', err.stack);
          })          
    // }, 1000); 

  }

  setTimeout(() => { 
    displayDefintion(elementaryDefinition, collegeDefinition);
    populateAudio(audioPronounciation);
  }, 300);

  // displayDefintion(elementaryDefinition, collegeDefinition)
}

function displayDefintion(elementaryDefinition, collegeDefinition, wordAudio) {
  console.log('a=', elementaryDefinition) 
  console.log('b=', collegeDefinition) 

  if (elementaryDefinition !== 'Placeholder') {
    displayDefinition = elementaryDefinition;
  } else if (collegeDefinition !== 'Placeholder') {
    displayDefinition = collegeDefinition;
  } else {
    displayDefinition = 'Sorry, definition not available';
  }
  document.querySelector('#definition').innerText = `Definition: ${displayDefinition}`;

  // document.querySelector('#definition').innerHTML = `
  //   Definition: ${displayDefinition}
  //   <audio 
  //     controls="" 
  //     name="media">
  //     <src=""
  //     type="audio/mpeg">
  //   </audio>    
  // `;

  // autoplay=""

  displaySolution.innerText = solution.join('');

//   displaySolution.innerHTML = `
//   Definition: ${displayDefinition}
//   <audio 
//     controls="" 
//     autoplay="" 
//     name="media">
//     <src=""
//     type="audio/mpeg">
//   </audio>    
// `;

displaySolution.innerHTML = `
  ${solution.join('')}
  <media-controller audio>
    <audio
      slot="media"
      src='./assets/pronunce_not_available.mp3'
    ></audio>
    <media-control-bar>
      <media-play-button></media-play-button>
      <p class='play-button'>Play</p>
      <p  class='play-button-line'>|</p>
      <p class='play-button'>0:02</p>
    </media-control-bar>
  </media-controller>
`;

{/* <p class='play-button'>0:01</p> */}
{/* <media-duration-display></media-duration-display> */}
// src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/858/outfoxing.mp3"
// src='pronunce_not_available.mp3'


  document.getElementById('solution').classList.toggle('hidden');
  document.getElementById('definition').classList.toggle('hidden');
  console.log('innerText=', document.querySelector('#definition').innerText);


  let currentRow = Math.floor(allInput.length / 5);
  let greenYellowBoard = `${currentRow}/6\n${currentEmojiBoard}`;
  let blueOrangeBoard = `${currentRow}/6\n${currentEmojiBoard2}`;
  let contrastState = document.querySelector('.contrast-toggle');
  let shareText = '';
  if (currentRow != 0) {
    try {
      shareText = contrastState.classList.contains('contrast-toggle--blueorange') ? blueOrangeBoard : greenYellowBoard;
      // navigator.clipboard.writeText(shareText).then(()=>{alert(`'Copied to clipboard!'\n${shareText}`)});
    } catch (err) {
      console.error('Share failed:', err.message);
    }
  }
  
  document.getElementById('hamburgerPopupMenu').classList.add('hidden');
  // document.getElementById('solution').classList.add('hidden');
  // document.getElementById('definition').classList.add('hidden');
  document.getElementById('createGameStatsMenu').classList.add('hidden');

  document.getElementById('instructionWrapper').classList.add('hidden');
  document.getElementById('toggleInstructionsOffIcon').classList.remove('hidden');
  document.getElementById('toggleInstructionsOnIcon').classList.add('hidden');
  // hideInstructions();

  document.getElementById('confettiWrapper').classList.add('hidden');

  setTimeout(() => {
    document.getElementById('solution').classList.add('hidden');
    document.getElementById('definition').classList.add('hidden');
  }, 7000);

  // document.getElementById('instructionWrapper').innerHTML = `
  //   <div class='instx-title'>
  //     <p class='hidden'>x</p>
  //     <p class='title'>GAME SUMMARY</p>
  //     <p class='click-to-hide-x'>X</p>
  //   </div>
  //   <p class=''>Winner in X Guesses/Try again</p>
  //   <p class=''>Solution: ${solution.join('')}</p>
  //   <p class=''>Definition: ${displayDefinition}</p>
  //   <div class='example-border'>
  //     <p>Game Statistics</p>
  //     <div class='instrx-wrapper'>Board Review</div>
  //     <p>${currentEmojiBoard}</p>
  //     <div class='instrx-wrapper'></div>
  //     <p>The letter I is in the word but in the wrong spot.</p>
  //     <div class='instrx-wrapper'></div>
  //     <p>The letter U is not in the word in any spot.</p>
  //   </div>
  //   <button>Play again</button>
  //   <button>Copy Game Summary</button>
  //   `;
  // document.getElementById('instructionWrapper').classList.remove('hidden');

  // Solution: ${solution.join('')};
  // Definition: ${displayDefinition};

  // console.log(document.querySelector('#audio').innerHTML)
  // console.log('elementary=', definition[0].hwi.prs[0].sound.audio);
  // console.log(`https://media.merriam-webster.com/audio/prons/en/us/mp3/p/pajama02.mp3`);
  // console.log(`https://media.merriam-webster.com/audio/prons/en/us/mp3/p/${definition[0].hwi.prs[0].sound.audio}.mp3`);
}

function populateAudio(audioPronounciation) {
  console.log('audio', audioPronounciation);
  // if (audioPronounciation !== 'Sorry, I could not find the audio') {
  //   displayDefinition = elementaryDefinition;
  // } else if (collegeDefinition !== 'Placeholder') {
  //   displayDefinition = collegeDefinition;
  // } else {
  //   displayDefinition = 'Sorry, I could not find the audio';
  // }

  let audioElement = document.querySelector('audio')
  // audioElement.setAttribute('src', 'https://audio.wordnik.com/10989.mp3?Expires=1648692105&Key-Pair-Id=APKAIHXX6B6C37D2VKVA&Signature=LVv8gcLj3hw7kXGPPacNS7vNM-OyBUNO-HywJ1uNY2nksLAPBjSgWqtZO~V6OsnV59XD8wswl9m3VVBlZYqjFcD6z6Ntji4d5HLG4RC8bDWNV6YbtT9CnfbICeW4g-RaYFVWuyPauXsdnmV1ZIkxJZxCUw4qX0mdBWqgpiKbpNDVJz91xrxIXE75JwdjBGuOOddnYLZVbPwnHeIdHaJWJR0-4K5XhG-in51ZUjeR419l0aArr3ep8Xd2d0Y7NSG0nbc0wO8F-KEeny5XqbYO3MHEqEQT~VgAMDXXaRkpXU04EAT624BTITekv6J1bZ9lgrD0wZaiad8b6VNhwRPtqQ__');
  
  // audioElement.setAttribute('src', `${audioPronounciation}`);
  document.querySelector('audio').src = `${audioPronounciation}`;

  // console.log('duration1=', document.querySelector('div'));
  // console.log('duration2=', document.querySelector('media-controller'));
  // console.log('duration3=', document.querySelector('media-controller').duration);
  // console.log('duration4=', document.querySelector('media-controller').getAttribute('media-current-time'));
  // console.log('duration4a=', document.querySelector('media-current-duration'));
  // console.log('duration4a=', document.querySelector('#container'));

  // document.querySelector('media-controller').getAttribute('media-current-time') === '0' ? document.querySelector('media-controller').setAttribute('media-current-time', '0:10') : document.querySelector('media-controller').setAttribute('media-current-time', '0:10');

  // console.log('duration5=', document.querySelector('media-controller').getAttribute('media-current-time'));
  // console.log('duration6=', document.querySelector('media-controller'));

  // let audioElement = document.querySelector('audio').src = `${wordAudio}`;

  // window.alert(audioPronounciation);

}

// SECTION BUTTONS
function createHamburgerMenu() {
  document.getElementById('hamburgerPopupMenu').innerHTML =
  `
    <div class='click-to-hide-x' onclick='hamburgerMenuShowHide()'>
      <p class='click-to-hide'>x</p>
    </div>
    <div class='hamburger-menu'>
      <div class='mode-description'>
        <p class='mode'>Dark Mode</p>
        <p class='toggle-detail'>Toggle dark / light mode</p>
      </div>
      <div class='hamburger-toggle'>
        <svg class='darkMode-toggle' id='toggleDarkOffIcon' onclick='toggleDarkModeButton()' width='42px' height'42px' viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M 9 7 C 8.378906 7 7.773438 7.066406 7.1875 7.1875 C 6.894531 7.246094 6.59375 7.320313 6.3125 7.40625 C 3.792969 8.203125 1.742188 10.085938 0.71875 12.5 C 0.605469 12.769531 0.492188 13.03125 0.40625 13.3125 C 0.136719 14.164063 0 15.058594 0 16 C 0 16.929688 0.144531 17.8125 0.40625 18.65625 C 0.410156 18.664063 0.402344 18.679688 0.40625 18.6875 C 1.203125 21.207031 3.085938 23.257813 5.5 24.28125 C 5.769531 24.394531 6.03125 24.507813 6.3125 24.59375 C 7.164063 24.863281 8.058594 25 9 25 L 23 25 C 27.957031 25 32 20.957031 32 16 C 32 11.042969 27.957031 7 23 7 Z M 9 9 C 12.878906 9 16 12.121094 16 16 C 16 19.878906 12.878906 23 9 23 C 5.121094 23 2 19.878906 2 16 C 2 15.757813 2.007813 15.515625 2.03125 15.28125 C 2.386719 11.742188 5.363281 9 9 9 Z M 14.625 9 L 23 9 C 26.878906 9 30 12.121094 30 16 C 30 19.878906 26.878906 23 23 23 L 14.625 23 C 16.675781 21.347656 18 18.828125 18 16 C 18 13.171875 16.675781 10.652344 14.625 9 Z"/></svg>
        <svg class='darkmode-toggle hidden' id='toggleDarkOnIcon' onclick='toggleDarkModeButton()' width="42px" height="42px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M 9 7 C 4.039063 7 0 11.035156 0 16 C 0 20.964844 4.039063 25 9 25 L 23 25 C 27.957031 25 32 20.957031 32 16 C 32 11.042969 27.957031 7 23 7 Z M 23 9 C 26.878906 9 30 12.121094 30 16 C 30 19.878906 26.878906 23 23 23 C 19.121094 23 16 19.878906 16 16 C 16 12.121094 19.121094 9 23 9 Z"/></svg>
      </div>
    </div>
    <div class='hamburger-menu'>
      <div class='mode-description'>
        <p class='mode'>High Contrast Mode</p>
        <p class='toggle-detail'>For improved color vision</p>
      </div>
      <div class='hamburger-toggle'>
        <svg class='' id='toggleContrastOffIcon' onclick='toggleContrastModeButton()' width="42px" height="42px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M 9 7 C 8.378906 7 7.773438 7.066406 7.1875 7.1875 C 6.894531 7.246094 6.59375 7.320313 6.3125 7.40625 C 3.792969 8.203125 1.742188 10.085938 0.71875 12.5 C 0.605469 12.769531 0.492188 13.03125 0.40625 13.3125 C 0.136719 14.164063 0 15.058594 0 16 C 0 16.929688 0.144531 17.8125 0.40625 18.65625 C 0.410156 18.664063 0.402344 18.679688 0.40625 18.6875 C 1.203125 21.207031 3.085938 23.257813 5.5 24.28125 C 5.769531 24.394531 6.03125 24.507813 6.3125 24.59375 C 7.164063 24.863281 8.058594 25 9 25 L 23 25 C 27.957031 25 32 20.957031 32 16 C 32 11.042969 27.957031 7 23 7 Z M 9 9 C 12.878906 9 16 12.121094 16 16 C 16 19.878906 12.878906 23 9 23 C 5.121094 23 2 19.878906 2 16 C 2 15.757813 2.007813 15.515625 2.03125 15.28125 C 2.386719 11.742188 5.363281 9 9 9 Z M 14.625 9 L 23 9 C 26.878906 9 30 12.121094 30 16 C 30 19.878906 26.878906 23 23 23 L 14.625 23 C 16.675781 21.347656 18 18.828125 18 16 C 18 13.171875 16.675781 10.652344 14.625 9 Z"/></svg>
        <svg class='hidden' id='toggleContrastOnIcon' onclick='toggleContrastModeButton()' width="42px" height="42px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M 9 7 C 4.039063 7 0 11.035156 0 16 C 0 20.964844 4.039063 25 9 25 L 23 25 C 27.957031 25 32 20.957031 32 16 C 32 11.042969 27.957031 7 23 7 Z M 23 9 C 26.878906 9 30 12.121094 30 16 C 30 19.878906 26.878906 23 23 23 C 19.121094 23 16 19.878906 16 16 C 16 12.121094 19.121094 9 23 9 Z"/></svg>
      </div>
    </div>
    <div class='hamburger-menu'>
      <div class='mode-description'>
        <p class='mode'>View Instructions</p>
        <p class='toggle-detail'>Toggle to view instructions</p>
      </div>
      <div class='hamburger-toggle'>
        <svg class='hidden' id='toggleInstructionsOffIcon' onclick='hideInstructions()' width="42px" height="42px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M 9 7 C 8.378906 7 7.773438 7.066406 7.1875 7.1875 C 6.894531 7.246094 6.59375 7.320313 6.3125 7.40625 C 3.792969 8.203125 1.742188 10.085938 0.71875 12.5 C 0.605469 12.769531 0.492188 13.03125 0.40625 13.3125 C 0.136719 14.164063 0 15.058594 0 16 C 0 16.929688 0.144531 17.8125 0.40625 18.65625 C 0.410156 18.664063 0.402344 18.679688 0.40625 18.6875 C 1.203125 21.207031 3.085938 23.257813 5.5 24.28125 C 5.769531 24.394531 6.03125 24.507813 6.3125 24.59375 C 7.164063 24.863281 8.058594 25 9 25 L 23 25 C 27.957031 25 32 20.957031 32 16 C 32 11.042969 27.957031 7 23 7 Z M 9 9 C 12.878906 9 16 12.121094 16 16 C 16 19.878906 12.878906 23 9 23 C 5.121094 23 2 19.878906 2 16 C 2 15.757813 2.007813 15.515625 2.03125 15.28125 C 2.386719 11.742188 5.363281 9 9 9 Z M 14.625 9 L 23 9 C 26.878906 9 30 12.121094 30 16 C 30 19.878906 26.878906 23 23 23 L 14.625 23 C 16.675781 21.347656 18 18.828125 18 16 C 18 13.171875 16.675781 10.652344 14.625 9 Z"/></svg>
        <svg class='' id='toggleInstructionsOnIcon' onclick='hideInstructions()' width="42px" height="42px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M 9 7 C 4.039063 7 0 11.035156 0 16 C 0 20.964844 4.039063 25 9 25 L 23 25 C 27.957031 25 32 20.957031 32 16 C 32 11.042969 27.957031 7 23 7 Z M 23 9 C 26.878906 9 30 12.121094 30 16 C 30 19.878906 26.878906 23 23 23 C 19.121094 23 16 19.878906 16 16 C 16 12.121094 19.121094 9 23 9 Z"/></svg>
      </div>
    </div>

    <div class='hamburger-menu'>
      <div class='mode-description'>
        <p class='mode'>Start New Game</p>
        <p class='toggle-detail'>Click to start new game</p>
      </div>
      <div class='hamburger-toggle'>
        <svg class='toggleDefinition' id='headerIconSVG' onclick='refreshButton()' viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 16c1.671 0 3-1.331 3-3s-1.329-3-3-3-3 1.331-3 3 1.329 3 3 3z"/><path d="M20.817 11.186a8.94 8.94 0 0 0-1.355-3.219 9.053 9.053 0 0 0-2.43-2.43 8.95 8.95 0 0 0-3.219-1.355 9.028 9.028 0 0 0-1.838-.18V2L8 5l3.975 3V6.002c.484-.002.968.044 1.435.14a6.961 6.961 0 0 1 2.502 1.053 7.005 7.005 0 0 1 1.892 1.892A6.967 6.967 0 0 1 19 13a7.032 7.032 0 0 1-.55 2.725 7.11 7.11 0 0 1-.644 1.188 7.2 7.2 0 0 1-.858 1.039 7.028 7.028 0 0 1-3.536 1.907 7.13 7.13 0 0 1-2.822 0 6.961 6.961 0 0 1-2.503-1.054 7.002 7.002 0 0 1-1.89-1.89A6.996 6.996 0 0 1 5 13H3a9.02 9.02 0 0 0 1.539 5.034 9.096 9.096 0 0 0 2.428 2.428A8.95 8.95 0 0 0 12 22a9.09 9.09 0 0 0 1.814-.183 9.014 9.014 0 0 0 3.218-1.355 8.886 8.886 0 0 0 1.331-1.099 9.228 9.228 0 0 0 1.1-1.332A8.952 8.952 0 0 0 21 13a9.09 9.09 0 0 0-.183-1.814z"/></svg>
      </div>
    </div>

    <div class='hamburger-menu'>
      <div class='mode-description'>
        <p class='mode'>Solution/Definition</p>
        <p class='toggle-detail'>Click for solution/definition</p>
      </div>
      <div class='hamburger-toggle'>
        <svg class='toggleDefinition' id='headerIconSVG' onclick='definitionButton()' version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 459.319 459.319" style="enable-background:new 0 0 459.319 459.319;" xml:space="preserve"><g><path d="M141.288,189.821h-23.685V145.28h23.528v-23.69h21.016v23.374h23.681v44.707h-23.681v0.151H141.288z M60.801,398.87 c0.012,1.1,0.03,1.921,0.042,2.459c0.006,0.331-0.053,0.638-0.071,0.963c0.739,18.224,15.755,32.817,34.146,32.817h303.76v-33.461 c0-6.68,5.421-12.105,12.105-12.105c6.679,0,12.105,5.426,12.105,12.105v45.565c0,6.686-5.427,12.105-12.105,12.105H93.091 c-0.629,0-1.235-0.089-1.847-0.183c-30.505-1.91-54.757-27.261-54.757-58.245c0-0.71,0.085-1.396,0.109-2.099 c-0.375-35.943,0-309.36,0.042-339.109c-0.047-0.423-0.127-0.827-0.127-1.259C36.511,26.205,62.719,0,94.938,0h19.343h293.535 h2.955c6.685,0,12.105,5.423,12.105,12.105v342.139c0,6.679-5.421,12.104-12.105,12.104c-0.071,0-0.13-0.023-0.201-0.023 c-0.887,0.213-1.82,0.354-2.772,0.354H94.918C76.736,366.674,61.859,380.948,60.801,398.87z M278.347,121.59h94.425v20.862h-23.685 v23.69h-23.525v23.685h-23.69v23.533h-23.536v49.882h120.792v-26.209h-94.584v-20.859h23.69V192.49h23.525v-23.69h23.689V145.28 h23.679V95.237h-120.78V121.59z M224.949,192.49h56.265v-26.353h-56.265V192.49z M91.41,263.229h26.2v-47.056h23.679v-0.15h44.54 v47.219h26.354v-120.79h-23.688v-23.841H164.81V95.237h-26.202v23.684h-23.685v23.69H91.389v120.618H91.41z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
      </div>
    </div>

    <div class='hamburger-menu'>
      <div class='mode-description'>
        <p class='mode'>View Game History</p>
        <p class='toggle-detail'>Click to view game history</p>
      </div>
      <div class='hamburger-toggle'>
        <svg class='toggleDefinition' id='headerIconSVG' onclick='displayGameHistory()'version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="503.379px" height="503.379px" viewBox="0 0 503.379 503.379" style="enable-background:new 0 0 503.379 503.379;"xml:space="preserve"><g><path d="M458.091,128.116v326.842c0,26.698-21.723,48.421-48.422,48.421h-220.92c-26.699,0-48.421-21.723-48.421-48.421V242.439 c6.907,1.149,13.953,1.894,21.184,1.894c5.128,0,10.161-0.381,15.132-0.969v211.594c0,6.673,5.429,12.104,12.105,12.104h220.92 c6.674,0,12.105-5.432,12.105-12.104V128.116c0-6.676-5.432-12.105-12.105-12.105H289.835c0-12.625-1.897-24.793-5.297-36.315 h125.131C436.368,79.695,458.091,101.417,458.091,128.116z M159.49,228.401c-62.973,0-114.202-51.229-114.202-114.199 C45.289,51.229,96.517,0,159.49,0c62.971,0,114.202,51.229,114.202,114.202C273.692,177.172,222.461,228.401,159.49,228.401z  M159.49,204.19c49.618,0,89.989-40.364,89.989-89.988c0-49.627-40.365-89.991-89.989-89.991 c-49.626,0-89.991,40.364-89.991,89.991C69.499,163.826,109.87,204.19,159.49,204.19z M227.981,126.308 c6.682,0,12.105-5.423,12.105-12.105s-5.423-12.105-12.105-12.105h-56.386v-47.52c0-6.682-5.423-12.105-12.105-12.105 s-12.105,5.423-12.105,12.105v59.625c0,6.682,5.423,12.105,12.105,12.105H227.981z M367.697,224.456h-131.14 c-6.682,0-12.105,5.423-12.105,12.105c0,6.683,5.423,12.105,12.105,12.105h131.14c6.685,0,12.105-5.423,12.105-12.105 C379.803,229.879,374.382,224.456,367.697,224.456z M367.91,297.885h-131.14c-6.682,0-12.105,5.42-12.105,12.105 s5.423,12.105,12.105,12.105h131.14c6.685,0,12.104-5.42,12.104-12.105S374.601,297.885,367.91,297.885z M367.91,374.353h-131.14 c-6.682,0-12.105,5.426-12.105,12.105c0,6.685,5.423,12.104,12.105,12.104h131.14c6.685,0,12.104-5.42,12.104-12.104 C380.015,379.778,374.601,374.353,367.91,374.353z"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
       </div>
    </div>

    <div class='hamburger-menu'>
      <div class='mode-description'>
        <p class='mode'>Delete Game History</p>
        <p class='toggle-detail'>Clear all history & settings</p>
      </div>
      <div class='hamburger-toggle'>
        <svg class='toggleDefinition' id='headerIconSVG' onclick='clearStorage()' version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 473 473" style="enable-background:new 0 0 473 473;" xml:space="preserve"><g><path d="M317.667,214.42l5.667-86.42h20.951V38h-98.384V0H132.669v38H34.285v90h20.951l20,305h140.571 c23.578,24.635,56.766,40,93.478,40c71.368,0,129.43-58.062,129.43-129.43C438.715,275.019,385.143,218.755,317.667,214.42z 	M162.669,30h53.232v8h-53.232V30z M64.285,68h250v30h-250V68z M103.334,403L85.301,128H293.27l-5.77,87.985 c-61.031,10.388-107.645,63.642-107.645,127.586c0,21.411,5.231,41.622,14.475,59.43H103.334z M309.285,443 c-54.826,0-99.43-44.604-99.43-99.43s44.604-99.429,99.43-99.429s99.43,44.604,99.43,99.429S364.111,443,309.285,443z"/><polygon points="342.248,289.395 309.285,322.358 276.322,289.395 255.109,310.608 288.072,343.571 255.109,376.533 276.322,397.746 309.285,364.783 342.248,397.746 363.461,376.533 330.498,343.571 363.461,310.608 	"/></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
     </div>
    </div>

  </div>
      `;
  // document.getElementById('hamburgerPopupMenu').classList.toggle('hidden');
}

function hamburgerMenuShowHide() { 
  document.getElementById('hamburgerPopupMenu').classList.toggle('hidden');

  // document.getElementById('hamburgerPopupMenu').classList.add('hidden');
  document.getElementById('solution').classList.add('hidden');
  document.getElementById('definition').classList.add('hidden');
  document.getElementById('createGameStatsMenu').classList.add('hidden');

  // document.getElementById('instructionWrapper').classList.add('hidden');
  // hideInstructions();

  document.getElementById('confettiWrapper').classList.add('hidden');

  allowInputCurrentGame();
  // if (gameStats.wordPlayed[gameStats.wordPlayed.length - 1].winCount === 0) {
  //   for (let i = 0; i < 30; i++) {
  //     document.getElementById('id' + (i)).removeAttribute('disabled');
  //   }  //todo disabled //section
  // }
  
  document.getElementById('historyBoardWrapper').classList.add('hidden');
  document.getElementById('historyTable').classList.add('hidden');
  document.getElementById('tableHeaderRow').classList.add('hidden');
}

function statsMenuShowHide() { 
  allowInputCurrentGame();
  // if (gameStats.wordPlayed[gameStats.wordPlayed.length - 1].winCount === 0) {
  //   for (let i = 0; i < 30; i++) {
  //     document.getElementById('id' + (i)).removeAttribute('disabled');
  //   }  //todo disabled //section
  // }

  document.getElementById('hamburgerPopupMenu').classList.add('hidden');
  document.getElementById('solution').classList.add('hidden');
  document.getElementById('definition').classList.add('hidden');
  // document.getElementById('createGameStatsMenu').classList.add('hidden');
  
  document.getElementById('instructionWrapper').classList.add('hidden');
  document.getElementById('toggleInstructionsOffIcon').classList.remove('hidden');
  document.getElementById('toggleInstructionsOnIcon').classList.add('hidden');
  // hideInstructions();
  document.getElementById('confettiWrapper').classList.add('hidden');
  document.getElementById('copyNotification').classList.add('hidden');
  
  document.getElementById('createGameStatsMenu').classList.toggle('hidden');

  // console.trace();
  createGameStatsMenu();
}

// function windowClick() {
//   // console.log(window.screen, window.innerHeight, window.innerWidth, navigator.appVersion);
//   window.alert(`height=${window.screen.height}\nwidth=${window.screen.width}\n${navigator.appVersion}`);
//   document.getElementById('instructionWrapper').classList.remove('hidden');
//   document.getElementById('instructionWrapper').innerHTML  = `height=${window.screen.height}\nwidth=${window.screen.width}\n${navigator.appVersion}`;
//   console.log(document.getElementById('instructionWrapper').innerHTML = `height=${window.screen.height}\nwidth=${window.screen.width}\n${navigator.appVersion}`)
// }

function getKeyboardButton() {
//   // createOnscreenKeyboard();
//   // document.querySelector('.keyboard-wrapper').classList.toggle('hidden');
//   // focusCurrentTile();
}

function refreshButton() {
  location.reload(true);
  // focusCurrentTile();
}

function toggleDarkModeButton(storageDarkValue) {
  document.getElementById('toggleDarkOffIcon').classList.toggle('hidden');
  document.getElementById('toggleDarkOnIcon').classList.toggle('hidden');
  document.querySelector('.darkmode-toggle-button').blur();
  // toggleDarkMode();
  toggleDarkMode(storageDarkValue)
  // focusCurrentTile();
  // event.preventDefault;
} 

function toggleContrastModeButton(storageContrastValue) {
  document.getElementById('toggleContrastOffIcon').classList.toggle('hidden');
  document.getElementById('toggleContrastOnIcon').classList.toggle('hidden');
  document.querySelector('.contrast-toggle').blur();
  toggleContrastMode(storageContrastValue);
  // createGameStatsMenu();
  // focusCurrentTile();
  // event.preventDefault;
} 

function definitionButton() {
  getWebsterDictionaryAPI();
  hamburgerMenuShowHide();
  // document.getElementById('createGameStatsMenu').classList.toggle('hidden');
  // hideInstructions();

  // focusCurrentTile();
} 

function createGameStatsMenu() {
  let percentage = calculateWinPercentage();
  let greenYellowBoard = `${currentEmojiBoard}`;
  let blueOrangeBoard = `${currentEmojiBoard2}`;
  const contrastModeCSS = document.querySelector("#contrastMode-link");
  let gameBoard = contrastModeCSS.getAttribute("href") === "../src/css/contrast-theme-blue.css" ? blueOrangeBoard : greenYellowBoard;

  // "../src/css/contrast-theme-green.css"

  document.getElementById('createGameStatsMenu').innerHTML = `
    <div class='click-to-hide' id='clickToHideX' onclick='statsMenuShowHide()'>x</div>
    <p class='win-description'>GAME INFORMATION</p>
    <div class='gameStats-menu'>
      <div class='stat-description'>
        <p class=''>Played<br></p>
        <p class=''>${gameStats.gameCount}</p>
      </div>
      <div class='stat-description'>
        <p class=''>Wins</p>
        <p class=''>${gameStats.winCount}</p>
      </div>
      <div class='stat-description'>
        <p class=''>Win%</p>
        <p class=''>${percentage}</p>
      </div>
    </div>
    <div class='win-stats-wrapper'>
      <p class='win-description'>Win Distribution</p>
      <div class='bars-wrapper' id='progressBarWrapper'></div>
    </div>
    <div class='current-stats' id='currentStats'>
      <div class='gameBoard-wrapper' id='gameBoardWrapper'>
        <p class='current-game-text'>Game Board</p>
        <p class='current-game-text'>#${gameStats.wordPlayed[gameStats.wordPlayed.length - 1].solutionNumber}, ${gameStats.wordPlayed[gameStats.wordPlayed.length - 1].rowSolved}/6</p>
        ${gameBoard}
      </div>
      <div class='spacer'></div>
      <div class='streak-stats'>
        <div class='description-container'>
          <p class='description'>Current Streak</p>
          <p class='description'>${gameStats.winStreak}</p>
        </div>
        <div class='description-container'>
          <p class='description'>Max Streak</p>
          <p class='description'>${gameStats.maxWins}</p>
        </div>
      </div>
    </div>
    <div class='stats-buttons' id='statsButtons'>
      <button class='play-again-button' onclick="refreshButton()">${'Play\nAgain'}</button>
      <div class='stats-button-spacer'></div>
      <div>
        <button class='copy-buttons' onclick="copyToClipboard('createGameStatsMenu')">Share Stats</button>
        <input class='copy-buttons' id="btn" onclick="copyToClipboard('gameBoardWrapper')" type="button" value="Share Board"></input>
      </div>
    </div>
  `;

  // for (let i = 1; i < 7; i++) {
  //   let rowWinCount = `${gameStats['row' + i]}`
  //   let rowWidth = Math.round((145 * (gameStats['row' + i] / gameStats.winCount))) ? Math.round((145 * (gameStats['row' + i] / gameStats.winCount))) : 15;
  //   let rowWinPercent = `${gameStats['row' + i] / gameStats.winCount ? Math.round((gameStats['row' + i] / gameStats.winCount) * 100) : '0'}%`;
  //   document.getElementById('progressBarWrapper').innerHTML += `
  //     <p class='row-number'>${i}</p>
  //     <div class='bar-wrapper'>
  //       <div class='progress-bar2' style='width: ${rowWidth}px'>${rowWinCount}</div>
  //     </div>
  //     <p class='win-percent'>${rowWinPercent}</p> 
  //   `
  // }

  let rowStats = createRowStats();
  // console.log(rowStats);

  for (let i = 1; i < 7; i++) {
    // console.log(rowStats['row' + i]);
    let rowWinCount = rowStats['row' + i];
    let rowWidth = Math.round((145 * (rowStats['row' + i] / rowStats.winCount))) ? Math.round((145 * (rowStats['row' + i] / rowStats.winCount))) : 15;
    let rowWinPercent = `${rowStats['row' + i] / rowStats.winCount ? Math.round((rowStats['row' + i] / rowStats.winCount) * 100) : '0'}%`;
    document.getElementById('progressBarWrapper').innerHTML += `
      <p class='row-number'>${i}</p>
      <div class='bar-wrapper'>
        <div class='progress-bar2' style='width: ${rowWidth}px'>${rowWinCount}</div>
      </div>
      <p class='win-percent'>${rowWinPercent}</p> 
    `
  }

  // <p class=''>${gameStats.gameCount}</p>
  // console.trace();
  // document.getElementById('hamburgerPopupMenu').classList.toggle('hidden');
}

function createRowStats() {
  let rowStats = {'incompleteGame': 0, 'row1': 0, 'row2': 0, 'row3': 0, 'row4': 0, 'row5': 0, 'row6': 0, 'winCount': 0};
  for (let i = 0; i < gameStats.wordPlayed.length; i++) {
    gameStats.wordPlayed[i].rowSolved === 0 && (rowStats.incompleteGame ++);
    gameStats.wordPlayed[i].rowSolved === 1 && (rowStats.row1 ++);
    gameStats.wordPlayed[i].rowSolved === 2 && (rowStats.row2 ++);
    gameStats.wordPlayed[i].rowSolved === 3 && (rowStats.row3 ++);
    gameStats.wordPlayed[i].rowSolved === 4 && (rowStats.row4 ++);
    gameStats.wordPlayed[i].rowSolved === 5 && (rowStats.row5 ++);
    gameStats.wordPlayed[i].rowSolved === 6 && (rowStats.row6 ++);
    gameStats.wordPlayed[i].rowSolved !== 0 && (rowStats.winCount ++);
  }
  // console.log(testObject2);
  return rowStats;
}

function copyGameBoardButton() {
  document.getElementById('hamburgerPopupMenu').classList.add('hidden');
  document.getElementById('solution').classList.add('hidden');
  document.getElementById('definition').classList.add('hidden');
  document.getElementById('createGameStatsMenu').classList.add('hidden');
  document.getElementById('instructionWrapper').classList.add('hidden');
  document.getElementById('confettiWrapper').classList.add('hidden');
  document.querySelector('.spacer1').classList.add('hidden');
  document.querySelector('.spacer2').classList.add('hidden');
  // document.getElementById('copyNotification').classList.add('hidden');
  document.getElementById('tableHeaderRow').classList.add('hidden');
  document.getElementById('historyTable').classList.add('hidden');
  // document.getElementById('historyButton').classList.add('hidden');

  allowInputCurrentGame();
  // if (gameStats.wordPlayed[gameStats.wordPlayed.length - 1].winCount === 0) {
  //   for (let i = 0; i < 30; i++) {
  //     document.getElementById('id' + (i)).removeAttribute('disabled');
  //   }  //todo disabled //section
  // }

  copyToClipboard('body');

  document.querySelector('.spacer1').classList.remove('hidden');
  document.querySelector('.spacer2').classList.remove('hidden');
}

// function copyHistoryTableButton(element) {
//   document.querySelector('.spacer1').classList.add('hidden');
//   document.querySelector('.spacer2').classList.add('hidden');

//   document.getElementById('hamburgerPopupMenu').classList.add('hidden');
//   document.getElementById('solution').classList.add('hidden');
//   document.getElementById('definition').classList.add('hidden');
//   document.getElementById('inputTilesRow1').classList.add('hidden');
//   document.getElementById('instructionWrapper').classList.add('hidden');
//   document.getElementById('confettiWrapper').classList.add('hidden');
//   document.getElementById('createGameStatsMenu').classList.add('hidden');
//   document.getElementById('copyNotification').classList.add('hidden');
//   document.getElementById('tableHeaderRow').classList.add('hidden');
//   document.getElementById('excelButton').classList.add('hidden');
//   document.getElementById('historyButton').classList.add('hidden');
//   document.getElementById('keyboardWrapper').classList.add('hidden');

//   copyToClipboard(element);

//   document.getElementById('header').classList.remove('hidden');
//   document.querySelector('.spacer1').classList.remove('hidden');
//   document.querySelector('.spacer2').classList.remove('hidden');
//   document.getElementById('excelButton').classList.remove('hidden');
//   document.getElementById('historyButton').classList.remove('hidden');
//   document.getElementById('keyboardWrapper').classList.remove('hidden');
//   document.getElementById('tableHeaderRow').classList.remove('hidden');
//   document.getElementById('inputTilesRow1').classList.add('hidden');

//   for (let i = 0; i < 30; i++) {
//     document.getElementById('id' + (i)).removeAttribute('disabled');
//   } //todo disabled //section
// }

function copyToClipboard(element) {
  let range, selection;

  console.log(element, element === 'historyTable');

  // element === 'historyTable' ? element = 'body' : element;
  alert('history table copy 2')

  let referenceNode = document.getElementById(element);
  
  console.log(element, referenceNode);


  if (document.body.createTextRange) {
    console.log('1=', document.body.createTextRange);
    range = document.body.createTextRange();
    range.moveToElementText(referenceNode);
    range.select();
  } else if (window.getSelection) {
    selection = window.getSelection();        
    range = document.createRange();
    range.selectNodeContents(referenceNode);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  document.getElementById('statsButtons') ? document.getElementById('statsButtons').classList.add('hidden') : null;
  document.getElementById('clickToHideX') ? document.getElementById('clickToHideX').classList.add('hidden') : null;
  document.execCommand('copy');
  document.getElementById('statsButtons') ? document.getElementById('statsButtons').classList.remove('hidden') : null;
  document.getElementById('clickToHideX') ? document.getElementById('clickToHideX').classList.remove('hidden') : null;
  // document.getElementById('statsButtons').classList.remove('hidden');
  // document.getElementById('clickToHideX').classList.remove('hidden');


  window.getSelection().removeAllRanges();


  // document.getElementById("btn").value="Copied";

  // document.getElementById('copyNotification').innerText = 'Screen Capture Copied To Clipboard';
  // document.getElementById('copyNotification').classList.toggle('hidden');
  // setTimeout(() => {
  //   document.getElementById('copyNotification').classList.add('hidden');
  // }, 3000);
  displayMessage('Screen Capture Copied To Clipboard');
}

function displayGameHistory() {
  createHistoryTable();
  document.getElementById('historyTable') ? document.getElementById('historyTable').classList.remove('hidden') : null;
  
  document.getElementById('hamburgerPopupMenu').classList.add('hidden');
  document.getElementById('copyNotification').classList.add('hidden');
  // document.getElementById('inputTilesRow1').classList.add('hidden');
  document.getElementById('instructionWrapper').classList.add('hidden');
  document.getElementById('confettiWrapper').classList.add('hidden');
  //todo message
  document.getElementById('solution').classList.add('hidden');
  document.getElementById('definition').classList.add('hidden');
  document.getElementById('createGameStatsMenu').classList.add('hidden');

  // for (let i = 0; i < 30; i++) {
  //   document.getElementById('id' + (i)).removeAttribute('disabled');
  // } //todo disabled //section

  document.getElementById('toggleInstructionsOffIcon').classList.remove('hidden');
  document.getElementById('toggleInstructionsOnIcon').classList.add('hidden');
  // hideInstructions();
  // document.getElementById('createGameStatsMenu').classList.toggle('hidden');
}

function displayHistoryBoard() {
//   createHistoryBoard();
//   document.getElementById('historyBoard') ? document.getElementById('historyBoard').classList.remove('hidden') : null;
  
//   document.getElementById('hamburgerPopupMenu').classList.add('hidden');
//   document.getElementById('copyNotification').classList.add('hidden');
//   // document.getElementById('inputTilesRow1').classList.add('hidden');
//   document.getElementById('instructionWrapper').classList.add('hidden');
//   document.getElementById('confettiWrapper').classList.add('hidden');
//   //todo message
//   document.getElementById('solution').classList.add('hidden');
//   document.getElementById('definition').classList.add('hidden');
//   document.getElementById('createGameStatsMenu').classList.add('hidden');

//   for (let i = 0; i < 30; i++) {
//     document.getElementById('id' + (i)).removeAttribute('disabled');
//   }

//   document.getElementById('toggleInstructionsOffIcon').classList.remove('hidden');
//   document.getElementById('toggleInstructionsOnIcon').classList.add('hidden');
//   // hideInstructions();
//   // document.getElementById('createGameStatsMenu').classList.toggle('hidden');
}

// SECTION DARK & CONTRAST MODE
function toggleDarkMode(storageDarkValue) {
  const darkModeCSS = document.querySelector("#darkMode-link");
  const darkModeIconList = document.querySelectorAll('.header-icon-svg');
  // console.trace();
  // console.log(storageDarkValue);

  if (storageDarkValue === true) {
    // console.log('1')
    // darkModeCSS.href = "dark-theme.css";
    darkModeCSS.setAttribute("href", "dark-theme.css")
    document.getElementById('toggleDarkOffIcon').classList.toggle('hidden');
    document.getElementById('toggleDarkOnIcon').classList.toggle('hidden');
  } else if (storageDarkValue === null || storageDarkValue === false) {
    return;
  } else {
    darkModeCSS.getAttribute("href") === "light-theme.css" ? storageDarkValue = true : storageDarkValue = false;
    // darkModeCSS.getAttribute("href") === "light-theme.css" ? darkModeCSS.href = "dark-theme.css" : darkModeCSS.href = "light-theme.css";
    // darkModeCSS.getAttribute("href") === "light-theme.css" ? darkModeCSS.setAttribute("href", "dark-theme.css") : darkModeCSS.setAttribute("href", "light-theme.css");
    darkModeCSS.getAttribute("href") === "../src/css/light-theme.css" ? darkModeCSS.setAttribute("href", "../src/css/dark-theme.css") : darkModeCSS.setAttribute("href", "../src/css/light-theme.css");

    // ../src/css/light-theme.css

    setLocalStorage('darkMode', storageDarkValue);
  }
  // console.log(darkModeIconList, darkModeIconList.length);
  for (let i = 0; i < darkModeIconList.length; i++) {
    darkModeIconList[i].classList.toggle('darkmode-svg-toggle--white');
  }
  // focusCurrentTile();
  // createHistoryTable();
  historyTableStyle();
}

function setColorContrast() {
  let startRowTile = (allInput.length - 1) * 1 - 4;
  // let endRowTile = startRowTile + 4; 
  for (let i = 0; i < 5; i++) {
    if (allInput[startRowTile + i] === solution[i]) {
      document.getElementById('id' + (startRowTile + i)).classList.add('contrast-toggle--exactMatch');
    } else if (solution.includes(allInput[startRowTile + i])) {
      document.getElementById('id' + (startRowTile + i)).classList.add('contrast-toggle--match');
    } else {
      document.getElementById('id' + (startRowTile + i)).classList.add('contrast-toggle--noMatch');
    }
  }
  // console.trace();
}

function toggleContrastMode(storageContrastValue) {
  let contrastModeCSS = document.querySelector("#contrastMode-link");
  const blue = '../src/css/contrast-theme-blue.css';
  const green = '../src/css/contrast-theme-green.css';
  if (storageContrastValue === true) {
    contrastModeCSS.href = blue;
    document.getElementById('toggleContrastOffIcon').classList.toggle('hidden');
    document.getElementById('toggleContrastOnIcon').classList.toggle('hidden');
  } else if (storageContrastValue === null || storageContrastValue === false) {
    return;
  } else {
    contrastModeCSS.getAttribute('href') === "../src/css/contrast-theme-green.css" ? storageContrastValue = true : storageContrastValue = false;
    contrastModeCSS.getAttribute('href') === "../src/css/contrast-theme-green.css" ? contrastModeCSS.href = blue : contrastModeCSS.href = green;
    setLocalStorage('contrastMode', storageContrastValue);
  }
  // console.trace();
  // focusCurrentTile();
}

//SECTION FOCUS TILE
function focusCurrentTile() {
  let status = '';
  let checkLengthNotZero = false;
  let checkLengthEqualToFive = false;
  let checkStatus = false;
  let currentTile = 0;

  if (allInput.length !== 0) {
    checkLengthNotZero = true;
    checkLengthEqualToFive = (allInput.length % 5 === 0);
    status = document.getElementById('id' + (allInput.length - 1)).dataset.status;
    checkStatus = (status !== 'noMatch' && status !== 'match' && status !== 'exactMatch');
  }
  checkLengthNotZero && checkLengthEqualToFive && checkStatus ? (currentTile = allInput.length - 1) : (currentTile = allInput.length);
  console.log(currentTile);

  if (allInput.length < 30) {
    document.getElementById('id' + (currentTile)).focus();
  };
}

//SECTION HISTORY TABLE

function createHistoryTable() {
  document.getElementById('historyTable').innerHTML =
  `
    <table id='testExport'>
      <thead class='history-header' id='historyHeader'></thead>
      <tbody class='history-data' id='historyData'></tbody>
      <tfoot class='history-footer' id='historyFooter'></tfoot>
    </table>
  `

  document.getElementById('historyHeader').innerHTML =
  `
    <tr>
      <th class='table-header' rowspan="1" onclick="sortHistoryTable('orderPlayed')">Order</th>
      <th class='table-header' rowspan="1" onclick="sortHistoryTable('word')">Word</th>
      <th class='table-header' rowspan="1" onclick="sortHistoryTable('playedCount')">Played</th>
      <th class='table-header' rowspan="1" onclick="sortHistoryTable('winCount')">Win / Win%</th>
      <th class='table-header' rowspan="1" onclick="sortHistoryTable('rowSolved')">Row Solved</th>
      <th class='table-header' rowspan="1">Game Board</th>
      <th class='table-header' rowspan="1" onclick="sortHistoryTable('datePlayed')">Date</th>
      <th class='table-header' rowspan="1" onclick="sortHistoryTable('solutionNumber')">Number</th>
  </tr>
  `
  document.getElementById('historyData').innerHTML = '';
  for (let i = 0; i < gameStats.wordPlayed.length; i++) {
    document.getElementById('historyData').innerHTML +=
    `
      <tr>
        <td scope="row">${gameStats.wordPlayed[i].orderPlayed}</td>
        <td scope="row">${gameStats.wordPlayed[i].word[0] + gameStats.wordPlayed[i].word.slice(1).toLowerCase()}</td>
        <td scope="row">${gameStats.wordPlayed[i].playedCount}</td>
        <td scope="row">${gameStats.wordPlayed[i].winCount}</td>
        <td>${gameStats.wordPlayed[i].rowSolved}</td>
        <td scope="row" class='history-board-link' id='${gameStats.wordPlayed[i].word}' onclick='createHistoryBoard(event)'>View</td>
        <td>${gameStats.wordPlayed[i].datePlayedShort}</td>
        <td>${gameStats.wordPlayed[i].solutionNumber}</td>
      </tr>
    `
  }
  // let winPercent = `${gameStats.winPercent ? Math.round((gameStats.winPercent) * 100) : '0'}%`;
  let winPercent = calculateWinPercentage();
  // let winCount = gameStats.winCount;
  let winCountPercent = gameStats.winCount + '/' + winPercent;
  document.getElementById('historyFooter').innerHTML =
  `
    <tr>
      <th></th>
      <th>Total</th>
      <th>${gameStats.gameCount}</th>
      <th>${winCountPercent}</th>
      <th><button id='historyButton' onclick="exportTableToExcel('historyTable')">Excel</button></th>
      <th><button id='historyButton' onclick="copyToClipboard('historyTable')">Copy</button></th>
      <th></th>
      <th></th>
    </tr>
  `
  historyTableStyle();
  document.getElementById('tableHeaderRow').classList.remove('hidden');
  document.getElementById('inputTilesRow1').classList.add('hidden');

  for (let x = 0; x < 30; x++) {
    document.getElementById('id' + (x)).setAttribute('disabled', 'disabled');
  }
}

{/* <th>${gameStats.gameCount}</th> */}
{/* <th><button id='excelButton' onclick="copyHistoryTableButton('historyTable')">Excel</button></th> */}
{/* <th><button id='historyButton' onclick="exportTableToExcel('tblData')">Excel</button></th> */}

function sortHistoryTable(sortColumn) {
  console.log(sortColumn);
  let wordPlayedHistory = gameStats.wordPlayed;
  let sortedHistory = [];

  if (sortColumn === 'datePlayed') {
    sortedHistory = [...wordPlayedHistory].sort(function(a, b) {
      if (new Date(a[sortColumn]) < new Date(b[sortColumn])) {
        return -1;
      }
      if (new Date(a[sortColumn]) > new Date(b[sortColumn])) {
        return 1;
      }
      // names must be equal
      return 0;
    })
    // alert('testing date sort')
  } else {
    sortedHistory = [...wordPlayedHistory].sort(function(a, b) {
      if (a[sortColumn] < b[sortColumn]) {
        return -1;
      }
      if (a[sortColumn] > b[sortColumn]) {
        return 1;
      }
      // names must be equal
      return 0;
    })
  }

  sortColumn === 'winCount' || sortColumn === 'playedCount' || sortColumn === 'rowSolved' ? sortedHistory.reverse() : sortedHistory;

  document.getElementById('historyData').innerHTML = '';
  for (let i = 0; i < sortedHistory.length; i++) {
    document.getElementById('historyData').innerHTML +=
    `
      <tr>
        <th scope="row">${sortedHistory[i].orderPlayed}</th>
        <th scope="row" id=${`sort${i}`}>${sortedHistory[i].word[0] + sortedHistory[i].word.slice(1).toLowerCase()}</th>
        <td scope="row">${sortedHistory[i].playedCount}</td>
        <th scope="row">${sortedHistory[i].winCount}</th>
        <td>${sortedHistory[i].rowSolved}</td>
        <th scope="row" class='history-board-link' id='${sortedHistory[i].word}' onclick='createHistoryBoard(event)'>View</th>
        <th>${sortedHistory[i].datePlayedShort}</th>
        <td>${sortedHistory[i].solutionNumber}</td>
      </tr>
    `
  }
  historyTableStyle();
  // document.getElementById('sort0').scrollIntoView();
  document.getElementById('sort0').scrollIntoView({behavior: "auto", block: "end", inline: "nearest"});
  document.getElementById('tableHeaderRow').classList.remove('hidden');
}

function historyTableStyle() {
  let tableHeader = document.querySelectorAll('.table-header');
  for (let i = 0; i < tableHeader.length; i++) {
    // console.log(tableHeader[i].innerText !== 'Game Board', document.querySelector("#darkMode-link").getAttribute("href") === "light-theme.css")
    if (tableHeader[i].innerText !== 'Game Board' && document.querySelector("#darkMode-link").getAttribute("href") === "light-theme.css") {
      tableHeader[i].style.color = 'blue';
      tableHeader[i].style.textDecoration = 'underline';
    } else if (tableHeader[i].innerText === 'Game Board' && document.querySelector("#darkMode-link").getAttribute("href") === "dark-theme.css") {
      tableHeader[i].style.color = 'white';
    } else if (tableHeader[i].innerText === 'Game Board') {
      tableHeader[i].style.color = 'black';
    } else if (document.querySelector("#darkMode-link").getAttribute("href") === "dark-theme.css") {
      tableHeader[i].style.color = '#BB86FD';
      tableHeader[i].style.textDecoration = 'underline';
    }
  }

  let viewBoardLink = document.querySelectorAll('.history-board-link');
  for (let i = 0; i < viewBoardLink.length; i++) {
    if (document.querySelector("#darkMode-link").getAttribute("href") === "dark-theme.css") {
      viewBoardLink[i].style.color = '#BB86FD';
      viewBoardLink[i].style.textDecoration = 'underline';
    } else {
      viewBoardLink[i].style.color = 'blue';
      viewBoardLink[i].style.textDecoration = 'underline';
    }
  }
}

function createHistoryBoard(event) {
  // console.log(event.target.id, event.target, event);
  for (let i = 0; i < gameStats.wordPlayed.length; i++) {
    // console.log(gameStats.wordPlayed[i].word === event.target.id, gameStats.wordPlayed[i].word, event.target.id)
    if (gameStats.wordPlayed[i].word === event.target.id) {
      historyBoardInput = gameStats.wordPlayed[i].boardInput;
      wordPlayed = event.target.id;
    }
  }

  document.getElementById('historyBoard').innerHTML = '';
  for (let x = 0; x < 30; x++) {
    // console.log('a')
    document.getElementById('historyBoard').innerHTML += 
    `   
      <input  type='text' 
              id=${`idh${x}`}
              maxlength='1'
              name='selection'
              value='${historyBoardInput[x] ? historyBoardInput[x] : ''}'
              size='1'
              data-status='start'
              style='text-transform:uppercase'>
    `;
  }  

  for (let i = 0; i < 30; i++) {
    if (historyBoardInput[i] === wordPlayed[i % 5]) {
      document.getElementById('idh' + i).classList.add('contrast-toggle--exactMatch');
      document.getElementById('idh' + i).setAttribute('data-status', 'exactMatch');
    } else if (wordPlayed.includes(historyBoardInput[i])) {
      document.getElementById('idh' + i).classList.add('contrast-toggle--match');
      document.getElementById('idh' + i).setAttribute('data-status', 'match');
    } else {
      document.getElementById('idh' + i).classList.add('contrast-toggle--noMatch');
      document.getElementById('idh' + i).setAttribute('data-status', 'noMatch');
    }
    // console.log(i % 5, historyBoardInput[i], wordPlayed[i % 5], document.getElementById('idh' + i).classList.value);
  }

  document.getElementById('historyBoardWrapper').classList.remove('hidden');
  document.getElementById('historyTable').classList.add('hidden');
  document.getElementById('instructionWrapper').classList.add('hidden');
}

function hideHistoryBoard() {
  document.getElementById('inputTilesRow1').classList.remove('hidden');
  document.getElementById('historyBoardWrapper').classList.add('hidden');
  document.getElementById('historyTable').classList.contains('hidden') ? document.getElementById('historyTable').classList.remove('hidden') : document.getElementById('historyTable').classList.add('hidden');
  document.getElementById('historyTable').classList.contains('hidden') ? document.getElementById('tableHeaderRow').classList.add('hidden') : document.getElementById('tableHeaderRow').classList.remove('hidden');

  allowInputCurrentGame();
  // for (let i = 0; i < gameStats.wordPlayed.length; i++) {
  //   if (gameStats.wordPlayed[i].word === solution.join('') && gameStats.wordPlayed[i].winCount === 0) {
  //     for (let i = 0; i < 30; i++) {
  //       document.getElementById('id' + (i)).removeAttribute('disabled');
  //     }  //todo disabled //section
  //   }
  // }

  // if (gameStats.wordPlayed[gameStats.wordPlayed.length - 1].winCount === 0) {
  //   for (let i = 0; i < 30; i++) {
  //     document.getElementById('id' + (i)).removeAttribute('disabled');
  //   }  //todo disabled //section
  // }
}

function allowInputCurrentGame() {
  for (let i = 0; i < gameStats.wordPlayed.length; i++) {
    if (gameStats.wordPlayed[i].word === solution.join('') && gameStats.wordPlayed[i].winCount === 0) {
      for (let i = 0; i < 30; i++) {
        document.getElementById('id' + (i)).removeAttribute('disabled');
      }  //todo disabled //section
    }
  }
}

//SECTION EXPORT TO EXCEL
function exportTableToExcel(tableID, filename = '') {
  var downloadLink;
  var dataType = 'application/vnd.ms-excel';
  // var dataType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  var tableSelect = document.getElementById(tableID);
  // console.log(tableSelect);
  var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
  // console.log(tableHTML)
  
  // Specify file name
  filename = filename ? filename+'.xls' : 'excel_data.xls';
  // filename = filename ? filename+'.xls' : 'excel_data.xls';
  
  // Create download link element
  downloadLink = document.createElement("a");
  console.log(downloadLink);
  
  document.body.appendChild(downloadLink);
  
  if (navigator.msSaveOrOpenBlob) {
      var blob = new Blob(['\ufeff', tableHTML], { type: dataType });
      navigator.msSaveOrOpenBlob(blob, filename);
  } else {
      // Create a link to the file
      downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
  
      // Setting the file name
      downloadLink.download = filename;
      
      //triggering the function
      downloadLink.click();
  }
}

//SECTION TESTING FUNCTIONS

// function testReturn() {
//   let randomNumber = Math.floor(Math.floor(Math.random() * wordList.length));
//   return randomNumber;
// }

// function testReturn2() {
//   let a = testReturn();
//   console.log(a);
// }

// testReturn2();

// const array1 = [1, 4, 9, 16];
// pass a function to map
// const map1 = array1.map(x => x * 2);
// console.log(map1);
// expected output: Array [2, 8, 18, 32]

// const kvArray = [
//   { key: 0, value: 10 },
//   { key: 0, value: 20 },
//   { key: 0, value: 30 },
//   { key: 2, value: 20 },
//   { key: 1, value: 10 },
//   { key: 2, value: 20 },
//   { key: 3, value: 30 },
//   { key: 2, value: 20 },
// ];
// const reformattedArray = kvArray.map(({ key, value}) => ({ [key]: value }));
// reformattedArray is now [{1: 10}, {2: 20}, {3: 30}],
// kvArray is still:
// [{key: 1, value: 10},
//  {key: 2, value: 20},
//  {key: 3, value: 30}]

// function constructRowStats() {
//   let testObject = {'incompleteGame': 0, 'row1': 0, 'row2': 0, 'row3': 0, 'row4': 0, 'row5': 0, 'row6': 0};
//   for (let i = 0; i < kvArray.length; i++) {
//     kvArray[i].key === 0 && (testObject.incompleteGame ++);
//     kvArray[i].key === 1 && (testObject.row1 ++);
//     kvArray[i].key === 2 && (testObject.row2 ++);
//     kvArray[i].key === 3 && (testObject.row3 ++);
//   }
//   console.log(testObject);
// }
// constructRowStats();

function calcGameCount() {
  // console.log('findIndex=', gameStats.wordPlayed.findIndex(element => element.word === solution.join('')));

  let initialValue = 0;
  let gameCount = gameStats.wordPlayed.reduce((previousValue, currentValue, index, array) => {
    // console.log('The value of previous: ', previousValue, 'The value of current: ', currentValue.playedCount, 'index=', index, 'array=', array);
    // console.log('The value of previous: ', previousValue, 'The value of current: ', currentValue.playedCount, 'index=', index);
    return previousValue + currentValue.playedCount
  }, initialValue);
  // console.log('gameCount=', gameCount);
  return gameCount;
  
  // localStorage.setItem('gameCount', 30)
  // setLocalStorage('gameCount', gameCount); 
  // setLocalStorage('gameCount', gameStats.gameCount + 1); 

  // let initialValue = 0;
  // let gameCount = gameStats.wordPlayed.reduce((previousValue, currentValue) => 
  //   previousValue + currentValue.playedCount, initialValue
  // );
  // // console.log('gameCount=', gameCount);

  // let initialValue2 = 0;
  // let winCount = gameStats.wordPlayed.reduce((previousValue, currentValue) => 
  //   previousValue + currentValue.winCount, initialValue2
  // );
  // console.log('gameCount=', gameCount, 'winCount=', winCount);

  // let initialValue = 0
  // let sum = [{x: 1}, {x: 2}, {x: 3}].reduce((previousValue, currentValue) =>
  //   previousValue + currentValue.x
  //   , initialValue
  // );
  // console.log(sum) // logs 6

  // let initialValue = 0
  // let sum = [{x: 1}, {x: 2}, {x: 3}].reduce((previousValue, currentValue) => {
  //   console.log('The value of previous: ', previousValue);
  //   console.log('The value of current: ', currentValue);
  //   return previousValue + currentValue.x
  // }, 0);
  // console.log(sum); // logs 6


  // const newNumbers = [1, 3, 5, 7];
  // const newSum = newNumbers.reduce((x, y) => {
  //   console.log('The value of x: ', x);
  //   console.log('The value of y: ', y);
  //   return x + y;
  // }, 10);

  // console.log(newSum);
}

// reduceGameCount();

// const array1 = [1, 2, 3, 4];

// // 0 + 1 + 2 + 3 + 4
// const initialValue = 0;
// const sumWithInitial = array1.reduce(
//   (previousValue, currentValue) => previousValue + currentValue,
//   initialValue
// );

// console.log(sumWithInitial);
// expected output: 10