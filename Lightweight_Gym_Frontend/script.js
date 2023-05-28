// Get the form element
const loginForm = document.getElementById('loginForm');

// Add an event listener to the form submit event
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevent form submission

  // Get the input values
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;

  // Create an object with the input data
  const signInData = { email, password };

  try {
    // Make the HTTP POST request to the API endpoint
    const response = await fetch('http://localhost:5296/api/Accounts/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signInData),
    });

    if (response.ok) {
      // Handle successful response
      const result = await response.json();
      console.log('User signed in successfully:', result);
      // Redirect
      window.location.href = 'index-login.html';
    } else {
      // Handle error response
      console.error('Sign-in failed');
      // Perform any desired error handling, such as displaying an error message to the user
    }
  } catch (error) {
    console.error('An error occurred during sign-in:', error);
    // Perform any desired error handling, such as displaying an error message to the user
  }
});
