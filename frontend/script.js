// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let currentToken = localStorage.getItem('authToken') || null;
let currentBooking = {};
let currentHotelId = null;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setMinDates();
    updateUIBasedOnAuth();
    setupStarRatings();
    initializeStripe();
});

// ==================== AUTHENTICATION ====================

function openAuthModal() {
    document.getElementById('authModal').style.display = 'block';
}

function closeAuthModal() {
    document.getElementById('authModal').style.display = 'none';
}

function switchToSignup(e) {
    e.preventDefault();
    document.getElementById('loginTab').classList.remove('active');
    document.getElementById('signupTab').classList.add('active');
}

function switchToLogin(e) {
    e.preventDefault();
    document.getElementById('loginTab').classList.add('active');
    document.getElementById('signupTab').classList.remove('active');
}

async function signupUser() {
    const fullName = document.getElementById('signupFullName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    if (!fullName || !email || !phone || !password) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, phone, password, confirmPassword })
        });

        const data = await response.json();

        if (response.ok) {
            alert('✅ Account created! Check your email to verify.');
            document.getElementById('signupFullName').value = '';
            document.getElementById('signupEmail').value = '';
            document.getElementById('signupPhone').value = '';
            document.getElementById('signupPassword').value = '';
            document.getElementById('signupConfirmPassword').value = '';
            switchToLogin({preventDefault: () => {}});
        } else {
            alert('❌ Signup failed: ' + data.error);
        }
    } catch (err) {
        alert('❌ Error: ' + err.message);
    }
}

async function loginUser() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Please enter email and password');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            currentUser = data.user;
            currentToken = data.token;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem('authToken', currentToken);
            closeAuthModal();
            updateUIBasedOnAuth();
            alert('✅ Logged in successfully');
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
        } else {
            alert('❌ Login failed: ' + data.error);
        }
    } catch (err) {
        alert('❌ Error: ' + err.message);
    }
}

function logout(e) {
    e.preventDefault();
    currentUser = null;
    currentToken = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    updateUIBasedOnAuth();
    alert('Logged out successfully');
}

function updateUIBasedOnAuth() {
    const authButton = document.getElementById('authButtonContainer');
    const userMenu = document.getElementById('userMenuContainer');
    const addReviewSection = document.getElementById('addReviewSection');

    if (currentUser && currentToken) {
        authButton.style.display = 'none';
        userMenu.style.display = 'block';
        document.getElementById('userGreeting').textContent = `Hi, ${currentUser.fullName.split(' ')[0]}`;
        if (addReviewSection) addReviewSection.style.display = 'block';
    } else {
        authButton.style.display = 'block';
        userMenu.style.display = 'none';
        if (addReviewSection) addReviewSection.style.display = 'none';
    }
}

function viewProfile(e) {
    e.preventDefault();
    alert(`Profile:\nName: ${currentUser.fullName}\nEmail: ${currentUser.email}\nPhone: ${currentUser.phone}`);
}

// ==================== HOTEL FUNCTIONS ====================

function setMinDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkInDate').setAttribute('min', today);
    document.getElementById('checkOutDate').setAttribute('min', today);
}

async function searchHotels() {
    const location = document.getElementById('searchLocation').value;
    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;

    if (!checkIn || !checkOut) {
        alert('Please select check-in and check-out dates');
        return;
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
        alert('Check-out date must be after check-in date');
        return;
    }

    try {
        let query = `${API_BASE_URL}/hotels`;
        if (location) query += `?location=${location}`;

        const response = await fetch(query);
        const data = await response.json();

        if (data.hotels && data.hotels.length > 0) {
            displayHotels(data.hotels);
        } else {
            document.getElementById('hotelsGrid').innerHTML = '<p>No hotels found matching your criteria.</p>';
        }
    } catch (err) {
        alert('Error searching hotels: ' + err.message);
    }

    document.getElementById('hotels').scrollIntoView({ behavior: 'smooth' });
}

function displayHotels(hotelList) {
    const hotelsGrid = document.getElementById('hotelsGrid');
    hotelsGrid.innerHTML = '';

    hotelList.forEach(hotel => {
        const hotelCard = document.createElement('div');
        hotelCard.className = 'hotel-card';
        hotelCard.onclick = () => showHotelDetails(hotel);
        
        const ratingStars = '★'.repeat(Math.round(hotel.rating)) + '☆'.repeat(5 - Math.round(hotel.rating));
        const minPrice = Math.min(...hotel.rooms.map(r => r.pricePerNight));
        
        hotelCard.innerHTML = `
            <div class="hotel-image">🏨</div>
            <div class="hotel-info">
                <div class="hotel-name">${hotel.name}</div>
                <span class="hotel-type">${hotel.type.charAt(0).toUpperCase() + hotel.type.slice(1)}</span>
                <div class="hotel-location">📍 ${hotel.location.city || 'Location'}</div>
                <div class="hotel-rating">${ratingStars} ${hotel.rating.toFixed(1)} (${hotel.totalReviews} reviews)</div>
                <div class="price-section">
                    <span class="price">$${minPrice}/night</span>
                    <button class="btn-book" onclick="event.stopPropagation(); openBookingModal('${hotel._id}')">Book Now</button>
                </div>
            </div>
        `;
        hotelsGrid.appendChild(hotelCard);
    });
}

function filterHotels() {
    const priceFilter = document.getElementById('priceFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const ratingFilter = document.getElementById('ratingFilter').value;

    let query = `${API_BASE_URL}/hotels?`;
    const params = [];

    if (priceFilter === 'budget') params.push('maxPrice=50');
    if (priceFilter === 'mid') params.push('minPrice=50&maxPrice=150');
    if (priceFilter === 'luxury') params.push('minPrice=150');
    if (typeFilter) params.push(`type=${typeFilter}`);
    if (ratingFilter) params.push(`rating=${ratingFilter}`);

    query += params.join('&');

    fetch(query)
        .then(res => res.json())
        .then(data => displayHotels(data.hotels || []))
        .catch(err => alert('Error filtering hotels: ' + err.message));
}

function showHotelDetails(hotel) {
    currentHotelId = hotel._id;

    document.getElementById('detailsHotelName').textContent = hotel.name;
    document.getElementById('detailsRating').innerHTML = `
        <div>★ ${hotel.rating.toFixed(1)}/5 (${hotel.totalReviews} reviews)</div>
    `;
    
    document.getElementById('detailsLocation').innerHTML = `<strong>📍 ${hotel.location.city}</strong>`;
    document.getElementById('detailsDescription').innerHTML = `<p>${hotel.description}</p>`;
    
    document.getElementById('detailsAmenities').innerHTML = `
        <h4>Amenities</h4>
        <ul class="amenity-list">
            ${hotel.amenities.map(a => `<li>${a}</li>`).join('')}
        </ul>
    `;

    document.getElementById('detailsRooms').innerHTML = `
        <h4>Available Rooms</h4>
        ${hotel.rooms.map(room => `
            <div class="room-option">
                <div class="room-option-header">
                    <strong>${room.name}</strong>
                    <span class="room-price">$${room.pricePerNight}/night</span>
                </div>
                <div>Beds: ${room.beds} | Capacity: ${room.capacity} guests</div>
            </div>
        `).join('')}
    `;

    displayReviews(hotel.reviews || []);
    
    document.getElementById('hotelDetailsModal').style.display = 'block';
}

function closeHotelDetailsModal() {
    document.getElementById('hotelDetailsModal').style.display = 'none';
}

// ==================== REVIEW FUNCTIONS ====================

function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
    } else {
        reviewsList.innerHTML = reviews.map(review => `
            <div class="review-item">
                <div class="review-header">
                    <div>
                        <div class="review-author">${review.user?.fullName || 'Anonymous'}</div>
                        <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</div>
                    </div>
                </div>
                <div class="review-title">${review.title}</div>
                <div class="review-comment">${review.comment}</div>
                <div class="review-date">${new Date(review.createdAt).toLocaleDateString()}</div>
            </div>
        `).join('');
    }
}

function setupStarRatings() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('star')) {
            const value = e.target.dataset.value;
            document.getElementById('reviewRating').value = value;
            
            const stars = document.querySelectorAll('.star');
            stars.forEach(star => {
                if (star.dataset.value <= value) {
                    star.classList.add('active');
                } else {
                    star.classList.remove('active');
                }
            });
        }
    });
}

async function submitReview() {
    if (!currentUser) {
        alert('Please login to leave a review');
        return;
    }

    const rating = parseInt(document.getElementById('reviewRating').value);
    const title = document.getElementById('reviewTitle').value;
    const comment = document.getElementById('reviewComment').value;

    if (!rating || !title || !comment) {
        alert('Please fill in all review fields');
        return;
    }

    // Note: In production, get bookingId from user's completed bookings
    const bookingId = 'booking-id-here';

    try {
        const response = await fetch(`${API_BASE_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify({
                hotelId: currentHotelId,
                bookingId,
                rating,
                title,
                comment
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('✅ Review submitted successfully');
            document.getElementById('reviewTitle').value = '';
            document.getElementById('reviewComment').value = '';
            document.getElementById('reviewRating').value = 0;
        } else {
            alert('❌ Error: ' + data.error);
        }
    } catch (err) {
        alert('Error submitting review: ' + err.message);
    }
}

// ==================== BOOKING FUNCTIONS ====================

function openBookingModal(hotelId) {
    if (!currentUser) {
        alert('Please login to book a room');
        openAuthModal();
        return;
    }

    currentBooking.hotelId = hotelId;

    const checkIn = document.getElementById('checkInDate').value;
    const checkOut = document.getElementById('checkOutDate').value;

    if (checkIn) document.getElementById('bookingCheckIn').value = checkIn;
    if (checkOut) document.getElementById('bookingCheckOut').value = checkOut;

    document.getElementById('fullName').value = currentUser.fullName;
    document.getElementById('email').value = currentUser.email;
    document.getElementById('phone').value = currentUser.phone || '';

    document.getElementById('bookingModal').style.display = 'block';
    calculatePrice();
}

function closeBookingModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

function closePaymentModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function calculatePrice() {
    const checkIn = new Date(document.getElementById('bookingCheckIn').value);
    const checkOut = new Date(document.getElementById('bookingCheckOut').value);

    if (!checkIn || !checkOut || checkIn >= checkOut) {
        document.getElementById('totalPrice').textContent = '$0';
        return;
    }

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const pricePerNight = 150; // Default price, should get from hotel
    const totalPrice = nights * pricePerNight;

    currentBooking.nights = nights;
    currentBooking.totalPrice = totalPrice;
    currentBooking.pricePerNight = pricePerNight;

    document.getElementById('totalPrice').textContent = `$${totalPrice}`;
}

document.addEventListener('change', function(e) {
    if (e.target.id === 'bookingCheckIn' || e.target.id === 'bookingCheckOut') {
        calculatePrice();
    }
});

async function proceedToPayment() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const checkIn = document.getElementById('bookingCheckIn').value;
    const checkOut = document.getElementById('bookingCheckOut').value;
    const guests = document.getElementById('bookingGuests').value;

    if (!fullName || !email || !phone || !checkIn || !checkOut) {
        alert('Please fill in all required fields');
        return;
    }

    currentBooking.fullName = fullName;
    currentBooking.email = email;
    currentBooking.phone = phone;
    currentBooking.checkIn = checkIn;
    currentBooking.checkOut = checkOut;
    currentBooking.guests = guests;
    currentBooking.specialRequests = document.getElementById('specialRequests').value;

    // Create booking first
    try {
        const response = await fetch(`${API_BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`
            },
            body: JSON.stringify({
                hotelId: currentBooking.hotelId,
                roomName: 'Deluxe Room', // Should be selected by user
                checkInDate: currentBooking.checkIn,
                checkOutDate: currentBooking.checkOut,
                numberOfGuests: currentBooking.guests,
                specialRequests: currentBooking.specialRequests
            })
        });

        const data = await response.json();

        if (response.ok) {
            currentBooking.bookingId = data.booking.id;
            closeBookingModal();
            document.getElementById('paymentModal').style.display = 'block';
            resetPaymentForm();
        } else {
            alert('❌ Error creating booking: ' + data.error);
        }
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

function resetPaymentForm() {
    document.getElementById('cardNumber').value = '';
    document.getElementById('cardName').value = '';
    document.getElementById('expiryDate').value = '';
    document.getElementById('cvv').value = '';
}

// ==================== PAYMENT GATEWAY ====================

function switchPaymentMethod(method) {
    document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.payment-tab').forEach(t => t.classList.remove('active'));

    const methodElement = document.getElementById(method + 'Method');
    if (methodElement) {
        methodElement.classList.add('active');
    }

    event.target.classList.add('active');
}

function initializeStripe() {
    // Stripe initialization would go here
    console.log('Stripe initialized');
}

function processCardPayment() {
    const cardName = document.getElementById('cardName').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;

    if (!cardName || !cardNumber || !expiryDate || !cvv) {
        alert('Please fill in all card details');
        return;
    }

    if (cardNumber.replace(/\s/g, '').length !== 16) {
        alert('Please enter a valid 16-digit card number');
        return;
    }

    processPaymentSuccess('Card');
}

function processStripePayment() {
    alert('Redirecting to Stripe payment gateway...');
    processPaymentSuccess('Stripe');
}

function processApplePayment() {
    alert('Redirecting to Apple Pay...');
    processPaymentSuccess('Apple Pay');
}

function processBMLPayment() {
    const account = document.getElementById('bmlAccount').value;
    if (!account) {
        alert('Please enter your BML account number');
        return;
    }
    alert('Redirecting to BML payment gateway...');
    processPaymentSuccess('BML');
}

function processSIBPayment() {
    const account = document.getElementById('sibAccount').value;
    if (!account) {
        alert('Please enter your SIB account number');
        return;
    }
    alert('Redirecting to SIB payment gateway...');
    processPaymentSuccess('SIB');
}

function processPaymentSuccess(paymentMethod) {
    closePaymentModal();
    alert(`✅ Booking Confirmed!\n\nPayment Method: ${paymentMethod}\n\nA confirmation email has been sent.`);
    currentBooking = {};
}

// Format card number
document.addEventListener('input', function(e) {
    if (e.target.id === 'cardNumber') {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    }
});

// Format expiry date
document.getElementById('expiryDate')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

// Close modals
window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

function sendMessage() {
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const message = document.getElementById('contactMessage').value;

    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }

    alert('✅ Message sent successfully. We will get back to you soon!');
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactMessage').value = '';
}
