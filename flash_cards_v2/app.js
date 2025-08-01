let currentIndex = 0;
let showAnswer = false;
const questionAnswers = [
    {
      question: "What is the difference between var, let, and const?",
      answer: "var is function-scoped and hoisted with undefined; let and const are block-scoped and hoisted without initialization. const cannot be reassigned."
    },
    {
      question: "What is a closure in JavaScript?",
      answer: "A closure is a function that retains access to variables from its lexical scope, even after that scope has exited."
    },
    {
      question: "What is the use of the 'this' keyword?",
      answer: "'this' refers to the object that is executing the current function."
    },
    {
      question: "What does '===’ do in JavaScript?",
      answer: "It checks for strict equality — both value and type must be the same."
    },
    {
      question: "What is an arrow function?",
      answer: "A shorter syntax for writing functions. It does not have its own 'this' context."
    },
    {
      question: "What is hoisting?",
      answer: "Hoisting is JavaScript's default behavior of moving declarations to the top of the current scope before code execution."
    },
    {
      question: "What is the difference between null and undefined?",
      answer: "null is an assigned value indicating no value; undefined means a variable has been declared but not assigned a value."
    },
    {
      question: "How do you create a JavaScript array?",
      answer: "Using square brackets: let arr = [1, 2, 3];"
    },
    {
      question: "What is the DOM?",
      answer: "The Document Object Model represents the structure of a webpage, allowing JavaScript to manipulate HTML and CSS."
    },

  ];

const questionElement = document.getElementById("question");
const answerElement = document.getElementById("answer");
const showHideButton = document.getElementById("show_hide_btn")
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const progressElement = document.getElementById("progress"); 
const progressPercentageElement = document.getElementById("progress_percentage"); 
const statsElement = document.getElementById("stats"); 

function showCurrentItem() {
    const currentItem = questionAnswers[currentIndex];
    questionElement.textContent = currentItem.question;
    answerElement.textContent = currentItem.answer;

    questionElement.classList.remove("hidden");
    answerElement.classList.add("hidden");
    showHideButton.textContent = 'Show Answer';
    updateProgressBar();
}

function updateProgressBar() {
    const percentage = (currentIndex + 1)/questionAnswers.length * 100;
    progressElement.classList.add(`w-[${percentage}%]`);
    progressPercentageElement.textContent = percentage.toFixed(2) + "%";
    statsElement.textContent = `${currentIndex + 1} of ${questionAnswers.length}`;
}

showHideButton.addEventListener("click", function() {
    showAnswer = !showAnswer;
    if(showAnswer) {
        questionElement.classList.add("hidden");
        answerElement.classList.remove("hidden");
        showHideButton.textContent = "Hide Answer";
    }
    else {
        questionElement.classList.remove("hidden");
        answerElement.classList.add("hidden");
        showHideButton.textContent = "Show Answer";
    }
});

nextButton.addEventListener("click", function() {
    if(currentIndex < (questionAnswers.length - 1)){
        currentIndex++;
        showCurrentItem();
    }
});

previousButton.addEventListener("click", function() {
    if(currentIndex > 0){
        currentIndex--;
        showCurrentItem();
    }
});

showCurrentItem();