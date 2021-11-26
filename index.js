const express = require('express');
let questionsList = require('./questions.json');

const app = express();

app.use(express.static('static'));



// called to get the quiz questions
app.get('/getquestions', (request,response) => {
    response.json(questionsList);
});

// called to get feedback on the answer the user clicked
app.get('/getanswer', (request, response) => {
    let answer = '';
    let stem = request.query.stem;       
    let option = request.query.option;   
    
    if((option == questionsList[stem].answerIndex)){
        answer = 'Correct!';        
    } else {
        answer = 'Incorrect, try again';  
      }      
    response.send(answer);
});

// called to get the score of the whole quiz
app.get('/getscore', (request, response) => {
    let score = 0;
    let selections = request.query.ans.split(',');      
    let solutions = [];     
    for (let i=0; i<questionsList.length;i++){
        solutions.push(questionsList[i].answerIndex);
    }
    for (let i=0;i<selections.length;i++){
        if(selections[i] == solutions[i]){
            score += 1;       
        }  
    }
    
    response.send("Your score is:  " + score.toString() + "/5");
});
app.listen(80);