function format(string) {
	return string
		.replace(/[\r\n？?，,！!。.]/gm, "")
		.trim()
		.toLowerCase();
}

async function parseData() {
	const charRes = await fetch("characters.txt").then((res) => res.text());
	const sentenceRes = await fetch("sentencepatterns.txt").then((res) => res.text());
	const polyRes = await fetch("polyatomic.txt").then((res) => res.text());
	const idiomsRes = await fetch("idioms.json").then((res) => res.json());

	const charactersRaw = charRes.split("\n");
	const sentenceRaw = sentenceRes.split("\n");
	const polyRaw = polyRes.split("\n");

	// Parse Characters
	const characterList = [];
	for (let i = 0; i < charactersRaw.length; i = i + 2) {
		const [character, definition] = charactersRaw[i].split(" - ");
		if (character.indexOf("/") > -1) {
			const [traditional, simplified] = character.split("/");
			characterList.push([[format(simplified), format(traditional)], definition]);
		} else {
			characterList.push([[format(character)], definition]);
		}
	}

	// Parse Sentence Patterns
	const sentencePatternsList = [];
	for (const line of sentenceRaw) {
		if (line.indexOf("-") == -1) continue;
		const [sentence, answer] = line.split(" - ");

		if (answer.indexOf("/") > -1) {
			const [traditional, simplified] = answer.split("/");
			sentencePatternsList.push([[format(simplified), format(traditional)], sentence]);
		} else {
			sentencePatternsList.push([[format(answer)], sentence]);
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
				.replace(/[ǖǘǚǜü]/g, "v")
				.replace(/[\r\n]/gm, "");

			if (tone1.test(char)) newCharacter += "1";
			if (tone2.test(char)) newCharacter += "2";
			if (tone3.test(char)) newCharacter += "3";
			if (tone4.test(char)) newCharacter += "4";

			completePinyin += newCharacter;
		}

		pinyinArray.push([[format(completePinyin)], characterList[count][0].join("/")]);
		count += 1;
	}

	const polyAtomic = [];
	for (const line of polyRaw) {
		let [name, formula] = line.split(" - ");
		polyAtomic.push([[format(name)], formula]);
		polyAtomic.push([[format(formula)], name]);
	}

	const idioms = [];
	for (const line of idiomsRes) {
		idioms.push([[format(line.answer)], line.question]);

		if (line.question.includes("-")) {
			const [character, _] = line.question.split(" - ");
			idioms.push([[format(line.pinyin)], character]);
		} else {

			let completeCharacter = "";
			if (line.question.includes("/")) {
				completeCharacter = line.question.split("/")[1] + line.answer;
			} else {
				completeCharacter = line.question + line.answer;
			}
			
			idioms.push([[format(line.pinyin)], completeCharacter]);
		}
	}

	return [characterList, sentencePatternsList, pinyinArray, polyAtomic, idioms];
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
	const cleanInput = format(input.value);

	const answers = data[index][0];
	if (answers.includes(cleanInput)) {
		if (selectElem.value == "Chinese Characters (汉字)") {
			const pinyinIndex = characters.indexOf(data[index]);
			alert(`Correct! The answer was ${data[index][0][0]} (${pinyinArray[pinyinIndex][0]}).`);
		} else {
			alert(`Correct! The answer was ${data[index][0][0]}.`);
		}

		if (!wrong) data.splice(index, 1);

		index = showNewDefinition();
		input.value = "";
		input.focus();
		wrong = false;
	} else {
		if (selectElem.value == "Chinese Characters (汉字)") {
			const pinyinIndex = characters.indexOf(data[index]);
			alert(`Wrong! The correct answer was ${data[index][0][0]} (${pinyinArray[pinyinIndex][0]}).`);
		} else {
			alert(`Wrong! The correct answer was ${data[index][0][0]}.`);
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
	} else if (selectElem.value == "Chinese Characters (汉字)") {
		type = "chinese character";
		data = [...characters];

		index = showNewDefinition();
	} else if (selectElem.value == "Polyatomic Ions") {
		type = "name/formula";
		data = [...polyAtomic];

		index = showNewDefinition();
	} else if (selectElem.value == "中文三成语复习") {
		type = "answer";
		data = [...idioms];

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
	[characters, sentencePatterns, pinyinArray, polyAtomic, idioms] = await parseData();
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
