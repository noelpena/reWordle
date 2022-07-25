/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _wordsAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wordsAPI */ \"./src/wordsAPI.js\");\n\r\n\r\n// WORD CONTROLLER\r\nconst wordCtrl = (function(){\r\n  const board = {\r\n    currentWord: '',\r\n    solution: '',\r\n    status: 'in-progress',\r\n    attempts: [],\r\n    results: [],\r\n    currentRow: 0,\r\n    attemptLimit: 6\r\n  };\r\n\r\n  const hasRepeatingLetters = function(word){\r\n      return /(.).*\\1/.test(word);  \r\n  }\r\n\r\n  return {\r\n    getBoard: function(){\r\n      return board;\r\n    },\r\n    getWord: function(word, callback){\r\n      _wordsAPI__WEBPACK_IMPORTED_MODULE_0__.http.get(word)\r\n      .then(data => {\r\n        // console.log(data);\r\n        callback(data);\r\n      })\r\n      .catch(err => console.log(err));\r\n    },\r\n    getSolution: function(date, callback){\r\n      _wordsAPI__WEBPACK_IMPORTED_MODULE_0__.http.getSolution(date)\r\n      .then(data => {\r\n        board.solution = data.word.toLowerCase();\r\n        callback(data);\r\n      })\r\n      .catch(err => console.log(err));\r\n    },\r\n    updateCurrentWord: function(letter, toRemove = false){\r\n      if(board.currentWord.length >= 5 && !toRemove){\r\n        return false;\r\n      }\r\n\r\n      if(toRemove){\r\n        board.currentWord = board.currentWord.substring(0, board.currentWord.length - 1);\r\n        return false;\r\n      }\r\n\r\n      board.currentWord = board.currentWord + letter;\r\n    },\r\n    clearCurrentWord : function(){\r\n      board.currentWord = '';\r\n    },\r\n    addAttempt: function(word){\r\n      board.attempts.push(word);\r\n      board.currentRow++;      \r\n    },\r\n    addResults: function(word){\r\n      //RESULTS NEEDS TO AFFECT THE UI as well\r\n      \r\n      word = word.toLowerCase();\r\n      let solution = board.solution.toLowerCase();\r\n      const resultsArr = [];\r\n\r\n\r\n      const numOfLetters = {}; // for solution\r\n      const solArr = Array.from(solution); // solution array\r\n      const correctLetterPositions = []\r\n\r\n      // grab last instance of the letter unless it's correct or present...?\r\n      for (let i = 0; i < word.length; i++){\r\n          let regex = new RegExp(`${word[i]}`);\r\n          let test = regex.test(solution)\r\n          \r\n          if(test){\r\n            if(i === solution.indexOf(word[i])){\r\n              resultsArr.push({word: word[i], result: \"correct\"})\r\n            } else{\r\n              resultsArr.push({word: word[i], result: \"present\"})\r\n            }\r\n          } else{\r\n            resultsArr.push({word: word[i], result: \"absent\"})\r\n          }\r\n\r\n          // Creating object to tell me howmany letters solution has\r\n          // For repeat letters\r\n          if(numOfLetters[solArr[i]] !== undefined){\r\n            numOfLetters[solArr[i]] = numOfLetters[solArr[i]] + 1;\r\n          } else{\r\n            numOfLetters[solArr[i]] = 1;\r\n          }\r\n      }\r\n\r\n      \r\n      console.log(word[2],word[3])\r\n      // repeating/double letter checking\r\n      const wordHasRepeatLetters = hasRepeatingLetters(word);\r\n      // const solutionHasRepeatLetters = hasRepeatingLetters(solution);\r\n      const weight = [\"absent\", \"present\", \"correct\"];\r\n      console.log(numOfLetters, 'num of letters')\r\n      if(wordHasRepeatLetters){\r\n        resultsArr.forEach(function(res){\r\n          if(res === \"present\"){\r\n\r\n          }\r\n        })\r\n      }\r\n\r\n      board.results.push(resultsArr.map(item => item.result));\r\n      wordCtrl.clearCurrentWord();\r\n\r\n      \r\n\r\n      console.log(board)\r\n    },\r\n    resetBoard: function(){\r\n      board.currentWord = '';\r\n      board.solution = '';\r\n      board.status = 'in-progress';\r\n      board.attempts = [];\r\n      board.results = [];\r\n      board.currentRow = 0,\r\n      board.attemptLimit = 6\r\n    }\r\n  }\r\n})();\r\n\r\n// UI CONTROLLER\r\nconst UICtrl = (function(){\r\n  const UISelectors = {\r\n    wordInput: '#word-input',\r\n    dateInput: '#date-input',\r\n    results: '#results', \r\n    form: '#form',\r\n    attemptOutput: '#output ul',\r\n    board: '#board',// new grid selectors\r\n    gridRow: '#board .grid-row',\r\n    emptyLetter: '.letter[data-state=\"empty\"]',\r\n    filledLetter: '.letter[data-state=\"filled\"]',\r\n    absentLetter: '.letter[data-state=\"absent\"]',\r\n    presentLetter: '.letter[data-state=\"present\"]',\r\n    correctLetter: '.letter[data-state=\"correct\"]',\r\n    keyboard: '#keyboard',\r\n    keyboardLetter: '#keyboard button.letter-key',\r\n  };\r\n  \r\n  return {\r\n    showAlert: function(type, message){\r\n      this.clearAlert();\r\n      const wrapper = document.createElement('div');\r\n      wrapper.innerHTML = `\r\n        <div class=\"alert alert-${type} alert-dismissible\" role=\"alert\">\r\n           <div>${message}</div>\r\n           <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"alert\" aria-label=\"Close\"></button>\r\n        </div>`;\r\n\r\n      document.querySelector(UISelectors.results).append(wrapper);\r\n\r\n      setTimeout(this.clearAlert, 3000);\r\n    },\r\n    clearAlert: function(){\r\n      document.querySelector(UISelectors.results).innerHTML = '';\r\n    },\r\n    getSelectors: function(){\r\n      return UISelectors;\r\n    },\r\n    getWordInput: function(){\r\n      let board = wordCtrl.getBoard();\r\n      let letters = document.querySelectorAll(UISelectors.gridRow + `:nth-child(${board.currentRow+1}) .letter`);\r\n      letters = Array.from(letters);\r\n\r\n      let word = letters.map(letter => letter.dataset.letter).join(\"\");\r\n      word = word.toLowerCase();\r\n      return word;\r\n    },\r\n    clearWordInput: function(){\r\n      // might not need this anymore\r\n      //document.querySelector(UISelectors.wordInput).value = \"\";\r\n    },\r\n    getDateInput: function(){\r\n      return document.querySelector(UISelectors.dateInput).value;\r\n    },\r\n    clearBoard: function(){\r\n      // need to add \r\n      //some animation to flip/spinn all tiles\r\n      let letters = document.querySelectorAll(UISelectors.gridRow + ' .letter');\r\n      letters = Array.from(letters);\r\n\r\n      letters.forEach(letter => {\r\n        letter.textContent = '';\r\n        letter.dataset.letter = '';\r\n        letter.dataset.state = 'empty';\r\n      });\r\n    },\r\n    addLetterInput: function(newKey){\r\n      let board = wordCtrl.getBoard();\r\n      const currentWord = board.currentWord;\r\n\r\n      if(currentWord.length === 5){\r\n        return false;\r\n      }\r\n\r\n      if(currentWord.length <= 5){\r\n        let box = \r\n        document.querySelector(\r\n          UISelectors.gridRow + \r\n          `:nth-child(${board.currentRow+1})` +\r\n          ' ' +\r\n          UISelectors.emptyLetter\r\n        );\r\n        box.textContent = newKey.toUpperCase();\r\n        box.dataset.state = 'filled';\r\n        box.dataset.letter = newKey;\r\n      }\r\n    },\r\n    backspaceLetterInput: function(){\r\n      let board = wordCtrl.getBoard();\r\n      if(board.currentWord.length === 0){\r\n        return false;\r\n      }\r\n\r\n      let box = document.querySelector(\r\n        UISelectors.gridRow + \r\n        `:nth-child(${board.currentRow+1})` +\r\n        ' ' +\r\n        UISelectors.filledLetter +\r\n        `:nth-child(${board.currentWord.length})`\r\n      );\r\n\r\n      box.textContent = '';\r\n      box.dataset.state = 'empty';\r\n      box.dataset.letter = '';\r\n    },\r\n    updateKeyboard: function(){\r\n      let board = wordCtrl.getBoard();\r\n      const lastAttempt = Array.from(board.attempts[board.currentRow-1])\r\n\r\n      lastAttempt.forEach((letter, i) => {\r\n        const result = board.results[board.currentRow-1][i];\r\n        document.querySelector(UISelectors.keyboardLetter + `[data-key=\"${letter}\"]`).dataset.state = result;\r\n      });\r\n    },\r\n    showLastAttempt: function(){\r\n      let board = wordCtrl.getBoard();\r\n\r\n      let letters = document.querySelectorAll(UISelectors.gridRow + `:nth-child(${board.currentRow}) .letter`);\r\n      letters = Array.from(letters);\r\n\r\n      board.results[board.currentRow-1].forEach((result, i) => {\r\n        letters[i].dataset.state = result;      \r\n      });\r\n\r\n      this.updateKeyboard();\r\n    }   \r\n  }\r\n})();\r\n\r\n// APP CONTROLLER\r\nconst App = (function(wordCtrl, UICtrl){\r\n  const todaysDateInput = function(){\r\n    const UISelectors = UICtrl.getSelectors();\r\n\r\n    const today = new Date()\r\n    const yesterday = new Date(today)\r\n\r\n    yesterday.setDate(yesterday.getDate() - 1)\r\n\r\n    let month = yesterday.getMonth() + 1;\r\n    month = month < 10 ? '0' + month : month;\r\n    const year = yesterday.getFullYear();\r\n    const day = yesterday.getDate();\r\n\r\n    document.querySelector('#date-input').setAttribute('max',`${year}-${month}-${day}`);\r\n    document.querySelector(UISelectors.dateInput).value = `${year}-${month}-${day}`;\r\n  }\r\n\r\n  const map = {}; \r\n  const loadEventListeners = function(){\r\n    // GET UI SELECTORS\r\n    const UISelectors = UICtrl.getSelectors();\r\n    document.querySelector(UISelectors.dateInput).addEventListener('change', dateChange);\r\n    keydownEventListener(true);        \r\n    document.querySelector(UISelectors.keyboard).addEventListener('click', keyboardClick);\r\n    document.addEventListener('keyup', (e) => {\r\n      e.type == 'keyup' && delete map[e.key.toLowerCase()]\r\n      // console.log(map)\r\n    });\r\n  };\r\n  \r\n  const keyboardClick = function(e){\r\n    e.preventDefault();\r\n    \r\n    let key = e.target.dataset.key.toLowerCase();\r\n\r\n    if(key === 'backspace'){\r\n      UICtrl.backspaceLetterInput();\r\n      wordCtrl.updateCurrentWord(e.key, true);\r\n      return false;\r\n    }  \r\n\r\n    if(key === 'enter'){\r\n      getWord();\r\n      return false;\r\n    }\r\n  \r\n    UICtrl.addLetterInput(key);\r\n    wordCtrl.updateCurrentWord(key);\r\n    \r\n  };\r\n\r\n  const keydownEventListener = function(isOn){\r\n    if(!isOn){\r\n      document.removeEventListener('keydown', typeWord);\r\n      return false;\r\n    }\r\n\r\n    document.addEventListener('keydown', typeWord);\r\n  }\r\n\r\n  const dateChange = function(){\r\n    UICtrl.clearBoard();\r\n    wordCtrl.resetBoard();\r\n    keydownEventListener(true);\r\n  };\r\n  \r\n  const typeWord = function(e){\r\n    e.preventDefault();\r\n    \r\n    let code = e.code.toLowerCase();\r\n    let regex = /key/gi;\r\n\r\n    map[e.key.toLowerCase()] = e.type == 'keydown'; \r\n    // CAN CHECK FOR MULTIPLE KEYBOARD PRESS AT A TIME\r\n    // NO CURRENT USE CASE BUT MAYBE IN THE FUTURE\r\n  \r\n    // if(map['control'] && map['b']){ // CTRL+R\r\n    //   console.log('YESS');s\r\n    // }else if(map[17] && map[16] && map[66]){ // CTRL+SHIFT+B\r\n    //   alert('Control Shift B');\r\n    // }else if(map[17] && map[16] && map[67]){ // CTRL+SHIFT+C\r\n    //   alert('Control Shift C');\r\n    // }\r\n    //  console.log(map)\r\n\r\n    // IF F5, Refresh the page duhh\r\n    if(e.code === 'F5' || e.key === 'F5' || e.keyCode === 116){\r\n      window.location.reload();\r\n    }  \r\n\r\n    if(e.code === 8 || e.key === 'Backspace' || e.keyCode === 8){\r\n      //if(!result && (e.code === 8 || e.key === 'Backspace' || e.keyCode === 8)){\r\n      UICtrl.backspaceLetterInput();\r\n      wordCtrl.updateCurrentWord(e.key, true);\r\n    }  \r\n\r\n    if(e.code === 13 || e.key === 'Enter' || e.keyCode === 13){\r\n      getWord();\r\n    }  \r\n    \r\n    let result = regex.test(code);\r\n\r\n    if(result){// TYPE LETTER IN INPUT      \r\n      UICtrl.addLetterInput(e.key);\r\n      wordCtrl.updateCurrentWord(e.key);\r\n    } \r\n  }\r\n\r\n  const getWord = function(){\r\n    const word = UICtrl.getWordInput();\r\n    const date = UICtrl.getDateInput();\r\n\r\n    if(word === '' || word.length !== 5){\r\n      UICtrl.showAlert('warning', 'Not enough letters.');\r\n      return false;\r\n    }\r\n\r\n    wordCtrl.getWord(word, wordData => {\r\n      let success = wordData.hasOwnProperty('word');\r\n        if(!success){\r\n          UICtrl.showAlert('danger', 'Not in word list. Please try again');\r\n          return false;\r\n        }\r\n  \r\n        UICtrl.clearWordInput();\r\n        wordCtrl.addAttempt(word);        \r\n\r\n        let board = wordCtrl.getBoard();\r\n\r\n        // success does the word match?\r\n        wordCtrl.getSolution(date, solution => {\r\n          wordCtrl.addResults(word);\r\n          UICtrl.showLastAttempt(word);\r\n          const correctWord = solution.word.toLowerCase();\r\n          if(board.currentRow === board.attemptLimit && word !== correctWord){\r\n            // GAME IS OVER            \r\n            keydownEventListener(false);\r\n            UICtrl.showAlert('info', correctWord);\r\n            return false;\r\n          }\r\n\r\n          if(correctWord === word){\r\n            UICtrl.showAlert('success', 'Word Matches!');\r\n            keydownEventListener(false);\r\n          } else{\r\n            UICtrl.showAlert('warning', 'Word doesn\\'t match');\r\n          }\r\n        });\r\n    });\r\n  };\r\n  \r\n  return{\r\n    init: function(){\r\n      console.log(\"Initializing App...\");\r\n\r\n      loadEventListeners();\r\n      todaysDateInput();\r\n    }\r\n  }\r\n})(wordCtrl, UICtrl);\r\n\r\nApp.init();\n\n//# sourceURL=webpack://rewordle/./src/app.js?");

/***/ }),

/***/ "./src/wordsAPI.js":
/*!*************************!*\
  !*** ./src/wordsAPI.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"http\": () => (/* binding */ http)\n/* harmony export */ });\n/**\r\n * EASY HTTP Library\r\n */\r\n\r\nconst wordsURL = 'https://wordsapiv1.p.rapidapi.com/words/';\r\n\r\nclass EasyHTTP{\r\n  async get(word){\r\n   const response = await fetch(`${wordsURL + word}`, {\r\n      method: 'GET',\r\n      headers: {\r\n        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',\r\n        'X-RapidAPI-Key': {\"WORDS_API_KEY\":\"9961f2eff6msh859a1a9fc78ca11p1d7883jsna1be20ea0a23\"}.WORDS_API_KEY\r\n      }\r\n   });\r\n   const data = await response.json();\r\n   return data;\r\n  };\r\n\r\n  async getSolution(date){\r\n    const response = await fetch(`../api/db.json`);\r\n    const data = await response.json();\r\n    for (const w of data.pastSolutions){\r\n      if(w.date === date){return w}\r\n    }\r\n   }\r\n}\r\n\r\nconst http = new EasyHTTP();\r\n\n\n//# sourceURL=webpack://rewordle/./src/wordsAPI.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/app.js");
/******/ 	
/******/ })()
;