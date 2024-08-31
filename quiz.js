const quizcontainer = document.getElementsByClassName("slide");
const QA = document.getElementsByClassName("q-a")[0];
const prevbutton = document.getElementsByClassName("prevbutton")[0];
const nextbutton = document.getElementsByClassName("nextbutton")[0];
const submitbutton = document.getElementsByClassName("submit")[0];
const resetbutton = document.getElementsByClassName("reset")[0];
const resultsElement = document.querySelector(".results");

const questions = [
	{
		id: 1,
		question: "Who is the creator of JavaScript?",
		answers: {
			a: "Me",
			b: "You",
			c: "Brendan Eich",
		},
		correctAnswer: "c",
	},
	{
		id: 2,
		question: "Which one is the programming language?",
		answers: {
			a: "HTML",
			b: "JavaScript",
			c: "CSS",
		},
		correctAnswer: "b",
	},
	{
		id: 3,
		question: "What is the purpose of a programming language?",
		answers: {
			a: "To scare people",
			b: "To scare computer",
			c: "To enhance the capability of a current system",
		},
		correctAnswer: "c",
	},
];

const quizslides = [];
let currentslide = 0;
let quizsubmitted = false;
let answerByuser = [];

function onnextclick() {
	const upslidenum = currentslide + 1;
	if (upslidenum >= questions.length) {
		return;
	} else {
		showslide(upslidenum);
	}
}
function onprevclick() {
	const upslidenum = currentslide - 1;
	if (upslidenum < 0) {
		return;
	} else {
		showslide(upslidenum);
	}
}

function disability() {
	if (currentslide <= 0) {
		prevbutton.setAttribute("disabled", "disabled");
	} else {
		prevbutton.removeAttribute("disabled");
	}

	if (currentslide >= questions.length - 1) {
		nextbutton.setAttribute("disabled", "disabled");
	} else {
		nextbutton.removeAttribute("disabled");
	}
}

function enablesubmitbutton(enable) {
	if (enable) {
		submitbutton.removeAttribute("disabled");
	} else {
		submitbutton.setAttribute("disabled", "disabled");
	}
}

function enablerestbutton(enable) {
	if (enable) {
		resetbutton.removeAttribute("disabled");
	} else {
		resetbutton.setAttribute("disabled", "disabled");
	}
}

function onAnswerClick(event) {
	const questionId = event.target.name.match(/(?<=question).*/gi)[0];
	const existingans = answerByuser.find((i) => i.questionId == questionId);

	const AnsweredObj = existingans ?? { questionId: questionId };
	AnsweredObj.answerChosen = event.target.id;
	markCorrect(AnsweredObj);
	if (!existingans) {
		answerByuser.push(AnsweredObj);
	}
	if (questions.length == answerByuser.length) {
		enablesubmitbutton(true);
	}
}

function markCorrect(AnsweredObj) {
	const question = questions.find((i) => i.id == AnsweredObj.questionId);
	if (question.correctAnswer == AnsweredObj.answerChosen) {
		AnsweredObj.isCorrect = true;
	} else {
		AnsweredObj.isCorrect = false;
	}
}

function onsubmitClick() {
	quizsubmitted = true;
	const resultsElement = document.querySelector(".results");
	const correctAnswerCount = answerByuser.filter((i) => i.isCorrect == true);
	resultsElement.innerHTML = ` ${correctAnswerCount.length} of ${questions.length} are correct `;

	enablesubmitbutton(false);
	enablerestbutton(true);
	disableAnswers(true);
}

function disableAnswers(disable) {
	const slide = quizslides[currentslide];
	const allradios = slide.querySelectorAll("input[type=radio");
	for (let index = 0; index < allradios.length; index++) {
		const element = allradios[index];
		if (disable) {
			element.setAttribute("disabled", "disabled");
		} else {
			element.removeAttribute("disabled");
		}
	}
}

function buildquiz() {
	questions.forEach(function (question, index) {
		const slideElement = document.createElement("div");
		slideElement.setAttribute("class", "q-a");

		const qElement = document.createElement("div");
		qElement.setAttribute("class", "question");
		qElement.innerText = question.question;
		slideElement.appendChild(qElement);

		const ansElements = document.createElement("div");
		ansElements.setAttribute("class", "answers");
		for (const letter in question.answers) {
			const ansElement = document.createElement("div");
			ansElement.setAttribute("class", "answer");

			const inputOptionElement = document.createElement("input");
			inputOptionElement.setAttribute("type", "radio");
			inputOptionElement.setAttribute("name", `question${question.id}`);
			inputOptionElement.setAttribute("id", letter);
			inputOptionElement.setAttribute("value", question.answers[letter]);
			inputOptionElement.setAttribute("onclick", "onAnswerClick(event)");

			ansElement.appendChild(inputOptionElement);
			const spanel = document.createElement("span");
			spanel.innerText = question.answers[letter];
			ansElement.appendChild(spanel);
			ansElements.appendChild(ansElement);
		}
		slideElement.appendChild(ansElements);
		quizslides.push(slideElement);
	});
}

function showslide(slidenumber) {
	QA.innerHTML = "";
	const slide = quizslides[slidenumber];
	QA.append(slide);
	currentslide = slidenumber;
	disability();
	if (quizsubmitted) {
		disableAnswers(true);
	}
}

function onresetbuttonclick() {
	resultsElement.innerText = "";
	quizsubmitted = false;
	answerByuser = [];
	unsetallquestions();
	showslide(0);
	enablerestbutton(false);
	enablesubmitbutton(false);
}

function unsetallquestions() {
	for (let index = 0; index < quizslides.length; index++) {
		const slide = quizslides[index];
		const alltheans = slide.querySelectorAll("input[type=radio");
		unsetallans(alltheans);
		currentslide = index;
		disableAnswers(false);
	}
}

function unsetallans(alltheans) {
	for (let index = 0; index < alltheans.length; index++) {
		const element = alltheans[index];
		element.checked = false;
	}
}

function init() {
	currentslide = 0;
	buildquiz();
	showslide(0);
	enablesubmitbutton(false);
	enablerestbutton(false);
}

init();
