var questions; // Array of the question database
var question;               // current question
var questionsAnswered = 1;  // how many questions have been answered at that round
var totalQuestionsAns = 0;

function loadQuestions(file, callback) {

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callback.call(JSON.parse(xmlhttp.responseText));
            questions = JSON.parse(xmlhttp.responseText);
            //storeQuestions(questions);
        }
    };
    xmlhttp.open("GET", file, true);
    xmlhttp.send();

}

function getRandomQuestion(db) {

    // Pick random question index
    var qi = Math.floor(Math.random() * db.questions.length);

    // Get the question from the database
    var question = db.questions[qi];

    // Delete that question from the choices
    db.questions.splice(qi, 1);

    return question;

}

function showTriviaQuestion() {

    question = getRandomQuestion(qdb);
    console.log(question.q);
    document.getElementById("questionOn").innerHTML = questionsAnswered + "/2";
    document.getElementById("trivia-title").innerHTML = "Welcome to " + planetName;
    document.getElementById("trivia-question").innerHTML = question.q;
    document.getElementById("ans-a").innerHTML = question.choices.a;
    document.getElementById("ans-b").innerHTML = question.choices.b;
    document.getElementById("ans-c").innerHTML = question.choices.c;
    document.getElementById("ans-d").innerHTML = question.choices.d;
    document.getElementsByClassName("trivia")[0].style.marginTop = "-15em";

}

function correctAns() {

    bell.play();

	var inc = 10;

    fuel = (fuel + inc) > 100 ? fuel = 100 : fuel += inc;

    document.getElementsByClassName("fuel")[0].style.height = fuel + "%";
    document.getElementsByClassName("fuel")[0].style.backgroundColor = "green";
    setTimeout(function() {
        document.getElementsByClassName("fuel")[0].style.backgroundColor = "#FFEA00";
    }, 1000);
	document.getElementsByClassName("fuel-value")[0].innerHTML = Math.floor(fuel);
}

function wrongAns() {

    error.play();

    var dec = 5;

    fuel = (fuel - dec) < 0 ? fuel = 0 : fuel -= dec;

    document.getElementsByClassName("fuel")[0].style.height = fuel + "%";
    document.getElementsByClassName("fuel")[0].style.backgroundColor = "red";
    setTimeout(function() {
        document.getElementsByClassName("fuel")[0].style.backgroundColor = "#FFEA00";
    }, 1000);
	document.getElementsByClassName("fuel-value")[0].innerHTML = Math.floor(fuel);
}

function submitAnswer(ans) {

    totalQuestionsAns++;

    // Check if answer is correct
	if(ans == question.answer) {
		correctAns();
	} else {
		wrongAns();
	}

    // BUG IS SOMEWHERE IN HERE I THINK
    if(questionsAnswered == 2)
    {
        if(totalQuestionsAns == 20) {
            gameWon();
        } else {
            startFlyingAgain();
            questionsAnswered = 1;
            visited[planet] = 1;
            controlsEnabled = true;
            usingFuel = true;
            spaceshipAmbient.pause().fadeIn(0.5, 2000);
        }
    } else {
        questionsAnswered++;
        showTriviaQuestion();
    }

}
