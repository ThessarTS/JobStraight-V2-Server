const { Op } = require("sequelize")
const { sequelize } = require("../models")
const { User, Job, Company, Skill } = require('../models/index')

class JobController {
    static async addNewJob(req, res, next) {
        const t = await sequelize.transaction()
        try {
            let { title, description, jobType, salary, companyId, mongoId, skills } = req.body

            let newJob = await Job.create({ title, description, jobType, salary, companyId, mongoId }, { transaction: t })

            if (skills) {
                if (skills.length > 0) {
                    skills.forEach(skill => {
                        skill.jobId = newJob.id
                    });
                    await Skill.bulkCreate(skills, { transaction: t })
                }
            }

            await t.commit()
            res.status(201).json({ message: 'success add new job' })
        } catch (error) {
            await t.rollback()
            next(error)
        }
    }

    static async findAllJobs(req, res, next) {
        try {
            let { limits, companyId, keyword } = req.query
            console.log(companyId, keyword);
            let options = {
                include: [Company, Skill],
                order: [['createdAt', 'DESC']],

            }

            if (limits) {
                options.limit = limits
            }

            if (companyId && keyword) {
                options.where = { [Op.and]: [{ companyId }, { title: { [Op.iLike]: `%${keyword}%` } }] }
            }

            if (keyword) {
                options.where = { title: { [Op.iLike]: `%${keyword}%` } }
            }

            if (companyId) {
                options.where = { companyId }
            }

            let jobs = await Job.findAll(options)
            let result = jobs.map(job => {
                return job.get({
                    plain: true
                })
            })

            res.json(result)
        } catch (error) {
            next(error)
        }
    }

    static async findJobById(req, res, next) {
        try {
            let resData = await Job.findOne({
                where: { id: req.params.id },
                include: [Company, Skill]
            })

            let job = resData.get({ plain: true })



            res.json(job)
        } catch (error) {
            next(error)
        }
    }

    static async editJob(req, res, next) {
        try {
            await Job.update(req.body, {
                where: { id: req.params.id }
            })
            res.json({ message: 'success edit job' })
        } catch (error) {
            next(error)
        }
    }

    static async deleteJob(req, res, next) {
        try {
            await Job.destroy({
                where: { id: req.params.id }
            })
            res.json({ message: `Job with id ${req.params.id} deleted` })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = JobController