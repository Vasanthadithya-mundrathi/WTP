document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    document.getElementById('quiz-category').innerText = `Category: ${category.charAt(0).toUpperCase() + category.slice(1)}`;

    let currentQuestionIndex = 0;
    let score = 0;
    let timer;
    const questions = window.quizData[category];
    const totalQuestions = questions.length;
    const timeLimit = 30; // seconds per question

    function startTimer() {
        let timeLeft = timeLimit;
        document.getElementById('timer').textContent = timeLeft;
        
        timer = setInterval(() => {
            timeLeft--;
            document.getElementById('timer').textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                nextQuestion();
            }
        }, 1000);
    }

    function updateProgress() {
        const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
        document.getElementById('quiz-progress').style.width = `${progress}%`;
    }

    function displayQuestion() {
        if (timer) clearInterval(timer);
        startTimer();
        updateProgress();
        
        const questionElement = document.getElementById('question-text');
        const optionsElement = document.getElementById('answer-options');

        questionElement.innerText = questions[currentQuestionIndex].question;
        optionsElement.innerHTML = '';

        questions[currentQuestionIndex].options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'form-check';
            optionElement.innerHTML = `
                <input class="form-check-input" type="radio" name="answer" value="${option}">
                <label class="form-check-label">${option}</label>
            `;
            optionsElement.appendChild(optionElement);
        });
    }

    window.nextQuestion = function() {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        if (selectedOption) {
            const feedback = document.createElement('div');
            if (selectedOption.value === questions[currentQuestionIndex].correct) {
                score++;
                feedback.className = 'feedback correct';
                feedback.textContent = 'Correct!';
            } else {
                feedback.className = 'feedback incorrect';
                feedback.textContent = `Incorrect! The correct answer was: ${questions[currentQuestionIndex].correct}`;
            }
            document.getElementById('quiz-question').appendChild(feedback);
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            window.location.href = `results.html?score=${score}`;
        }
    }

    displayQuestion();
});
