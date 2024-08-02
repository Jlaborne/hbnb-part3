document.addEventListener('DOMContentLoaded', () => {
    const addReviewForm = document.getElementById('add-review-form');
    if (addReviewForm) {
        addReviewForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent default form submission behavior

            const comment = document.getElementById('review-comment').value;
            const rating = document.getElementById('review-rating').value;

            fetch(addReviewForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getCookie('token')
                },
                body: JSON.stringify({
                    review: comment,
                    rating: rating
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => { throw new Error(error.msg); });
                }
                return response.json();
            })
            .then(data => {
                if (data.msg === 'Review added') {
                    const reviewsSection = document.querySelector('.reviews');
                    const newReview = document.createElement('div');
                    newReview.classList.add('review-card');
                    newReview.innerHTML = `<h4>You</h4><p>Rating: ${rating}</p><p>${comment}</p>`;
                    reviewsSection.appendChild(newReview);

                    addReviewForm.reset();
                } else {
                    alert('Failed to add review: ' + data.msg);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to add review.');
            });
        });
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
});
