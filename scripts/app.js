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
      { text: "Basic SEO Package (£0)", value: 0 },
      { text: "Intermediate  SEO Package (£50)", value: 50 },
      { text: "Advanced SEO Package (£150)", value: 150 },
    ],
    type: "radio",
    name: "seo",
  },
  {
    question: "Do you need help with creating content (text, images)?",
    options: [
      { text: "Both text and images (£130)", value: 130 },
      { text: "Text only (£80)", value: 80 },
      { text: "Images only (£50)", value: 50 },
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
let basePrice = 0;
let budget = 0;
let multiplier = 1;
const previousSelections = {};

const quizContainer = document.getElementById("quiz-container");

// Display budget function
function displayBudget() {
  const totalBudget = (basePrice * multiplier) + (budget * multiplier);
  const budgetContainer = document.getElementById("budget-container");
  budgetContainer.innerHTML = `<h3>Estimated Budget: £${totalBudget.toFixed(2)}</h3>`;
}

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

function updateBudget(name, newValue) {
  if (name === "has_website") {
    multiplier = newValue; 
  } else if (name === "website_type") {
    basePrice = newValue; 
  } else {
    const previousValue = previousSelections[name] || 0;
    budget = budget - previousValue + newValue;
    previousSelections[name] = newValue;
  }

  displayBudget(); 
}

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

function collectAnswers() {
  const inputs = quizContainer.querySelectorAll("input");
  inputs.forEach((input) => {
    if (input.type === "radio" && input.checked) {
      const currentValue = parseFloat(input.value);

      if (input.name === "website_type") {
        basePrice = currentValue;
      } else if (input.name !== "has_website") {
        const previousValue = previousSelections[input.name] || 0;
        budget = budget - previousValue + currentValue;
        previousSelections[input.name] = currentValue;
      }

      answers[input.name] = input.value;
    }
  });

  displayBudget(); 
}

function nextQuestion() {
  collectAnswers();
  if (currentQuestion < totalQuestions - 1) {
    currentQuestion++;
    loadQuestion(currentQuestion);
  } else {
    showSummary();
  }
}

function prevQuestion() {
  const currentAnswer = previousSelections[quizData[currentQuestion].name] || 0;
  if (quizData[currentQuestion].name !== "website_type") {
    budget -= currentAnswer; 
  }

  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion(currentQuestion);
  }

  displayBudget(); 
}

function showSummary() {
  quizContainer.innerHTML = "<h2>Thank you for completing the quiz!</h2>";
  const summary = document.createElement("div");
  summary.classList.add("summary");

  // Create table for detailed summary
  const summaryTable = document.createElement("table");
  summaryTable.classList.add("summary-table");

  const tableHeader = `<tr>
                         <th>Feature</th>
                         <th>Cost</th>
                         <th>Action</th>
                       </tr>`;
  summaryTable.innerHTML = tableHeader;

  for (const [key, value] of Object.entries(answers)) {
    // Skip 'has_website' in the summary
    if (key === 'has_website') continue;

    const row = document.createElement("tr");
    row.innerHTML = `<td>${key.replace(/_/g, ' ')}</td><td>£${value}</td>`;

    // Add a delete button to remove feature
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Remove";
    deleteButton.classList.add("btn", "delete-btn");
    deleteButton.addEventListener("click", () => removeFeature(key));
    const actionCell = document.createElement("td");
    actionCell.appendChild(deleteButton);
    row.appendChild(actionCell);

    summaryTable.appendChild(row);
  }

  summary.appendChild(summaryTable);
  quizContainer.appendChild(summary);

  // Display final budget
  const finalBudget = document.createElement("h3");
  const totalBudget = (basePrice * multiplier) + (budget * multiplier);
  finalBudget.textContent = `Final Estimated Budget: £${totalBudget.toFixed(2)}`;
  summary.appendChild(finalBudget);

  // Create a button to download the summary
  const downloadButton = document.createElement("button");
  downloadButton.textContent = "Download Detailed Summary";
  downloadButton.classList.add("btn", "download-btn");
  downloadButton.addEventListener("click", () => downloadSummary(totalBudget));
  summary.appendChild(downloadButton);
}

// Function to remove a feature and update budget
function removeFeature(feature) {
  const previousValue = previousSelections[feature] || 0;
  budget -= previousValue; // Adjust budget
  delete answers[feature]; // Remove feature from answers
  delete previousSelections[feature]; // Remove feature from selections
  showSummary(); // Refresh summary
}

// Function to download the summary
function downloadSummary(totalBudget) {
  let summaryContent = "Website Quoting Tool - Detailed Summary\n\n";
  for (const [key, value] of Object.entries(answers)) {
    summaryContent += `${key.replace(/_/g, ' ')}: £${value}\n`;
  }
  summaryContent += `\nFinal Estimated Budget: £${totalBudget.toFixed(2)}`;
  summaryContent += "\n\nNote: This summary includes all selected features with their respective costs for your custom website project.";

  const blob = new Blob([summaryContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Website_Quote_Summary.txt";
  a.click();
  URL.revokeObjectURL(url);
}

function initQuiz() {
  const appContainer = document.getElementById('app');
  const budgetContainer = document.createElement("div");
  budgetContainer.id = "budget-container";
  appContainer.appendChild(budgetContainer);
  appContainer.appendChild(quizContainer);

  displayBudget();
  loadQuestion(currentQuestion);
}

initQuiz();
