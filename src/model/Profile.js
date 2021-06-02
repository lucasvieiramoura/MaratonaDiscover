const Database = require('../db/config')



    module.exports = {

        async get(){

            const db = await Database()

            const data = await db.get(`select * from profile`)

            db.close(data)

            return {
                name: data.name,
                avatar: data.avatar,
                "monthly-budget": data.monthly_budget,
                "days-per-week": data.days_per_week,
                "hours-per-day": data.hours_per_day,
                "vaction-per-day": data.vacation_per_day,
                "value-hour": data.value_hour

            };
        },
        async update(newData){
           
            const db = await Database()

            db.run(`UPDATE profile SET 
            name = '${newData.name}',
            avatar = '${newData.avatar}',
            monthly_budget = '${newData["monthly-budget"]}',
            days_per_week = '${newData["days-per-week"]}',
            hours_per_day = '${newData["hours-per-day"]}',
            vacation_per_year = '${newData["vacation-per-year"]}',
            value_hour = '${newData["value-hour"]}'
            `)

            await db.close()
        }
    }