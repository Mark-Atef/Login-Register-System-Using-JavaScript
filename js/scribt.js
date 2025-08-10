function showRegister() {
  document.getElementById("registerForm").classList.remove("hidden");
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("profilePage").classList.add("hidden");
}

function showLogin() {
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("profilePage").classList.add("hidden");
}

function showProfile(user) {
  document.getElementById("profileName").textContent = user.username;
  document.getElementById("profilePage").classList.remove("hidden");
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("registerForm").classList.add("hidden");
}

function checkPasswordStrength() {
  const password = document.getElementById("regPassword").value;
  const strength = document.getElementById("passwordStrength");
  let msg = "";
  let strengthScore = 0;

  if (password.length >= 6) strengthScore++;
  if (/[A-Z]/.test(password)) strengthScore++;
  if (/[0-9]/.test(password)) strengthScore++;
  if (/[^A-Za-z0-9]/.test(password)) strengthScore++;

  if (strengthScore <= 1) msg = "Weak";
  else if (strengthScore === 2) msg = "Medium";
  else if (strengthScore >= 3) msg = "Strong";

  strength.textContent = msg;
  strength.style.color = strengthScore < 2 ? "red" : strengthScore === 2 ? "orange" : "green";
}

function register() {
  const username = document.getElementById("regUsername").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;
  const errorDiv = document.getElementById("regError");

  if (!username || !email || !password || !confirmPassword) {
    errorDiv.textContent = "Please fill all fields.";
    errorDiv.className = "error";
    return;
  }
  if (password !== confirmPassword) {
    errorDiv.textContent = "Passwords do not match.";
    errorDiv.className = "error";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.some(u => u.email === email)) {
    errorDiv.textContent = "Email is already registered.";
    errorDiv.className = "error";
    return;
  }

  users.push({ username, email, password });
  localStorage.setItem("users", JSON.stringify(users));

  errorDiv.textContent = "Registration successful! Please log in.";
  errorDiv.className = "success";

  setTimeout(() => {
    document.getElementById("regUsername").value = "";
    document.getElementById("regEmail").value = "";
    document.getElementById("regPassword").value = "";
    document.getElementById("regConfirmPassword").value = "";
    showLogin();
  }, 1000);
}

function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const rememberMe = document.getElementById("rememberMe").checked;
  const errorDiv = document.getElementById("loginError");

  if (!email || !password) {
    errorDiv.textContent = "Please fill all fields.";
    errorDiv.className = "error";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];
  let validUser = users.find(u => u.email === email && u.password === password);

  if (validUser) {
    errorDiv.textContent = `Welcome back, ${validUser.username}!`;
    errorDiv.className = "success";

    if (rememberMe) {
      localStorage.setItem("rememberedUser", JSON.stringify(validUser));
    } else {
      localStorage.removeItem("rememberedUser");
    }

    localStorage.setItem("loggedInUser", JSON.stringify(validUser));

    setTimeout(() => {
      document.getElementById("loginEmail").value = "";
      document.getElementById("loginPassword").value = "";
      showProfile(validUser);
    }, 800);
  } else {
    errorDiv.textContent = "Invalid email or password.";
    errorDiv.className = "error";
  }
}

function logout() {
  // Clear both loggedInUser AND rememberedUser on logout (fixes Objective 6)
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("rememberedUser");
  showLogin();
}

window.onload = function () {
  // Prioritize loggedInUser, then rememberedUser (Objective 7)
  const loggedIn = JSON.parse(localStorage.getItem("loggedInUser"));
  const remembered = JSON.parse(localStorage.getItem("rememberedUser"));

  if (loggedIn) {
    showProfile(loggedIn);
  } else if (remembered) {
    // Sync remembered user to loggedInUser for consistent state
    localStorage.setItem("loggedInUser", JSON.stringify(remembered));
    showProfile(remembered);
  } else {
    showLogin();
  }
};
