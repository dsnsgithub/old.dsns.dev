const raw = `師母/师母 - An honorific term used when addressing the teacher's wife
shī mǔ
些 - some
xiē
維生素/维生素 - vitamin
wéi shēng sù
永遠/永远 - forever
yǒng yuǎn
健康 - healthy
jiàn kāng
年輕/年轻 - young
nián qīng
破費/破费 - you spend too much money, wen to great expense
pò fèi
小意思 - no big deal
xiǎo yì si
難得/难得 - seldom, rarely
nán dé
特地 - specially
tè dì
拿手菜 - best cooking
ná shǒu cài
涼/凉 - cool, cold
liáng
精神 - energetic, high-spirited
jīng shen
白頭髮/白头发 - gray or white hair
bái tóu fa
眼睛 - eye(s)
yǎn jīng
花 - blurred eyesight, flower
huā
適應/适应 - to get used to
shì yìng
時差/时差 - time difference, jetlag
shí chā
白天 - daytime
bái tiān
睏 - sleepy, dozy
kùn
睡不著/睡不着 - unable to sleep
shuì bu zháo
街道 - street
jiē dào
習慣/习惯 - to be used to
xí guàn
長/长 - to grow
cháng
年糕 - New Year cake, rice cake
nián gāo
味道 - taste
wèi dao
地道 - original, genuine, authentic
dì dao
香 - aroma, aromatic
xiāng
俱全 - all included,, altogether
jù quán
飽/饱 - full
bǎo
只是 - just, simply
zhǐ shì
家常便飯/家常便饭 - homemade meal
jiā cháng biàn fàn
相聚 - to be together, get together
xiāng jù
乾杯/干杯 - to toast, cheers
gān bēi
有朋自遠方來，不亦樂乎?/有朋自远方来，不亦乐乎？ - Isn't it pleasant to have friends coming from afar?
yǒu péng zì yuǎn fāng lái , bú yì yùe hū ?`.split("\n");

//! Parse Characters ------------------------------------------------------
let characters = [];
for (let i = 0; i < raw.length; i = i + 2) {
	let character = raw[i];
	let [char, def] = character.split(" - ");
	if (char.indexOf("/") > -1) {
		let [traditional, simple] = char.split("/");
		characters.push([simple, def]);
	} else {
		characters.push([char, def]);
	}
}

//! Parse Pinyin ------------------------------------------------------
const pinyinArray = [];
let count = 0;
for (let i = 1; i < raw.length; i = i + 2) {
	const pinyin = raw[i].split(" ");

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

//! Sentence Patterns ----------------------------------------------------------------------------------

const sentenceRaw = `老師的太太是 ______。
老师的太太是 ______。 - 師母/师母
這 ______ 東西都不是我的。
这 ______ 东西都不是我的。 - 些
媽媽每天早上都吃很多 ______，讓自己看來年輕一點。
妈妈每天早上都吃很多 ______，让自己看来年轻一点。 - 維生素/维生素
媽媽說: "我 ______ 都愛你。"
妈妈说: "我 ______ 都爱你。" - 永遠/永远
聽說她常生病，好像不太 ______。
听说她常生病，好像不太 ______。 - 健康
他已經五十歲了，可是看來很 ______。
他已经五十岁了，可是看来很 ______。 - 年輕/轻
你怎麼帶禮物來看我，讓你 ______ 了!
你怎么带礼物来看我，让你 ______ 了! - 破費/破费
"這件衣服很貴吧!" "沒關係，______。"
"这件衣服很贵吧!" "没关系，______。" - 小意思
這個星期 ______ 沒有功課，我們去看電影吧!
这个星期 ______ 沒有功课，我们去看电影吧! - 難得/难得
我男朋友知道我喜歡吃炒麵，他 ______ 去那家小吃店買給我吃。
我男朋友知道我喜欢吃炒面，他 ______ 去那家小吃店买给我吃。 - 特地
"請你嚐嚐我的 ______。" "真好吃! 你怎麼做的?"
"请你尝尝我的 ______。" "真好吃! 你怎么做的?" - 拿手菜
這杯茶已經 ______ 了，你要一杯熱的嗎?
这杯茶已经 ______ 了，你要一杯热的吗? - 涼/凉
他昨天晚上睡了很久，所以現在看來很 ______。
他昨天晚上睡了很久，所以現在看来很 ______。 - 精神
"老師三十歲的時候已經開始有 ______ 了。" "真的嗎?"
"老师三十岁的时候已经开始有 ______ 了。" "真的吗?" - 白頭髮/白头发
她那雙大 ______ 真好看! 好像會說話。
她那双大 ______ 真好看! 好像会说话。 - 眼睛
爸爸老了，眼睛 ______ 了，走路也慢了。 - 花
我還不 ______ 這裡的天氣，太熱了。
我还不 ______ 这里的天气，太热了。 - 適應/适应
我很不喜歡去國外旅行，因為適應 ______ 讓我很不舒服。
我很不喜欢去国外旅行，因为适应 ______ 让我很不舒服。 - 時差/时差
"我喜歡 ______ 睡覺，晚上找東西吃。""你是貓嗎?"
"我喜欢 ______ 睡觉，晚上找东西吃。""你是猫吗?" - 白天
我昨天沒睡覺，現在覺得很 ______。
我昨天沒睡觉，現在觉得很 ______。 - 睏
我很累，可是 ______。 - 睡不著/睡不着
中國新年的時候，______ 上到處都是買東西的人。
中国新年的时候，______ 上到处都是买东西的人。 - 街道
我 ______ 先吃飯，再做功課。我不喜歡先做功課再吃飯。
我 ______ 先吃饭，再做功课。我不喜欢先做功课再吃饭。 - 習慣/习惯
他常鍛煉，所以 ______ 得很高。
他常锻炼，所以 ______ 得很高。 - 長
過新年的時候，中國人要吃 ______。
过新年的时候，中国人要吃 ______。 - 年糕
媽媽包的餃子 ______ 好極了!
妈妈包的饺子 ______ 好极了! - 味道
我媽媽做的炒年糕味道很 ______。
我妈妈做的炒年糕味道很 ______。 - 地道
"這些花真 ______!" "你喜歡嗎? 送給你吧!"
"这些花真 ______!" "你喜欢吗? 送给你吧!" - 香
她的拿手菜很好吃也很好看，真是色香味 ______。 - 俱全
我吃了兩碗飯，現在覺得很 _____。
我吃了两碗饭，现在觉得很 _____。 - 飽/饱
"這盤炒麵真好吃!" "哪裡，______ 家常便飯。快吃吧!"
"这盘炒面真好吃!" "哪里，______ 家常便饭。快吃吧!" - 只是
晚上來我家吃飯吧! 都只是一些 ______。
晚上来我家吃饭吧! 都只是一些 ______。 - 家常便飯/饭
你很久沒有和男朋友 ______ 了，一起出去玩吧! - 相聚
好久不見，咱們來 ______ 吧!
好久不见，咱们来 ______ 吧! - 乾杯/干杯
"我的老朋友要來看我了，真高興!" "是啊! _______。"
"我的老朋友要来看我了，真高兴!" "是啊! _______。" - 有朋自遠方來，不亦樂乎?/有朋自远方来，不亦乐乎?`.split("\n");

let sentencePatterns = [];
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
});
