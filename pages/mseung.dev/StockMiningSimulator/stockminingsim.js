/*-----------------------Pear Stock-------------------------*/

const boughtStocksElem = document.getElementById("boughtStocks")
boughtStocksElem.innerHTML = 0;

const stockPriceElem = document.getElementById("stockPrice")
stockPriceElem.innerHTML = Math.floor(Math.random() * 230) + 20;

function setInterval() {
    const stockPriceElem = document.getElementById("stockPrice");
    stockPriceElem.innerHTML = Math.floor(Math.random() * 50) + 250;
    const rand = Math.floor(Math.random() * (3 - 0.01 + 1) + 0.01);
    setTimeout(setInterval, rand * 1000);
}

setInterval()

/*Bank Element*/
const bankElem = document.getElementById("bank")
bankElem.innerHTML = 500;
/*Bank Element*/

function buyStock() {
    if(Number(bankElem.innerHTML) >= Number(stockPriceElem.innerHTML)) {
        boughtStocksElem.innerHTML = Number(boughtStocksElem.innerHTML) + 1;
        bankElem.innerHTML = Number(bankElem.innerHTML) - Number(stockPriceElem.innerHTML);
    }
}

function sellStock() {
    if(Number(boughtStocksElem.innerHTML) > 0) {
        const boughtStocksElem = document.getElementById("boughtStocks")
        const bankElem = document.getElementById("bank")
        bankElem.innerHTML = (stockPriceElem.innerHTML) * Number(boughtStocksElem.innerHTML) + Number(bankElem.innerHTML);
        boughtStocksElem.innerHTML = 0;
    }
}

/*---------------------------------------------Orange Stock--------------------------------------------------*/
const boughtStocks2Elem = document.getElementById("boughtStocks2")
boughtStocks2Elem.innerHTML = 0;


const stockPrice2Elem = document.getElementById("stockPrice2")
stockPrice2Elem.innerHTML = Math.floor(Math.random() * 230) + 20;

function setInterval2() {
    const stockPrice2Elem = document.getElementById("stockPrice2")
    stockPrice2Elem.innerHTML = Math.floor(Math.random() * 50) + 250;
    const rand2 = Math.floor(Math.random() * (5 - 0.1 + 1) + 0.1);
    setTimeout(setInterval2, rand2 * 1000);
}

setInterval2()

function buyStock2() {
    if(Number(bankElem.innerHTML) >= Number(stockPrice2Elem.innerHTML)) {
        boughtStocks2Elem.innerHTML = Number(boughtStocks2Elem.innerHTML) + 1
        bankElem.innerHTML = Number(bankElem.innerHTML) - Number(stockPrice2Elem.innerHTML)
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

/*--------------Brokers---------------*/

const nameList = ["Max","Chase","David","Nathan","kDev","Aiden","Arlen","Daniel","Billy","Mark","Ash","Dylan","Ethan","Myra","Adih","Darryl","Hokam","Tejas"]

/*--------------Broker1---------------*/
const pick = Math.floor(Math.random() * nameList.length);

const nameElem = document.getElementById("name")
nameElem.innerHTML = (nameList[pick]);

const brokersstocksElem = document.getElementById("brokersstocks")
brokersstocksElem.innerHTML = Math.floor(Math.random() * 490) + 10;

const brokerpriceElem = document.getElementById("brokerprice")
brokerpriceElem.innerHTML = Math.floor(Math.random() * 99) + 1;

const interestElem = document.getElementById("interest")
interestElem.innerHTML = Math.floor(Math.random() * 19) + 1;

/*--------------Broker2---------------*/
const pick2 = Math.floor(Math.random() * nameList.length);

const name2Elem = document.getElementById("name2")
name2Elem.innerHTML = (nameList[pick2]);

const brokersstocks2Elem = document.getElementById("brokersstocks2")
brokersstocks2Elem.innerHTML = Math.floor(Math.random() * 490) + 10;

const brokerprice2Elem = document.getElementById("brokerprice2")
brokerprice2Elem.innerHTML = Math.floor(Math.random() * 99) + 1;

const interest2Elem = document.getElementById("interest2")
interest2Elem.innerHTML = Math.floor(Math.random() * 19) + 1;