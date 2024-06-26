import { http } from "./wordsAPI";

const localStorageKeyName = "rewordle-solution";
const localStorageStatsName = "rewordle-statistics";
const localStorageDarkMode = "rewordle-darkmode";

// WORD CONTROLLER
const wordCtrl = (function () {
	const board = {
		currentWord: "",
		solution: "",
		status: "in-progress",
		attempts: [],
		results: [],
		currentRow: 0,
		attemptLimit: 6,
	};

	const stats = {
		avgGuesses: 0,
		currentStreak: 0,
		gamesPlayed: 0,
		gamesWon: 0,
		guesses: {
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
			6: 0,
			fail: 0,
		},
		maxStreak: 0,
		winPercentage: 0,
		wonLastGame: false,
		datesPlayed: [],
	};

	const hasRepeatingLetters = function (word) {
		return /(.).*\1/.test(word);
	};

	return {
		getBoard: function () {
			return board;
		},
		getWord: function (word, callback) {
			http.get(word)
				.then((data) => {
					// console.log(data);
					callback(data);
				})
				.catch((err) => console.log(err));
		},
		getSolution: function (date, callback) {
			const solutionExists = localStorage.getItem(localStorageKeyName);

			if (solutionExists) {
				callback(JSON.parse(solutionExists));
			} else {
				http.getSolution(date)
					.then((data) => {
						board.solution = data.word.toLowerCase();
						localStorage.setItem(
							localStorageKeyName,
							JSON.stringify(data)
						);
						callback(data);
					})
					.catch((err) => console.log(err));
			}
		},
		clearStoredSolution: function () {
			localStorage.removeItem(localStorageKeyName);
		},
		updateCurrentWord: function (letter, toRemove = false) {
			if (board.currentWord.length >= 5 && !toRemove) {
				return false;
			}

			if (toRemove) {
				board.currentWord = board.currentWord.substring(
					0,
					board.currentWord.length - 1
				);
				return false;
			}

			board.currentWord = board.currentWord + letter;
		},
		clearCurrentWord: function () {
			board.currentWord = "";
		},
		addAttempt: function (word) {
			board.attempts.push(word);
			board.currentRow++;

			if (board.currentRow === 6) {
				board.status = "game over";
			}
		},
		addResults: function (word) {
			word = word.toLowerCase();
			let solution = board.solution.toLowerCase();
			const todaysSolution = board.solution.toLowerCase();
			const resultsArr = [];

			if (word === solution) {
				board.status = "game over";
			}
			if (board.currentRow === board.attemptLimit && word !== solution) {
				board.status = "game over";
			}

			// all results as absent
			for (let i = 0; i < word.length; i++) {
				resultsArr.push({ letter: word[i], result: "absent" });
			}

			// add correct results then remove letter from solution
			for (let i = 0; i < word.length; i++) {
				// if(i === solution.indexOf(word[i])){
				if (word[i] === solution[i]) {
					resultsArr[i] = { letter: word[i], result: "correct" };
					solution = solution.replace(word[i], " ");
				}
			}
			// add present with check for correct results then remove letter from solution
			for (let i = 0; i < word.length; i++) {
				let regex = new RegExp(`${word[i]}`);
				let test = regex.test(solution);
				// can also use solution.includes(word[i]) instead of regex

				if (resultsArr[i].result !== "correct" && test) {
					resultsArr[i] = { letter: word[i], result: "present" };
					solution = solution.replace(word[i], " ");
				}
			}

			board.results.push(resultsArr.map((item) => item.result));
			wordCtrl.clearCurrentWord();

			// update stats here
			if (word === todaysSolution && board.status === "game over") {
				this.updateStats(true);
			}
			if (word !== todaysSolution && board.status === "game over") {
				this.updateStats(false);
			}
		},
		resetBoard: function () {
			board.currentWord = "";
			board.solution = "";
			board.status = "in-progress";
			board.attempts = [];
			board.results = [];
			(board.currentRow = 0), (board.attemptLimit = 6);
		},
		getStats: function () {
			const storedStats = localStorage.getItem(localStorageStatsName);

			if (storedStats === null) {
				localStorage.setItem(
					localStorageStatsName,
					JSON.stringify(stats)
				);
				return stats;
			} else {
				const _storedStats = JSON.parse(storedStats);
				stats.currentStreak = _storedStats.currentStreak;
				stats.gamesPlayed = _storedStats.gamesPlayed;
				stats.gamesWon = _storedStats.gamesWon;
				stats.guesses = _storedStats.guesses;
				stats.maxStreak = _storedStats.maxStreak;
				stats.winPercentage = _storedStats.winPercentage;
				stats.wonLastGame = _storedStats.wonLastGame;
				stats.datesPlayed = _storedStats.datesPlayed;

				return _storedStats;
			}
		},
		updateStats: function (gameWon) {
			// Updating stats to include which dates have been played
			const date = UICtrl.getDateInput();
			let dateUpdated = false;
			stats.datesPlayed.forEach((date) => {
				if (date.date === date) {
					date.isWinner = gameWon;
					date.attempts = board.attempts.length;
					date.board = board;
					dateUpdated = true;
				}
			});

			if (!dateUpdated) {
				stats.datesPlayed.push({
					date: date,
					isWinner: gameWon,
					attempts: board.attempts.length,
					board: board,
				});
			}

			stats.gamesPlayed = stats.gamesPlayed + 1;

			if (gameWon) {
				stats.gamesWon = stats.gamesWon + 1;
				stats.guesses[board.attempts.length] =
					stats.guesses[board.attempts.length] + 1;
				if (stats.wonLastGame || stats.currentStreak === 0) {
					stats.currentStreak = stats.currentStreak + 1;
				}
				stats.wonLastGame = true;

				if (stats.currentStreak >= stats.maxStreak) {
					stats.maxStreak = stats.currentStreak;
				}
			} else {
				stats.guesses["fail"] = stats.guesses["fail"] + 1;
				if (!stats.wonLastGame) {
					stats.currentStreak = 0;
				}
				stats.wonLastGame = false;
			}
			stats.winPercentage = Math.round(
				(stats.gamesWon / stats.gamesPlayed) * 100
			);

			localStorage.setItem(localStorageStatsName, JSON.stringify(stats));
			UICtrl.populateStats(true);
		},
		getDarkMode: function () {
			const storedDarkMode = JSON.parse(
				localStorage.getItem(localStorageDarkMode)
			);

			if (storedDarkMode === null) {
				localStorage.setItem(localStorageDarkMode, "false");
				return;
			}

			if (storedDarkMode) {
				UICtrl.toggleDarkMode();
			}
		},
	};
})();

// UI CONTROLLER
const UICtrl = (function () {
	const UISelectors = {
		wordInput: "#word-input",
		dateInput: "#inputDate",
		dateInputData: "data-date",
		setDateBtn: "#set-date",
		selectedDate: "#inputDate .datepicker-grid .datepicker-cell.selected",
		results: "#results",
		form: "#form",
		attemptOutput: "#output ul",
		board: "#board", // new grid selectors
		gridRow: "#board .grid-row",
		emptyLetter: '.letter[data-state="empty"]',
		filledLetter: '.letter[data-state="filled"]',
		absentLetter: '.letter[data-state="absent"]',
		presentLetter: '.letter[data-state="present"]',
		correctLetter: '.letter[data-state="correct"]',
		keyboard: "#keyboard",
		keyboardLetter: "#keyboard button.letter-key",
		keyboardRow: "#keyboard .keyboard-row",
		sidebar: "#sidebar-menu",
		sidebarFill: "#sidebar-fill",
		darkModeCheckbox: "#e",
		mainStatsModal: "#statsModal .main-stats",
	};

	return {
		showAlert: function (type, message) {
			let { status, solution } = wordCtrl.getBoard();
			type = "dark";
			this.clearAlert();
			const wrapper = document.createElement("div");
			wrapper.innerHTML = `
        <div class="alert alert-${type} text-white bg-dark fw-bold fade show" role="alert" id="re-alert">
           <div>${message}</div>          
        </div>`;

			document.querySelector(UISelectors.results).append(wrapper);
			if (status !== "game over") {
				setTimeout(() => {
					const alert =
						bootstrap.Alert.getOrCreateInstance("#re-alert");
					alert.close();
					document
						.querySelector(UISelectors.results)
						.classList.add("fadeOut");
				}, 1800);
				setTimeout(this.clearAlert, 2000);
			}

			if (status === "game over" && message !== solution) {
				setTimeout(() => {
					const alert =
						bootstrap.Alert.getOrCreateInstance("#re-alert");
					alert.close();
					document
						.querySelector(UISelectors.results)
						.classList.add("fadeOut");
				}, 5800);
				setTimeout(this.clearAlert, 6000);
			}
		},
		clearAlert: function () {
			document.querySelector(UISelectors.results).innerHTML = "";
			document
				.querySelector(UISelectors.results)
				.classList.remove("fadeOut");
		},
		getSelectors: function () {
			return UISelectors;
		},
		getWordInput: function () {
			let board = wordCtrl.getBoard();
			let letters = document.querySelectorAll(
				UISelectors.gridRow +
					`:nth-child(${board.currentRow + 1}) .letter`
			);
			letters = Array.from(letters);

			let word = letters.map((letter) => letter.dataset.letter).join("");
			word = word.toLowerCase();
			return word;
		},
		getDateInput: function () {
			const date = document
				.querySelector(UISelectors.dateInput)
				.getAttribute(UISelectors.dateInputData);
			const dateArr = date.split("-");

			return `${dateArr[2]}-${dateArr[0]}-${dateArr[1]}`;
		},
		clearBoard: function () {
			// need to add
			//some animation to flip/spin all tiles
			let letters = document.querySelectorAll(
				UISelectors.gridRow + " .letter"
			);
			letters = Array.from(letters);

			letters.forEach((letter) => {
				letter.textContent = "";
				letter.dataset.letter = "";
				letter.dataset.state = "empty";
				letter.className = "letter";
			});
		},
		clearKeyboard: function () {
			let keyLetters = document.querySelectorAll(
				UISelectors.keyboardLetter
			);
			keyLetters = Array.from(keyLetters);

			keyLetters.forEach((letter) => {
				letter.dataset.state = "empty";
			});
		},
		addLetterInput: function (newKey) {
			let board = wordCtrl.getBoard();
			const currentWord = board.currentWord;

			if (currentWord.length === 5) {
				return false;
			}

			if (currentWord.length <= 5) {
				let box = document.querySelector(
					UISelectors.gridRow +
						`:nth-child(${board.currentRow + 1})` +
						" " +
						UISelectors.emptyLetter
				);
				box.textContent = newKey.toUpperCase();
				box.dataset.state = "filled";
				box.dataset.letter = newKey;
			}
		},
		backspaceLetterInput: function () {
			let board = wordCtrl.getBoard();
			if (board.currentWord.length === 0) {
				return false;
			}

			let box = document.querySelector(
				UISelectors.gridRow +
					`:nth-child(${board.currentRow + 1})` +
					" " +
					UISelectors.filledLetter +
					`:nth-child(${board.currentWord.length})`
			);

			box.textContent = "";
			box.dataset.state = "empty";
			box.dataset.letter = "";
		},
		updateKeyboard: function () {
			let board = wordCtrl.getBoard();
			const lastAttempt = Array.from(
				board.attempts[board.currentRow - 1]
			);

			lastAttempt.forEach((letter, i) => {
				const result = board.results[board.currentRow - 1][i];
				document.querySelector(
					UISelectors.keyboardLetter + `[data-key="${letter}"]`
				).dataset.state = result;
			});
		},
		showLastAttempt: function (callback) {
			let board = wordCtrl.getBoard();
			let letters = document.querySelectorAll(
				UISelectors.gridRow + `:nth-child(${board.currentRow}) .letter`
			);
			letters = Array.from(letters);

			let i = 0;
			letters[i].classList.add(
				"animate__animated",
				"animate__flip",
				"animate__faster"
			);
			letters[i].dataset.state = board.results[board.currentRow - 1][i];
			i++;

			const flipAnimation = setInterval(() => {
				if (i === 4) {
					window.clearInterval(flipAnimation);
				}
				letters[i].classList.add(
					"animate__animated",
					"animate__flip",
					"animate__faster"
				);
				letters[i].dataset.state =
					board.results[board.currentRow - 1][i];
				i++;
			}, 500);

			setTimeout(() => {
				this.updateKeyboard();
				if (board.attempts[board.currentRow - 1] === board.solution) {
					this.correctWordAnimate(board);
				} else {
					callback();
				}
			}, 2700);
		},
		correctWordAnimate: function (board) {
			let letters = document.querySelectorAll(
				UISelectors.gridRow + `:nth-child(${board.currentRow}) .letter`
			);
			letters = Array.from(letters);

			board.results[board.currentRow - 1].forEach((result, i) => {
				letters[i].classList.remove(
					"animate__animated",
					"animate__flip",
					"animate__faster"
				);
			});

			let i = 0;
			letters[i].classList.add(
				"animate__animated",
				"animate__bounce",
				"animate__faster"
			);
			letters[i].dataset.state = board.results[board.currentRow - 1][i];
			i++;

			const bounceAnimation = setInterval(() => {
				if (i === 4) {
					window.clearInterval(bounceAnimation);
				}
				letters[i].classList.add(
					"animate__animated",
					"animate__bounce",
					"animate__faster"
				);
				letters[i].dataset.state =
					board.results[board.currentRow - 1][i];
				i++;
			}, 150);
		},
		showStatsModal: function () {
			setTimeout(() => {
				var statsModal = new bootstrap.Modal(
					document.getElementById("statsModal")
				);
				statsModal.show();
			}, 5000);
		},
		toggleDarkMode: function (e) {
			const body = document.querySelector("body");
			const bodyClass = body.className;
			if (bodyClass.includes("dark")) {
				body.classList.remove("dark");
				document
					.querySelector(
						"#instructionsModal .modal-content .btn-close"
					)
					.classList.remove("btn-close-white");
				document
					.querySelector("#dateModal .modal-content .btn-close")
					.classList.remove("btn-close-white");
				document
					.querySelector("#statsModal .modal-content .btn-close")
					.classList.remove("btn-close-white");

				localStorage.setItem(localStorageDarkMode, "false");
			} else {
				if (e === undefined) {
					document.querySelector(
						UISelectors.darkModeCheckbox
					).checked = true;
				}
				body.classList.add("dark");
				document
					.querySelector(
						"#instructionsModal .modal-content .btn-close"
					)
					.classList.add("btn-close-white");
				document
					.querySelector("#dateModal .modal-content .btn-close")
					.classList.add("btn-close-white");
				document
					.querySelector("#statsModal .modal-content .btn-close")
					.classList.add("btn-close-white");
				localStorage.setItem(localStorageDarkMode, "true");
			}
		},
		toggleSidebar: function (e) {
			e.preventDefault();

			const UISelectors = UICtrl.getSelectors();
			const sidebar = document.querySelector(UISelectors.sidebar);
			const sidebarFill = document.querySelector(UISelectors.sidebarFill);
			const sidebarClasses = sidebar.classList.value;

			if (sidebarClasses.includes("open")) {
				sidebar.classList.remove("open");
				sidebar.classList.add("close");
				sidebarFill.classList.remove("open");
				setTimeout(() => {
					sidebar.style.display = "none";
					sidebarFill.style.display = "none";
				}, 300);
			} else {
				sidebar.classList.add("open");
				sidebar.classList.remove("close");
				sidebarFill.classList.add("open");
				sidebar.style.display = "block";
				sidebarFill.style.display = "block";
			}
		},
		populateStats: function (showGreen = false) {
			this.clearStats();
			const stats = wordCtrl.getStats();
			let { attempts } = wordCtrl.getBoard();

			const highestGuess = Math.max(...Object.values(stats.guesses));

			const gamesPlayed = document.querySelectorAll(
				UISelectors.mainStatsModal + " .games-played span"
			)[0];
			gamesPlayed.textContent = stats.gamesPlayed;
			const winPercentage = document.querySelectorAll(
				UISelectors.mainStatsModal + " .win-percentage span"
			)[0];
			winPercentage.textContent = stats.winPercentage;
			const currentStreak = document.querySelectorAll(
				UISelectors.mainStatsModal + " .current-streak span"
			)[0];
			currentStreak.textContent = stats.currentStreak;
			const maxStreak = document.querySelectorAll(
				UISelectors.mainStatsModal + " .max-streak span"
			)[0];
			maxStreak.textContent = stats.maxStreak;

			const style = getComputedStyle(document.body);
			const green = style.getPropertyValue("--green");
			const darkestGray = style.getPropertyValue("--darkestGray");

			const items = Array.from(
				document.querySelectorAll(".guess-table > *")
			);
			items.forEach((item, i) => {
				item.children[1].textContent = stats.guesses[i + 1];
				item.children[1].style.backgroundColor = darkestGray;
				const width = (stats.guesses[i + 1] / highestGuess) * 100;
				item.children[1].style.width = width.toString() + "%";

				if (
					i + 1 === attempts.length &&
					showGreen &&
					stats.wonLastGame
				) {
					item.children[1].style.backgroundColor = green;
					// item.children[1].style.width = "100%";
				}
			});
		},
		clearStats: function () {
			const gamesPlayed = document.querySelectorAll(
				UISelectors.mainStatsModal + " .games-played span"
			)[0];
			gamesPlayed.textContent = "";
			const winPercentage = document.querySelectorAll(
				UISelectors.mainStatsModal + " .win-percentage span"
			)[0];
			winPercentage.textContent = "";
			const currentStreak = document.querySelectorAll(
				UISelectors.mainStatsModal + " .current-streak span"
			)[0];
			currentStreak.textContent = "";
			const maxStreak = document.querySelectorAll(
				UISelectors.mainStatsModal + " .max-streak span"
			)[0];
			maxStreak.textContent = "";

			const items = Array.from(
				document.querySelectorAll(".guess-table > *")
			);
			items.forEach((item, i) => {
				item.children[1].textContent = "";
			});
		},
	};
})();

// APP CONTROLLER
const App = (function (wordCtrl, UICtrl) {
	const todaysDateInput = function () {
		const UISelectors = UICtrl.getSelectors();

		const today = new Date();
		const yesterday = new Date(today);

		yesterday.setDate(yesterday.getDate() - 1);

		let month = yesterday.getMonth() + 1;
		month = month < 10 ? "0" + month : month;
		const year = yesterday.getFullYear();
		let day = yesterday.getDate();
		day = day < 10 ? "0" + day : day;

		const elem = document.querySelector(UISelectors.dateInput);
		const datepicker = new Datepicker(elem, {
			minDate: "06-19-2021",
			maxDate: `${month}-${day}-${year}`,
		});
		document
			.querySelector(UISelectors.dateInput)
			.setAttribute("data-date", `${month}-${day}-${year}`);
		document
			.querySelector(
				UISelectors.dateInput + " .datepicker-grid span.focused"
			)
			.classList.add("selected");
	};

	const updateLocalStorage = function () {
		wordCtrl.clearStoredSolution();
		wordCtrl.getStats();
		wordCtrl.getDarkMode();
		UICtrl.populateStats();
	};

	const loadEventListeners = function () {
		// GET UI SELECTORS
		const UISelectors = UICtrl.getSelectors();
		document
			.querySelector(UISelectors.setDateBtn)
			.addEventListener("click", dateChange);
		keydownEventListener(true);
		document
			.querySelector(UISelectors.keyboard)
			.addEventListener("click", keyboardClick);

		document
			.querySelector("#sidebar-inner #dark-mode")
			.addEventListener("click", UICtrl.toggleDarkMode);
		document
			.getElementById("hamburger-menu")
			.addEventListener("click", UICtrl.toggleSidebar);
		document
			.getElementById("sidebar-fill")
			.addEventListener("click", UICtrl.toggleSidebar);

		const statsModal = document.getElementById("statsModal");
		statsModal.addEventListener("shown.bs.modal", (e) => {
			const sidebarClasses = document.querySelector(UISelectors.sidebar)
				.classList.value;
			if (sidebarClasses.includes("open")) {
				UICtrl.toggleSidebar(e);
			}
		});
	};

	const keyboardClick = function (e) {
		e.preventDefault();

		let key = e.target.dataset.key;
		const isEmpty = Object.keys(e.target.dataset).length === 0;

		if (isEmpty) {
			return false;
		}

		key = key.toLowerCase();

		if (key === "backspace") {
			UICtrl.backspaceLetterInput();
			wordCtrl.updateCurrentWord(e.key, true);
			return false;
		}

		if (key === "enter") {
			getWord();
			return false;
		}

		UICtrl.addLetterInput(key);
		wordCtrl.updateCurrentWord(key);
	};

	const keydownEventListener = function (isOn) {
		if (!isOn) {
			document.removeEventListener("keydown", typeWord);
			return false;
		}

		document.addEventListener("keydown", typeWord);
	};

	const formatDate = function (date, isYesterday = false) {
		const d = new Date(date);

		let month = d.getMonth() + 1;
		month = month < 10 ? "0" + month : month;
		const year = d.getFullYear();
		let day = d.getDate();
		day = day < 10 ? "0" + day : day;

		return `${month}-${day}-${year}`;
	};

	const dateChange = function (e) {
		// update datepicker data attr value
		const UISelectors = UICtrl.getSelectors();
		const selectedDate = document
			.querySelector(UISelectors.selectedDate)
			.getAttribute("data-date");
		const date = formatDate(parseInt(selectedDate));

		document
			.querySelector(UISelectors.dateInput)
			.setAttribute("data-date", date);

		// close modal
		var dateModal = document.getElementById("dateModal");
		var modal = bootstrap.Modal.getInstance(dateModal);
		modal.hide();

		UICtrl.clearBoard();
		UICtrl.clearKeyboard();
		UICtrl.clearAlert();
		wordCtrl.resetBoard();
		wordCtrl.clearStoredSolution();
		keydownEventListener(true);
	};

	const typeWord = function (e) {
		e.preventDefault();

		let code = e.code.toLowerCase();
		let regex = /key/gi;

		// IF F5, Refresh the page duhh
		if (e.code === "F5" || e.key === "F5" || e.keyCode === 116) {
			window.location.reload();
		}

		if (e.code === 8 || e.key === "Backspace" || e.keyCode === 8) {
			//if(!result && (e.code === 8 || e.key === 'Backspace' || e.keyCode === 8)){
			UICtrl.backspaceLetterInput();
			wordCtrl.updateCurrentWord(e.key, true);
			return false;
		}

		if (e.code === 13 || e.key === "Enter" || e.keyCode === 13) {
			getWord();
			return false;
		}

		let result = regex.test(code);
		if (result) {
			// TYPE LETTER IN INPUT
			UICtrl.addLetterInput(e.key);
			wordCtrl.updateCurrentWord(e.key);
		}
	};

	const getWord = function () {
		const word = UICtrl.getWordInput();
		const date = UICtrl.getDateInput();

		if (word === "" || word.length !== 5) {
			UICtrl.showAlert("warning", "Not enough letters.");
			return false;
		}

		wordCtrl.getWord(word, (wordData) => {
			let success = wordData.hasOwnProperty("word");
			if (!success) {
				UICtrl.showAlert("danger", "Not in word list");
				return false;
			}

			wordCtrl.addAttempt(word);

			let board = wordCtrl.getBoard();

			// success does the word match?
			wordCtrl.getSolution(date, (solution) => {
				wordCtrl.addResults(word);
				keydownEventListener(false);
				UICtrl.showLastAttempt(() => {
					keydownEventListener(true);
				});
				const correctWord = solution.word.toLowerCase();
				if (
					board.currentRow === board.attemptLimit &&
					word !== correctWord
				) {
					// GAME IS OVER
					keydownEventListener(false);
					UICtrl.showAlert("info", correctWord);
					return false;
				}

				if (correctWord === word) {
					UICtrl.showAlert("success", "Word Matches!");
					keydownEventListener(false);
					UICtrl.showStatsModal();
				} else {
					//UICtrl.showAlert('warning', 'Word doesn\'t match');
					// add animation here
				}
			});
		});
	};

	const todaysSolution = function () {
		const date = UICtrl.getDateInput();
		wordCtrl.getSolution(date, () => {});
	};

	return {
		init: function () {
			// console.log("Initializing App...");

			updateLocalStorage();
			loadEventListeners();
			todaysDateInput();
			todaysSolution();
		},
	};
})(wordCtrl, UICtrl);

App.init();
