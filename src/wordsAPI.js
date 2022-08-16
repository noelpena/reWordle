/**
 * EASY HTTP Library
 */

// import Bank from "../api/bank.json";
// const wordsURL = 'https://wordsapiv1.p.rapidapi.com/words/';

class EasyHTTP{
  async get(word){
    const response = await fetch(`../api/bank.json`);
    const data = await response.json();
    for (const [i, w] of data.entries()){
      if(w === word){return {"word": w}}
      if(i+1 === data.length){return {}}
    }
  };

  async getSolution(date){
    const response = await fetch(`../api/solutions.json`);
    const data = await response.json();
    for (const w of data.pastSolutions){
      if(w.date === date){return w}
    }
   }
}

export const http = new EasyHTTP();
