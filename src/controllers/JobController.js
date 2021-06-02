const Job = require('../model/Job')
const JobUtils = require('../utils/JobUtils')
const Profile = require('../model/Profile')

module.exports = {
    create(req, res) {
        return res.render( "job")
    },
    async save(req,res){
            await Job.create({
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now()
            });

            return res.redirect('/')
    },
    async show(req, res){

        const jobId = req.params.id
        const jobs = await Job.get();
        const profile = await Profile.get();
        
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