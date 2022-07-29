import { http } from './wordsAPI';

// WORD CONTROLLER
const wordCtrl = (function(){
  const board = {
    currentWord: '',
    solution: '',
    status: 'in-progress',
    attempts: [],
    results: [],
    currentRow: 0,
    attemptLimit: 6
  };

  const hasRepeatingLetters = function(word){
      return /(.).*\1/.test(word);  
  }

  return {
    getBoard: function(){
      return board;
    },
    getWord: function(word, callback){
      http.get(word)
      .then(data => {
        // console.log(data);
        callback(data);
      })
      .catch(err => console.log(err));
    },
    getSolution: function(date, callback){
      http.getSolution(date)
      .then(data => {
        board.solution = data.word.toLowerCase();
        callback(data);
      })
      .catch(err => console.log(err));
    },
    updateCurrentWord: function(letter, toRemove = false){
      if(board.currentWord.length >= 5 && !toRemove){
        return false;
      }

      if(toRemove){
        board.currentWord = board.currentWord.substring(0, board.currentWord.length - 1);
        return false;
      }

      board.currentWord = board.currentWord + letter;
    },
    clearCurrentWord : function(){
      board.currentWord = '';
    },
    addAttempt: function(word){
      board.attempts.push(word);
      board.currentRow++;      

      if(board.currentRow === 6){
        board.status = "game over"
      }
    },
    addResults: function(word){
      //RESULTS NEEDS TO AFFECT THE UI as well
      
      word = word.toLowerCase();
      let solution = board.solution.toLowerCase();
      const resultsArr = [];

      if(word === solution){board.status = "game over"}

      // all results as absent
      for (let i = 0; i < word.length; i++){
        resultsArr.push({letter: word[i], result: "absent"})
      }

      // add correct results then remove letter from solution
      for (let i = 0; i < word.length; i++){        
        // if(i === solution.indexOf(word[i])){
        if(word[i] === solution[i]){
          resultsArr[i] = {letter: word[i], result: "correct"};
          solution = solution.replace(word[i]," ");
        }
      }
      // add present with check for correct results then remove letter from solution
      for (let i = 0; i < word.length; i++){        
        let regex = new RegExp(`${word[i]}`);
        let test = regex.test(solution)
        // can also use solution.includes(word[i]) instead of regex
          
        if(resultsArr[i].result !== "correct" && test){
          resultsArr[i] = {letter: word[i], result: "present"};
          solution = solution.replace(word[i]," ");
        }
      }

      board.results.push(resultsArr.map(item => item.result));
      wordCtrl.clearCurrentWord();
    },
    resetBoard: function(){
      board.currentWord = '';
      board.solution = '';
      board.status = 'in-progress';
      board.attempts = [];
      board.results = [];
      board.currentRow = 0,
      board.attemptLimit = 6
    }
  }
})();

// UI CONTROLLER
const UICtrl = (function(){
  const UISelectors = {
    wordInput: '#word-input',
    dateInput: '#inputDate',
    dateInputData: 'data-date',
    setDateBtn: "#set-date",
    selectedDate: "#inputDate .datepicker-grid .datepicker-cell.selected",
    results: '#results', 
    form: '#form',
    attemptOutput: '#output ul',
    board: '#board',// new grid selectors
    gridRow: '#board .grid-row',
    emptyLetter: '.letter[data-state="empty"]',
    filledLetter: '.letter[data-state="filled"]',
    absentLetter: '.letter[data-state="absent"]',
    presentLetter: '.letter[data-state="present"]',
    correctLetter: '.letter[data-state="correct"]',
    keyboard: '#keyboard',
    keyboardLetter: '#keyboard button.letter-key',
    keyboardRow: '#keyboard .keyboard-row',
  };
  
  return {
    showAlert: function(type, message){
      let {status} = wordCtrl.getBoard();
      type = "dark";
      this.clearAlert();
      const wrapper = document.createElement('div');
      wrapper.innerHTML = `
        <div class="alert alert-${type} text-white bg-dark fw-bold fade show" role="alert" id="re-alert">
           <div>${message}</div>          
        </div>`;

      document.querySelector(UISelectors.results).append(wrapper);
      if(status !== "game over"){
        setTimeout(() =>{
          const alert = bootstrap.Alert.getOrCreateInstance('#re-alert');
          alert.close();
        }, 1800);
        setTimeout(this.clearAlert, 2000);
      }
    },
    clearAlert: function(){
      document.querySelector(UISelectors.results).innerHTML = '';
    },
    getSelectors: function(){
      return UISelectors;
    },
    getWordInput: function(){
      let board = wordCtrl.getBoard();
      let letters = document.querySelectorAll(UISelectors.gridRow + `:nth-child(${board.currentRow+1}) .letter`);
      letters = Array.from(letters);

      let word = letters.map(letter => letter.dataset.letter).join("");
      word = word.toLowerCase();
      return word;
    },
    getDateInput: function(){
      const date = document.querySelector(UISelectors.dateInput).getAttribute(UISelectors.dateInputData);
      const dateArr = date.split('-');
     
      return `${dateArr[2]}-${dateArr[0]}-${dateArr[1]}`;
    },
    clearBoard: function(){
      // need to add 
      //some animation to flip/spinn all tiles
      let letters = document.querySelectorAll(UISelectors.gridRow + ' .letter');
      letters = Array.from(letters);

      letters.forEach(letter => {
        letter.textContent = '';
        letter.dataset.letter = '';
        letter.dataset.state = 'empty';
      });
    },
    clearKeyboard: function(){
      let keyLetters = document.querySelectorAll(UISelectors.keyboardLetter);
      keyLetters = Array.from(keyLetters);

      keyLetters.forEach(letter => {
        letter.dataset.state = 'empty';
      });
    },
    addLetterInput: function(newKey){
      let board = wordCtrl.getBoard();
      const currentWord = board.currentWord;

      if(currentWord.length === 5){
        return false;
      }

      if(currentWord.length <= 5){
        let box = 
        document.querySelector(
          UISelectors.gridRow + 
          `:nth-child(${board.currentRow+1})` +
          ' ' +
          UISelectors.emptyLetter
        );
        box.textContent = newKey.toUpperCase();
        box.dataset.state = 'filled';
        box.dataset.letter = newKey;
      }
    },
    backspaceLetterInput: function(){
      let board = wordCtrl.getBoard();
      if(board.currentWord.length === 0){
        return false;
      }

      let box = document.querySelector(
        UISelectors.gridRow + 
        `:nth-child(${board.currentRow+1})` +
        ' ' +
        UISelectors.filledLetter +
        `:nth-child(${board.currentWord.length})`
      );

      box.textContent = '';
      box.dataset.state = 'empty';
      box.dataset.letter = '';
    },
    updateKeyboard: function(){
      let board = wordCtrl.getBoard();
      const lastAttempt = Array.from(board.attempts[board.currentRow-1])

      lastAttempt.forEach((letter, i) => {
        const result = board.results[board.currentRow-1][i];
        document.querySelector(UISelectors.keyboardLetter + `[data-key="${letter}"]`).dataset.state = result;
      });
    },
    showLastAttempt: function(){
      let board = wordCtrl.getBoard();

      let letters = document.querySelectorAll(UISelectors.gridRow + `:nth-child(${board.currentRow}) .letter`);
      letters = Array.from(letters);

      board.results[board.currentRow-1].forEach((result, i) => {
        letters[i].dataset.state = result;      
      });

      this.updateKeyboard();
    }   
  }
})();

// APP CONTROLLER
const App = (function(wordCtrl, UICtrl){
  const todaysDateInput = function(){
    const UISelectors = UICtrl.getSelectors();

    const today = new Date()
    const yesterday = new Date(today)

    yesterday.setDate(yesterday.getDate() - 1)

    let month = yesterday.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    const year = yesterday.getFullYear();
    const day = yesterday.getDate();

    const elem = document.querySelector(UISelectors.dateInput);
    const datepicker = new Datepicker(elem, {
      minDate: '06-19-2021',
      maxDate: `${month}-${day}-${year}`
    }); 
    document.querySelector(UISelectors.dateInput).setAttribute('data-date',`${month}-${day}-${year}`);
    document.querySelector(UISelectors.dateInput + ' .datepicker-grid span.focused').classList.add("selected");
  }

  const map = {}; 
  const loadEventListeners = function(){
    // GET UI SELECTORS
    const UISelectors = UICtrl.getSelectors();
    document.querySelector(UISelectors.setDateBtn).addEventListener('click', dateChange);
    keydownEventListener(true);        
    document.querySelector(UISelectors.keyboard).addEventListener('click', keyboardClick);
    document.addEventListener('keyup', (e) => {
      e.type == 'keyup' && delete map[e.key.toLowerCase()]
      // console.log(map)
    });
  };
  
  const keyboardClick = function(e){
    e.preventDefault();

    let key = e.target.dataset.key;
    const isEmpty = Object.keys(e.target.dataset).length === 0;

    if(isEmpty){
      return false;
    }

    key = key.toLowerCase();
    
    if(key === 'backspace'){
      UICtrl.backspaceLetterInput();
      wordCtrl.updateCurrentWord(e.key, true);
      return false;
    }  

    if(key === 'enter'){
      getWord();
      return false;
    }
  
    UICtrl.addLetterInput(key);
    wordCtrl.updateCurrentWord(key);
    
  };

  const keydownEventListener = function(isOn){
    if(!isOn){
      document.removeEventListener('keydown', typeWord);
      return false;
    }

    document.addEventListener('keydown', typeWord);
  }
  
  const formatDate = function(date, isYesterday = false){
    const d = new Date(date);
    
    let month = d.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    const year = d.getFullYear();
    let day = d.getDate();
    day = day < 10 ? '0' + day : day;

    return `${month}-${day}-${year}`
  };

  const dateChange = function(e){
    // update datepicker data attr value
    const UISelectors = UICtrl.getSelectors();
    const selectedDate = document.querySelector(UISelectors.selectedDate).getAttribute('data-date');
    const date = formatDate(parseInt(selectedDate));
    
    document.querySelector(UISelectors.dateInput).setAttribute('data-date', date);

    // close modal
    var dateModal = document.getElementById('dateModal');
    var modal = bootstrap.Modal.getInstance(dateModal);
    modal.hide();

    UICtrl.clearBoard();
    UICtrl.clearKeyboard();
    UICtrl.clearAlert();
    wordCtrl.resetBoard();
    keydownEventListener(true);
  };
  
  const typeWord = function(e){
    e.preventDefault();
    
    let code = e.code.toLowerCase();
    let regex = /key/gi;

    map[e.key.toLowerCase()] = e.type == 'keydown'; 
    // CAN CHECK FOR MULTIPLE KEYBOARD PRESS AT A TIME
    // NO CURRENT USE CASE BUT MAYBE IN THE FUTURE
  
    // if(map['control'] && map['b']){ // CTRL+R
    // }else if(map[17] && map[16] && map[66]){ // CTRL+SHIFT+B
    //   alert('Control Shift B');
    // }else if(map[17] && map[16] && map[67]){ // CTRL+SHIFT+C
    //   alert('Control Shift C');
    // }
    //  console.log(map)

    // IF F5, Refresh the page duhh
    if(e.code === 'F5' || e.key === 'F5' || e.keyCode === 116){
      window.location.reload();
    }  

    if(e.code === 8 || e.key === 'Backspace' || e.keyCode === 8){
      //if(!result && (e.code === 8 || e.key === 'Backspace' || e.keyCode === 8)){
      UICtrl.backspaceLetterInput();
      wordCtrl.updateCurrentWord(e.key, true);
      return false;
    }  

    if(e.code === 13 || e.key === 'Enter' || e.keyCode === 13){
      getWord();
      return false;
    }  
    
    let result = regex.test(code);

    if(result){// TYPE LETTER IN INPUT      
      UICtrl.addLetterInput(e.key);
      wordCtrl.updateCurrentWord(e.key);
    } 
  }

  const getWord = function(){
    const word = UICtrl.getWordInput();
    const date = UICtrl.getDateInput();

    if(word === '' || word.length !== 5){
      UICtrl.showAlert('warning', 'Not enough letters.');
      return false;
    }

    wordCtrl.getWord(word, wordData => {
      let success = wordData.hasOwnProperty('word');
        if(!success){
          UICtrl.showAlert('danger', 'Not in word list');
          return false;
        }
  
        wordCtrl.addAttempt(word);        

        let board = wordCtrl.getBoard();

        // success does the word match?
        wordCtrl.getSolution(date, solution => {
          wordCtrl.addResults(word);
          UICtrl.showLastAttempt(word);
          const correctWord = solution.word.toLowerCase();
          if(board.currentRow === board.attemptLimit && word !== correctWord){
            // GAME IS OVER            
            keydownEventListener(false);
            UICtrl.showAlert('info', correctWord);
            return false;
          }

          if(correctWord === word){
            UICtrl.showAlert('success', 'Word Matches!');
            keydownEventListener(false);
          } else{
            //UICtrl.showAlert('warning', 'Word doesn\'t match');
            // add animation here
          }
        });
    });
  };
  
  return{
    init: function(){
      console.log("Initializing App...");

      loadEventListeners();
      todaysDateInput();
    }
  }
})(wordCtrl, UICtrl);

App.init();