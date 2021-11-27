const express = require('express');
// define variable to hold the list of questions from JSON file (database)
let questionsList = require('./questions.json');

const app = express();

// serve static contents
app.use(express.static('static'));

// dynamic handling 


// called to get the quiz questions
app.get('/questionsInJSON', (request,response) => {
    // send json file of questions
    response.json(questionsList);
});

// called to get feedback on the answer the user clicked
app.get('/get-answer', (request, response) => {
    let answer = '';
    let stem = request.query.stem;       
    let option = request.query.option;   
    
    // compares the indices of the chosen option and the answer index for that question
    if((option == questionsList[stem].answerIndex)){
        answer = 'Correct!';        //the user submitted the correct answer
    } else {
        answer = 'Incorrect, try again';   //the user got the wron answer
      }      
    response.send(answer);
});

// called to get the score of the whole quiz
app.get('/get-score', (request, response) => {
    let score = 0;
    let selections = request.query.ans.split(',');      // holds array of the indices of the options the user submitted
    let solutions = [];      // holds array of indices of the solutions (i.e. answerIndex for all questions)
    // for loop to retrieve and insert solutions into the array
    for (let i=0; i<questionsList.length;i++){
        solutions.push(questionsList[i].answerIndex);
    }
    for (let i=0;i<selections.length;i++){
        // compares the chosen index to the answer index for all questions
        if(selections[i] == solutions[i]){
            score += 1;        // if the correct answer is selected, increase the score
        }  
    }
    
    response.send("Your score is:  " + score.toString() + "/5");
});
app.listen(80);