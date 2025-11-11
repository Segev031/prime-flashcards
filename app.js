// displayQuestion();
const primeNumbers = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43];
const allNumbers = [
	1, 2, 3, 4, 5, 7, 9, 11, 13, 14, 17, 18, 19, 21, 23, 26, 27, 29, 31, 33, 34,
	35, 37, 39, 41, 43, 46, 47,
];

let currentQuestionIndex = 0;
let correctAnswers = 0;
let wrongAnswers = 0;
let totalQuestions = 0;
let usedNumbers = [];
let currentNumber = 0;
let currentStreak = 0;
let maxStreakValue = 0;
const maxQuestions = 15;
let timerInterval;
let restTime = 2;
let startTime = Date.now();
let questionTimeout; // חדש – טיימר לשאלה
const questionTimeLimit = 2000; // 2 שניות

function isPrime(num) {
	return primeNumbers.includes(num);
}

function getRandomNumber() {
	const availableNumbers = allNumbers.filter(
		(num) => !usedNumbers.includes(num)
	);
	if (availableNumbers.length === 0) {
		usedNumbers = [];
		return allNumbers[Math.floor(Math.random() * allNumbers.length)];
	}
	const randomIndex = Math.floor(Math.random() * availableNumbers.length);
	const number = availableNumbers[randomIndex];
	usedNumbers.push(number);
	return number;
}

function displayQuestion() {
	clearTimeout(questionTimeout);
	currentNumber = getRandomNumber();
	const numberEl = document.getElementById("currentNumber");
	numberEl.textContent = currentNumber;
	numberEl.className = "number-display";

	document
		.getElementById("feedback")
		.classList.remove("show", "correct", "incorrect");
	document.getElementById("nextBtn").classList.remove("show");

	document.querySelectorAll(".btn-yes, .btn-no").forEach((btn) => {
		btn.disabled = false;
		btn.style.display = "block";
	});

	const progress = (currentQuestionIndex / maxQuestions) * 100;
	document.getElementById("progressFill").style.width = progress + "%";
	document.getElementById("currentQ").textContent = currentQuestionIndex;

	// ⏰ טיימר לשאלה – אם לא ענה תוך 2 שניות זה נחשב שגוי
	questionTimeout = setTimeout(() => {
		handleTimeout();
	}, questionTimeLimit);
}

function handleTimeout() {
	wrongAnswers++;
	currentStreak = 0;
	totalQuestions++;
	updateStats();

	const feedback = document.getElementById("feedback");
	const feedbackText = document.getElementById("feedbackText");
	const explanation = document.getElementById("explanation");

	feedbackText.textContent = `⏰ לא הספקת לענות בזמן!`;
	explanation.textContent = `${currentNumber} ${
		isPrime(currentNumber) ? "הוא מספר ראשוני" : "אינו מספר ראשוני"
	}`;
	feedback.className = "feedback incorrect show";

	document
		.querySelectorAll(".btn-yes, .btn-no")
		.forEach((btn) => (btn.disabled = true));

	setTimeout(() => {
		if (currentQuestionIndex >= maxQuestions - 1) {
			showCompletion();
		} else {
			startTimer();
		}
	}, 1000);
}

function answer(userAnswer) {
	clearTimeout(questionTimeout);
	const isCorrect = userAnswer === isPrime(currentNumber);
	const numberEl = document.getElementById("currentNumber");

	totalQuestions++;

	if (isCorrect) {
		correctAnswers++;
		currentStreak++;
		if (currentStreak > maxStreakValue) maxStreakValue = currentStreak;
		numberEl.classList.add("correct");
	} else {
		wrongAnswers++;
		currentStreak = 0;
		numberEl.classList.add("incorrect");
	}

	updateStats();
	showFeedback(isCorrect);

	document
		.querySelectorAll(".btn-yes, .btn-no")
		.forEach((btn) => (btn.disabled = true));

	setTimeout(() => {
		if (currentQuestionIndex >= maxQuestions - 1) {
			showCompletion();
		} else {
			startTimer();
		}
	}, 1000);
}

function showFeedback(isCorrect) {
	const feedback = document.getElementById("feedback");
	const feedbackText = document.getElementById("feedbackText");
	const explanation = document.getElementById("explanation");
	const isPrimeNumber = isPrime(currentNumber);

	if (isCorrect) {
		feedbackText.textContent = `✓ נכון! ${currentNumber} ${
			isPrimeNumber ? "הוא מספר ראשוני" : "אינו מספר ראשוני"
		}`;
		feedback.className = "feedback correct show";
	} else {
		feedbackText.textContent = `✗ לא נכון. ${currentNumber} ${
			isPrimeNumber ? "הוא מספר ראשוני" : "אינו מספר ראשוני"
		}`;
		feedback.className = "feedback incorrect show";
	}

	if (isPrimeNumber) {
		explanation.textContent = `${currentNumber} מתחלק רק ב-1 וב-${currentNumber}`;
	} else if (currentNumber === 1) {
		explanation.textContent = "1 אינו נחשב למספר ראשוני";
	} else {
		const divisors = findDivisors(currentNumber);
		explanation.textContent = `${currentNumber} = ${divisors}`;
	}
}

function findDivisors(num) {
	for (let i = 2; i <= Math.sqrt(num); i++) {
		if (num % i === 0) {
			return `${i} × ${num / i}`;
		}
	}
	return `${num}`;
}

function startTimer() {
	clearInterval(timerInterval);
	let timeLeft = restTime;
	const timerEl = document.getElementById("timer");
	timerEl.classList.add("show");
	document.getElementById("timeLeft").textContent = timeLeft;

	timerInterval = setInterval(() => {
		timeLeft--;
		document.getElementById("timeLeft").textContent = timeLeft;
		if (timeLeft <= 0) {
			clearInterval(timerInterval);
			timerEl.classList.remove("show");
			nextQuestion();
		}
	}, 1000);
}

function nextQuestion() {
	currentQuestionIndex++;
	displayQuestion();
}

function updateStats() {
	document.getElementById("correct").textContent = correctAnswers;
	document.getElementById("wrong").textContent = wrongAnswers;
	document.getElementById("streak").textContent = currentStreak;

	const accuracy =
		totalQuestions > 0
			? Math.round((correctAnswers / totalQuestions) * 100)
			: 0;
	document.getElementById("accuracy").textContent = accuracy + "%";
}

function showCompletion() {
	const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
	const totalTime = Math.round((Date.now() - startTime) / 1000);

	document.getElementById("gameScreen").style.display = "none";
	document.getElementById("completionScreen").classList.add("show");
	document.getElementById("finalScore").textContent = accuracy + "%";

	document.getElementById("finalCorrect").textContent = correctAnswers;
	document.getElementById("finalWrong").textContent = wrongAnswers;
	document.getElementById("maxStreak").textContent = maxStreakValue;
	document.getElementById("finalTime").textContent = totalTime + "s";

	let message = "";
	if (accuracy >= 90) message = "מצוין! אתה מומחה במספרים ראשוניים! 🏆";
	else if (accuracy >= 75) message = "טוב מאוד! המשך להתרגל! 🌟";
	else if (accuracy >= 60) message = "לא רע! יש מקום לשיפור 📚";
	else message = "כדאי לחזור על החומר ולנסות שוב 💪";

	document.getElementById("finalMessage").textContent = message;
}

function restart() {
	currentQuestionIndex = 0;
	correctAnswers = 0;
	wrongAnswers = 0;
	totalQuestions = 0;
	currentStreak = 0;
	maxStreakValue = 0;
	usedNumbers = [];
	startTime = Date.now();

	clearInterval(timerInterval);
	clearTimeout(questionTimeout);

	document.getElementById("gameScreen").style.display = "block";
	document.getElementById("completionScreen").classList.remove("show");
	updateStats();
	displayQuestion();
}

function toggleTheme() {
	document.body.classList.toggle("dark");
	const btn = document.querySelector(".theme-toggle");
	if (document.body.classList.contains("dark")) {
		btn.textContent = "☀️ מצב יום";
	} else {
		btn.textContent = "🌙 מצב לילה";
	}
}

displayQuestion();
