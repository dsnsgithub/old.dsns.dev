/*BoughtStocksParagraph*/

const boughtStocksElem = document.getElementById("boughtStocks")
boughtStocksElem.innerHTML = 0;

const boughtStocks2Elem = document.getElementById("boughtStocks2")
boughtStocks2Elem.innerHTML = 0;

/*StockPriceParagraph*/

const stockPriceElem = document.getElementById("stockPrice")
stockPriceElem.innerHTML = 0;

const stockPrice2Elem = document.getElementById("stockPrice2")
stockPrice2Elem.innerHTML = 0;

/*SetIntervalFunction*/

function setInterval1() {
    const stockPriceElem = document.getElementById("stockPrice");
    stockPriceElem.innerHTML = Math.floor(Math.random() * 230) + 20;
    const rand = Math.floor(Math.random() * (3 - 0.01 + 1) + 0.01);
    setTimeout(setInterval1, rand * 1000);
}

function setInterval2() {
    const stockPrice2Elem = document.getElementById("stockPrice2")
    stockPrice2Elem.innerHTML = Math.floor(Math.random() * 50) + 250;
    const rand2 = Math.floor(Math.random() * (5 - 0.1 + 1) + 0.1);
    setTimeout(setInterval2, rand2 * 1000);
}

setInterval1()
setInterval2()

/*BuyFunction*/

function buyStock() {
    if(Number(bankElem.innerHTML) >= Number(stockPriceElem.innerHTML) * Number(document.getElementById("stockfield").value)) {
        boughtStocksElem.innerHTML = Number(boughtStocksElem.innerHTML) + Number(document.getElementById("stockfield").value);
        bankElem.innerHTML = Number(bankElem.innerHTML) - (Number(stockPriceElem.innerHTML) * Number(document.getElementById("stockfield").value));
    }
    document.getElementById("stockfield").value = "";
}

function buyStock2() {
    if(Number(bankElem.innerHTML) >= Number(stockPrice2Elem.innerHTML) * Number(document.getElementById("stockfield2").value)) {
        boughtStocks2Elem.innerHTML = Number(boughtStocks2Elem.innerHTML) + Number(document.getElementById("stockfield2").value);
        bankElem.innerHTML = Number(bankElem.innerHTML) - (Number(stockPrice2Elem.innerHTML) * Number(document.getElementById("stockfield2").value));
    }
}

/*SellFunction*/

function sellStock() {
    if(Number(boughtStocksElem.innerHTML) > 0) {
        const boughtStocksElem = document.getElementById("boughtStocks")
        const bankElem = document.getElementById("bank")
        bankElem.innerHTML = (stockPriceElem.innerHTML) * Number(boughtStocksElem.innerHTML) + Number(bankElem.innerHTML);
        boughtStocksElem.innerHTML = 0;
    }
}

function sellStock2() {
    if(Number(boughtStocks2Elem.innerHTML) > 0) {
        const boughtStocks2Elem = document.getElementById("boughtStocks2")
        const bankElem = document.getElementById("bank")
        bankElem.innerHTML = (stockPrice2Elem.innerHTML) * Number(boughtStocks2Elem.innerHTML) + Number(bankElem.innerHTML);
        boughtStocks2Elem.innerHTML = 0;
    }
}

/*BankParagraph*/
const bankElem = document.getElementById("bank")
bankElem.innerHTML = 500;
/*BankParagraph*/

/*--------------Brokers---------------*/

const nameList = ["Max","Chase","David","Nathan","kDev","Aiden","Arlen","Daniel","Billy","Mark","Ash","Dylan","Ethan","Myra","Adih","Darryl","Hokam","Tejas"]

/*------Pick------*/

const pick = Math.floor(Math.random() * nameList.length);

const pick2 = Math.floor(Math.random() * nameList.length);

const pick3 = Math.floor(Math.random() * nameList.length);

const pick4 = Math.floor(Math.random() * nameList.length);

const pick5 = Math.floor(Math.random() * nameList.length);

/*------NameDiv------*/

const nameElem = document.getElementById("name")
nameElem.innerHTML = (nameList[pick]);

const name2Elem = document.getElementById("name2")
name2Elem.innerHTML = (nameList[pick2]);

const name3Elem = document.getElementById("name3")
name3Elem.innerHTML = (nameList[pick3]);

const name4Elem = document.getElementById("name4")
name4Elem.innerHTML = (nameList[pick4]);

const name5Elem = document.getElementById("name5")
name5Elem.innerHTML = (nameList[pick5]);

/*------BrokersStocksDiv------*/

const brokersstocksElem = document.getElementById("brokersstocks")
brokersstocksElem.innerHTML = Math.floor(Math.random() * 490) + 10;

const brokersstocks2Elem = document.getElementById("brokersstocks2")
brokersstocks2Elem.innerHTML = Math.floor(Math.random() * 490) + 10;

const brokersstocks3Elem = document.getElementById("brokersstocks3")
brokersstocks3Elem.innerHTML = Math.floor(Math.random() * 490) + 10;

const brokersstocks4Elem = document.getElementById("brokersstocks4")
brokersstocks4Elem.innerHTML = Math.floor(Math.random() * 490) + 10;

const brokersstocks5Elem = document.getElementById("brokersstocks5")
brokersstocks5Elem.innerHTML = Math.floor(Math.random() * 490) + 10;

/*------BrokerPriceDiv------*/

const brokerpriceElem = document.getElementById("brokerprice")
brokerpriceElem.innerHTML = Math.floor(Math.random() * 99) + 1;

const brokerprice2Elem = document.getElementById("brokerprice2")
brokerprice2Elem.innerHTML = Math.floor(Math.random() * 99) + 1;

const brokerprice3Elem = document.getElementById("brokerprice3")
brokerprice3Elem.innerHTML = Math.floor(Math.random() * 99) + 1;

const brokerprice4Elem = document.getElementById("brokerprice4")
brokerprice4Elem.innerHTML = Math.floor(Math.random() * 99) + 1;

const brokerprice5Elem = document.getElementById("brokerprice5")
brokerprice5Elem.innerHTML = Math.floor(Math.random() * 99) + 1;

/*------InterestPercentageDiv------*/

const interestElem = document.getElementById("interest")
interestElem.innerHTML = Math.floor(Math.random() * 19) + 1;

const interest2Elem = document.getElementById("interest2")
interest2Elem.innerHTML = Math.floor(Math.random() * 19) + 1;

const interest3Elem = document.getElementById("interest3")
interest3Elem.innerHTML = Math.floor(Math.random() * 19) + 1;

const interest4Elem = document.getElementById("interest4")
interest4Elem.innerHTML = Math.floor(Math.random() * 19) + 1;

const interest5Elem = document.getElementById("interest5")
interest5Elem.innerHTML = Math.floor(Math.random() * 19) + 1;

/*------BorrowButton------*/
let testSleep = setInterval(test, 1000);
let testSleep2 = setInterval(test, 1000);
let testSleep3 = setInterval(test, 1000);
let testSleep4 = setInterval(test, 1000);
let testSleep5 = setInterval(test, 1000);

function test() {
    if(document.getElementById("b1b").value == "Give") {
        bankElem.innerHTML = Number(bankElem.innerHTML) - Number(interestElem.innerHTML);
    }
}
function test2() {
    if(document.getElementById("b2b").value == "Give") {
        bankElem.innerHTML = Number(bankElem.innerHTML) - Number(interest2Elem.innerHTML);
    }
}
function test3() {
    if(document.getElementById("b3b").value == "Give") {
        bankElem.innerHTML = Number(bankElem.innerHTML) - Number(interest3Elem.innerHTML);
    }
}
function test4() {
    if(document.getElementById("b4b").value == "Give") {
        bankElem.innerHTML = Number(bankElem.innerHTML) - Number(interest4Elem.innerHTML);
    }
}
function test5() {
    if(document.getElementById("b5b").value == "Give") {
        bankElem.innerHTML = Number(bankElem.innerHTML) - Number(interest5Elem.innerHTML);
    }
}

function borrow() {
    if(document.getElementById("b1b").value == "Borrow") {
        document.getElementById("b1b").value = "Give";
        test()
    } else if (document.getElementById("b1b").value == "Give") {
        document.getElementById("b1b").value = "Borrow";
    }
}

function borrow2() {
    if(document.getElementById("b2b").value == "Borrow") {
        document.getElementById("b2b").value = "Give";
        test2()
    } else if (document.getElementById("b2b").value == "Give") {
        document.getElementById("b2b").value = "Borrow";
    }
}

function borrow3() {
    if(document.getElementById("b3b").value == "Borrow") {
        document.getElementById("b3b").value = "Give";
        test3()
    } else if (document.getElementById("b3b").value == "Give") {
        document.getElementById("b3b").value = "Borrow";
    }
}

function borrow4() {
    if(document.getElementById("b4b").value == "Borrow") {
        document.getElementById("b4b").value = "Give";
        test4()
    } else if (document.getElementById("b4b").value == "Give") {
        document.getElementById("b4b").value = "Borrow";
    }
}

function borrow5() {
    if(document.getElementById("b5b").value == "Borrow") {
        document.getElementById("b5b").value = "Give";
        test5()
    } else if (document.getElementById("b5b").value == "Give") {
        document.getElementById("b5b").value = "Borrow";
    }
}
/*
const boughtStocksElem = document.getElementById("boughtStocks")
boughtStocksElem.innerHTML = 0;

const stockPriceElem = document.getElementById("stockPrice")
stockPriceElem.innerHTML = Math.floor(Math.random() * 230) + 20;

function setInterval(){
    const stockPriceElem = document.getElementById("stockPrice");
    stockPriceElem.innerHTML = Math.floor(Math.random() * 290) + 10;
    const rand = Math.floor(Math.random() * (5- 0.1 + 1) + 0.1);
    setTimeout(setInterval, rand * 1000);
}
setInterval()

const bankElem = document.getElementById("bank")
bankElem.innerHTML = 500;

function buyStock() {
    if(Number(bankElem.innerHTML) >= Number(stockPriceElem.innerHTML)) {
        boughtStocksElem.innerHTML = Number(boughtStocksElem.innerHTML) + 1;
        bankElem.innerHTML = Number(bankElem.innerHTML) - Number(stockPriceElem.innerHTML);
    }
}

function sellStock() {
    if(Number(boughtStocksElem.innerHTML) > 0) {
        const boughtStocksElem = document.getElementById("boughtStocks")
        const bankElem=document.getElementById("bank")
        bankElem.innerHTML = (stockPriceElem.innerHTML) * Number(boughtStocksElem.innerHTML) + Number(bankElem.innerHTML);
        boughtStocksElem.innerHTML = 0;
    }
}
*/