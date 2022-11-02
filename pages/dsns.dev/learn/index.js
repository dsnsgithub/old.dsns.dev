async function parseData() {
	const charRes = await fetch("characters.txt").then((res) => res.text());
	const sentenceRes = await fetch("sentencepatterns.txt").then((res) => res.text());

	const charactersRaw = charRes.split("\n");
	const sentenceRaw = sentenceRes.split("\n");

	// Parse Characters
	const characters = [];
	for (let i = 0; i < charactersRaw.length; i = i + 2) {
		let character = charactersRaw[i];
		let [char, def] = character.split(" - ");
		if (char.indexOf("/") > -1) {
			let [traditional, simple] = char.split("/");
			characters.push([simple, def]);
		} else {
			characters.push([char, def]);
		}
	}

	// Parse Sentence Patterns
	const sentencePatterns = [];
	for (const line of sentenceRaw) {
		if (line.indexOf("-") == -1) continue;

		let [sentence, answer] = line.split(" - ");

		if (answer.indexOf("/") > -1) {
			let [traditional, simplified] = answer.split("/");
			sentencePatterns.push([simplified, sentence]);
		} else {
			sentencePatterns.push([answer, sentence]);
		}
	}

	// Parse Pinyin
	const pinyinArray = [];
	let count = 0;
	for (let i = 1; i < charactersRaw.length; i = i + 2) {
		const pinyin = charactersRaw[i].split(" ");

		let completePinyin = "";
		for (const char of pinyin) {
			const tone1 = /[āēīōūǖ]/;
			const tone2 = /[áéíóúǘ]/;
			const tone3 = /[ǎěǐǒǔǚ]/;
			const tone4 = /[àèìòùǜ]/;

			let newCharacter = char
				.replace(/[āáǎà]/g, "a")
				.replace(/[ēéěè]/g, "e")
				.replace(/[īíǐì]/g, "i")
				.replace(/[ōóǒò]/g, "o")
				.replace(/[ūúǔù]/g, "u")
				.replace(/[ǖǘǚǜü]/g, "v");

			if (tone1.test(char)) newCharacter += "1";
			if (tone2.test(char)) newCharacter += "2";
			if (tone3.test(char)) newCharacter += "3";
			if (tone4.test(char)) newCharacter += "4";

			completePinyin += newCharacter;
		}

		pinyinArray.push([completePinyin, characters[count][0]]);
		count += 1;
	}

	return [characters, sentencePatterns, pinyinArray];
}

function showNewDefinition() {
	if (data.length == 0) {
		alert("You have finished the game!");
		return;
	}
	const randomIndex = Math.floor(Math.random() * data.length);
	characterElem.innerHTML = `Type the ${type} for <b>${data[randomIndex][1]}</b>`;
	return randomIndex;
}

function checkAnswer() {
	const input = document.getElementById("chinese");

	if (input.value == data[index][0]) {
		if (selectElem.value == "Chinese Characters (汉字)") {
			const pinyinIndex = characters.indexOf(data[index]);
			alert(`Correct! The answer was ${data[index][0]} (${pinyinArray[pinyinIndex][0]}).`);
		} else {
			alert(`Correct! The answer was ${data[index][0]}.`);
		}

		if (!wrong) data.splice(index, 1);

		index = showNewDefinition();
		input.value = "";
		input.focus();
		wrong = false;
	} else {
		if (selectElem.value == "Chinese Characters (汉字)") {
			const pinyinIndex = characters.indexOf(data[index]);
			alert(`Wrong! The correct answer was ${data[index][0]} (${pinyinArray[pinyinIndex][0]}).`);
		} else {
			alert(`Wrong! The correct answer was ${data[index][0]}.`);
		}

		input.value = "";
		input.focus();
		wrong = true;
	}
}

function selectOption() {
	if (selectElem.value == "Pinyin") {
		data = [...pinyinArray];
		type = "pinyin";

		index = showNewDefinition();
	} else if (selectElem.value == "Sentence Patterns") {
		data = [...sentencePatterns];
		type = "chinese character(s)";

		index = showNewDefinition();
	} else {
		type = "chinese character";
		data = [...characters];

		index = showNewDefinition();
	}
}

const characterElem = document.getElementById("showCharacter");
const selectElem = document.getElementById("select");
const submitButton = document.getElementById("submit");

let wrong = false;
let data = [];
let type = "chinese character";
let index = 0;
let characters, sentencePatterns, pinyinArray;

async function run() {
	[characters, sentencePatterns, pinyinArray] = await parseData();
	data = [...characters];

	index = showNewDefinition();
	selectElem.addEventListener("change", selectOption);
	submitButton.addEventListener("click", checkAnswer);

	document.onkeyup = function (event) {
		if (event.key == "Enter") {
			event.preventDefault();
			checkAnswer();
		}
	};
}

run();