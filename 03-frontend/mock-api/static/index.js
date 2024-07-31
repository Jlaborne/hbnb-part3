/*document.getElementById('login-form').addEventListener('submit', function(event) {
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
            // Redirect or store token
        } else {
            alert('Login failed: ' + data.msg);
        }
    })
    .catch(error => console.error('Error:', error));
});
*/
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');

    const placesList = document.getElementById('places-list');
    const countryFilter = document.getElementById('country-filter');

    if (!placesList || !countryFilter) {
        console.error('Required elements not found in the DOM');
        return;
    }

    // Fetch places data from the API
    fetch('/places')
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log("Fetched data:", data); // Debugging line
            displayPlaces(data);
            populateCountryFilter(data);
        })
        .catch(error => console.error('Error fetching places:', error));

    function displayPlaces(places) {
        placesList.innerHTML = '';
        places.forEach(place => {
            const placeCard = document.createElement('div');
            placeCard.classList.add('place-card');
            placeCard.innerHTML = `
                <img src="${place.image_url}" alt="Image of ${place.name}" class="place-image"> 
                <p>Price per night: $${place.price_per_night}</p>
                <h3>Location: ${place.city_name}</h3>
                <a href="/places/${place.id}" class="details-button">View Details</a>
            `;
            placesList.appendChild(placeCard);
        });
    }

    function populateCountryFilter(places) {
        const countries = [...new Set(places.map(place => place.country_name))];
        countryFilter.innerHTML = '<option value="">All Countries</option>';
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countryFilter.appendChild(option);
        });

        countryFilter.addEventListener('change', function() {
            const selectedCountry = this.value;
            const filteredPlaces = selectedCountry ? places.filter(place => place.country_name === selectedCountry) : places;
            displayPlaces(filteredPlaces);
        });
    }
});
