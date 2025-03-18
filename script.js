// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyASErT4hb5uTONo6FjzE1PE8_s5b6mTuG4",
  authDomain: "recipe-rush-40d8b.firebaseapp.com",
  projectId: "recipe-rush-40d8b",
  storageBucket: "recipe-rush-40d8b.firebasestorage.app",
  messagingSenderId: "635239126467",
  appId: "1:635239126467:web:0e3fd1b34a79e69ca11976",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

// Game variables
let ingredientsInBowl = [];
let timeLeft = 60;
let score = 0;
let timerInterval;

// Show Login Form
function showLogin() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("signUpForm").style.display = "none";
  document.getElementById("loginMessage").textContent = "";
}

// Show Sign-Up Form
function showSignUp() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signUpForm").style.display = "block";
  document.getElementById("loginMessage").textContent = "";
}

// Login function
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("loginPage").style.display = "none";
      document.getElementById("gamePage").style.display = "block";
      startTimer(); // Start the timer only after logging in
    })
    .catch((error) => {
      document.getElementById("loginMessage").textContent = error.message;
    });
}

// Sign-up function
function signUp() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Check if passwords match
  if (password !== confirmPassword) {
    document.getElementById("loginMessage").textContent = "Passwords do not match!";
    return;
  }

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      showSuccessModal(); // Show success pop-up
    })
    .catch((error) => {
      document.getElementById("loginMessage").textContent = error.message;
    });
}

// Show success pop-up
function showSuccessModal() {
  document.getElementById("successModal").style.display = "flex";
}

// Close success pop-up and go back to login page
function closeSuccessModal() {
  document.getElementById("successModal").style.display = "none";
  showLogin(); // Go back to the login page
}

// Check if the user is already logged in (but don't auto-login)
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is already logged in, but we won't auto-start the game
    console.log("User is already logged in, but waiting for explicit action.");
  } else {
    // User is not logged in, show the login page
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("gamePage").style.display = "none";
  }
});

// Drag and drop functions
const bowl = document.getElementById("bowl");
const message = document.getElementById("message");
const dishImage = document.getElementById("dishImage");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const instructionsModal = document.getElementById("instructionsModal");

// Add event listeners to all ingredients
const ingredients = document.querySelectorAll(".ingredient");
ingredients.forEach(ingredient => {
  ingredient.addEventListener("dragstart", dragStart);
});

// Add event listeners to the bowl
bowl.addEventListener("dragover", dragOver);
bowl.addEventListener("drop", drop);

// Drag and drop functions
function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.dataset.name);
}

function dragOver(event) {
  event.preventDefault(); // Allow dropping
}

function drop(event) {
  event.preventDefault();
  const ingredientName = event.dataTransfer.getData("text/plain");
  ingredientsInBowl.push(ingredientName); // Add ingredient to the bowl
  updateBowl();
  checkRecipe();
  const dropSound = document.getElementById("dropSound");
  dropSound.play(); // Play drop sound
}

// Update the bowl display
function updateBowl() {
  const bowlContent = document.createElement("p");
  bowlContent.textContent = `Ingredients in bowl: ${ingredientsInBowl.join(", ")}`;

  // Clear the bowl's content except for the dish image
  bowl.innerHTML = "";
  bowl.appendChild(bowlContent);
  bowl.appendChild(dishImage); // Re-add the dish image to the bowl
}

// Check if the ingredients match a recipe
function checkRecipe() {
  const successSound = document.getElementById("successSound");

  // Check for Burger first
  if (ingredientsInBowl.includes("bread") && ingredientsInBowl.includes("tomato") && ingredientsInBowl.includes("lettuce") && ingredientsInBowl.includes("cheese")) {
    message.textContent = "You made a Burger! 🍔";
    dishImage.src = "burger.png";
    dishImage.style.display = "block";
    successSound.play();
    updateScore(20);
    setTimeout(resetBowlForNextDish, 2000); // Reset the bowl after 2 seconds
  }
  // Check for Salad
  else if (ingredientsInBowl.includes("tomato") && ingredientsInBowl.includes("lettuce") && ingredientsInBowl.includes("cheese")) {
    message.textContent = "You made a Salad! 🥗";
    dishImage.src = "salad.png";
    dishImage.style.display = "block";
    successSound.play();
    updateScore(10);
    setTimeout(resetBowlForNextDish, 2000); // Reset the bowl after 2 seconds
  }
  // Check for Grilled Cheese Sandwich
  else if (ingredientsInBowl.includes("bread") && ingredientsInBowl.includes("cheese")) {
    message.textContent = "You made a Grilled Cheese Sandwich! 🥪";
    dishImage.src = "sandwich.png";
    dishImage.style.display = "block";
    successSound.play();
    updateScore(15);
    setTimeout(resetBowlForNextDish, 2000); // Reset the bowl after 2 seconds
  }
  // Check for Pasta
  else if (ingredientsInBowl.includes("pasta") && ingredientsInBowl.includes("sauce")) {
    message.textContent = "You made Pasta! 🍝";
    dishImage.src = "pasta.png";
    dishImage.style.display = "block";
    successSound.play();
    updateScore(15);
    setTimeout(resetBowlForNextDish, 2000); // Reset the bowl after 2 seconds
  }
  // Check for Pizza
  else if (ingredientsInBowl.includes("pizza-base") && ingredientsInBowl.includes("tomato") && ingredientsInBowl.includes("cheese")) {
    message.textContent = "You made a Pizza! 🍕";
    dishImage.src = "pizza.png";
    dishImage.style.display = "block";
    successSound.play();
    updateScore(25);
    setTimeout(resetBowlForNextDish, 2000); // Reset the bowl after 2 seconds
  }
  // No recipe matched
  else {
    message.textContent = "Keep cooking!";
    dishImage.style.display = "none"; // Hide the dish image if no recipe is matched
  }
}

// Update the score
function updateScore(points) {
  score += points;
  scoreDisplay.textContent = score;
}

// Reset the bowl for the next dish
function resetBowlForNextDish() {
  ingredientsInBowl = []; // Clear the bowl
  updateBowl();
  dishImage.src = ""; // Clear the dish image source
  dishImage.style.display = "none"; // Hide the dish image
}

// Reset the bowl, timer, and score
function resetBowl() {
  ingredientsInBowl = []; // Clear the bowl
  updateBowl();
  message.textContent = "";
  dishImage.src = ""; // Clear the dish image source
  dishImage.style.display = "none"; // Hide the dish image

  // Reset the timer
  timeLeft = 60;
  timerDisplay.textContent = timeLeft;
  timerDisplay.style.color = "#fff"; // Reset timer color
  timerDisplay.style.animation = "none"; // Stop blinking animation

  // Reset the score
  score = 0;
  scoreDisplay.textContent = score;

  // Restart the timer
  clearInterval(timerInterval); // Clear the existing timer
  startTimer(); // Start a new timer
}

// Show instructions modal
function showInstructions() {
  instructionsModal.style.display = "flex";
}

// Close instructions modal
function closeInstructions() {
  instructionsModal.style.display = "none";
}

// Timer function
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    // Change timer color and play beep when time is running low
    if (timeLeft <= 10) {
      timerDisplay.style.color = "#ff0000"; // Red color
      timerDisplay.style.animation = "blink 1s infinite";
      const timerBeep = document.getElementById("timerBeep");
      timerBeep.play(); // Play timer beep
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      message.textContent = "Time's up! Game over!";
      bowl.innerHTML = `<p>Game Over!</p>`;
    }
  }, 1000);
}