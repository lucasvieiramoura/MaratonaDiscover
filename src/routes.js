const express = require('express');
const routes = express.Router()

const Profile = {
    data: {
        name: 'Lucas',
        avatar: 'https://mlohrktvfr9b.i.optimole.com/scftOdE.Oppq~1677e/w:600/h:600/q:82/https://www.nerdstickers.com.br/wp-content/uploads/2020/12/adesivo-extreme-go-horse-ns.png',
        "monthly-budget": 3000,
        "days-per-week": 5,
        "hours-per-day": 5,
        "vacation-per-year": 4,
        "value-hour": 15
    },
    controllers:{
        index(req, res){
            return  res.render(  '/profile', {profile: Profile.data})
        },
        update(req, res){
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

            Profile.data = {
                ...Profile.data,
                ...req.body,
                "value-hour": valueHour
            }

            return res.redirect('/profile')

        }
    }
}

const Job = {
    data:[
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
    ],
    controllers: {
        index(req, res)  {

        const updatejobs = Job.data.map((job) =>{
            
            const remaining = Job.serives.remainingDays(job)
            const status = remaining <= 0 ? 'done' : 'progress'
    
            return {
                ...job,
                remaining,
                status,
                budget: Job.serives.calculateBudget(job, Profile.data["value-hour"])
            }    	    
            })
            return res.render( 'index',{jobs : updatejobs})
        },
        create(req, res) {
            return res.render( "job")
        },
        save(req,res){
                const lastId = Job.data[Job.data.length -1]?.id || 1;
            
                Job.data.push({
                    id: lastId + 1,
                    name: req.body.name,
                    "daily-hours": req.body["daily-hours"],
                    "total-hours": req.body["total-hours"],
                    create_at: Date.now()
                })
                return res.redirect('/')
        },
        show(req, res){

            const jobId = req.params.id
            
            const job = Job.data.find( job => Number(job.id) === Number(jobId))

            if (!job) {
             return res.send('Não encontrado')   
            }

            job.budget = Job.serives.calculateBudget(job, Profile.data["value-hour"])

            return res.render( 'job-edit',{ job })
        },
        update(req, res){

            const jobId = req.params.id

            const job = Job.data.find( job => Number(job.id) === Number(jobId))

            if(!job) {
                return res.send('Valor não encontrado')
            }

            const updateJob = {
                ...job,
                name: req.body.name,
                "total-hours": req.body["total-hours"],
                "daily-hours": req.body["daily-hours"],
            }

            Job.data = Job.data.map( job => {
                
                if( Number(job.id) === Number(jobId)) {
                    job = updateJob
                }
                return job
            })
            res.redirect('job/'+jobId)
        },
        delete (req,res ) {
            const jobId = req.params.id

            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))

            return res.redirect('/')
        }
       
    },
    serives:{
        remainingDays(job){
            // cálculo de tempo restante
            const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed()
        
            const createDate = new Date(job.create_at)
            const dueDay = createDate.getDate() + Number(remainingDays)
            const dueDateInMs = createDate.setDate(dueDay)            
            
            const timeDiffInMs = dueDateInMs - Date.now()
            // dias em mili segundos
            const dayInMs =  1000 * 60 * 60 * 24
            // Math.Floor arredondadmento para baixo
            const dayDiff = Math.floor(timeDiffInMs / dayInMs)
        
            // restam x dias
            return dayDiff
        
        },
        calculateBudget: (job, valueHour) => valueHour * job["total-hours"]
    }
}

routes.get('/',Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/:id', Job.controllers.show)
routes.post('/job/:id', Job.controllers.update)
routes.post('/job/delete/:id', Job.controllers.delete)
routes.get('/profile',Profile.controllers.index)
routes.post('/profile',Profile.controllers.update)

module.exports = routes;