/**
 * EASY HTTP Library
 */

const wordsURL = 'https://wordsapiv1.p.rapidapi.com/words/';

class EasyHTTP{
  async get(word){
    console.log(word)
   const response = await fetch(`${wordsURL + word}`, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
        'X-RapidAPI-Key': process.env.WORDS_API_KEY
      }
   });
   const data = await response.json();
   return data;
  };

  async getSolution(date){
    // const response = await fetch(`http://localhost:3000/pastSolutions?date=${date}`);
    const response = await fetch(`../api/db.json`);
    const data = await response.json();
    for (const w of data.pastSolutions){
      if(w.date === date){return w}
    }
   }
}

export const http = new EasyHTTP();
