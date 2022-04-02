/*-----------------------Pear Stock-------------------------*/

const boughtStocksElem = document.getElementById("boughtStocks")
boughtStocksElem.innerHTML = 0;

const stockPriceElem = document.getElementById("stockPrice")
stockPriceElem.innerHTML = Math.floor(Math.random() * 230) + 20;

function setInterval() {
    const stockPriceElem = document.getElementById("stockPrice");
    stockPriceElem.innerHTML = Math.floor(Math.random() * 290) + 10;
    const rand = Math.floor(Math.random() * (5 - 0.1 + 1) + 0.1);
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