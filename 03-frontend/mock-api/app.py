from flask import Flask, request, jsonify, render_template
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, decode_token
from flask_cors import CORS
import json

app = Flask(__name__)
app.config.from_object('config.Config')

jwt = JWTManager(app)
CORS(app) # Enable CORS for all routes

with open('data/users.json') as f:
    users = json.load(f)

with open('data/places.json') as f:
    places = json.load(f)

# In-memory storage for new reviews
new_reviews = []

def is_user_logged_in(request):
    token = request.cookies.get('token')
    if token:
        try:
            decode_token(token)  # Validate token
            return True
        except Exception as e:
            print(f"Token validation failed: {e}")
    return False

@app.route('/')
def index_page():
    return render_template('index.html', user_logged_in=is_user_logged_in(request))

@app.route('/login', methods=['GET'])
def login_page():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    user = next((u for u in users if u['email'] == email and u['password'] == password), None)
    
    if not user:
        print(f"User not found or invalid password for: {email}")
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user['id'])
    return jsonify(access_token=access_token)

@app.route('/places', methods=['GET'])
def get_places():
    response = [
        {
            "id": place['id'],
            "host_id": place['host_id'],
            "host_name": place['host_name'],
            "description": place['description'],
            "price_per_night": place['price_per_night'],
            "city_id": place['city_id'],
            "city_name": place['city_name'],
            "country_code": place['country_code'],
            "country_name": place['country_name'],
            "image_url": place['image_url']
        }
        for place in places
    ]
    return jsonify(response)

@app.route('/places/<place_id>/json', methods=['GET'])
def get_place(place_id):
    place = next((p for p in places if p['id'] == place_id), None)

    if not place:
        return jsonify({"msg": "Place not found"}), 404

    response = {
        "id": place['id'],
        "host_id": place['host_id'],
        "host_name": place['host_name'],
        "description": place['description'],
        "number_of_rooms": place['number_of_rooms'],
        "number_of_bathrooms": place['number_of_bathrooms'],
        "max_guests": place['max_guests'],
        "price_per_night": place['price_per_night'],
        "latitude": place['latitude'],
        "longitude": place['longitude'],
        "city_id": place['city_id'],
        "city_name": place['city_name'],
        "country_code": place['country_code'],
        "country_name": place['country_name'],
        "amenities": place['amenities'],
        "reviews": place['reviews'] + [r for r in new_reviews if r['place_id'] == place_id],
        "image_url": place['image_url']
    }
    return jsonify(response)

@app.route('/places/<place_id>/reviews', methods=['POST'])
@jwt_required()
def add_review(place_id):
    current_user_id = get_jwt_identity()
    user = next((u for u in users if u['id'] == current_user_id), None)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    review_text = request.form.get('comment')
    rating = request.form.get('rating')

    if not review_text or not rating:
        return jsonify({"msg": "Missing comment or rating"}), 400
    
    try:
        rating = int(rating)
    except ValueError:
        return jsonify({"msg": "Invalid rating format"}), 400

    if rating < 1 or rating > 5:
        return jsonify({"msg": "Rating must be between 1 and 5"}), 400

    new_review = {
        "user_name": user['name'],
        "rating": rating,
        "comment": review_text,
        "place_id": place_id
    }

    new_reviews.append(new_review)
    return jsonify({"msg": "Review added"}), 201

@app.route('/places/<place_id>', methods=['GET'])
def place_details(place_id):
    place = next((p for p in places if p['id'] == place_id), None)

    if not place:
        return jsonify({"msg": "Place not found"}), 404

    # Fetch reviews associated with the place
    place_reviews = [r for r in new_reviews if r['place_id'] == place_id]

    return render_template('place.html', place=place, reviews=place_reviews, user_logged_in=is_user_logged_in(request))

if __name__ == '__main__':
    app.run(debug=True)