const slideTime = 20000; // ms

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

    draw() {}
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

class MostDrank1 extends Slide {
    constructor() {
        super(arguments);
        this._data = {"labels": [], "values": [], "product_name": ""}
    }

    draw() {
        const name = this._data.product_name;
        this.contentBox.innerHTML = `<h1>Gedronken: ${name}</h1><canvas class="graph" id="graph"></canvas>`;
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

class MostDrank2 extends Slide {
    constructor() {
        super(arguments);
        this._data = {"labels": [], "values": [], "product_name": ""}
    }

    draw() {
        const name = this._data.product_name;
        this.contentBox.innerHTML = `<h1>Gedronken: ${name}</h1><canvas class="graph" id="graph"></canvas>`;
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

class MostDrank3 extends Slide {
    constructor() {
        super(arguments);
        this._data = {"labels": [], "values": [], "product_name": ""}
    }

    draw() {
        const name = this._data.product_name;
        this.contentBox.innerHTML = `<h1>Gedronken: ${name}</h1><canvas class="graph" id="graph"></canvas>`;
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

        let fontSize = parseInt(Math.floor(height / products));

        if (fontSize > 32) {
            fontSize = 32;
        }

        let table = "";
        for (let j = 0; j < 2; j++) {
            if (j % 2 === 1) {
                table = table + `<td style="width: 6%"></td>`
            }
            table = table + `<td style="width: 47%"><table style="width: 100%;">`;

            for (let i = 0; i < products / 2; i++) {
                let name = this._data.names[i + j * products / 2];
                let price = this._data.prices[i + j * products / 2];
                if (j % 2 === 0) {
                    table = table + `<tr><td style='text-align: right;'>${name}</td><td style="width: 5%"></td><td style='text-align: left;'>${price}</td></tr>`;
                } else {
                    table = table + `<tr><td style='text-align: right;'>${price}</td><td style="width: 5%"></td><td style='text-align: left;'>${name}</td></tr>`;
                }
            }
            table = table + `</table></td>`;
        }

        this.contentBox.innerHTML = `<h1>Drankjes</h1><div class="pricelist" id="pricetable"><table width="100%" style="font-size: ${fontSize}px"><tr>${table}</tr></table></div>`
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
        this.contentBox.innerHTML = `<div id="quote" style="font-size: 30px; height: 100%; padding: 30px"><table style="width: 100%; height: 100%"><tr><td style="vertical-align: center; font-size: 40px"><i>${quote}</i></td></tr></table></div>`;
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
        this.contentBox.innerHTML = `<div id="quote" style="font-size: 30px; height: 100%"><table style="width: 100%; height: 100%"><tr><td style="vertical-align: center; font-size: 40px">${quote}</td></tr></table></div>`;
    }
}

class Title extends Slide {
    constructor() {
        super(arguments);
        this._data = {'beer': "", 'flugel': ""}
    }

    draw() {
        const beer = this._data.beer;
        const flugel = this._data.flugel;
        this.contentBox.innerHTML = `<div id="title" style="font-size: 40px; height: 100%">
<table style="width: 100%; height: 100%">
<tr>
<td style="vertical-align: center;">
<b style="font-size: 56px">Prins Pils</b style="font-size: 56px"><br>${beer}
</td>
</tr>
<tr>
<td style="vertical-align: center;">
<b style="font-size: 56px">Flügelmeisje</b><br>${flugel}
</td></tr></table></div>`
    }
}

class RecentlyPlayed extends Slide {
    constructor() {
        super(arguments);
        this._data = [];
    }

    draw() {
        const pre = `<h1>Recent afgespeelde nummers</h1></h1><table style="width: 100%;">`;

        let content = "";
        for (let i = 0; i < this._data.length; i++) {
            const timestamp = this._data[i].timestamp;
            const track = this._data[i].artist + " - " + this._data[i].title;
            content = content + `<tr><td style="text-align: right; min-width: 120px; vertical-align: top;">${timestamp}</td><td style="width: 5%"></td><td style="text-align: left;">${track}</td></tr>`
        }

        const post = `</table>`;
        this.contentBox.innerHTML = pre + content + post;
    }
}

class Calendar extends Slide {
    constructor() {
        super(arguments);
        this._data = {'upcoming_events': false};
    }

    draw() {
        const pre = `<h1>Aankomende activiteiten</h1></h1><table style="width: 100%;">`;

        let content = "";
        let name, date, days;
        if (this._data.upcoming_events) {
            for (let i = 0; i < this._data.calendar.length; i++) {
                name = this._data.calendar[i].name;
                date = this._data.calendar[i].date;
                days = this._data.calendar[i].days;
                content = content + `<tr><td style="text-align: right; min-width: 250px; vertical-align: top;">${date}</td><td style="width: 5%"><td style="text-align: left; width: 180px; vertical-align: top;">(${days} dagen)</td><td style="text-align: left;">${name}</td></tr>`
            }
        } else {
            content = `<tr><td style="text-align: center;">Er zijn geen aankomende activiteiten :(</td></tr>`
        }

        const post = `</table>`;
        this.contentBox.innerHTML = pre + content + post;
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
let contentBox;

function initCarousel() {
    contentBox = document.getElementById("content");

    slides.DrankTonight = new DrankTonight(contentBox, "Meest gedronken vanavond", `<h1>Meest gedronken vanavond</h1><canvas class="graph" id="graph"></canvas>`);
    slides.MostDrank1 = new MostDrank1(contentBox, "Gedronken: ", "");
    slides.MostDrank2 = new MostDrank2(contentBox, "Gedronken: ", "");
    slides.MostDrank3 = new MostDrank3(contentBox, "Gedronken: ", "");
    slides.RecentlyPlayed = new RecentlyPlayed(contentBox, "Laatst afgespeelde nummers", "");
    slides.Title = new Title(contentBox, "Burgelijke Titels", "");
    slides.Debt = new Debt(contentBox, "Grootste schuld", '');
    slides.PriceList = new PriceList(contentBox, "Drankjes", '');
    slides.Quote = new Quote(contentBox, "Citaat", "");
    slides.Calendar = new Calendar(contentBox, "Kalender", "");

    slides.Message = new Message(contentBox, "Bericht", '');

    /*slides.drankTonight.data = {
        "labels": ['Bier', 'Apfelkorn', 'Cola'],
        "data": [10, 4, 7]};*/

    slides.DrankTonight.next = slides.MostDrank1;
    slides.MostDrank1.next = slides.MostDrank2;
    slides.MostDrank2.next = slides.MostDrank3;
    slides.MostDrank3.next = slides.RecentlyPlayed;
    slides.RecentlyPlayed.next = slides.Calendar;
    slides.Calendar.next = slides.Title;
    slides.Title.next = slides.Debt;
    slides.Debt.next = slides.Quote;
    slides.Quote.next = slides.PriceList;
    slides.PriceList.next = slides.DrankTonight;


    carousel = new Carousel();
    carousel.state = slides.Calendar;
    return carousel.state.constructor.name
}

let carouselLoop;

function runCarouselObj() {
    setTimeout(drawWithCarouselObj, 500);
    hideContentBox();
}

function drawWithCarouselObj() {
    carousel.run();
    carouselLoop = setTimeout(runCarouselObj, slideTime);
    showContentBox();
    carousel.update_data()
}

function hideContentBox() {
    contentBox.style.opacity = '0'
}

function showContentBox() {
    contentBox.style.opacity = '1'
}

function interruptCarousel(interruptingState) {
    clearTimeout(carouselLoop);
    carousel.interrupt(interruptingState);
    carouselLoop = setTimeout(runCarouselObj, slideTime);
}