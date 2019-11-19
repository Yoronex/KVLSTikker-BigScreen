const slideTime = 5000; // ms

/**
 * @class Carousel
 */

class Carousel {
    constructor(state) {
        this._state = state;
    }

    set state(state) {
        this._state = state
    }

    get state() {
        return this._state
    }

    run() {
        this._state.draw();
        this._state.getNext(this);
        // Update data
    }

    update_data() {
        updateSlideData(this._state.constructor.name);
    }

    interrupt(interruptingState) {
        this._oldState = this._state;
        this._state = interruptingState;
        this._state.next = this._oldState;
        this.run()
    }
}

/**
 * @class Slide
 */

class Slide {
    constructor() {
        if (new.target === Slide) {
            throw new Error("Cannot instantiate abstract class");
        }
        this._contentbox = arguments[0][0];
        this._header = arguments[0][1];
        this._html = arguments[0][2];
    }

    get contentBox() {
        return this._contentbox;
    }

    get header() {
        return this._header;
    }

    get html() {
        return this._html;
    }

    set next(slide) {
        this._next = slide
    }

    get next() {
        return this._next
    }

    getNext(carousel) {
        carousel.state = this._next
    }

    set data(data) {
        this._data = data
    }

    draw() {
        //console.log("Timeout set for " + this._next);
        //sleep(5000);
        //setTimeout(this._next.draw(), slideTime);
        //console.log("Timeout done for " + this._next);
    }
}

/**
 * @class DrankTonight
 * @description Graph of most bought products tonight
 */

class DrankTonight extends Slide {
    constructor() {
        super(arguments);
        this._data = {"labels": [], "values": []}
    }

    draw() {
        this.contentBox.innerHTML = this.html;
        
        var ctx = document.getElementById("graph");
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this._data.labels,
                datasets: [{
                    data: this._data.values,
                    backgroundColor: backgroundColors(this._data.values.length),
                    borderColor: borderColors(this._data.values.length),
                    borderWidth: 1
                }]
            },
            options: {
                animation: false,
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            fontSize: 30,
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            fontSize: 30
                        }
                    }]
                }
            }
        });
    }
}

/**
 * @class PriceList
 * @description Table of prices of all available products
 */

class PriceList extends Slide {
    constructor() {
        super(arguments);
        this._data = {"names": [], "prices": []}
    }

    draw() {
        this.contentBox.innerHTML = `<div class="pricelist" id="pricetable"></div>`;
        const height = document.getElementById("pricetable").offsetHeight;
        let products = this._data.names.length;
        if (products % 2 === 1) {
            products = products + 1;
            this._data.names.push("");
            this._data.prices.push("");
        }

        let fontSize = parseInt(Math.floor(height / products) / 1.5);

        if (fontSize > 24) {
            fontSize = 24;
        }

        let table = "";
        for (let i = 0; i < products; i++) {
            let name = this._data.names[i];
            let price = this._data.prices[i];
            if (i % 2 === 0) {
                table = table + `<tr><td style='text-align: right; width: 23%'>${name}</td><td style="width: 4%"></td><td style='text-align: left; width: 23%'>${price}</td>`
            } else {
                table = table + `<td style='text-align: right; width: 23%'>${name}</td><td style="width: 4%"></td><td style='text-align: left; width: 23%'>${price}</td></tr>`
            }
        }

        this.contentBox.innerHTML = `<h1>Drankjes</h1><div class="pricelist" id="pricetable"><table width="100%" style="font-size: ${fontSize}px">${table}</table></div>`
    }
}

/**
 * @class Quote
 * @description Random quote stored in Tikker
 */
class Quote extends Slide {
    constructor() {
        super(arguments);
        this._data = "";
    }

    draw() {
        const quote = this._data;
        this.contentBox.innerHTML = `<div id="quote" style="font-size: 30px; height: 100%"><table style="width: 100%; height: 100%"><tr><td style="vertical-align: center">${quote}</td></tr></table></div>`;
    }
}

/**
 * @class Debt
 * @description Wall of shame for who has the most debt
 */

class Debt extends Slide {
    constructor() {
        super(arguments);
        this._data = {'names': [], 'amount': []}
    }

    draw() {
        let table = ""
        for (let i = 0; i < Math.min(12, this._data.names.length); i++) {
            const name = this._data.names[i];
            const debt = this._data.amount[i];
            if (i === 0) {
                table = table + "<tr style='font-size: 48px'>";
            } else if (i === 1) {
                table = table + "<tr style='font-size: 40px'>";
            } else if (i === 2) {
                table = table + "<tr style='font-size: 32px'>";
            } else {
                table = table + "<tr style='font-size: 24px'>";
            }

            const row = `<td style="text-align: right; width: 48%">${name}</td><td style="width: 4%"></td><td style="text-align: left; width: 48%; color: red;">${debt}</td></tr>`
            table = table + row;

            this.contentBox.innerHTML = `<h1>Meeste schulden</h1><table style='width: 100%'>${table}</table>`
        }
    }
}

class Message extends Slide {
    constructor() {
        super(arguments);
        this._data = ""
    }

    draw() {
        const quote = this._data;
        this.contentBox.innerHTML = `<div id="quote" style="font-size: 30px; height: 100%"><table style="width: 100%; height: 100%"><tr><td style="vertical-align: center">${quote}</td></tr></table></div>`;
    }
}

/**
 * supportive functions
 */

function backgroundColors(length) {
    var result = [];
    for (var i = 0; i < length; i++) {
        if (i % 2 === 0) {
            result.push('rgba(11, 131, 55, 0.5)');
        } else {
            result.push('rgba(255, 200, 0, 0.5)');
        }
    }
    return result;
}

function borderColors(length) {
    var result = [];
    for (var i = 0; i < length; i++) {
        if (i % 2 === 0) {
            result.push('rgba(11, 131, 55, 1.0)');
        } else {
            result.push('rgba(255, 200, 0, 1.0)');
        }
    }
    return result;
}

/**
 * Initialization
 */

let carousel;
let slides = {};

function startCarousel() {
    const contentBox = document.getElementById("content");

    slides.DrankTonight = new DrankTonight(contentBox, "Meest gedronken vanavond", `<h1>Meest gedronken vanavond</h1><canvas class="graph" id="graph"></canvas>`);
    slides.Debt = new Debt(contentBox, "Grootste schuld", '');
    slides.PriceList = new PriceList(contentBox, "Drankjes", '');
    slides.Quote = new Quote(contentBox, "Citaat", "");

    slides.Message = new Message(contentBox, "Bericht", '');

    /*slides.drankTonight.data = {
        "labels": ['Bier', 'Apfelkorn', 'Cola'],
        "data": [10, 4, 7]};*/

    slides.DrankTonight.next = slides.Debt;
    slides.Debt.next = slides.Quote;
    slides.Quote.next = slides.PriceList;
    slides.PriceList.next = slides.DrankTonight;


    carousel = new Carousel();
    carousel.state = slides.DrankTonight;
    runCarouselObj();
}

let carouselLoop;

function runCarouselObj() {
    carousel.run();
    carouselLoop = setTimeout(runCarouselObj, slideTime);
    carousel.update_data()
}

function interruptCarousel(interruptingState) {
    clearTimeout(carouselLoop);
    carousel.interrupt(interruptingState);
    carouselLoop = setTimeout(runCarouselObj, slideTime);
}