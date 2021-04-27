const { update } = require("./Profile");

let data = [
    {
        id: 1,
        name: "Pizzaria Guloso",
        "daily-hours": 2,
        "total-hours": 1,
        create_at: Date.now(),
        budget: 4500,
        status: 'progress'
    },
    {
        id: 2,
        name: "OneTwo Project",
        "daily-hours": 3,
        "total-hours": 47,
        create_at: Date.now(),
        budget: 4500,
        remaining:3,
        satus: 'done'
    }
];

module.exports = {
    get(){
        return data;
    },
    update(newJob){
        data = newJob;
    },
    delete(id){
        data = data.filter(job => Number(job.id) !== Number(id))
    }
}