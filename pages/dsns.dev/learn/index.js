function format(string) {
	return string
		.replace(/[\r\n？?，,！!。.]/gm, "")
		.trim()
		.toLowerCase();
}

async function parseLesson(lesson) {
	const charactersRaw = await fetch(`${lesson}/characters.txt`)
		.then((res) => res.text())
		.then((data) => data.split("\n"));
	const sentenceRaw = await fetch(`${lesson}/sentencepatterns.txt`)
		.then((res) => res.text())
		.then((data) => data.split("\n"));

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

		pinyinArray.push([[format(completePinyin)], characterList[count][0].join("/"), "pinyin"]);
		count += 1;
	}

	return [characterList, sentencePatternsList, pinyinArray];
}

async function parseData() {
	const polyRaw = await fetch("polyatomic.txt")
		.then((res) => res.text())
		.then((data) => data.split("\n"));
	const idiomsRaw = await fetch("idioms.json").then((res) => res.json());

	const polyAtomic = [];
	for (const line of polyRaw) {
		let [name, formula] = line.split(" - ");
		polyAtomic.push([[format(name)], formula, "name"]);
		polyAtomic.push([[format(formula)], name], "formula");
	}

	const idioms = [];
	for (const line of idiomsRaw) {
		idioms.push([[format(line.answer)], line.question, "answer"]);

		if (line.question.includes("|")) {
			const [character, _] = line.question.split(" | ");
			idioms.push([[format(line.pinyin)], character, "pinyin"]);
		}
	}

	return [polyAtomic, idioms];
}

let lastQuestion = "";
function showNewDefinition() {
	if (data.length == 0) {
		alert("You have finished the game!");
		return;
	}

	let randomIndex = 0;

	do {
		randomIndex = Math.floor(Math.random() * data.length);
	} while (data[randomIndex] == lastQuestion && data.length > 1);

	type = data[randomIndex][2] || type;
	characterElem.innerHTML = `Type the ${type} for <b>${data[randomIndex][1]}</b>`;

	lastQuestion = data[randomIndex];
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
		input.placeholder = "汉字";
		input.style.border = "";
		input.style.borderStyle = "";
		wrong = false;
	} else {
		if (selectElem.value == "Chinese Characters (汉字)") {
			const pinyinIndex = characters.indexOf(data[index]);
			alert(`Wrong! The correct answer was ${data[index][0][0]} (${pinyinArray[pinyinIndex][0]}).`);
		} else {
			alert(`Wrong! The correct answer was ${data[index][0][0]}.`);
		}

		input.value = "";
		input.placeholder = data[index][0][0];
		input.style.border = "#ff786e";
		input.style.borderStyle = "solid";
		wrong = true;
	}
}

function selectOption() {
	if (selectElem.value == "Pinyin") {
		data = [...pinyinArray];
		type = "pinyin";
		lessonSelect.parentElement.style.display = "inline-block";

		index = showNewDefinition();
	} else if (selectElem.value == "Sentence Patterns") {
		data = [...sentencePatterns];
		type = "chinese character(s)";
		lessonSelect.parentElement.style.display = "inline-block";

		index = showNewDefinition();
	} else if (selectElem.value == "Chinese Characters (汉字)") {
		type = "chinese character";
		data = [...characters];
		lessonSelect.parentElement.style.display = "inline-block";

		index = showNewDefinition();
	} else if (selectElem.value == "Polyatomic Ions") {
		type = "name/formula";
		data = [...polyAtomic];
		lessonSelect.parentElement.style.display = "none";

		index = showNewDefinition();
	} else if (selectElem.value == "中文三成语复习") {
		type = "answer";
		data = [...idioms];
		lessonSelect.parentElement.style.display = "none";

		index = showNewDefinition();
	}
}

const characterElem = document.getElementById("showCharacter");
const selectElem = document.getElementById("select");
const submitButton = document.getElementById("submit");
const lessonSelect = document.getElementById("lesson");

let wrong = false;
let data = [];
let type = "chinese character";
let index = 0;

let currentLesson = "L10";
lessonSelect.value = currentLesson;

let characters, sentencePatterns, pinyinArray;
async function run() {
	[characters, sentencePatterns, pinyinArray] = await parseLesson(currentLesson);
	[polyAtomic, idioms] = await parseData();
	data = [...characters];

	index = showNewDefinition();
	selectElem.addEventListener("change", selectOption);
	submitButton.addEventListener("click", checkAnswer);
	lessonSelect.addEventListener("change", async () => {
		[characters, sentencePatterns, pinyinArray] = await parseLesson(lessonSelect.value);
		selectOption();
	});

	document.onkeyup = function (event) {
		if (event.key == "Enter") {
			event.preventDefault();
			checkAnswer();
		}
	};
}

const pencilToggle = document.getElementById("pencil");
const pencilArea = document.getElementById("pencilArea");
pencilToggle.addEventListener("click", () => {
	if (pencilArea.style.display == "none") {
		pencilArea.style.display = "block";
		pencilToggle.style.backgroundColor = "lightgreen";
	} else {
		pencilArea.style.display = "none";
		pencilToggle.style.backgroundColor = "lightcoral";
	}
});

run();
