const characters = [
	["倒", "to move backwards, to reverse"],
	["别", "don't"],
	["房东", "landlord"],
	["树", "tree"],
	["撞", "to collide with, hit, strike"],
	["坏", "bad"],
	["呀", "(used at the end of the sentence to soften the tone)"],
	["小心", "careful, cautious"],
	["镜子", "mirror"],
	["破", "broken"],
	["分工合作", "to collaborate by dividing up the work"],
	["主意", "idea"],
	["负责", "to be responsible for"],
	["行李", "luggage, baggage"],
	["放", "to put; to place"],
	["装", "to install, assemble; to load, pack"],
	["扫", "to clean, sweep"],
	["整理", "to arrange, sort out"],
	["箱子", "box, case"],
	["衣服", "clothes"],
	["挂", "to hang"],
	["累", "tired, to get tired of"],
	["请客", "to act as the host, to treat"],
	["死", "dead, to die"],
	["附近", "nearby"],
	["忘", "to forget"],
	["门", "door"],
	["窗", "window"],
	["关上", "to close (door/window)"],
	["外套", "coat"],
	["咱们", "we, us (includes speaker and listener)"]
];

const pinyin = [
	["dao4", "倒"],
	["bie2", "别"],
	["fang2dong1", "房东"],
	["shu4", "树"],
	["zhuang4", "撞"],
	["huai4", "坏"],
	["ya", "呀"],
	["xiao3xin1", "小心"],
	["jing4zi", "镜子"],
	["po4", "破"],
	["fen1gong1he2zuo4", "分工合作"],
	["zhu3yi", "主意"],
	["fu4ze2", "负责"],
	["xing2li", "行李"],
	["fang4", "放"],
	["zhuang1", "装"],
	["sao3", "扫"],
	["zheng3li3", "整理"],
	["xiang1zi", "箱子"],
	["yi1fu", "衣服"],
	["gua4", "挂"],
	["lei4", "累"],
	["qing3ke4", "请客"],
	["si3", "死"],
	["fu4jin4", "附近"],
	["wang4", "忘"],
	["men2", "门"],
	["chuang1", "窗"],
	["guan1shang4", "关上"],
	["wai4tao4", "外套"],
	["zan2men", "咱们"]
];

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
		alert("Correct!");

		if (!wrong) data.splice(index, 1);
		
		index = showNewDefinition();
		input.value = "";
		wrong = false;
	} else {
		alert("Wrong! The correct answer was " + data[index][0]);
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
	} else {
		type = "chinese character";
		data = [...characters];

		index = showNewDefinition();
	}
});
