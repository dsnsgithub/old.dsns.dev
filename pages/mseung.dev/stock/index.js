/* not functions */

const [stockPrice, stockPrice2] = [document.getElementById("stockPrice"),document.getElementById("stockPrice2")] /*pear ltd and orange ltd*/
stockPrice.innerHTML = Math.floor(Math.random() * 230) + 20;
stockPrice2.innerHTML = Math.floor(Math.random() * 230) + 20;

const [inv, inv2] = [document.getElementById("inv"), document.getElementById("inv2")] /*how many shares you have */
inv.innerHTML = 0;
inv2.innerHTML = 0;

const [amountspent, amountspent2] = [document.getElementById("amountspent"), document.getElementById("amountspent2")] /*how much you spent */
amountspent.innerHTML = 0;
amountspent2.innerHTML = 0;

const brokernames = ["Max","Chase","David","Nathan","kDev", "Cat", "Aiden","Arlen","Daniel","Billy","Mark","Ash","Dylan","Ethan","Myra","Adih","Daryl","Hokam","Tejas", "Tricky", "Julian"]; /*all the brokers' names */

var [name1, name2, name3, name4, name5] = [document.getElementById("name1"), document.getElementById("name2"), document.getElementById("name3"), document.getElementById("name4"), document.getElementById("name5")]
name1.innerHTML = brokernames[Math.floor(Math.random() * brokernames.length)];
name2.innerHTML = brokernames[Math.floor(Math.random() * brokernames.length)];
name3.innerHTML = brokernames[Math.floor(Math.random() * brokernames.length)];
name4.innerHTML = brokernames[Math.floor(Math.random() * brokernames.length)];
name5.innerHTML = brokernames[Math.floor(Math.random() * brokernames.length)];

const [brokerstocks, brokerstocks2, brokerstocks3, brokerstocks4, brokerstocks5] = [document.getElementById("brokerstocks"), document.getElementById("brokerstocks2"), document.getElementById("brokerstocks3"), document.getElementById("brokerstocks4"), document.getElementById("brokerstocks5")];
brokerstocks.innerHTML = Math.floor(Math.random() * 130) + 20;
brokerstocks2.innerHTML = Math.floor(Math.random() * 130) + 20;
brokerstocks3.innerHTML = Math.floor(Math.random() * 130) + 20;
brokerstocks4.innerHTML = Math.floor(Math.random() * 130) + 20;
brokerstocks5.innerHTML = Math.floor(Math.random() * 130) + 20;

const [brokerprice, brokerprice2, brokerprice3, brokerprice4, brokerprice5] = [document.getElementById("brokerprice"), document.getElementById("brokerprice2"), document.getElementById("brokerprice3"), document.getElementById("brokerprice4"), document.getElementById("brokerprice5")];
brokerprice.innerHTML = Math.floor(Math.random() * 14600) + 400;
brokerprice2.innerHTML = Math.floor(Math.random() * 14600) + 400;
brokerprice3.innerHTML = Math.floor(Math.random() * 14600) + 400;
brokerprice4.innerHTML = Math.floor(Math.random() * 14600) + 400;
brokerprice5.innerHTML = Math.floor(Math.random() * 14600) + 400;

const [brokerInterest, brokerInterest2, brokerInterest3, brokerInterest4, brokerInterest5] = [document.getElementById("brokerInterest"), document.getElementById("brokerInterest2"), document.getElementById("brokerInterest3"), document.getElementById("brokerInterest4"), document.getElementById("brokerInterest5")];
brokerInterest.innerHTML = Math.floor(Math.random() * 18) + 2;
brokerInterest2.innerHTML = Math.floor(Math.random() * 18) + 2;
brokerInterest3.innerHTML = Math.floor(Math.random() * 18) + 2;
brokerInterest4.innerHTML = Math.floor(Math.random() * 18) + 2;
brokerInterest5.innerHTML = Math.floor(Math.random() * 18) + 2;

const bank = document.getElementById("bank") /*how much money you have */
bank.innerHTML = 500;

let checkChange = setInterval(updateValue, 1); /*changes the price of the stocks */
let checkChange2 = setInterval(updateValue2, 1);

var priceInterval, priceInterval2, priceInterval3, priceInterval4;

var takeInterval, takeInterval2;

/* functions */

function priceSystem() {
    clearInterval(priceInterval);
    clearInterval(priceInterval2);
    if(Math.random() < 0.5) { /*50% chance price will go up*/
        if(Number(stockPrice.innerHTML) <= 500) {
            priceInterval = setInterval(changePrice, 2000);
            stockPrice.innerHTML = Number(stockPrice.innerHTML) + Math.floor(Math.random() * 49) + 1;
            function changePrice() {
                if(Math.random() < 0.8) { /*80% chance price will keep going up*/
                    if(Number(stockPrice.innerHTML) <= 500) {
                        stockPrice.innerHTML = Number(stockPrice.innerHTML) + Math.floor(Math.random() * 49) + 1;
                    } else if(Number(stockPrice.innerHTML > 500)) {
                        stockPrice.innerHTML = Number(stockPrice.innerHTML) - Math.floor(Math.random() * 49) + 1;
                        priceSystem();
                    }
                } else { /*20% chance price will break its trend*/
                    if(Number(stockPrice.innerHTML) >= 150) {
                        stockPrice.innerHTML = Number(stockPrice.innerHTML) - Math.floor(Math.random() * 49) + 1;
                        priceSystem();
                    } 
                } 
            }
        } else {
            priceSystem()
        }
    } else { /*50% chance price will go down*/
        if(Number(stockPrice.innerHTML) >= 150) {
            priceInterval2 = setInterval(changePrice2, 2000);
            stockPrice.innerHTML = Number(stockPrice.innerHTML) - Math.floor(Math.random() * 49) + 1;
            function changePrice2() {
                if(Math.random() < 0.8) { /*80% chance price will keep going down*/
                    if(Number(stockPrice.innerHTML) >= 150) {
                        stockPrice.innerHTML = Number(stockPrice.innerHTML) - Math.floor(Math.random() * 49) + 1;
                    } else if(Number(stockPrice.innerHTML < 150)) {
                        stockPrice.innerHTML = Number(stockPrice.innerHTML) + Math.floor(Math.random() * 49) + 1;
                        priceSystem();
                    }
                } else { /*20% chance price will break its trend*/
                    if(Number(stockPrice.innerHTML) <= 500) {
                        stockPrice.innerHTML = Number(stockPrice.innerHTML) + Math.floor(Math.random() * 49) + 1;
                        priceSystem();
                    }
                }
            }
        } else {
            priceSystem()
        }
    }
}

function priceSystem2() {
    clearInterval(priceInterval3);
    clearInterval(priceInterval4);
    if(Math.random() < 0.5) { /*50% chance price will go up*/
        if(Number(stockPrice2.innerHTML) <= 500) {
            priceInterval3 = setInterval(changePrice3, 1000);
            stockPrice2.innerHTML = Number(stockPrice2.innerHTML) + Math.floor(Math.random() * 49) + 1;
            function changePrice3() {
                if(Math.random() < 0.8) { /*80% chance price will keep going up*/
                    if(Number(stockPrice2.innerHTML) <= 500) {
                        stockPrice2.innerHTML = Number(stockPrice2.innerHTML) + Math.floor(Math.random() * 49) + 1;
                    } else if(Number(stockPrice2.innerHTML > 500)) {
                        stockPrice2.innerHTML = Number(stockPrice2.innerHTML) - Math.floor(Math.random() * 49) + 1;
                        priceSystem2();
                    }
                } else { /*20% chance price will break its trend*/
                    if(Number(stockPrice2.innerHTML) >= 150) {
                        stockPrice2.innerHTML = Number(stockPrice2.innerHTML) - Math.floor(Math.random() * 49) + 1;
                        priceSystem2();
                    }
                }
            }
        } else {
            priceSystem2()
        }
    } else { /*50% chance price will go down*/
        if(Number(stockPrice2.innerHTML) >= 150) {
            priceInterval4 = setInterval(changePrice4, 1000);
            stockPrice2.innerHTML = Number(stockPrice2.innerHTML) - Math.floor(Math.random() * 49) + 1;
            function changePrice4() {
                if(Math.random() < 0.8) { /*80% chance price will keep going down*/
                    if(Number(stockPrice2.innerHTML) >= 150) {
                        stockPrice2.innerHTML = Number(stockPrice2.innerHTML) - Math.floor(Math.random() * 49) + 1;
                    } else if(Number(stockPrice2.innerHTML < 150)) {
                        stockPrice2.innerHTML = Number(stockPrice2.innerHTML) + Math.floor(Math.random() * 49) + 1;
                        priceSystem2();
                    }
                } else { /*20% chance price will break its trend*/
                    if(Number(stockPrice2.innerHTML) <= 500) {
                        stockPrice2.innerHTML = Number(stockPrice2.innerHTML) + Math.floor(Math.random() * 49) + 1;
                        priceSystem2();
                    }
                }
            }
        } else {
            priceSystem2()
        }
    }
}

priceSystem()
priceSystem2()

function buy() { /*it explains itself */
    if(Number(bank.innerHTML) >= Number(document.getElementById("amountspent").innerHTML)) {
        bank.innerHTML = Number(bank.innerHTML) - Number(document.getElementById("amountspent").innerHTML);
        inv.innerHTML = Number(inv.innerHTML) + Number(document.getElementById("amountfield").value);
    }
}
function buy2() {
    if(Number(bank.innerHTML) >= Number(document.getElementById("amountspent2").innerHTML)) {
        bank.innerHTML = Number(bank.innerHTML) - Number(document.getElementById("amountspent2").innerHTML);
        inv2.innerHTML = Number(inv2.innerHTML) + Number(document.getElementById("amountfield2").value);;
    }
}

function sell() { /*same for this one */
    if(Number(inv.innerHTML) > 0) {
        bank.innerHTML = Number(bank.innerHTML) + (Number(inv.innerHTML) * Number(stockPrice.innerHTML));
        inv.innerHTML = 0;
    }
}
function sell2() {
    if(Number(inv2.innerHTML) > 0) {
        bank.innerHTML = Number(bank.innerHTML) + (Number(inv2.innerHTML) * Number(stockPrice2.innerHTML));
        inv2.innerHTML = 0;
    }
}

function updateValue() { /*updates the number of how much you spent */
    document.getElementById("amountspent").innerHTML = (Number(document.getElementById("amountfield").value) * Number(stockPrice.innerHTML));
}
function updateValue2() {
    document.getElementById("amountspent2").innerHTML = (Number(document.getElementById("amountfield2").value) * Number(stockPrice2.innerHTML));
}

function chooseCompany(name) { /*chooses what company each broker should go to */
    if(Math.random() < 0.5) {
        name.style.color = "lightgreen"; /*broker chooses pear */
    } else {
        name.style.color = "orange"; /*broker chooses orange */
    }
}

chooseCompany(name1);
chooseCompany(name2);
chooseCompany(name3);
chooseCompany(name4);
chooseCompany(name5);

function borrowstocks(name, stocks, interest, price, purpose) {
    if(purpose.value == "Borrow") {
        if(price.innerHTML <= Number(bank.innerHTML)) {
            if(name.style.color == "lightgreen") {
                purpose.value = "Give";
                takeInterval = setInterval(takeInterest, 500);
                inv.innerHTML = Number(inv.innerHTML) + Number(stocks.innerHTML);
                bank.innerHTML = Number(bank.innerHTML) - price.innerHTML;
                function takeInterest() {
                    bank.innerHTML = Number(bank.innerHTML) - Number(stockPrice.innerHTML) * (interest.innerHTML / 100);
                    bank.innerHTML = Math.round(bank.innerHTML);
                }
            } else if(name.style.color == "orange") {
                purpose.value = "Give";
                takeInterval2 = setInterval(takeInterest2, 500);
                inv2.innerHTML = Number(inv2.innerHTML) + Number(stocks.innerHTML);
                bank.innerHTML = Number(bank.innerHTML) - price.innerHTML;
                function takeInterest2() {
                    bank.innerHTML = Number(bank.innerHTML) - Number(stockPrice2.innerHTML) * (interest.innerHTML / 100);
                    bank.innerHTML = Math.round(bank.innerHTML);
                }
            }
        }
    } else if (purpose.value == "Give") {
        if(name.style.color == "lightgreen") {
            if(Number(inv.innerHTML) >= Number(stocks.innerHTML)) {
                console.log(Number(inv.innerHTML), Number(stocks.innerHTML), Number(price.innerHTML));
                clearInterval(takeInterval);
                inv.innerHTML = Number(inv.innerHTML) - Number(stocks.innerHTML);
                purpose.value = "Borrow";
            }
        } else if(name.style.color == "orange") {
            if(Number(inv2.innerHTML) >= Number(stocks.innerHTML)) {
                console.log(Number(inv2.innerHTML), Number(stocks.innerHTML), Number(price.innerHTML));
                clearInterval(takeInterval2);
                inv2.innerHTML = Number(inv2.innerHTML) - Number(stocks.innerHTML);
                purpose.value = "Borrow";
            }
        }
    }
}

function checkBroke(purpose, interest) {
    setTimeout(checkBroke, 2000)
    if(Number(bank.innerHTML) <= 19 && Number(inv.innerHTML) + Number(inv2.innerHTML) == 0 || purpose == "Give" && (Number(bank.innerHTML) < Number(interest.innerHTML) && Number(inv.innerHTML) + Number(inv2.innerHTML) == 0)) {
        alert("You lost! How??? Refresh the page to restart the game.");
    }
}

checkBroke(document.getElementById("borrow"), brokerInterest);
checkBroke(document.getElementById("borrow2"), brokerInterest2);
checkBroke(document.getElementById("borrow3"), brokerInterest3);
checkBroke(document.getElementById("borrow4"), brokerInterest4);
checkBroke(document.getElementById("borrow5"), brokerInterest5);