document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.access_token) {
            alert('Login successful!');
            // Redirect or store token here
        } else {
            alert('Login failed: ' + data.msg);
        }
    })
    .catch(error => console.error('Error:', error));
});
