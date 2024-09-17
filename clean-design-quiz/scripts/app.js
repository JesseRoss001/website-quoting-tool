const quizData = [
  {
    question: "Do you already have a website?",
    options: [
      { text: "Yes (50% discount on add-ons)", value: 0.5 },
      { text: "No (Full price for add-ons)", value: 1 },
    ],
    type: "radio",
    name: "has_website",
  },
  {
    question: "What type of website are you interested in?",
    options: [
      { text: "Start-up Service Website (£250)", value: 250 },
      { text: "Start-up E-commerce Website (£600)", value: 600 },
      { text: "Informational Website (£400)", value: 400 },
      { text: "Comprehensive E-commerce Website (£1505)", value: 1505 },
      { text: "Dynamic Service Business Website (£1020)", value: 1020 },
      { text: "Portfolio Website (£800)", value: 800 },
      { text: "Blog or News Site (£650)", value: 650 },
    ],
    type: "radio",
    name: "website_type",
  },
  {
    question: "Do you have a logo and brand colors?",
    options: [
      { text: "Yes (£0)", value: 0 },
      { text: "No, need both (£25)", value: 25 },
      { text: "No, need logo only (£15)", value: 15 },
    ],
    type: "radio",
    name: "branding",
  },
  {
    question: "Do you need a content management system (CMS)?",
    options: [
      { text: "Yes (£100)", value: 100 },
      { text: "No (£0)", value: 0 },
    ],
    type: "radio",
    name: "cms",
  },
  {
    question: "What level of SEO do you need?",
    options: [
      { text: "Basic SEO Package (£50)", value: 50 },
      { text: "Advanced SEO Package (£150)", value: 150 },
    ],
    type: "radio",
    name: "seo",
  },
  {
    question: "Do you need help with creating content (text, images)?",
    options: [
      { text: "Both text and images (£500)", value: 500 },
      { text: "Text only (£300)", value: 300 },
      { text: "Images only (£200)", value: 200 },
      { text: "No (£0)", value: 0 },
    ],
    type: "radio",
    name: "content_creation",
  },
  {
    question: "Would you like to integrate social media accounts?",
    options: [
      { text: "Yes (£0)", value: 0 },
      { text: "No (£0)", value: 0 },
    ],
    type: "radio",
    name: "social_media",
  },
  {
    question: "Do you need multilingual support?",
    options: [
      { text: "Yes (£50)", value: 50 },
      { text: "No (£0)", value: 0 },
    ],
    type: "radio",
    name: "multilingual",
  }
];

let currentQuestion = 0;
const totalQuestions = quizData.length;
const answers = {};
let basePrice = 0; // Holds the price of the selected website type
let budget = 0; // Holds the add-ons' total
let multiplier = 1; // Initialize the multiplier
const previousSelections = {}; // Store previous selections for backtracking

const quizContainer = document.getElementById("quiz-container");

// Display budget function
function displayBudget() {
  const budgetContainer = document.getElementById("budget-container");
  const totalBudget = (basePrice * multiplier) + (budget * multiplier); // Apply multiplier to both base price and add-ons
  budgetContainer.innerHTML = `<h3>Estimated Budget: £${totalBudget.toFixed(2)}</h3>`;
}

// Load each question
function loadQuestion(questionIndex) {
  const data = quizData[questionIndex];
  quizContainer.innerHTML = "";

  const questionElement = document.createElement("div");
  questionElement.classList.add("question");

  const questionTitle = document.createElement("h2");
  questionTitle.textContent = `${questionIndex + 1}. ${data.question}`;
  questionElement.appendChild(questionTitle);

  const optionsList = document.createElement("ul");
  optionsList.classList.add("options");

  data.options.forEach((option) => {
    const optionItem = document.createElement("li");

    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = data.type;
    input.name = data.name;
    input.value = option.value;

    if (answers[data.name] && parseFloat(answers[data.name]) === option.value) {
      input.checked = true;
    }

    input.addEventListener("change", () => {
      updateBudget(data.name, parseFloat(input.value));
    });

    label.appendChild(input);
    label.appendChild(document.createTextNode(option.text));
    optionItem.appendChild(label);
    optionsList.appendChild(optionItem);
  });

  questionElement.appendChild(optionsList);
  quizContainer.appendChild(questionElement);
  updateProgress();
  updateNavigation();
}

// Update budget based on user selection
function updateBudget(name, newValue) {
  if (name === "has_website") {
    multiplier = newValue; // Set the multiplier for future calculations
  } else if (name === "website_type") {
    basePrice = newValue; // Set the base price without adding or subtracting anything
  } else {
    const previousValue = previousSelections[name] || 0;
    // Adjust the add-ons budget by subtracting the previous value and adding the new one
    budget = budget - previousValue + newValue;
    previousSelections[name] = newValue; // Store the current selection
  }

  displayBudget(); // Update budget display
}

// Update progress bar
function updateProgress() {
  let progressBar = document.getElementById("progress-bar");
  if (!progressBar) {
    const progressContainer = document.createElement("div");
    progressContainer.id = "progress";

    progressBar = document.createElement("div");
    progressBar.id = "progress-bar";
    progressContainer.appendChild(progressBar);
    quizContainer.appendChild(progressContainer);
  }
  const progressPercent = ((currentQuestion + 1) / totalQuestions) * 100;
  progressBar.style.width = `${progressPercent}%`;
}

// Navigation logic
function updateNavigation() {
  let navigation = document.getElementById("navigation");
  if (!navigation) {
    navigation = document.createElement("div");
    navigation.id = "navigation";

    const backButton = document.createElement("button");
    backButton.textContent = "Back";
    backButton.classList.add("btn");
    backButton.addEventListener("click", prevQuestion);

    const nextButton = document.createElement("button");
    nextButton.textContent = currentQuestion === totalQuestions - 1 ? "Submit" : "Next";
    nextButton.classList.add("btn");
    nextButton.addEventListener("click", nextQuestion);

    navigation.appendChild(backButton);
    navigation.appendChild(nextButton);
    quizContainer.appendChild(navigation);
  } else {
    const nextButton = navigation.querySelector(".btn:last-child");
    nextButton.textContent = currentQuestion === totalQuestions - 1 ? "Submit" : "Next";
  }
}

// Collect answers and adjust budget when navigating next
function collectAnswers() {
  const inputs = quizContainer.querySelectorAll("input");
  inputs.forEach((input) => {
    if (input.type === "radio" && input.checked) {
      const currentValue = parseFloat(input.value);

      if (input.name === "website_type") {
        basePrice = currentValue; // Set the base price
      } else if (input.name !== "has_website") { // Avoid affecting the budget with the multiplier selection
        const previousValue = previousSelections[input.name] || 0;
        // Adjust the add-ons budget
        budget = budget - previousValue + currentValue;
        previousSelections[input.name] = currentValue;
      }

      answers[input.name] = input.value;
    }
  });

  displayBudget(); // Update the budget display
}

// Navigate to the next question
function nextQuestion() {
  collectAnswers();
  if (currentQuestion < totalQuestions - 1) {
    currentQuestion++;
    loadQuestion(currentQuestion);
  } else {
    showSummary();
  }
}

// Navigate to the previous question and adjust the budget
function prevQuestion() {
  const currentAnswer = previousSelections[quizData[currentQuestion].name] || 0;
  if (quizData[currentQuestion].name !== "website_type") {
    budget -= currentAnswer; // Remove add-on value from budget when going back
  }

  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion(currentQuestion);
  }

  displayBudget(); // Update budget display
}

// Show summary after all questions
function showSummary() {
  quizContainer.innerHTML = "<h2>Thank you for completing the quiz!</h2>";
  const summary = document.createElement("div");
  summary.classList.add("summary");

  const summaryList = document.createElement("ul");
  for (const [key, value] of Object.entries(answers)) {
    const listItem = document.createElement("li");
    listItem.textContent = `${key.replace(/_/g, ' ')}: £${value}`;
    summaryList.appendChild(listItem);
  }
  summary.appendChild(summaryList);
  quizContainer.appendChild(summary);

  // Display final budget
  const finalBudget = document.createElement("h3");
  const totalBudget = (basePrice * multiplier) + (budget * multiplier); // Apply the multiplier to both base price and add-ons
  finalBudget.textContent = `Final Estimated Budget: £${totalBudget.toFixed(2)}`;
  summary.appendChild(finalBudget);
}

// Function to initialize and start the quiz
function initQuiz() {
  const budgetContainer = document.createElement("div");
  budgetContainer.id = "budget-container";

  // Append the budget container and quiz container to #app
  const appContainer = document.getElementById('app');
  appContainer.appendChild(budgetContainer);
  appContainer.appendChild(quizContainer); // Ensure quizContainer is part of the DOM

  displayBudget(); // Display the initial budget
  loadQuestion(currentQuestion); // Load the first question
}

// Start the quiz
initQuiz();

 
