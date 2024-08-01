// Function to get a cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Check if the user is logged in by checking the presence of the token cookie
function checkLoginStatus() {
    const token = getCookie('token');
    const addReviewSection = document.getElementById('add-review-section');

    if (token) {
        // User is logged in
        // Display the review form if not already shown
        if (addReviewSection) {
            addReviewSection.innerHTML = `
                <h2>Add a Review</h2>
                <form class="form" method="post" action="{{ url_for('add_review', place_id=place.id) }}">
                    <label for="review-comment">Comment:</label>
                    <textarea id="review-comment" name="comment" required></textarea>

                    <label for="review-rating">Rating (1-5):</label>
                    <input type="number" id="review-rating" name="rating" min="1" max="5" required>

                    <button type="submit">Submit Review</button>
                </form>
            `;

            // Attach the submit event handler to the form
            document.getElementById('add-review-form').addEventListener('submit', submitReview);
        }
    } else {
        // User is not logged in
        // Display the login link if not already shown
        if (addReviewSection) {
            addReviewSection.innerHTML = `
                <a href="{{ url_for('login') }}" class="login-button">Log In to Add a Review</a>
            `;
        }
    }
}

// Function to submit the review
async function submitReview(event) {
    event.preventDefault(); // Prevent the default form submission

    const reviewComment = document.getElementById('review-comment').value;
    const reviewRating = document.getElementById('review-rating').value;
    const errorMessage = document.getElementById('error-message');

    const token = getCookie('token');
    console.log('Token:', token); // Log the token to verify it

    if (!token) {
        if (errorMessage) {
            errorMessage.textContent = 'You must be logged in to submit a review.';
        }
        return;
    }

    try {
        const response = await fetch(addReviewUrl, {  // Use the passed URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                comment: reviewComment,
                rating: reviewRating
            })
        });

        if (response.ok) {
            const data = await response.json();
            alert('Review added successfully.');
            location.reload(); // Reload the page to see the new review
        } else {
            const errorData = await response.json();
            if (errorMessage) {
                errorMessage.textContent = 'Failed to add review: ' + errorData.msg;
            }
        }
    } catch (error) {
        if (errorMessage) {
            errorMessage.textContent = 'An error occurred. Please try again.';
        }
        console.error('Review submission error:', error);
    }
}

// Call checkLoginStatus on page load
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();

    const reviewForm = document.getElementById('review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', submitReview);
    }
});