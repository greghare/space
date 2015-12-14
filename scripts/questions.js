// var questions; // Array of the question database
var question;               // current question
var questionsAnswered = 0;  // how many questions have been answered at that round

function loadQuestions(file, callback) {

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            callback.call(JSON.parse(xmlhttp.responseText));
            // questions = JSON.parse(xmlhttp.responseText);
            // storeQuestions(questions);
        }
    };
    xmlhttp.open("GET", file, true);
    xmlhttp.send();

}

function getRandomQuestion(db) {

    // Pick random question index
    var qi = Math.floor(Math.random() * db.questions.length);
    return db.questions[qi];

}

function showTriviaQuestion() {
    debugger;
    question = getRandomQuestion(qdb);
    console.log(question.q);
    document.getElementById("trivia-title").innerHTML = "Welcome to " + planetName + "!";
    document.getElementById("trivia-question").innerHTML = question.q;
    document.getElementById("ans-a").innerHTML = question.choices.a;
    document.getElementById("ans-b").innerHTML = question.choices.b;
    document.getElementById("ans-c").innerHTML = question.choices.c;
    document.getElementById("ans-d").innerHTML = question.choices.d;
    document.getElementsByClassName("trivia")[0].style.marginTop = "-12em";

}

function submitAnswer(ans) {

    debugger;

	var unit = 10;

	if(ans == question.answer) {
		fuel = (fuel + unit) > 100 ? fuel = 100 : fuel += unit;
		console.log("correct answer");
	} else {
		fuel -= unit;
		console.log("wrong answer");
	}

	questionsAnswered++;

    console.log("questionsAnswered" + questionsAnswered);

	if(questionsAnswered < 2) {
        console.log("Showing another question");
    	showTriviaQuestion();
	} else {
        console.log("Starting to fly...");
		startFlyingAgain();
		questionsAnswered = 0;
	}

}
