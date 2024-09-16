const quizData = [
  {
    question: "What type of website are you interested in?",
    options: [
      "Informational Website (e.g., company info, services)",
      "E-commerce Store (sell products online)",
      "Portfolio Website (showcase work/projects)",
      "Blog or News Site (regular articles/posts)",
    ],
    type: "radio",
    name: "website_type",
  },
  {
    question: "Do you currently have a website?",
    options: ["Yes", "No"],
    type: "radio",
    name: "existing_website",
  },
  {
    question: "Do you have a logo and brand colors?",
    options: [
      "Yes, I have both",
      "I have a logo but need help with colors",
      "No, I need help with both",
    ],
    type: "radio",
    name: "branding",
  },
  {
    question: "How many pages do you expect your website to have?",
    options: [
      "1-5 pages",
      "6-10 pages",
      "11-20 pages",
      "More than 20 pages",
    ],
    type: "radio",
    name: "page_count",
  },
  {
    question: "Do you need your website to be mobile-friendly?",
    options: ["Yes", "No"],
    type: "radio",
    name: "mobile_friendly",
  },
  {
    question: "Would you like to sell products or services directly from your website?",
    options: ["Yes", "No"],
    type: "radio",
    name: "ecommerce",
  },
  {
    question: "Do you require a content management system (CMS) to update your website yourself?",
    options: ["Yes", "No", "Not sure, need advice"],
    type: "radio",
    name: "cms",
  },
  {
    question: "Are you interested in search engine optimization (SEO) to improve your site's visibility on search engines?",
    options: ["Yes", "No"],
    type: "radio",
    name: "seo",
  },
  {
    question: "Do you need help with creating content (text, images) for your website?",
    options: [
      "Yes, need help with both text and images",
      "Only need help with text",
      "Only need help with images",
      "No, I have all content ready",
    ],
    type: "radio",
    name: "content_creation",
  },
  {
    question: "Would you like to integrate your social media accounts into the website?",
    options: ["Yes", "No"],
    type: "radio",
    name: "social_media",
  },
  {
    question: "Do you need multilingual support for your website?",
    options: ["Yes, multiple languages", "No, English only"],
    type: "radio",
    name: "multilingual",
  },
  {
    question: "What style of design do you prefer?",
    options: [
      "Modern and Minimalist",
      "Bold and Colorful",
      "Professional and Corporate",
      "Creative and Artistic",
    ],
    type: "radio",
    name: "design_style",
  },
  {
    question: "Do you need any special features? (Select all that apply)",
    options: [
      "Contact Form",
      "Live Chat",
      "Booking System",
      "Blog Section",
      "Image or Video Gallery",
    ],
    type: "checkbox",
    name: "special_features",
  },
  {
    question: "What is your expected timeline for the project?",
    options: [
      "ASAP (1-2 weeks)",
      "Short Term (3-6 weeks)",
      "Flexible (No strict deadline)",
    ],
    type: "radio",
    name: "timeline",
  },
  {
    question: "Please select your approximate budget for this project:",
    type: "range",
    name: "budget",
    min: 0,
    max: 2000,
  },
];

let currentQuestion = 0;
const totalQuestions = quizData.length;
const answers = {};

const quizContainer = document.getElementById("quiz-container");

function loadQuestion(questionIndex) {
  const data = quizData[questionIndex];
  quizContainer.innerHTML = "";

  const questionElement = document.createElement("div");
  questionElement.classList.add("question");

  const questionTitle = document.createElement("h2");
  questionTitle.textContent = `${questionIndex + 1}. ${data.question}`;
  questionElement.appendChild(questionTitle);

  if (data.type === "radio" || data.type === "checkbox") {
    const optionsList = document.createElement("ul");
    optionsList.classList.add("options");

    data.options.forEach((option, index) => {
      const optionItem = document.createElement("li");

      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = data.type;
      input.name = data.name;
      input.value = option;

      // Restore previous answers
      if (answers[data.name]) {
        if (data.type === "radio" && answers[data.name] === option) {
          input.checked = true;
        } else if (data.type === "checkbox" && answers[data.name].includes(option)) {
          input.checked = true;
        }
      }

      label.appendChild(input);
      label.appendChild(document.createTextNode(option));
      optionItem.appendChild(label);
      optionsList.appendChild(optionItem);
    });

    questionElement.appendChild(optionsList);
  } else if (data.type === "range") {
    const sliderContainer = document.createElement("div");
    sliderContainer.classList.add("slider-container");

    const input = document.createElement("input");
    input.type = "range";
    input.name = data.name;
    input.min = data.min;
    input.max = data.max;
    input.value = answers[data.name] || data.min;

    const valueDisplay = document.createElement("p");
    valueDisplay.textContent = `£${input.value}`;

    input.addEventListener("input", () => {
      valueDisplay.textContent = `£${input.value}`;
    });

    sliderContainer.appendChild(input);
    sliderContainer.appendChild(valueDisplay);
    questionElement.appendChild(sliderContainer);
  }

  quizContainer.appendChild(questionElement);
  updateProgress();
  updateNavigation();
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
    if (input.type === "radio" || input.type === "range") {
      if (input.checked || input.type === "range") {
        answers[input.name] = input.value;
      }
    } else if (input.type === "checkbox") {
      if (!answers[input.name]) {
        answers[input.name] = [];
      }
      if (input.checked) {
        if (!answers[input.name].includes(input.value)) {
          answers[input.name].push(input.value);
        }
      } else {
        const index = answers[input.name].indexOf(input.value);
        if (index > -1) {
          answers[input.name].splice(index, 1);
        }
      }
    }
  });
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
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion(currentQuestion);
  }
}

function showSummary() {
  quizContainer.innerHTML = "<h2>Thank you for completing the quiz!</h2>";
  const summary = document.createElement("div");
  summary.classList.add("summary");

  const summaryList = document.createElement("ul");
  for (const [key, value] of Object.entries(answers)) {
    const listItem = document.createElement("li");
    listItem.textContent = `${key.replace(/_/g, ' ')}: ${Array.isArray(value) ? value.join(", ") : value}`;
    summaryList.appendChild(listItem);
  }
  summary.appendChild(summaryList);
  quizContainer.appendChild(summary);

  // You can add code here to send 'answers' to a server or email
}

// Start the quiz
loadQuestion(currentQuestion);
