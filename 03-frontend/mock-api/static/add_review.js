document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie('jwt_token'); // Function to get JWT token from cookies

    if (!token) {
        window.location.href = '/'; // Redirect to index page if not authenticated
    }

    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get('place_id');

    const reviewForm = document.getElementById('reviewForm');
    reviewForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const reviewText = document.getElementById('reviewText').value;
        const messageDiv = document.getElementById('message');

        try {
            const response = await fetch('http://127.0.0.1:5000/places/${placeId}/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    place_id: placeId,
                    review_text: reviewText
                })
            });

            if (response.ok) {
                messageDiv.textContent = 'Review submitted successfully!';
                reviewForm.reset();
            } else {
                const errorData = await response.json();
                messageDiv.textContent = `Error: ${errorData.message}`;
            }
        } catch (error) {
            messageDiv.textContent = `Error: ${error.message}`;
        }
    });
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
