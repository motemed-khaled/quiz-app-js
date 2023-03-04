// select main element to use 
let questionCount = document.querySelector(".count span");
let spanBullets = document.querySelector(".spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answer-area");
let button = document.querySelector(".Submit");
let allBullets = document.querySelector(".bullets");

// create main variable
let current = 0;
let rightAns = 0;
let duration;

// sart function to get data from api
function getQuestion() {
    let myRequest = new XMLHttpRequest();
    myRequest.open("get", "../js/question.json", true);
    myRequest.send();
    myRequest.onreadystatechange = () => {
        if (myRequest.status === 200 && myRequest.readyState === 4) {
            let question = JSON.parse(myRequest.responseText);
            // shuffle my json objects
            shuffle(question);
            // start timer
            timer(5, question.length);
            // create bullets and question count
            createBullets(question.length);
            // add data in my page
            addData(question[current], question.length);
            // click event
            button.onclick = () => {
                if (current < question.length) {
                    clearInterval(duration);
                    timer(5, question.length);
                    let rightAnswer = question[current]["right_answer"];
                    current += 1;
                    checkAnswer(rightAnswer, question.length);
                    quizArea.innerHTML = "";
                    answerArea.innerHTML = "";
                    // get the next question
                    addData(question[current], question.length);
                    // add class active to the main bullets to refer to the current question
                    activeBullets(current);
                    showResults(question.length);
                }
            }
        }
    }
}

getQuestion();

// function to create bullets span and add question count
function createBullets(length) {
    questionCount.innerHTML = length;
    for (let i = 0; i < length; i++) {
        let span = document.createElement("span");
        span.id = i;
        if (i === 0) {
            span.classList.add("active");
        }
        spanBullets.appendChild(span);
    }
}

// function to add data to my page from request
function addData(object, count) {
    if (current < count) {
        //make and append question in mypage
        let question = document.createElement("h2");
        let questionText = document.createTextNode(object.title);
        question.appendChild(questionText);
        quizArea.appendChild(question)
        let inputAnswer = document.createElement("input");
        for (let i = 1; i < 5; i++) {
            // create main element to add answerArea
            let mainDiv = document.createElement("div");
            let inputSpan = document.createElement("input");
            let inputLabel = document.createElement("label");
            // add answer data to my label
            let labelText = document.createTextNode(object[`answer_${i}`]);
            // add main attribute to my element
            mainDiv.className = "answer";
            if (i === 1) {
                inputSpan.checked = true;
            }
            inputSpan.type = "radio";
            inputSpan.id = `answer${i}`;
            inputSpan.name = "answer";
            inputSpan.dataset.answer = object[`answer_${i}`]
            inputLabel.htmlFor = `answer${i}`;
            // append data to element and my page
            inputLabel.appendChild(labelText);
            mainDiv.appendChild(inputSpan);
            mainDiv.appendChild(inputLabel);
            answerArea.appendChild(mainDiv);
        }
    }
}

// function check answer 
function checkAnswer(rightAnswer, length) {
    let ansewrs = document.getElementsByName("answer");
    let chooseAns;
    for (let i = 0; i < ansewrs.length; i++) {
        if (ansewrs[i].checked) {
            chooseAns = ansewrs[i].dataset.answer;
        }
    }
    if (chooseAns === rightAnswer) {
        rightAns++;
    }
}

// function to active bullets 
function activeBullets(current) {
    let allBullets = document.querySelectorAll(".spans span");
    allBullets.forEach((bullet, index) => {
        if (index === current) {
            bullet.classList.add("active");
        } else if (index < current) {
            bullet.classList.add("done");
        }
    });
}

// function show results
function showResults(length) {
    if (current === length) {
        (quizArea, answerArea, button, allBullets).remove();
        if (rightAns === length) {
            Swal.fire({
                icon: 'success',
                title: 'Excellent',
                text: `All Answer Is Right Your Score [ ${rightAns} From ${length}]`
            })
        } else if (rightAns >= 7 && rightAns < length) {
            Swal.fire({
                icon: 'success',
                title: 'very Goog',
                text: `Your Score is ${rightAns} From ${length}`
            })
        } else if (rightAns >= 5 && rightAns < 7) {
            Swal.fire({
                icon: 'success',
                title: ' Good',
                text: `Your Score is ${rightAns} From ${length}`
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Hard Luck',
                text: `Your Score is ${rightAns} From ${length}`
            })
        }
    }
}

// function count duration
function timer(time, length) {
    if (current < length-1) {
        let min, sec;
        duration = setInterval(() => {
            min = parseInt(time / 60);
            sec = parseInt(time % 60);
            min = min < 10 ? `0${min}` : min;
            sec = sec < 10 ? `0${sec}` : sec;
            document.querySelector(".count-down").innerHTML = `${min}:${sec}`;
            if (--time < 0) {
                clearInterval(duration);
                button.click();
            }
        }, 1000);
    }
}

// function to get random array from my data
function shuffle(arr) { 
    let current = 0;
    let temp, random;
    while (current < arr.length) {
        temp = arr[current];
        random = Math.floor(Math.random() * arr.length);
        arr[current] = arr[random];
        arr[random] = temp;
        current++;
    }
    return arr;
}