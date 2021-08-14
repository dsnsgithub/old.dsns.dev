require("dotenv").config();

//? Requirements ----------------------------------------------------------------------------------
const { HypixelAPI } = require("hypixel-api-v2"); //* npm install hypixel-api-v2
const hypixel = new HypixelAPI("745289c9-323e-4225-962b-cb653d62cf0c", 2);

async function getDailyReward(email, IGN) {
	const playerData = await hypixel.player(IGN);

    let lastDate = new Date(playerData["lastClaimedReward"]);
    lastDate.setHours(16, 0, 0, 0);
	let resetDate = new Date();
	resetDate.setHours(21, 0, 0, 0);

	if (resetDate < lastDate) {
		resetDate.setHours(resetDate.getHours() + 24);
	}

	let dateString = lastDate.toLocaleDateString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true
	});

	if (resetDate - lastDate <= 1000 * 60 * 60 * 7) {
        const SibApiV3Sdk = require("sib-api-v3-sdk");
		const defaultClient = SibApiV3Sdk.ApiClient.instance;

		let apiKey = defaultClient.authentications["api-key"];
		apiKey.apiKey = "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";

		const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

		let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        
		sendSmtpEmail.subject = "Hypixel Level Difference";
        sendSmtpEmail.htmlContent = `<html><body><h1>You need to collect your daily reward!</h1><br><h1>Last Collected Date: ${dateString}</h1></body></html>`;
        sendSmtpEmail.textContent = `You need to collect your daily reward!\nLast Collected Date:\n${dateString}`
		sendSmtpEmail.sender = { name: "DSNS", email: "dsns@dsns.dev" };
		sendSmtpEmail.to = [{ email: email, name: "DSNS Phone" }];
		sendSmtpEmail.replyTo = { email: "dsns@dsns.dev", name: "DSNS" };

		apiInstance.sendTransacEmail(sendSmtpEmail).then(
			function (data) {
                console.log("Sent Text Message.");
                console.log(data);
			},
			function (error) {
				console.error(error);
			}
		);
	}


}

getDailyReward("9259671744@vzwpix.com", "557bafa10aad40bbb67207a9cefa8220");


