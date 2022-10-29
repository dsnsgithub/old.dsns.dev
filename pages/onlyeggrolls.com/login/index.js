const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");

async function submit() {
	const request = {
		email: emailField.value,
		password: passwordField.value
	};

	const response = await fetch("/api/login", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify(request)
	});

	alert(await response.text());
}
