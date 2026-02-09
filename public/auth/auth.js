const phoneInput = document.getElementById('phoneInput');
const passwordInput = document.getElementById('passwordInput');
const submitBtn = document.getElementById('submitBtn');
const authForm = document.getElementById('authForm');
const toggleLink = document.getElementById('toggleLink');
const errorMsg = document.getElementById('errorMsg');
const introOverlay = document.getElementById('introOverlay');
const launchSound = document.getElementById('launchSound');
const authContainer = document.querySelector('.auth-container');

let isLogin = true;

// ===== TOGGLE MODE =====
toggleLink.addEventListener('click', (e) => {
  e.preventDefault();
  isLogin = !isLogin;
  submitBtn.textContent = isLogin ? 'LOGIN' : 'REGISTER';
  toggleLink.textContent = isLogin ? 'Create one' : 'Back to login';
  errorMsg.classList.remove('show');
});

// ===== FORM SUBMIT =====
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.classList.remove('show');

  const phone = phoneInput.value.trim();
  const password = passwordInput.value;

  // Validation
  if (!/^0\d{9,10}$/.test(phone)) {
    showError('Invalid phone format (start with 0, 10-11 digits)');
    return;
  }

  if (password.length < 8) {
    showError('Password must be at least 8 characters');
    return;
  }

  // Disable button during request
  submitBtn.disabled = true;
  submitBtn.textContent = isLogin ? 'LOGGING IN...' : 'REGISTERING...';

  // API Call
  try {
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const backendUrl = 'http://localhost:5000';
    
    const res = await fetch(`${backendUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
      credentials: 'include'
    });

    const data = await res.json();

    if (!res.ok) {
      showError(data.error || 'Something went wrong');
      submitBtn.disabled = false;
      submitBtn.textContent = isLogin ? 'LOGIN' : 'REGISTER';
      return;
    }

    // Store token and user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Show intro
    showIntro();
  } catch (err) {
    showError('Network error. Make sure backend is running on localhost:5000');
    console.error(err);
    submitBtn.disabled = false;
    submitBtn.textContent = isLogin ? 'LOGIN' : 'REGISTER';
  }
});

// ===== INTRO ANIMATION =====
function showIntro() {
  authContainer.classList.add('fade-out');
  setTimeout(() => {
    introOverlay.classList.remove('hidden');
  }, 300);
  document.body.style.overflow = 'hidden';

  introOverlay.addEventListener('click', launchSequence, { once: true });
}

function launchSequence() {
  // Play sound
  launchSound.play().catch(() => console.log('Audio autoplay blocked'));

  // Add launch animation
  document.querySelectorAll('.rocket').forEach(rocket => {
    rocket.classList.add('take-off');
  });

  // Fade and redirect
  setTimeout(() => {
    introOverlay.classList.add('fade-out');
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  }, 800);
}

// ===== ERROR HANDLING =====
function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.classList.add('show');
}

// ===== INPUT EFFECTS (Glow on Touch) =====
[phoneInput, passwordInput].forEach(input => {
  input.addEventListener('touchstart', () => {
    input.style.boxShadow = '0 0 20px rgba(0, 243, 255, 0.5)';
  });

  input.addEventListener('touchend', () => {
    input.style.boxShadow = '';
  });
});

console.log('🔐 Delta Stress Lens Auth loaded');
