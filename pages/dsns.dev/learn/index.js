const raw = `牆/墙 - wall
qiáng
著/着 - indicates continuous or stationary status
zhe
照片 - photograph, picture
zhào piàn
服裝/服装 - clothes
fú zhuāng
舞台 - performance stage
wǔ tái
擺/摆 - to place, put
bǎi
各種/各种 - various, all kinds of 
gè zhǒng
樂器/乐器 - musical instrument
yùe qì
演員/演员 - actor or actress, performer
yǎn yuán
表演 - performance, to perform
biǎo yǎn
樂師/乐师 - musician
yùe shī
打 - to play (the drum), to hit
dǎ
鼓 - drum
gǔ
拉 - to play a stringed musical instrument, to pull
lā
胡琴 - two-stringed bowed instruments
hú qín
彈奏/弹奏 - to play, pluck, strike
tán zòu
自己 - oneself
zì jǐ
齣/出 - MW for Chinese theater performance
chū
戲/戏 - play, drama
xì
畫/画 - to paint, draw a painting
huà
臉/脸 - face
liǎn
拿 - to hold, take
ná
把 - MW for a utensil with a handle
bǎ
刀 - knife
dāo
神氣/神气 - energetic, high-spirited, proud
shén qì
座位 - seat
zuò wèi
滿/满 - full
mǎn
觀眾/观众 - audience
guān zhòng
站 - to stand
zhàn
一言為定/一言为定 - it's a deal
yì yán wéi dìng`.split("\n");


//! Parse Characters ------------------------------------------------------
let characters = [];
for (let i = 0; i < raw.length; i = i + 2) {
	let character = raw[i];
	let [char, def] = character.split(" - ");
	if (char.indexOf("/") > 0) {
		let [traditional, simple] = char.split("/");
		characters.push([simple, def]);
	} else {
		characters.push([char, def]);
	}
}


//! Parse Pinyin ------------------------------------------------------
let pinyin = [];
let count = 0;
for (let i = 1; i < raw.length; i = i + 2) {
	let cPinyin = raw[i].split(" ");

	let completePinyin = "";
	for (let char of cPinyin) {
		let tone1 = Math.max(char.indexOf("ā"), char.indexOf("ē"), char.indexOf("ī"), char.indexOf("ō"), char.indexOf("ū"));
		let tone2 = Math.max(char.indexOf("á"), char.indexOf("é"), char.indexOf("í"), char.indexOf("ó"), char.indexOf("ú"));
		let tone3 = Math.max(char.indexOf("ǎ"), char.indexOf("ě"), char.indexOf("ǐ"), char.indexOf("ǒ"), char.indexOf("ǔ"));
		let tone4 = Math.max(char.indexOf("à"), char.indexOf("è"), char.indexOf("ì"), char.indexOf("ò"), char.indexOf("ù"));

		char = char
			.replace(/[āáǎà]/g, "a")
			.replace(/[ēéěè]/g, "e")
			.replace(/[īíǐì]/g, "i")
			.replace(/[ōóǒò]/g, "o")
			.replace(/[ūúǔù]/g, "u");

		if (tone1 > 0) {
			char = char + "1";
		} else if (tone2 > 0) {
			char = char + "2";
		} else if (tone3 > 0) {
			char = char + "3";
		} else if (tone4 > 0) {
			char = char + "4";
		}

		completePinyin = completePinyin + char;
	}

	pinyin.push([completePinyin, characters[count][0]]);
	count = count + 1;
}


//! Sentence Patterns ----------------------------------------------------------------------------------

const sentenceRaw = `______ 上是誰的照片?
______ 上是谁的照片？-牆/墙
文中正看 ______ 他的女朋友。
文中正看 ______ 他的女朋友。-著/着
他送我一張他的 ______，可是我不想要。
他送我一张他的 ______，可是我不想要。-照片
京劇演員的 ______ 真好看啊!
京剧演员的 ______ 真好看啊！-服裝/服装
______ 上有很多樂器，還有一些人在跳舞。
______ 上有很多乐器，还有一些人在跳舞。-舞台
我的書 ______ 在桌上，你的呢?
我的书 ______ 在桌上，你的呢？-擺/摆
這家書店很大，有 ______ 語言的書。
这家书店很大，有 ______ 语言的书。-各種/各种
"這是什麼 ______?" "是胡琴。"
"这是什么 ______?" " 是胡琴。"-樂器/乐器
大家都很喜歡這位女 ______，所以都去看她的電影。
大家都很喜欢这位女 _______，所以都去看她的电影。-演員/演员
我媽媽不喜歡看我在舞台上 ______。
我妈妈不喜欢看我在舞台上 ______。-表演
這位 ______ 正坐著拉胡琴。
这位 ______ 正做着拉胡琴。-樂師/乐师
別 ______ 鼓了，爸爸要睡覺。
别 ______ 鼓了，爸爸要睡觉。-打
你聽，他打 ______ 打得真好啊!
你听，他打 ______ 打得真好啊！-鼓
爸爸教我怎麼 ______ 胡琴。
爸爸叫我怎么 ______ 胡琴。-拉
妹妹會 ______ 很多樂器，比如胡琴，中國鼓等等。
妹妹会 ______ 很多乐器，比如胡琴，中国鼓等等。-彈奏/弹奏
______ 是一種中國的樂器，你去看京劇的時候常常會看到。
______ 是一种中国的乐器，你去看京剧的时候常常会看到。-胡琴
今天姐姐生病了，我得 ______ 一個人去上學。
今天姐姐生病了，我得 ______ 一个人去上学。-自己
我看過那 ______ 戲了，還不錯。
我看过那 ______ 戏了，还不错。-齣/出
咱們一起去看 ______ 吧，我請客。
咱们一起去看 ______ 吧，我请客。-戲/戏
老師喜歡貓，我 ______ 一隻送給她吧。
老师喜欢猫，我 ______ 一只送给她吧。-畫/画
"你的 ______ 怎麼了? 誰打你了?"
"你的 ______ 怎么了？谁打你了？"-臉/脸
"這是誰的衣服?" "小美的，她要我幫她 ______ 著。"
"这是谁的衣服？""小美的，她要我帮她 ______ 着，"-拿
她的手裡拿著一 ______ 刀。
她的手里拿着一 ______ 刀。-把
小心!她的手裡有一把 ______。
小心！她的手里有一把 ______。-刀
她穿著新衣服，看來很 ______。
她穿着新衣服，看来很 ______。-神氣/神气
教室裡只有兩個 ______，可是有三個學生。
教室里有两个 ______， 可是有三个学生。-座位
快喝! 這杯可樂太 ______ 了!
快喝！这杯可乐太 ______ 了！-滿/满
______ 不喜歡看她的戲，都走了。
______ 不喜欢看她的戏，都走了。-觀眾/观众
上課的時候別 ______ 著，坐著聽老師說。
上课的时候别 ______ 着，坐着听老师说。-站
"明天我們一起去圖書館吧! "
"______，幾點?"
"明天我们一起去图书馆吧！""______， 几点？"-一言為定/一言为定`.split("\n");


let sentencePatterns = []
for (const line of sentenceRaw) {
	if (line.indexOf("-") == -1) continue;

	console.log(line);
	let [sentence, answer] = line.split("-");

	if (answer.indexOf("/") > -1) {
		let [traditional, simplified] = answer.split("/");
		sentencePatterns.push([simplified, sentence]);
	} else {
		sentencePatterns.push([answer, sentence]);
	}
}

console.log(sentencePatterns);

// ! MAIN ----------------------------------------------------------------------------------------------
const showCharacter = document.getElementById("showCharacter");

function showNewDefinition() {
	if (data.length == 0) {
		alert("You have finished the game!");
		return;
	}
	const randomIndex = Math.floor(Math.random() * data.length);
	showCharacter.innerHTML = `Type the ${type} for <b>${data[randomIndex][1]}</b>`;
	return randomIndex;
}

let wrong = false;

function run() {
	const input = document.getElementById("chinese");

	if (input.value == data[index][0]) {

		if (type == "Chinese Characters (汉字)") {
			const pinyinIndex = characters.indexOf(data[index]);
			alert(`Correct! The answer was ${data[index][0]} (${pinyin[pinyinIndex][0]}).`);
		} else {
			alert(`Correct! The answer was ${data[index][0]}.`);
		}

		if (!wrong) data.splice(index, 1);

		index = showNewDefinition();
		input.value = "";
		wrong = false;
	} else {

		if (type == "Chinese Characters (汉字)") {
			const pinyinIndex = characters.indexOf(data[index]);
			alert(`Wrong! The correct answer was ${data[index][0]} (${pinyin[pinyinIndex][0]}).`);
		} else {
			alert(`Wrong! The correct answer was ${data[index][0]}.`);
		}
		
		input.value = "";
		wrong = true;
	}
}

const submitButton = document.getElementById("submit");
submitButton.addEventListener("click", run);

document.onkeyup = function (event) {
	if (event.key == "Enter") {
		event.preventDefault();
		run();
	}
};

//! CONFIG ----------------------------------------------------------------------------------------------

let data = [...characters];
let type = "chinese character";

//? Initiate
let index = showNewDefinition();

const selectElem = document.getElementById("select");

selectElem.addEventListener("change", function () {
	if (selectElem.value == "Pinyin") {
		data = [...pinyin];
		type = "pinyin";

		index = showNewDefinition();
	} else if (selectElem.value == "Sentence Patterns") {
		data = [...sentencePatterns];
		type = "chinese character(s)";

		index = showNewDefinition();
	}
	else {
		type = "chinese character";
		data = [...characters];

		index = showNewDefinition();
	}
});
