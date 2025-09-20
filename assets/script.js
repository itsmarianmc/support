document.addEventListener('DOMContentLoaded', function() {
	const urlParams = new URLSearchParams(window.location.search);

	document.getElementById('utm_origin').value = urlParams.get('utm_origin') || 'N/A';
	document.getElementById('utm_page').value = urlParams.get('utm_page') || 'N/A';
	document.getElementById('page_pos').value = urlParams.get('page_pos') || 'N/A';

	const contactForm = document.getElementById('contactForm');
	const formStatus = document.getElementById('formStatus');

	contactForm.addEventListener('submit', async function(e) {
		e.preventDefault();

		const formData = {
			name: document.getElementById('name').value,
			title: document.getElementById('title').value,
			email: document.getElementById('email').value,
			message: document.getElementById('message').value,
			utm_origin: document.getElementById('utm_origin').value,
			utm_page: document.getElementById('utm_page').value,
			page_pos: document.getElementById('page_pos').value
		};

		if (!formData.name || !formData.email || !formData.message) {
			showStatus('Please fill in all fields.', 'error');
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			showStatus('Please enter a valid email address.', 'error');
			return;
		}

		try {
			const response = await fetch('https://itsmarianmc-github.vercel.app/api/support-contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				showStatus('Message sent successfully! I will reach out back to you soon.', 'success');
				contactForm.reset();
			} else {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Serverfehler');
			}
		} catch (error) {
			console.error('Error:', error);
			showStatus('Error sending the message. Please try again later.', 'error');
		}
	});

	function showStatus(message, type) {
		formStatus.textContent = message;
		formStatus.className = 'form-status ' + type;

		setTimeout(() => {
			formStatus.textContent = '';
			formStatus.className = 'form-status';
		}, 5000);
	}
});
