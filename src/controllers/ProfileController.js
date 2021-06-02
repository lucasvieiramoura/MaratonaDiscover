
const Profile = require('../model/Profile')

module.exports = {
    async index(req, res){
        return  res.render(  'profile', {profile: await Profile.get()})
    },
    async update(req, res){
        // req.body pegar dados
        const data = req.body

        // definir semanda do ano: 52 
        const weeksPerYear = 52
        // remover as semanda do ano
        const weeksPerMonth = ( weeksPerYear - data["vacation-per-year"]) / 12

        //quantas horas por semana trabalharei
        const weekTotalHours =  data["hours-per-day"] * data["days-per-week"]

        //total de horas trabalhar nos mÊs
        const monthlyTotalHours = weekTotalHours * weeksPerMonth

        //Qual sera valor da minha horas
        const valueHour = data["monthly-budget"] / monthlyTotalHours

        const profile = await Profile.get()

        Profile.update({
            ...profile,
            ...req.body,
            "value-hour": valueHour

        }) 

        return res.redirect('profile')

    }
}