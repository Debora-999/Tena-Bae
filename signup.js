document.getElementById('signupForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const terms = document.getElementById('terms').checked;
  const error = document.getElementById('error');

  if (!name || !email || !password || !confirmPassword) {
    error.textContent = "Please fill in all fields.";
    return;
  }

  if (password !== confirmPassword) {
    error.textContent = "Passwords do not match.";
    return;
  }

  if (!terms) {
    error.textContent = "You must agree to the terms and conditions.";
    return;
  }

  fetch('/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      window.location.href = data.redirect || 'home.html';
    } else {
      error.textContent = data.message || 'Registration failed.';
    }
  })
  .catch(error => {
    console.error('Error:', error);
    error.textContent = 'An error occurred during registration.';
  });
});