const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')

module.exports = {
    index(req, res)  {
    
    const jobs = Job.get();
    const profile = Profile.get();

    const updatejobs = jobs.map((job) =>{
        
        const remaining = JobUtils.remainingDays(job)
        const status = remaining <= 0 ? 'done' : 'progress'

        return {
            ...job,
            remaining,
            status,
            budget: JobUtils.calculateBudget(job, profile["value-hour"])
        }    	    
        })
        return res.render( 'index',{jobs : updatejobs})
    },
    create(req, res) {
        return res.render( "job")
    },
    save(req,res){

        const jobs = Job.get();

            const lastId = jobs[jobs.length -1]?.id || 1;
        
            jobs.push({
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
        const jobs = Job.get();
        const profile = Profile.get();
        
        const job = jobs.find( job => Number(job.id) === Number(jobId))

        if (!job) {
         return res.send('Não encontrado')   
        }

        job.budget = JobUtils.calculateBudget(job, profile["value-hour"])

        return res.render( 'job-edit',{ job })
    },
    update(req, res){

        const jobId = req.params.id
        const jobs = Job.get();

        const job = jobs.find( job => Number(job.id) === Number(jobId))

        if(!job) {
            return res.send('Valor não encontrado')
        }

        const updateJob = {
            ...job,
            name: req.body.name,
            "total-hours": req.body["total-hours"],
            "daily-hours": req.body["daily-hours"],
        }

        const newJobs = jobs.map( job => {
            
            if( Number(job.id) === Number(jobId)) {
                job = updateJob
            }
            return job
        })

        Job.update(newJobs)

        res.redirect(jobId)
    },
    delete (req,res ) {
        const jobId = req.params.id       

        Job.delete(jobId)

        return res.redirect('/')
    }
}