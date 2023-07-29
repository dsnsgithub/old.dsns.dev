const emailField = document.getElementById("email");
const passwordField = document.getElementById("password");
const ccnField = document.getElementById("CCN");
const cvvField = document.getElementById("CVV");
const addressField = document.getElementById("address");
const zipCodeField = document.getElementById("zipCode");
const nameField = document.getElementById("fullName");

// TODO: replace all mentions of login with signup

async function submit() {
	const request = {
		email: emailField.value,
		password: passwordField.value,
		CCN: ccnField.value,
		CVV: cvvField.value,
		address: addressField.value,
		zipCode: zipCodeField.value,
		fullName: nameField.value
	};

	const response = await fetch("/api/signup", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify(request)
	});

	alert(await response.text());

	if (response.status === 200) {
		window.location.href = "/finalize/";
	}
}

async function switchBox() {
	const signupField = document.getElementById("signup-field");
	const loginBox = document.getElementById("loginBox");

	if (loginBox.checked) {
		signupField.style.display = "block";
	} else {
		signupField.style.display = "none";
	}
}


const accountInfo = document.getElementById("accountInfo");
async function checkAccountInfo() {
	const res = await fetch("/api/accountInfo")

	if (res.status != 200) {
		accountInfo.innerHTML = "You are currently not signed in.";
	} else {
		const response = await res.json();
		accountInfo.innerText = "You are already signed in under: " + response["email"];
	}
}

checkAccountInfo();
