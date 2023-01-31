'use strict';

/// <reference path="jquery-3.6.0.js" />

$(() => {

    let coins = [];

    $("section").hide();
    $("#homeSection").show();

    $("a").on("click", function () {
        const dataSection = $(this).attr("data-section");
        $("section").hide();
        $("#" + dataSection).show();
    });


    $("#homeSection").on("click", ".card > button", async function () {
        if ($(this).next().html() === "") {
            const coinId = $(this).attr("id");

            $(this).next().append('<div class="spinner"><div class="dot1"></div><div class="dot2"></div><div class="dot3"></div></div>');

            $(this).parent().animate({ scrollTop: $(this).parent().prop("scrollHeight") }, 500);

            const coin = await getMoreInfo(coinId);
            const content = `
        <br><br>
        <img src="assets/images/coins-png/dollar.png" /> ${coin.market_data.current_price.usd} <br>
        <img src="assets/images/coins-png/euro.png" /> ${coin.market_data.current_price.eur} <br>
        <img src="assets/images/coins-png/shekel.png" /> ${coin.market_data.current_price.ils}
        `;
            $(this).parent().animate({ scrollTop: $(this).parent().prop("scrollHeight") }, 500);
            $(this).next().html(content);
            $(this).text('less info');
        } else {
            $(this).next().html("");
            $(this).text('more info');
        }
    });


    $("input[type=text]").on("keyup", function () {

        const textToSearch = $(this).val().toLowerCase();
        if (textToSearch === "") {
            displayCoins(coins);
        }
        else {
            const filteredCoins = coins.filter(c => c.symbol.indexOf(textToSearch) >= 0);
            if (filteredCoins.length > 0) {
                displayCoins(filteredCoins);
            }
        }

    });


    handleCoins();

    async function handleCoins() {
        try {
            coins = await getJSON("https://api.coingecko.com/api/v3/coins");
            displayCoins(coins);
        }
        catch (err) {
            alert(err.message);
        }
    }


    function displayCoins(coins) {
        let content = "";
        for (const coin of coins) {
            const card = createCard(coin);
            content += card;
        }
        $("#homeSection").html(content);
    }


    function createCard(coin) {
        const card = `
            <div class="card" data-coin-id="${coin.id}">
                <label class="switch">
                    <input type="checkbox" id="check${coin.symbol}" onchange="onToggleClick(this, '${coin.symbol}')">
                    <span class="slider"></span>
                </label> <br>
                <span>${coin.symbol}</span> <br>
                <span>${coin.name}</span> <br>
                <img src="${coin.image.thumb}" /> <br>
                <button class="moreInfo-btn" id="${coin.id}">more info</button>
                <span></span>
            </div>
        `;
        return card;
    }




    async function getMoreInfo(coinId) {
        const coin = await getJSON("https://api.coingecko.com/api/v3/coins/" + coinId);
        return coin;
    }


    function getJSON(url) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url,
                success: data => {
                    resolve(data);
                },
                error: err => {
                    reject(err);
                }
            })
        });
    }


    //-------------------------------------- About ----------------------------------------

    const content = `

        <div class="aboutDiv">

            <h2 class="aboutHeader"> About </h2>

            <div class="aboutSpan">

                    <h3> About the project: </h3>
                    
                    This is a second project as part of my studies at "John Bryce" college.<br>
                    This project is based on jQuery with fine detailed HTML & CSS. This jQuery project displays the most popular <br>
                    and current Crypto Coins. The Crypto Coins are presented through an API. In this project each Crypto Coin is <br>
                    presented along with its current data. In addition, there is an option of selecting up to five coins which are <br>
                    then displayed on a graph that is automatically refreshed and updated every two seconds. <br>
                    <br>

                    <h3> About myself: </h3>
                   
                    A little about myself, my name is Nicole Zabarinsky, i am 26 years old and i live in Rishon Lezion in Israel. <br>
                    I am a Fullstack student in "John Bryce" college. One of my favorite hobbies is painting, I really liked everything <br>
                    related to art from a very young age. Another hobby of mine is traveling, my partner and I often go on trips, we really <br>
                    like to travel in Israel and also to travel around the world. <br>
                    In my spare time I also enjoy playing computer games, meeting with friends and family and playing chess. <br>
                    
                <br>
                <br>

                <span class="logoSpan">

                    <a href="https://www.linkedin.com/in/nicole-zabarinsky-700b81238/"><img class="linkedin-img" src="assets/images/logos-png/linkedin.png"></a>
                    <a href="https://www.facebook.com/nicole.zabarinsky.1"><img class="facebook-img" src="assets/images/logos-png/facebook.png"></a>
                    <a href="https://www.instagram.com/nicole_zabarinsky/"><img class="instagram-img" src="assets/images/logos-png/instagram.png"></a>

                </span> 

            </div> 

            <br>

            <div class="imgDiv">

                <img src="assets/images/my-imgs/me2.jpg" class="firstImg">

                <img src="assets/images/my-imgs/me3.jpeg" class="secondImg">

            </div>
     
        </div>
    `;

    $("#aboutSection").append(content);

});


//---------------------------------- background video -------------------------------------

function playAndPause() {
    let video = document.getElementById("myVideo");
    let btn = document.getElementById("myBtn");
    if (video.paused) {
        video.play();
        btn.innerHTML = "Pause background";
    } else {
        video.pause();
        btn.innerHTML = "Play background";
    }
}


//---------------------------------------- Modal -------------------------------------------

let selectedCoins = [];
let selectedToggleIds = [];
let togglesCounter = 0;

function onToggleClick(currentToggle, coinSymbol) {

    let toggleId = currentToggle.id;
    let symbolCoinIndex = selectedCoins.indexOf(coinSymbol);
    let indexToggleId = selectedToggleIds.indexOf(toggleId);

    if (symbolCoinIndex != -1) {
        selectedCoins.splice(symbolCoinIndex, 1);
        selectedToggleIds.splice(indexToggleId, 1);
    }
    else {
        if (selectedCoins.length < 5) {
            togglesCounter++;
            selectedCoins.push(coinSymbol);
            selectedToggleIds.push(toggleId);
        }
        else {
            $(`#modalBody`).empty();
            $(`#${toggleId}`).prop("checked", false);
            $(`#modalBody`).html('To add the "<b id="b">' + coinSymbol.toUpperCase() + '</b>" coin, you must unselect one of the following: <br>');
            $('#myModal').css("display", "block");
            $(`#myModal`).css("visibility", "visible");
            $('#keepCurrent').on("click", () => {
                $('#myModal').css("display", "none");
            });
            let counterId = 1;
            for (let i = 0; i < selectedCoins.length; i++) {
                $(`#modalBody`).append(
                    `<div id="modalDiv">
                        <div class="card" id="modalCard">
                            <div class="card-body" id="modalCardBody"> 
                                <h6 id="modalCoinName" class="card-title">${selectedCoins[i].toUpperCase()}</h6>
                                <label class="switch" id="modalSwitch">
                                    <input type="checkbox" class="checkbox" id="chosenToggle${counterId}"><span class="slider round" id="modalSlider"></span>
                                </label>
                    
                            </div>
                        </div>
                    </div>`
                )
                $(`#chosenToggle${counterId}`).prop("checked", true);
                $(`#chosenToggle${counterId}`).on("change", () => {
                    let indexCoinRemove = selectedCoins.indexOf(selectedCoins[i]);
                    let toggleToFalse = selectedToggleIds[indexCoinRemove];
                    selectedCoins.splice(indexCoinRemove, 1);
                    selectedToggleIds.splice(indexCoinRemove, 1);
                    selectedCoins.push(coinSymbol);
                    selectedToggleIds.push(toggleId);
                    $(`#myModal`).css("display", "none");
                    $(`#${toggleToFalse}`).prop("checked", false);
                    doubleCheckToggle();
                })
                counterId++;
            }
        }
    }
}

function doubleCheckToggle() {
    for (let i = 0; i < selectedToggleIds.length; i++) {
        $(`#${selectedToggleIds[i]}`).prop('checked', true);
    }
}


//-------------------------------------- Live report ----------------------------------------

let chartInterval;

const liveReportFunc = function () {

    $(`#reportSection`).empty();
    let firstCoinSelected = [];
    let secondCoinSelected = [];
    let thirdCoinSelected = [];
    let fourthCoinSelected = [];
    let fifthCoinSelected = [];
    let coinKeysArray = [];

    chartInterval = setInterval(() => {
        getDataFromAPI();
    }, 2000);

    function getDataFromAPI() {
        let url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${selectedCoins[0]},${selectedCoins[1]},${selectedCoins[2]},${selectedCoins[3]},${selectedCoins[4]}&tsyms=USD`;
        $.get(url).then(result => {
            $("#reportSection").html(`
            <h2 class="liveReportHeader"> Live Report </h2>
            <div id="chart-container" style="height: 400px; width: 100%; margin-top: 20px">
            </div>`);
            let currentTime = new Date();
            let coinCounter = 1;
            for (let key in result) {
                if (coinCounter == 1) {
                    firstCoinSelected.push({ x: currentTime, y: result[key].USD });
                    coinKeysArray.push(key);
                }

                if (coinCounter == 2) {
                    secondCoinSelected.push({ x: currentTime, y: result[key].USD });
                    coinKeysArray.push(key);
                }

                if (coinCounter == 3) {
                    thirdCoinSelected.push({ x: currentTime, y: result[key].USD });
                    coinKeysArray.push(key);
                }

                if (coinCounter == 4) {
                    fourthCoinSelected.push({ x: currentTime, y: result[key].USD });
                    coinKeysArray.push(key);
                }

                if (coinCounter == 5) {
                    fifthCoinSelected.push({ x: currentTime, y: result[key].USD });
                    coinKeysArray.push(key);
                }
                coinCounter++;
            }
            createChart();
        })
    }

    function createChart() {
        let options = {
            animationEnabled: false,
            backgroundColor: "white",
            title: {
                text: "Currencies"
            },
            axisX: {
                ValueFormatString: "HH: mm: ss",
                titleFontColor: "red",
                lineColor: "red",
                labelFontColor: "red",
                tickColor: "red"
            },
            axisY: {
                suffix: "$",
                titleFontColor: "blue",
                lineColor: "blue",
                labelFontColor: "blue",
                tickColor: "blue"
            },
            tooltip: {
                shared: true
            },
            data: [{
                type: "spline",
                name: coinKeysArray[0],
                showInLegend: true,
                xValueFormatString: "HH: mm: ss",
                dataPoints: firstCoinSelected
            },
            {
                type: "spline",
                name: coinKeysArray[1],
                showInLegend: true,
                xValueFormatString: "HH: mm: ss",
                dataPoints: secondCoinSelected
            },
            {
                type: "spline",
                name: coinKeysArray[2],
                showInLegend: true,
                xValueFormatString: "HH: mm: ss",
                dataPoints: thirdCoinSelected
            },
            {
                type: "spline",
                name: coinKeysArray[3],
                showInLegend: true,
                xValueFormatString: "HH: mm: ss",
                dataPoints: fourthCoinSelected
            },
            {
                type: "spline",
                name: coinKeysArray[4],
                showInLegend: true,
                xValueFormatString: "HH: mm: ss",
                dataPoints: fifthCoinSelected
            }]
        }
        $(`#chart-container`).CanvasJSChart(options);
        $("#reportSection").append(options);
    }
}

$("#reportSection").append(liveReportFunc);
