
let data = {
        name: 'Lucas',
        avatar: 'https://mlohrktvfr9b.i.optimole.com/scftOdE.Oppq~1677e/w:600/h:600/q:82/https://www.nerdstickers.com.br/wp-content/uploads/2020/12/adesivo-extreme-go-horse-ns.png',
        "monthly-budget": 3000,
        "days-per-week": 5,
        "hours-per-day": 5,
        "vacation-per-year": 4,
        "value-hour": 15
    };


    module.exports = {
        get(){
            return data;
        },
        update(newData){
            data = newData;
        }
    }