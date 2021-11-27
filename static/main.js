const send = require("process");

// getting the question stems
function getStems(){
    let xReq = new XMLHttpRequest();
    xReq.onreadystatechange = displayStems;
    
    xReq.open('GET','/questionsinJSON',true);
    xReq.send();
}


// function is called every time the ready state changes
function displayStems(){
    if(this.readyState == 4 && this.status == 200){
        let stemDiv = document.getElementById('stemDiv');
        let questionsList = JSON.parse(this.responseText);
        let options = [];
            let content ='';
            for (let q=0; q<questionsList.length; q++)
            {
                options = questionsList[q].options;
                content += `<form ><form><label name="stem" id="${q}">${questionsList[q].stem}<br></label>`
                for (let o=0; o<options.length;o++){
                    content += `<input id="${o}" name="option" type="radio" value="${options[o]}" onclick="chooseOption(this)">${options[o]}</input>`;
                }
                // label to store the feedback for each question
                content += `</form><label id="feedbackDiv${q}"><br><br></label>`
            }
            // submit button for when the user is done
            content += `<button onclick="submit()" id="submit">submit and see score</button></form>`;
            stemDiv.innerHTML = content;

    }
};

// function to handle when the user chooses an option
function chooseOption(option){
    let choiceNum = option.id;
    let quesNum = option.parentNode.firstChild.id;
    let xReq = new XMLHttpRequest();

    xReq.onreadystatechange = function(){displayFeedback(xReq, option)};
    xReq.open('GET','/get-answer?stem='+quesNum+'&&option='+choiceNum,true);
    xReq.send(); 
}

// function to display feedback
function displayFeedback(xReq, option){
    let quesNum = option.parentNode.firstChild.id;
    let feedbackDiv = document.getElementById('feedbackDiv'+quesNum);
    if(xReq.readyState == 4 && xReq.status == 200){
        // add the server's feedback to the div to display it to the user
        feedbackDiv.innerHTML = xReq.responseText + '<br><br>';
    }
};

// function to submit the quiz with the user's current selections
function submit(){
    let selected = document.getElementsByName('option');
    let selections = [];
    
    // iterate through all name="option" elements
    for (let i=0; i<selected.length; i++){
        if (selected.item(i).checked){      
            selections.push(selected.item(i).id);       // add its index (relative to the other options for this question) into the array
        } 
    }
    // if the length of this array is less than 4, it means less than 5 questions have been answered
    if (selections.length<4){     
        alert('please answer all questions before submitting!');   
    } else {
        let xReq = new XMLHttpRequest();
        // display the user's score after response comes back
        xReq.onreadystatechange = displayScore;
        // the request gets the answer from the server depending on the question and option the user clicked
        xReq.open('GET','/get-score?ans='+selections,true);
        xReq.send(); 
    }
}

// function to display the user's score to them
function displayScore(){
    let stemDiv = document.getElementById('score');
    stemDiv.innerHTML = this.responseText;
}