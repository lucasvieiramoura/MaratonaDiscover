const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')

module.exports = {
    async index(req, res)  {
    
    const jobs = await Job.get();
    const profile = await Profile.get();

        let statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length
        }

        //total de horas por dia de cada Job em progresso
        let jobTotalHours = 0


        const updatejobs = jobs.map((job) =>{
            
            const remaining = JobUtils.remainingDays(job)
            const status = remaining <= 0 ? 'done' : 'progress'
            
            //statusCunt[done || progress ] soma na linha 12 ou 13 
            // +=1  a + a = result  1 + 1 
            statusCount[status] += 1;

            // Total de horas por dia de cada job em progress
            jobTotalHours = status == 'progress' ? Number(jobTotalHours) + Number(job["daily-hours"]) : Number(jobTotalHours)

            return {
                ...job,
                remaining,
                status,
                budget: JobUtils.calculateBudget(job, profile["value-hour"])
            }    	    
        })

        // Qts de horas que quero trabalhar por dia (profile)
        // MENOS
        // quantidade de horas/dia de cada job in progress
        const freeHours = profile["hours-per-day"] - jobTotalHours;

        return res.render( 'index',{jobs : updatejobs, profile : profile, statusCount: statusCount, freeHours: freeHours})
    }
}

