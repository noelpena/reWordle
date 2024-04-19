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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _wordsAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wordsAPI */ \"./src/wordsAPI.js\");\n\r\n\r\nconst localStorageKeyName = \"rewordle-solution\";\r\nconst localStorageStatsName = \"rewordle-statistics\";\r\nconst localStorageDarkMode = \"rewordle-darkmode\";\r\n\r\n// WORD CONTROLLER\r\nconst wordCtrl = (function () {\r\n\tconst board = {\r\n\t\tcurrentWord: \"\",\r\n\t\tsolution: \"\",\r\n\t\tstatus: \"in-progress\",\r\n\t\tattempts: [],\r\n\t\tresults: [],\r\n\t\tcurrentRow: 0,\r\n\t\tattemptLimit: 6,\r\n\t};\r\n\r\n\tconst stats = {\r\n\t\tavgGuesses: 0,\r\n\t\tcurrentStreak: 0,\r\n\t\tgamesPlayed: 0,\r\n\t\tgamesWon: 0,\r\n\t\tguesses: {\r\n\t\t\t1: 0,\r\n\t\t\t2: 0,\r\n\t\t\t3: 0,\r\n\t\t\t4: 0,\r\n\t\t\t5: 0,\r\n\t\t\t6: 0,\r\n\t\t\tfail: 0,\r\n\t\t},\r\n\t\tmaxStreak: 0,\r\n\t\twinPercentage: 0,\r\n\t\twonLastGame: false,\r\n\t\tdatesPlayed: [],\r\n\t};\r\n\r\n\tconst hasRepeatingLetters = function (word) {\r\n\t\treturn /(.).*\\1/.test(word);\r\n\t};\r\n\r\n\treturn {\r\n\t\tgetBoard: function () {\r\n\t\t\treturn board;\r\n\t\t},\r\n\t\tgetWord: function (word, callback) {\r\n\t\t\t_wordsAPI__WEBPACK_IMPORTED_MODULE_0__.http.get(word)\r\n\t\t\t\t.then((data) => {\r\n\t\t\t\t\t// console.log(data);\r\n\t\t\t\t\tcallback(data);\r\n\t\t\t\t})\r\n\t\t\t\t.catch((err) => console.log(err));\r\n\t\t},\r\n\t\tgetSolution: function (date, callback) {\r\n\t\t\tconst solutionExists = localStorage.getItem(localStorageKeyName);\r\n\r\n\t\t\tif (solutionExists) {\r\n\t\t\t\tcallback(JSON.parse(solutionExists));\r\n\t\t\t} else {\r\n\t\t\t\t_wordsAPI__WEBPACK_IMPORTED_MODULE_0__.http.getSolution(date)\r\n\t\t\t\t\t.then((data) => {\r\n\t\t\t\t\t\tboard.solution = data.word.toLowerCase();\r\n\t\t\t\t\t\tlocalStorage.setItem(\r\n\t\t\t\t\t\t\tlocalStorageKeyName,\r\n\t\t\t\t\t\t\tJSON.stringify(data)\r\n\t\t\t\t\t\t);\r\n\t\t\t\t\t\tcallback(data);\r\n\t\t\t\t\t})\r\n\t\t\t\t\t.catch((err) => console.log(err));\r\n\t\t\t}\r\n\t\t},\r\n\t\tclearStoredSolution: function () {\r\n\t\t\tlocalStorage.removeItem(localStorageKeyName);\r\n\t\t},\r\n\t\tupdateCurrentWord: function (letter, toRemove = false) {\r\n\t\t\tif (board.currentWord.length >= 5 && !toRemove) {\r\n\t\t\t\treturn false;\r\n\t\t\t}\r\n\r\n\t\t\tif (toRemove) {\r\n\t\t\t\tboard.currentWord = board.currentWord.substring(\r\n\t\t\t\t\t0,\r\n\t\t\t\t\tboard.currentWord.length - 1\r\n\t\t\t\t);\r\n\t\t\t\treturn false;\r\n\t\t\t}\r\n\r\n\t\t\tboard.currentWord = board.currentWord + letter;\r\n\t\t},\r\n\t\tclearCurrentWord: function () {\r\n\t\t\tboard.currentWord = \"\";\r\n\t\t},\r\n\t\taddAttempt: function (word) {\r\n\t\t\tboard.attempts.push(word);\r\n\t\t\tboard.currentRow++;\r\n\r\n\t\t\tif (board.currentRow === 6) {\r\n\t\t\t\tboard.status = \"game over\";\r\n\t\t\t}\r\n\t\t},\r\n\t\taddResults: function (word) {\r\n\t\t\tword = word.toLowerCase();\r\n\t\t\tlet solution = board.solution.toLowerCase();\r\n\t\t\tconst todaysSolution = board.solution.toLowerCase();\r\n\t\t\tconst resultsArr = [];\r\n\r\n\t\t\tif (word === solution) {\r\n\t\t\t\tboard.status = \"game over\";\r\n\t\t\t}\r\n\t\t\tif (board.currentRow === board.attemptLimit && word !== solution) {\r\n\t\t\t\tboard.status = \"game over\";\r\n\t\t\t}\r\n\r\n\t\t\t// all results as absent\r\n\t\t\tfor (let i = 0; i < word.length; i++) {\r\n\t\t\t\tresultsArr.push({ letter: word[i], result: \"absent\" });\r\n\t\t\t}\r\n\r\n\t\t\t// add correct results then remove letter from solution\r\n\t\t\tfor (let i = 0; i < word.length; i++) {\r\n\t\t\t\t// if(i === solution.indexOf(word[i])){\r\n\t\t\t\tif (word[i] === solution[i]) {\r\n\t\t\t\t\tresultsArr[i] = { letter: word[i], result: \"correct\" };\r\n\t\t\t\t\tsolution = solution.replace(word[i], \" \");\r\n\t\t\t\t}\r\n\t\t\t}\r\n\t\t\t// add present with check for correct results then remove letter from solution\r\n\t\t\tfor (let i = 0; i < word.length; i++) {\r\n\t\t\t\tlet regex = new RegExp(`${word[i]}`);\r\n\t\t\t\tlet test = regex.test(solution);\r\n\t\t\t\t// can also use solution.includes(word[i]) instead of regex\r\n\r\n\t\t\t\tif (resultsArr[i].result !== \"correct\" && test) {\r\n\t\t\t\t\tresultsArr[i] = { letter: word[i], result: \"present\" };\r\n\t\t\t\t\tsolution = solution.replace(word[i], \" \");\r\n\t\t\t\t}\r\n\t\t\t}\r\n\r\n\t\t\tboard.results.push(resultsArr.map((item) => item.result));\r\n\t\t\twordCtrl.clearCurrentWord();\r\n\r\n\t\t\t// update stats here\r\n\t\t\tif (word === todaysSolution && board.status === \"game over\") {\r\n\t\t\t\tthis.updateStats(true);\r\n\t\t\t}\r\n\t\t\tif (word !== todaysSolution && board.status === \"game over\") {\r\n\t\t\t\tthis.updateStats(false);\r\n\t\t\t}\r\n\t\t},\r\n\t\tresetBoard: function () {\r\n\t\t\tboard.currentWord = \"\";\r\n\t\t\tboard.solution = \"\";\r\n\t\t\tboard.status = \"in-progress\";\r\n\t\t\tboard.attempts = [];\r\n\t\t\tboard.results = [];\r\n\t\t\t(board.currentRow = 0), (board.attemptLimit = 6);\r\n\t\t},\r\n\t\tgetStats: function () {\r\n\t\t\tconst storedStats = localStorage.getItem(localStorageStatsName);\r\n\r\n\t\t\tif (storedStats === null) {\r\n\t\t\t\tlocalStorage.setItem(\r\n\t\t\t\t\tlocalStorageStatsName,\r\n\t\t\t\t\tJSON.stringify(stats)\r\n\t\t\t\t);\r\n\t\t\t\treturn stats;\r\n\t\t\t} else {\r\n\t\t\t\tconst _storedStats = JSON.parse(storedStats);\r\n\t\t\t\tstats.currentStreak = _storedStats.currentStreak;\r\n\t\t\t\tstats.gamesPlayed = _storedStats.gamesPlayed;\r\n\t\t\t\tstats.gamesWon = _storedStats.gamesWon;\r\n\t\t\t\tstats.guesses = _storedStats.guesses;\r\n\t\t\t\tstats.maxStreak = _storedStats.maxStreak;\r\n\t\t\t\tstats.winPercentage = _storedStats.winPercentage;\r\n\t\t\t\tstats.wonLastGame = _storedStats.wonLastGame;\r\n\t\t\t\tstats.datesPlayed = _storedStats.datesPlayed;\r\n\r\n\t\t\t\treturn _storedStats;\r\n\t\t\t}\r\n\t\t},\r\n\t\tupdateStats: function (gameWon) {\r\n\t\t\t// Updating stats to include which dates have been played\r\n\t\t\tconst date = UICtrl.getDateInput();\r\n\t\t\tlet dateUpdated = false;\r\n\t\t\tstats.datesPlayed.forEach((date) => {\r\n\t\t\t\tif (date.date === date) {\r\n\t\t\t\t\tdate.isWinner = gameWon;\r\n\t\t\t\t\tdate.attempts = board.attempts.length;\r\n\t\t\t\t\tdate.board = board;\r\n\t\t\t\t\tdateUpdated = true;\r\n\t\t\t\t}\r\n\t\t\t});\r\n\r\n\t\t\tif (!dateUpdated) {\r\n\t\t\t\tstats.datesPlayed.push({\r\n\t\t\t\t\tdate: date,\r\n\t\t\t\t\tisWinner: gameWon,\r\n\t\t\t\t\tattempts: board.attempts.length,\r\n\t\t\t\t\tboard: board,\r\n\t\t\t\t});\r\n\t\t\t}\r\n\r\n\t\t\tstats.gamesPlayed = stats.gamesPlayed + 1;\r\n\r\n\t\t\tif (gameWon) {\r\n\t\t\t\tstats.gamesWon = stats.gamesWon + 1;\r\n\t\t\t\tstats.guesses[board.attempts.length] =\r\n\t\t\t\t\tstats.guesses[board.attempts.length] + 1;\r\n\t\t\t\tif (stats.wonLastGame || stats.currentStreak === 0) {\r\n\t\t\t\t\tstats.currentStreak = stats.currentStreak + 1;\r\n\t\t\t\t}\r\n\t\t\t\tstats.wonLastGame = true;\r\n\r\n\t\t\t\tif (stats.currentStreak >= stats.maxStreak) {\r\n\t\t\t\t\tstats.maxStreak = stats.currentStreak;\r\n\t\t\t\t}\r\n\t\t\t} else {\r\n\t\t\t\tstats.guesses[\"fail\"] = stats.guesses[\"fail\"] + 1;\r\n\t\t\t\tif (!stats.wonLastGame) {\r\n\t\t\t\t\tstats.currentStreak = 0;\r\n\t\t\t\t}\r\n\t\t\t\tstats.wonLastGame = false;\r\n\t\t\t}\r\n\t\t\tstats.winPercentage = Math.round(\r\n\t\t\t\t(stats.gamesWon / stats.gamesPlayed) * 100\r\n\t\t\t);\r\n\r\n\t\t\tlocalStorage.setItem(localStorageStatsName, JSON.stringify(stats));\r\n\t\t\tUICtrl.populateStats(true);\r\n\t\t},\r\n\t\tgetDarkMode: function () {\r\n\t\t\tconst storedDarkMode = JSON.parse(\r\n\t\t\t\tlocalStorage.getItem(localStorageDarkMode)\r\n\t\t\t);\r\n\r\n\t\t\tif (storedDarkMode === null) {\r\n\t\t\t\tlocalStorage.setItem(localStorageDarkMode, \"false\");\r\n\t\t\t\treturn;\r\n\t\t\t}\r\n\r\n\t\t\tif (storedDarkMode) {\r\n\t\t\t\tUICtrl.toggleDarkMode();\r\n\t\t\t}\r\n\t\t},\r\n\t};\r\n})();\r\n\r\n// UI CONTROLLER\r\nconst UICtrl = (function () {\r\n\tconst UISelectors = {\r\n\t\twordInput: \"#word-input\",\r\n\t\tdateInput: \"#inputDate\",\r\n\t\tdateInputData: \"data-date\",\r\n\t\tsetDateBtn: \"#set-date\",\r\n\t\tselectedDate: \"#inputDate .datepicker-grid .datepicker-cell.selected\",\r\n\t\tresults: \"#results\",\r\n\t\tform: \"#form\",\r\n\t\tattemptOutput: \"#output ul\",\r\n\t\tboard: \"#board\", // new grid selectors\r\n\t\tgridRow: \"#board .grid-row\",\r\n\t\temptyLetter: '.letter[data-state=\"empty\"]',\r\n\t\tfilledLetter: '.letter[data-state=\"filled\"]',\r\n\t\tabsentLetter: '.letter[data-state=\"absent\"]',\r\n\t\tpresentLetter: '.letter[data-state=\"present\"]',\r\n\t\tcorrectLetter: '.letter[data-state=\"correct\"]',\r\n\t\tkeyboard: \"#keyboard\",\r\n\t\tkeyboardLetter: \"#keyboard button.letter-key\",\r\n\t\tkeyboardRow: \"#keyboard .keyboard-row\",\r\n\t\tsidebar: \"#sidebar-menu\",\r\n\t\tsidebarFill: \"#sidebar-fill\",\r\n\t\tdarkModeCheckbox: \"#e\",\r\n\t\tmainStatsModal: \"#statsModal .main-stats\",\r\n\t};\r\n\r\n\treturn {\r\n\t\tshowAlert: function (type, message) {\r\n\t\t\tlet { status, solution } = wordCtrl.getBoard();\r\n\t\t\ttype = \"dark\";\r\n\t\t\tthis.clearAlert();\r\n\t\t\tconst wrapper = document.createElement(\"div\");\r\n\t\t\twrapper.innerHTML = `\r\n        <div class=\"alert alert-${type} text-white bg-dark fw-bold fade show\" role=\"alert\" id=\"re-alert\">\r\n           <div>${message}</div>          \r\n        </div>`;\r\n\r\n\t\t\tdocument.querySelector(UISelectors.results).append(wrapper);\r\n\t\t\tif (status !== \"game over\") {\r\n\t\t\t\tsetTimeout(() => {\r\n\t\t\t\t\tconst alert =\r\n\t\t\t\t\t\tbootstrap.Alert.getOrCreateInstance(\"#re-alert\");\r\n\t\t\t\t\talert.close();\r\n\t\t\t\t\tdocument\r\n\t\t\t\t\t\t.querySelector(UISelectors.results)\r\n\t\t\t\t\t\t.classList.add(\"fadeOut\");\r\n\t\t\t\t}, 1800);\r\n\t\t\t\tsetTimeout(this.clearAlert, 2000);\r\n\t\t\t}\r\n\r\n\t\t\tif (status === \"game over\" && message !== solution) {\r\n\t\t\t\tsetTimeout(() => {\r\n\t\t\t\t\tconst alert =\r\n\t\t\t\t\t\tbootstrap.Alert.getOrCreateInstance(\"#re-alert\");\r\n\t\t\t\t\talert.close();\r\n\t\t\t\t\tdocument\r\n\t\t\t\t\t\t.querySelector(UISelectors.results)\r\n\t\t\t\t\t\t.classList.add(\"fadeOut\");\r\n\t\t\t\t}, 5800);\r\n\t\t\t\tsetTimeout(this.clearAlert, 6000);\r\n\t\t\t}\r\n\t\t},\r\n\t\tclearAlert: function () {\r\n\t\t\tdocument.querySelector(UISelectors.results).innerHTML = \"\";\r\n\t\t\tdocument\r\n\t\t\t\t.querySelector(UISelectors.results)\r\n\t\t\t\t.classList.remove(\"fadeOut\");\r\n\t\t},\r\n\t\tgetSelectors: function () {\r\n\t\t\treturn UISelectors;\r\n\t\t},\r\n\t\tgetWordInput: function () {\r\n\t\t\tlet board = wordCtrl.getBoard();\r\n\t\t\tlet letters = document.querySelectorAll(\r\n\t\t\t\tUISelectors.gridRow +\r\n\t\t\t\t\t`:nth-child(${board.currentRow + 1}) .letter`\r\n\t\t\t);\r\n\t\t\tletters = Array.from(letters);\r\n\r\n\t\t\tlet word = letters.map((letter) => letter.dataset.letter).join(\"\");\r\n\t\t\tword = word.toLowerCase();\r\n\t\t\treturn word;\r\n\t\t},\r\n\t\tgetDateInput: function () {\r\n\t\t\tconst date = document\r\n\t\t\t\t.querySelector(UISelectors.dateInput)\r\n\t\t\t\t.getAttribute(UISelectors.dateInputData);\r\n\t\t\tconst dateArr = date.split(\"-\");\r\n\r\n\t\t\treturn `${dateArr[2]}-${dateArr[0]}-${dateArr[1]}`;\r\n\t\t},\r\n\t\tclearBoard: function () {\r\n\t\t\t// need to add\r\n\t\t\t//some animation to flip/spin all tiles\r\n\t\t\tlet letters = document.querySelectorAll(\r\n\t\t\t\tUISelectors.gridRow + \" .letter\"\r\n\t\t\t);\r\n\t\t\tletters = Array.from(letters);\r\n\r\n\t\t\tletters.forEach((letter) => {\r\n\t\t\t\tletter.textContent = \"\";\r\n\t\t\t\tletter.dataset.letter = \"\";\r\n\t\t\t\tletter.dataset.state = \"empty\";\r\n\t\t\t\tletter.className = \"letter\";\r\n\t\t\t});\r\n\t\t},\r\n\t\tclearKeyboard: function () {\r\n\t\t\tlet keyLetters = document.querySelectorAll(\r\n\t\t\t\tUISelectors.keyboardLetter\r\n\t\t\t);\r\n\t\t\tkeyLetters = Array.from(keyLetters);\r\n\r\n\t\t\tkeyLetters.forEach((letter) => {\r\n\t\t\t\tletter.dataset.state = \"empty\";\r\n\t\t\t});\r\n\t\t},\r\n\t\taddLetterInput: function (newKey) {\r\n\t\t\tlet board = wordCtrl.getBoard();\r\n\t\t\tconst currentWord = board.currentWord;\r\n\r\n\t\t\tif (currentWord.length === 5) {\r\n\t\t\t\treturn false;\r\n\t\t\t}\r\n\r\n\t\t\tif (currentWord.length <= 5) {\r\n\t\t\t\tlet box = document.querySelector(\r\n\t\t\t\t\tUISelectors.gridRow +\r\n\t\t\t\t\t\t`:nth-child(${board.currentRow + 1})` +\r\n\t\t\t\t\t\t\" \" +\r\n\t\t\t\t\t\tUISelectors.emptyLetter\r\n\t\t\t\t);\r\n\t\t\t\tbox.textContent = newKey.toUpperCase();\r\n\t\t\t\tbox.dataset.state = \"filled\";\r\n\t\t\t\tbox.dataset.letter = newKey;\r\n\t\t\t}\r\n\t\t},\r\n\t\tbackspaceLetterInput: function () {\r\n\t\t\tlet board = wordCtrl.getBoard();\r\n\t\t\tif (board.currentWord.length === 0) {\r\n\t\t\t\treturn false;\r\n\t\t\t}\r\n\r\n\t\t\tlet box = document.querySelector(\r\n\t\t\t\tUISelectors.gridRow +\r\n\t\t\t\t\t`:nth-child(${board.currentRow + 1})` +\r\n\t\t\t\t\t\" \" +\r\n\t\t\t\t\tUISelectors.filledLetter +\r\n\t\t\t\t\t`:nth-child(${board.currentWord.length})`\r\n\t\t\t);\r\n\r\n\t\t\tbox.textContent = \"\";\r\n\t\t\tbox.dataset.state = \"empty\";\r\n\t\t\tbox.dataset.letter = \"\";\r\n\t\t},\r\n\t\tupdateKeyboard: function () {\r\n\t\t\tlet board = wordCtrl.getBoard();\r\n\t\t\tconst lastAttempt = Array.from(\r\n\t\t\t\tboard.attempts[board.currentRow - 1]\r\n\t\t\t);\r\n\r\n\t\t\tlastAttempt.forEach((letter, i) => {\r\n\t\t\t\tconst result = board.results[board.currentRow - 1][i];\r\n\t\t\t\tdocument.querySelector(\r\n\t\t\t\t\tUISelectors.keyboardLetter + `[data-key=\"${letter}\"]`\r\n\t\t\t\t).dataset.state = result;\r\n\t\t\t});\r\n\t\t},\r\n\t\tshowLastAttempt: function (callback) {\r\n\t\t\tlet board = wordCtrl.getBoard();\r\n\t\t\tlet letters = document.querySelectorAll(\r\n\t\t\t\tUISelectors.gridRow + `:nth-child(${board.currentRow}) .letter`\r\n\t\t\t);\r\n\t\t\tletters = Array.from(letters);\r\n\r\n\t\t\tlet i = 0;\r\n\t\t\tletters[i].classList.add(\r\n\t\t\t\t\"animate__animated\",\r\n\t\t\t\t\"animate__flip\",\r\n\t\t\t\t\"animate__faster\"\r\n\t\t\t);\r\n\t\t\tletters[i].dataset.state = board.results[board.currentRow - 1][i];\r\n\t\t\ti++;\r\n\r\n\t\t\tconst flipAnimation = setInterval(() => {\r\n\t\t\t\tif (i === 4) {\r\n\t\t\t\t\twindow.clearInterval(flipAnimation);\r\n\t\t\t\t}\r\n\t\t\t\tletters[i].classList.add(\r\n\t\t\t\t\t\"animate__animated\",\r\n\t\t\t\t\t\"animate__flip\",\r\n\t\t\t\t\t\"animate__faster\"\r\n\t\t\t\t);\r\n\t\t\t\tletters[i].dataset.state =\r\n\t\t\t\t\tboard.results[board.currentRow - 1][i];\r\n\t\t\t\ti++;\r\n\t\t\t}, 500);\r\n\r\n\t\t\tsetTimeout(() => {\r\n\t\t\t\tthis.updateKeyboard();\r\n\t\t\t\tif (board.attempts[board.currentRow - 1] === board.solution) {\r\n\t\t\t\t\tthis.correctWordAnimate(board);\r\n\t\t\t\t} else {\r\n\t\t\t\t\tcallback();\r\n\t\t\t\t}\r\n\t\t\t}, 2700);\r\n\t\t},\r\n\t\tcorrectWordAnimate: function (board) {\r\n\t\t\tlet letters = document.querySelectorAll(\r\n\t\t\t\tUISelectors.gridRow + `:nth-child(${board.currentRow}) .letter`\r\n\t\t\t);\r\n\t\t\tletters = Array.from(letters);\r\n\r\n\t\t\tboard.results[board.currentRow - 1].forEach((result, i) => {\r\n\t\t\t\tletters[i].classList.remove(\r\n\t\t\t\t\t\"animate__animated\",\r\n\t\t\t\t\t\"animate__flip\",\r\n\t\t\t\t\t\"animate__faster\"\r\n\t\t\t\t);\r\n\t\t\t});\r\n\r\n\t\t\tlet i = 0;\r\n\t\t\tletters[i].classList.add(\r\n\t\t\t\t\"animate__animated\",\r\n\t\t\t\t\"animate__bounce\",\r\n\t\t\t\t\"animate__faster\"\r\n\t\t\t);\r\n\t\t\tletters[i].dataset.state = board.results[board.currentRow - 1][i];\r\n\t\t\ti++;\r\n\r\n\t\t\tconst bounceAnimation = setInterval(() => {\r\n\t\t\t\tif (i === 4) {\r\n\t\t\t\t\twindow.clearInterval(bounceAnimation);\r\n\t\t\t\t}\r\n\t\t\t\tletters[i].classList.add(\r\n\t\t\t\t\t\"animate__animated\",\r\n\t\t\t\t\t\"animate__bounce\",\r\n\t\t\t\t\t\"animate__faster\"\r\n\t\t\t\t);\r\n\t\t\t\tletters[i].dataset.state =\r\n\t\t\t\t\tboard.results[board.currentRow - 1][i];\r\n\t\t\t\ti++;\r\n\t\t\t}, 150);\r\n\t\t},\r\n\t\tshowStatsModal: function () {\r\n\t\t\tsetTimeout(() => {\r\n\t\t\t\tvar statsModal = new bootstrap.Modal(\r\n\t\t\t\t\tdocument.getElementById(\"statsModal\")\r\n\t\t\t\t);\r\n\t\t\t\tstatsModal.show();\r\n\t\t\t}, 5000);\r\n\t\t},\r\n\t\ttoggleDarkMode: function (e) {\r\n\t\t\tconst body = document.querySelector(\"body\");\r\n\t\t\tconst bodyClass = body.className;\r\n\t\t\tif (bodyClass.includes(\"dark\")) {\r\n\t\t\t\tbody.classList.remove(\"dark\");\r\n\t\t\t\tdocument\r\n\t\t\t\t\t.querySelector(\r\n\t\t\t\t\t\t\"#instructionsModal .modal-content .btn-close\"\r\n\t\t\t\t\t)\r\n\t\t\t\t\t.classList.remove(\"btn-close-white\");\r\n\t\t\t\tdocument\r\n\t\t\t\t\t.querySelector(\"#dateModal .modal-content .btn-close\")\r\n\t\t\t\t\t.classList.remove(\"btn-close-white\");\r\n\t\t\t\tdocument\r\n\t\t\t\t\t.querySelector(\"#statsModal .modal-content .btn-close\")\r\n\t\t\t\t\t.classList.remove(\"btn-close-white\");\r\n\r\n\t\t\t\tlocalStorage.setItem(localStorageDarkMode, \"false\");\r\n\t\t\t} else {\r\n\t\t\t\tif (e === undefined) {\r\n\t\t\t\t\tdocument.querySelector(\r\n\t\t\t\t\t\tUISelectors.darkModeCheckbox\r\n\t\t\t\t\t).checked = true;\r\n\t\t\t\t}\r\n\t\t\t\tbody.classList.add(\"dark\");\r\n\t\t\t\tdocument\r\n\t\t\t\t\t.querySelector(\r\n\t\t\t\t\t\t\"#instructionsModal .modal-content .btn-close\"\r\n\t\t\t\t\t)\r\n\t\t\t\t\t.classList.add(\"btn-close-white\");\r\n\t\t\t\tdocument\r\n\t\t\t\t\t.querySelector(\"#dateModal .modal-content .btn-close\")\r\n\t\t\t\t\t.classList.add(\"btn-close-white\");\r\n\t\t\t\tdocument\r\n\t\t\t\t\t.querySelector(\"#statsModal .modal-content .btn-close\")\r\n\t\t\t\t\t.classList.add(\"btn-close-white\");\r\n\t\t\t\tlocalStorage.setItem(localStorageDarkMode, \"true\");\r\n\t\t\t}\r\n\t\t},\r\n\t\ttoggleSidebar: function (e) {\r\n\t\t\te.preventDefault();\r\n\r\n\t\t\tconst UISelectors = UICtrl.getSelectors();\r\n\t\t\tconst sidebar = document.querySelector(UISelectors.sidebar);\r\n\t\t\tconst sidebarFill = document.querySelector(UISelectors.sidebarFill);\r\n\t\t\tconst sidebarClasses = sidebar.classList.value;\r\n\r\n\t\t\tif (sidebarClasses.includes(\"open\")) {\r\n\t\t\t\tsidebar.classList.remove(\"open\");\r\n\t\t\t\tsidebar.classList.add(\"close\");\r\n\t\t\t\tsidebarFill.classList.remove(\"open\");\r\n\t\t\t\tsetTimeout(() => {\r\n\t\t\t\t\tsidebar.style.display = \"none\";\r\n\t\t\t\t\tsidebarFill.style.display = \"none\";\r\n\t\t\t\t}, 300);\r\n\t\t\t} else {\r\n\t\t\t\tsidebar.classList.add(\"open\");\r\n\t\t\t\tsidebar.classList.remove(\"close\");\r\n\t\t\t\tsidebarFill.classList.add(\"open\");\r\n\t\t\t\tsidebar.style.display = \"block\";\r\n\t\t\t\tsidebarFill.style.display = \"block\";\r\n\t\t\t}\r\n\t\t},\r\n\t\tpopulateStats: function (showGreen = false) {\r\n\t\t\tthis.clearStats();\r\n\t\t\tconst stats = wordCtrl.getStats();\r\n\t\t\tlet { attempts } = wordCtrl.getBoard();\r\n\r\n\t\t\tconst highestGuess = Math.max(...Object.values(stats.guesses));\r\n\r\n\t\t\tconst gamesPlayed = document.querySelectorAll(\r\n\t\t\t\tUISelectors.mainStatsModal + \" .games-played span\"\r\n\t\t\t)[0];\r\n\t\t\tgamesPlayed.textContent = stats.gamesPlayed;\r\n\t\t\tconst winPercentage = document.querySelectorAll(\r\n\t\t\t\tUISelectors.mainStatsModal + \" .win-percentage span\"\r\n\t\t\t)[0];\r\n\t\t\twinPercentage.textContent = stats.winPercentage;\r\n\t\t\tconst currentStreak = document.querySelectorAll(\r\n\t\t\t\tUISelectors.mainStatsModal + \" .current-streak span\"\r\n\t\t\t)[0];\r\n\t\t\tcurrentStreak.textContent = stats.currentStreak;\r\n\t\t\tconst maxStreak = document.querySelectorAll(\r\n\t\t\t\tUISelectors.mainStatsModal + \" .max-streak span\"\r\n\t\t\t)[0];\r\n\t\t\tmaxStreak.textContent = stats.maxStreak;\r\n\r\n\t\t\tconst style = getComputedStyle(document.body);\r\n\t\t\tconst green = style.getPropertyValue(\"--green\");\r\n\t\t\tconst darkestGray = style.getPropertyValue(\"--darkestGray\");\r\n\r\n\t\t\tconst items = Array.from(\r\n\t\t\t\tdocument.querySelectorAll(\".guess-table > *\")\r\n\t\t\t);\r\n\t\t\titems.forEach((item, i) => {\r\n\t\t\t\titem.children[1].textContent = stats.guesses[i + 1];\r\n\t\t\t\titem.children[1].style.backgroundColor = darkestGray;\r\n\t\t\t\tconst width = (stats.guesses[i + 1] / highestGuess) * 100;\r\n\t\t\t\titem.children[1].style.width = width.toString() + \"%\";\r\n\r\n\t\t\t\tif (\r\n\t\t\t\t\ti + 1 === attempts.length &&\r\n\t\t\t\t\tshowGreen &&\r\n\t\t\t\t\tstats.wonLastGame\r\n\t\t\t\t) {\r\n\t\t\t\t\titem.children[1].style.backgroundColor = green;\r\n\t\t\t\t\t// item.children[1].style.width = \"100%\";\r\n\t\t\t\t}\r\n\t\t\t});\r\n\t\t},\r\n\t\tclearStats: function () {\r\n\t\t\tconst gamesPlayed = document.querySelectorAll(\r\n\t\t\t\tUISelectors.mainStatsModal + \" .games-played span\"\r\n\t\t\t)[0];\r\n\t\t\tgamesPlayed.textContent = \"\";\r\n\t\t\tconst winPercentage = document.querySelectorAll(\r\n\t\t\t\tUISelectors.mainStatsModal + \" .win-percentage span\"\r\n\t\t\t)[0];\r\n\t\t\twinPercentage.textContent = \"\";\r\n\t\t\tconst currentStreak = document.querySelectorAll(\r\n\t\t\t\tUISelectors.mainStatsModal + \" .current-streak span\"\r\n\t\t\t)[0];\r\n\t\t\tcurrentStreak.textContent = \"\";\r\n\t\t\tconst maxStreak = document.querySelectorAll(\r\n\t\t\t\tUISelectors.mainStatsModal + \" .max-streak span\"\r\n\t\t\t)[0];\r\n\t\t\tmaxStreak.textContent = \"\";\r\n\r\n\t\t\tconst items = Array.from(\r\n\t\t\t\tdocument.querySelectorAll(\".guess-table > *\")\r\n\t\t\t);\r\n\t\t\titems.forEach((item, i) => {\r\n\t\t\t\titem.children[1].textContent = \"\";\r\n\t\t\t});\r\n\t\t},\r\n\t};\r\n})();\r\n\r\n// APP CONTROLLER\r\nconst App = (function (wordCtrl, UICtrl) {\r\n\tconst todaysDateInput = function () {\r\n\t\tconst UISelectors = UICtrl.getSelectors();\r\n\r\n\t\tconst today = new Date();\r\n\t\tconst yesterday = new Date(today);\r\n\r\n\t\tyesterday.setDate(yesterday.getDate() - 1);\r\n\r\n\t\tlet month = yesterday.getMonth() + 1;\r\n\t\tmonth = month < 10 ? \"0\" + month : month;\r\n\t\tconst year = yesterday.getFullYear();\r\n\t\tlet day = yesterday.getDate();\r\n\t\tday = day < 10 ? \"0\" + day : day;\r\n\r\n\t\tconst elem = document.querySelector(UISelectors.dateInput);\r\n\t\tconst datepicker = new Datepicker(elem, {\r\n\t\t\tminDate: \"06-19-2021\",\r\n\t\t\tmaxDate: `${month}-${day}-${year}`,\r\n\t\t});\r\n\t\tdocument\r\n\t\t\t.querySelector(UISelectors.dateInput)\r\n\t\t\t.setAttribute(\"data-date\", `${month}-${day}-${year}`);\r\n\t\tdocument\r\n\t\t\t.querySelector(\r\n\t\t\t\tUISelectors.dateInput + \" .datepicker-grid span.focused\"\r\n\t\t\t)\r\n\t\t\t.classList.add(\"selected\");\r\n\t};\r\n\r\n\tconst updateLocalStorage = function () {\r\n\t\twordCtrl.clearStoredSolution();\r\n\t\twordCtrl.getStats();\r\n\t\twordCtrl.getDarkMode();\r\n\t\tUICtrl.populateStats();\r\n\t};\r\n\r\n\tconst loadEventListeners = function () {\r\n\t\t// GET UI SELECTORS\r\n\t\tconst UISelectors = UICtrl.getSelectors();\r\n\t\tdocument\r\n\t\t\t.querySelector(UISelectors.setDateBtn)\r\n\t\t\t.addEventListener(\"click\", dateChange);\r\n\t\tkeydownEventListener(true);\r\n\t\tdocument\r\n\t\t\t.querySelector(UISelectors.keyboard)\r\n\t\t\t.addEventListener(\"click\", keyboardClick);\r\n\r\n\t\tdocument\r\n\t\t\t.querySelector(\"#sidebar-inner #dark-mode\")\r\n\t\t\t.addEventListener(\"click\", UICtrl.toggleDarkMode);\r\n\t\tdocument\r\n\t\t\t.getElementById(\"hamburger-menu\")\r\n\t\t\t.addEventListener(\"click\", UICtrl.toggleSidebar);\r\n\t\tdocument\r\n\t\t\t.getElementById(\"sidebar-fill\")\r\n\t\t\t.addEventListener(\"click\", UICtrl.toggleSidebar);\r\n\r\n\t\tconst statsModal = document.getElementById(\"statsModal\");\r\n\t\tstatsModal.addEventListener(\"shown.bs.modal\", (e) => {\r\n\t\t\tconst sidebarClasses = document.querySelector(UISelectors.sidebar)\r\n\t\t\t\t.classList.value;\r\n\t\t\tif (sidebarClasses.includes(\"open\")) {\r\n\t\t\t\tUICtrl.toggleSidebar(e);\r\n\t\t\t}\r\n\t\t});\r\n\t};\r\n\r\n\tconst keyboardClick = function (e) {\r\n\t\te.preventDefault();\r\n\r\n\t\tlet key = e.target.dataset.key;\r\n\t\tconst isEmpty = Object.keys(e.target.dataset).length === 0;\r\n\r\n\t\tif (isEmpty) {\r\n\t\t\treturn false;\r\n\t\t}\r\n\r\n\t\tkey = key.toLowerCase();\r\n\r\n\t\tif (key === \"backspace\") {\r\n\t\t\tUICtrl.backspaceLetterInput();\r\n\t\t\twordCtrl.updateCurrentWord(e.key, true);\r\n\t\t\treturn false;\r\n\t\t}\r\n\r\n\t\tif (key === \"enter\") {\r\n\t\t\tgetWord();\r\n\t\t\treturn false;\r\n\t\t}\r\n\r\n\t\tUICtrl.addLetterInput(key);\r\n\t\twordCtrl.updateCurrentWord(key);\r\n\t};\r\n\r\n\tconst keydownEventListener = function (isOn) {\r\n\t\tif (!isOn) {\r\n\t\t\tdocument.removeEventListener(\"keydown\", typeWord);\r\n\t\t\treturn false;\r\n\t\t}\r\n\r\n\t\tdocument.addEventListener(\"keydown\", typeWord);\r\n\t};\r\n\r\n\tconst formatDate = function (date, isYesterday = false) {\r\n\t\tconst d = new Date(date);\r\n\r\n\t\tlet month = d.getMonth() + 1;\r\n\t\tmonth = month < 10 ? \"0\" + month : month;\r\n\t\tconst year = d.getFullYear();\r\n\t\tlet day = d.getDate();\r\n\t\tday = day < 10 ? \"0\" + day : day;\r\n\r\n\t\treturn `${month}-${day}-${year}`;\r\n\t};\r\n\r\n\tconst dateChange = function (e) {\r\n\t\t// update datepicker data attr value\r\n\t\tconst UISelectors = UICtrl.getSelectors();\r\n\t\tconst selectedDate = document\r\n\t\t\t.querySelector(UISelectors.selectedDate)\r\n\t\t\t.getAttribute(\"data-date\");\r\n\t\tconst date = formatDate(parseInt(selectedDate));\r\n\r\n\t\tdocument\r\n\t\t\t.querySelector(UISelectors.dateInput)\r\n\t\t\t.setAttribute(\"data-date\", date);\r\n\r\n\t\t// close modal\r\n\t\tvar dateModal = document.getElementById(\"dateModal\");\r\n\t\tvar modal = bootstrap.Modal.getInstance(dateModal);\r\n\t\tmodal.hide();\r\n\r\n\t\tUICtrl.clearBoard();\r\n\t\tUICtrl.clearKeyboard();\r\n\t\tUICtrl.clearAlert();\r\n\t\twordCtrl.resetBoard();\r\n\t\twordCtrl.clearStoredSolution();\r\n\t\tkeydownEventListener(true);\r\n\t};\r\n\r\n\tconst typeWord = function (e) {\r\n\t\te.preventDefault();\r\n\r\n\t\tlet code = e.code.toLowerCase();\r\n\t\tlet regex = /key/gi;\r\n\r\n\t\t// IF F5, Refresh the page duhh\r\n\t\tif (e.code === \"F5\" || e.key === \"F5\" || e.keyCode === 116) {\r\n\t\t\twindow.location.reload();\r\n\t\t}\r\n\r\n\t\tif (e.code === 8 || e.key === \"Backspace\" || e.keyCode === 8) {\r\n\t\t\t//if(!result && (e.code === 8 || e.key === 'Backspace' || e.keyCode === 8)){\r\n\t\t\tUICtrl.backspaceLetterInput();\r\n\t\t\twordCtrl.updateCurrentWord(e.key, true);\r\n\t\t\treturn false;\r\n\t\t}\r\n\r\n\t\tif (e.code === 13 || e.key === \"Enter\" || e.keyCode === 13) {\r\n\t\t\tgetWord();\r\n\t\t\treturn false;\r\n\t\t}\r\n\r\n\t\tlet result = regex.test(code);\r\n\t\tif (result) {\r\n\t\t\t// TYPE LETTER IN INPUT\r\n\t\t\tUICtrl.addLetterInput(e.key);\r\n\t\t\twordCtrl.updateCurrentWord(e.key);\r\n\t\t}\r\n\t};\r\n\r\n\tconst getWord = function () {\r\n\t\tconst word = UICtrl.getWordInput();\r\n\t\tconst date = UICtrl.getDateInput();\r\n\r\n\t\tif (word === \"\" || word.length !== 5) {\r\n\t\t\tUICtrl.showAlert(\"warning\", \"Not enough letters.\");\r\n\t\t\treturn false;\r\n\t\t}\r\n\r\n\t\twordCtrl.getWord(word, (wordData) => {\r\n\t\t\tlet success = wordData.hasOwnProperty(\"word\");\r\n\t\t\tif (!success) {\r\n\t\t\t\tUICtrl.showAlert(\"danger\", \"Not in word list\");\r\n\t\t\t\treturn false;\r\n\t\t\t}\r\n\r\n\t\t\twordCtrl.addAttempt(word);\r\n\r\n\t\t\tlet board = wordCtrl.getBoard();\r\n\r\n\t\t\t// success does the word match?\r\n\t\t\twordCtrl.getSolution(date, (solution) => {\r\n\t\t\t\twordCtrl.addResults(word);\r\n\t\t\t\tkeydownEventListener(false);\r\n\t\t\t\tUICtrl.showLastAttempt(() => {\r\n\t\t\t\t\tkeydownEventListener(true);\r\n\t\t\t\t});\r\n\t\t\t\tconst correctWord = solution.word.toLowerCase();\r\n\t\t\t\tif (\r\n\t\t\t\t\tboard.currentRow === board.attemptLimit &&\r\n\t\t\t\t\tword !== correctWord\r\n\t\t\t\t) {\r\n\t\t\t\t\t// GAME IS OVER\r\n\t\t\t\t\tkeydownEventListener(false);\r\n\t\t\t\t\tUICtrl.showAlert(\"info\", correctWord);\r\n\t\t\t\t\treturn false;\r\n\t\t\t\t}\r\n\r\n\t\t\t\tif (correctWord === word) {\r\n\t\t\t\t\tUICtrl.showAlert(\"success\", \"Word Matches!\");\r\n\t\t\t\t\tkeydownEventListener(false);\r\n\t\t\t\t\tUICtrl.showStatsModal();\r\n\t\t\t\t} else {\r\n\t\t\t\t\t//UICtrl.showAlert('warning', 'Word doesn\\'t match');\r\n\t\t\t\t\t// add animation here\r\n\t\t\t\t}\r\n\t\t\t});\r\n\t\t});\r\n\t};\r\n\r\n\tconst todaysSolution = function () {\r\n\t\tconst date = UICtrl.getDateInput();\r\n\t\twordCtrl.getSolution(date, () => {});\r\n\t};\r\n\r\n\treturn {\r\n\t\tinit: function () {\r\n\t\t\t// console.log(\"Initializing App...\");\r\n\r\n\t\t\tupdateLocalStorage();\r\n\t\t\tloadEventListeners();\r\n\t\t\ttodaysDateInput();\r\n\t\t\ttodaysSolution();\r\n\t\t},\r\n\t};\r\n})(wordCtrl, UICtrl);\r\n\r\nApp.init();\r\n\n\n//# sourceURL=webpack://rewordle/./src/app.js?");

/***/ }),

/***/ "./src/wordsAPI.js":
/*!*************************!*\
  !*** ./src/wordsAPI.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"http\": () => (/* binding */ http)\n/* harmony export */ });\nclass wordsAPI {\r\n\tasync get(word) {\r\n\t\tconst response = await fetch(`../api/bank.json`);\r\n\t\tconst data = await response.json();\r\n\t\tfor (const [i, w] of data.entries()) {\r\n\t\t\tif (w === word) {\r\n\t\t\t\treturn { word: w };\r\n\t\t\t}\r\n\t\t\tif (i + 1 === data.length) {\r\n\t\t\t\treturn {};\r\n\t\t\t}\r\n\t\t}\r\n\t}\r\n\r\n\tasync getSolution(date) {\r\n\t\tconst response = await fetch(\r\n\t\t\t`https://www.noelpena.com/api/wordle/${date}`\r\n\t\t);\r\n\r\n\t\tconst { data, error } = await response.json();\r\n\r\n\t\tif (!error) {\r\n\t\t\t// console.log(\"test\", data);\r\n\t\t\treturn data;\r\n\t\t}\r\n\t}\r\n}\r\n\r\nconst http = new wordsAPI();\r\n\n\n//# sourceURL=webpack://rewordle/./src/wordsAPI.js?");

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