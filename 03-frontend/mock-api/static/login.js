document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                if (response.ok) {
                    const data = await response.json();
                    document.cookie = `token=${data.access_token}; path=/`;

                    // Redirect the user to the main page (index)
                    window.location.href = '/';
                } else {
                    const errorData = await response.json();
                    errorMessage.textContent = 'Login failed: ' + errorData.msg;
                }
            } catch (error) {
                errorMessage.textContent = 'An error occurred. Please try again.';
                console.error('Login error:', error);
            }
        });
    }
});
