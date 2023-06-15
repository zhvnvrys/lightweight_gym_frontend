const loginForm = document.getElementById('loginForm');
const loginButton = document.getElementById('loginButton');

const signUpForm = document.getElementById('signupForm');
const signUpButton = document.getElementById('signupButton');

const errorContainer = document.getElementById('errorContainer');
const errorMessage = document.getElementById('errorMessage');

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault(); 

  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;

  const signInData = { email, password };

  try {
    const response = await fetch('http://localhost:5296/api/Accounts/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signInData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('User signed in successfully:', result);
      window.location.href = 'index-login.html';
    } else if (response.status === 401) {
      errorMessage.textContent = 'Invalid username or password.';
      errorContainer.style.display = 'block';
    } else {
      errorMessage.textContent = 'An error occurred during sign-in. Please try again later.';
      errorContainer.style.display = 'block';
    }
  } catch (error) {
    console.error('An error occurred during sign-in:', error);
    errorMessage.textContent = 'An error occurred during sign-in.';
    errorContainer.style.display = 'block';
  }
});

loginButton?.addEventListener('click', () => {
  loginForm.submit();
});


signUpForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const firstName = document.getElementById('firstNameInput').value;
  const lastName = document.getElementById('lastNameInput').value;
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;
  const confirmPassword = document.getElementById('confirmPasswordInput').value;

  const signUpData = {
    firstName,
    lastName,
    email,
    password,
    confirmPassword
  };

  try {
    const response = await fetch('http://localhost:5296/api/Accounts/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signUpData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('User signed up successfully:', result);
      window.location.href = 'login.html';
    } else {
      const errorData = await response.json();

      let errorMessageText = '<ul>';

      if (errorData && errorData.errors && errorData.errors.Email && errorData.errors.Email.includes('Email address is already in use.')) {
        errorMessageText += '<li>Email address is already in use.</li>';
      } else {
        for (const [key, errorMessages] of Object.entries(errorData.errors)) {
          errorMessageText += `<li>${errorMessages.join(', ')}</li>`;
        }
      }

      errorMessageText += '</ul>';
      errorMessage.innerHTML = errorMessageText;
      errorContainer.style.display = 'block'; // Show the error container
    }
  } catch (error) {
    console.error('An error occurred during sign-up:', error);
    errorMessage.innerHTML = 'An error occurred during sign-up. Please try again later.';
    errorContainer.style.display = 'block'; // Show the error container
  }
});



// Clear the error message and hide the error container when the input fields are modified
signUpForm?.addEventListener('input', () => {
  errorMessage.innerHTML = '';
  errorContainer.style.display = 'none';
});


signUpForm?.addEventListener('input', () => {
  errorMessage.textContent = '';
});

signUpButton?.addEventListener('click', () => {
  signUpForm.submit();
});



function formatDateTime(activityDate, finishedAt) {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const date = new Date(activityDate).toLocaleDateString(undefined, options);

  return `${date}`;
}

function formatHours(activityDate, finishedAt) {

  const startTime = new Date(finishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const endTime = finishedAt.slice(11, 16);

  return `${startTime} - ${endTime}`;
}



async function fetchAndDisplayActivities() {
  try {
    const response = await fetch('http://localhost:5296/api/Activities');
    const activities = await response.json();

    
    const activityList = document.getElementById('activityList');
    activities.forEach(activity => {
      const activityHeader = document.createElement('h2');
      activityHeader.textContent = activity.activityName;

      const activityItem = document.createElement('div');
      activityItem.classList.add('activity-item');
      activityItem.innerHTML = `
        <p class="activity-date">${formatDateTime(activity.activityDate, activity.finishedAt)}</p>
        <p class="activity-hours">${formatHours(activity.activityDate, activity.finishedAt)}</p>
        <p><strong>Trainer ID:</strong> ${activity.trainerId}</p>
      `;

      activityList.appendChild(activityHeader);
      activityList.appendChild(activityItem);
    });
  } catch (error) {
    console.error('An error occurred while fetching activities:', error);
  }
}

fetchAndDisplayActivities();
