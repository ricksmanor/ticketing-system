function validateForm() {
    const event = document.getElementById('event').value;
    const date = document.getElementById('date').value;
    const tickets = document.getElementById('tickets').value;
    const feedback = document.getElementById('feedback');
    const today = new Date().toISOString().split('T')[0];

    // Clear previous feedback
    feedback.textContent = '';

    // Validate form fields
    if (!event || !date || !tickets) {
        feedback.textContent = 'Please fill in all fields.';
        feedback.style.color = 'red';
        feedback.classList.add('fade-in');
        return false; // Prevent form submission
    }

    // Validate date
    if (date < today) {
        feedback.textContent = 'Please select a valid future date.';
        feedback.style.color = 'red';
        feedback.classList.add('fade-in');
        return false; // Prevent form submission
    }

    feedback.textContent = 'Booking successful! Thank you for your purchase.';
    feedback.style.color = 'green';
    feedback.classList.add('fade-in');
    return true; // Allow form submission
}

function updateTotalPrice() {
    const tickets = document.getElementById('tickets').value;
    const pricePerTicket = 20; // Example price per ticket
    const totalPrice = tickets * pricePerTicket;
    document.getElementById('totalPrice').textContent = `Total Price: $${totalPrice}`;
}