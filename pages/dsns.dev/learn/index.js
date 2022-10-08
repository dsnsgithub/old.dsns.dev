const raw = `往 - toward (casual)
wǎng
各位 - everyone (announcements)
gè wèi
旅客 - traveler, passenger
lǚkè
降落 - to land, descend
jiàng luò
安全帶/安全带 - seat belt, safety belt
ān quán dài
繫上/系上 - to tie, fasten, buckle up
xì shàng
計算機/计算机 - computer
jì suàn jī
電子/电子 - electronics
diàn zǐ
用品 - product
yòng pǐn
搭乘 - to take (a means of transportation)
dā chéng
航空 - aviation, airline
háng kōng
出租 - to rent (to someone else)
chū zū
旅館/旅馆 - hotel, hostel
lǚ guǎn
路人 - passerby
lù rén
棟/栋 - MW for buildings
dòng
交叉口 - intersection (crossroad)
jiāo chā kǒu
左 - left side
zuǒ
拐 - to turn (casual)
guǎi
一直 - straight
yì zhí
路口 - block, intersection, or a fork in a road
lù kǒu
司機/司机 - driver
sī jī
假日 - holiday
jià rì
公里 - kilometer
gōng lǐ
後車箱/后车箱 - trunk (of a car)
hòu chē xiāng
發展/发展 - to develop, development
fā zhǎn
變化/变化 - to change, change (Noun/Verb)
biàn huà
本來/本来 - originally
běn lái
農田/农田 - farmland, cropland
nóng tián
變成/变成 - to become
biàn chéng
馬路/马路 - road, avenue, street
mǎ lù
喔 - used to indicate realization
ō
公尺 - meter (MW of length)
gōng chǐ
紅綠燈/红绿灯 - traffic light
hóng lǜ dēng
向 - toward (formal)
xiàng
右 - right side
yòu
轉/转 - to turn (formal)
zhuǎn
小吃店 - snack bar
xiǎo chī diàn
彎兒/弯儿 - turn, detour
wār
車費/车费 - cab fare
chē fèi
找 - to seek, look for, to give (change)
zhǎo`.split("\n");


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
		let tone1 = Math.max(char.indexOf("ā"), char.indexOf("ē"), char.indexOf("ī"), char.indexOf("ō"), char.indexOf("ū"), char.indexOf("ǖ"));
		let tone2 = Math.max(char.indexOf("á"), char.indexOf("é"), char.indexOf("í"), char.indexOf("ó"), char.indexOf("ú"), char.indexOf("ǘ"));
		let tone3 = Math.max(char.indexOf("ǎ"), char.indexOf("ě"), char.indexOf("ǐ"), char.indexOf("ǒ"), char.indexOf("ǔ"), char.indexOf("ǚ"));
		let tone4 = Math.max(char.indexOf("à"), char.indexOf("è"), char.indexOf("ì"), char.indexOf("ò"), char.indexOf("ù"), char.indexOf("ǜ"));

		char = char
			.replace(/[āáǎà]/g, "a")
			.replace(/[ēéěè]/g, "e")
			.replace(/[īíǐì]/g, "i")
			.replace(/[ōóǒò]/g, "o")
			.replace(/[ūúǔù]/g, "u")
			.replace(/[ǖǘǚǜü]/g, "v");

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

const sentenceRaw = `從這兒 ______ 前走，就會看到我家。
从这儿 ______ 前走，就会看到我家。 - 往
______ 觀眾，請坐。
______ 观众，请坐。 - 各位
這位 ______，請把你的行李拿過來。
这位 ______，请把你的行李拿过来。 - 旅客
飛機快要 ______ 了，請不要用手機。
飛机快要 ______ 了，请不要用手机。 - 降落
坐車的時候，你得把 ______ 繫上。
坐车的时候，你得把 ______ 系上。 - 安全帶/安全带
你一定要把安全帶 ______ 才能開車。
你一定要把安全带 ______ 才能开车。 - 繫上/系上
你的桌上有一個 ______，對嗎?
你的桌上有一个 ______，对吗? - 計算機/计算机
飛機降落的時候不要用 ______ 用品。
飞机降落的时候不要用 ______ 用品。 - 電子/电子
考試的時候你不可以用電子 ______。
考试的时候你不可以用电子 ______。 - 用品
我要 ______ 明天上午的飛機去中國。
我要 ______ 明天上午的飞机去中国。 - 搭乘
我聽說這家 ______ 公司不錯，下次去中國的時候我們試試看吧!
我听说这家 ______ 公司不错，下次去中国的时候我们试试看吧! - 航空
你們有房間要 ______ 嗎?
你们有房间要 ______ 吗? - 出租
我在中國的時候不喜歡住 ______，我喜歡住在女朋友家。
我在中国的时候不喜欢住 ______，我喜欢住在女朋友家。 - 旅館/旅馆
紅綠燈旁邊有幾位 ______，我們去問問圖書館在哪兒吧!
红绿灯旁边有几位 ______，我们去问问图书馆在哪儿吧! - 路人
這 ______ 大樓真高!
这 ______ 大楼真高! - 棟/栋
你先往前走，走到 ______ 就會看見紅綠燈。
你先往前走，走到 ______ 就会看見红绿灯。 - 交叉口
從這兒往前走，往右轉是圖書館，往 ______ 轉是學校。
从这儿往前走，往右转是图书馆，往 ______ 转是学校。 - 左
我家離這兒不遠，往前 ______ 一個彎兒就到了。
我家离这儿不远，往前 ______ 一个弯儿就到了。 - 拐
從這兒往前 ______ 走，你會先看到書店，再看到中國飯館。
从这儿往前 ______ 走，你会先看到书店，再看到中国饭馆。 - 一直
他站在 ______ 等媽媽來接他。
他站在 ______ 等妈妈来接他。 - 路口
______，請你開快一點兒。
______，请你开快一点儿。 - 司機/司机
______ 的時候，我沒有時間出去玩。
______ 的时候，我没有时间出去玩。 - 假日
從美國到中國有幾 ______?
从美国到中国有几 ______? - 公里
我把行李放在 ______ 裡。
我把行李放在 ______ 里。 - 後車箱/后车箱
上海 ______ 得很快，現在到處都是新的大樓。
上海 ______ 得很快，現在到处都是新的大楼。 - 發展/发展
我已經十年沒有看到他了，他看來 ______ 不多。
我已经十年没有看到他了，他看来 ______ 不多。 - 變化/变化
我 ______ 不喜歡中文，現在覺得中文不錯。
我 ______ 不喜欢中文，現在觉得中文不错。 - 本來/本来
這兒本來是 ______，現在都是大樓。
这儿本来是 ______，現在都是大楼。 - 農田/农田
"她以前很不好看。""對，可是她現在 ______ 一個大美女了!"
"她以前很不好看。""对，可是她現在 ______ 一个大美女了!" - 變成/变成
我家前面有一條大 ______。
我家前面有一条大 ______。 - 馬路/马路
"這是我的新男朋友。" "______，看起來不錯!"
"这是我的新男朋友。" "______，看起来不错!" - 喔
一 ______ 是幾公分?
一 ______ 是几公分? - 公尺
紅燈的時候不能往前開，車子都停在 ______ 前面。
红灯的时候不能往前开，车子都停在 ______ 前面。 - 紅綠燈/红绿灯
請你 ______ 他走過去。
请你 ______ 他走过去。 - 向
很多人都用 ______ 手寫字，不用左手。
很多人都用 ______ 手写字，不用左手。 - 右
我家離這兒不遠，你先向右 ______，再往前走，就到了。
我家离这儿不远，你先向右 ______，再往前走，就到了。 - 轉/转
這家 ______ 的炒麵很好吃，我常去。
这家 ______ 的炒面很好吃，我常去。 - 小吃店
你拐了幾個 ______ 才到這兒?
你拐了几个 ______ 才到这儿? - 彎兒/弯儿
你有錢嗎?我坐出租汽車得付 ______。
你有钱吗?我坐出租汽车得付 ______。 - 車費/车费
這件衣服七塊錢，收您十塊錢，______ 您三塊錢。
这件衣服七块钱，收您十块钱，______ 您三块钱。 - 找`.split("\n");


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

		if (selectElem.value == "Chinese Characters (汉字)") {
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

		if (selectElem.value == "Chinese Characters (汉字)") {
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
