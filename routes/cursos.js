const express = require('express')
const Course = require('../models/Course')
const User = require('../models/User')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require('fs')
const path = require('path')
const router = express.Router()



router.get('/todos', async (req, res)=>{

    try {
        const cursos = await Course.find()
        res.json(cursos)
    } catch (err) {
        console.error("Error fetching courses:", err);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get('/curso/:id', async (req, res)=>{
    try {
        const curso = await Course.findById(req.params.id)
        if (!curso) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.json(curso)
    } catch (err) {
        console.error("Error fetching course:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}
)
router.post('/addcurso', async (req, res)=>{
    try {
        console.log('body',req.body)
        const { title, description,nextClass, instructor, price, category, level, duration, syllabus, image } = req.body
        const newCurso = new Course({
            title,
            description,
            instructor,
            price,
            category,
            level,
            nextClass,
            duration,
            image,
            syllabus
        })
        await newCurso.save()
        res.status(201).json(newCurso)
    } catch (err) {
        console.log("Error creating course:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}
)
router.put('/curso/:id', async (req, res)=>{
    try {
        const { title, description, instructor, price, category, level, duration, image,nextClass, syllabus } = req.body
        const curso = await Course.findByIdAndUpdate(req.params.id, {
            title,
            description,
            instructor,
            price,
            category,
            level,
            duration,
            nextClass,
            image,
            syllabus
        }, { new: true })
        if (!curso) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.json(curso)
    } catch (err) {
        console.error("Error updating course:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}
)
router.delete('/curso/:id', async (req, res)=>{
    try {
        const curso = await Course.findByIdAndDelete(req.params.id)
        if (!curso) {
            
            return res.status(404).json({ error: "Course not found" });
        }
        res.json({ message: "Course deleted successfully" })
    } catch (err) {
        console.error("Error deleting course:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}
)
router.post('/curso/:id/matricular', async (req, res)=>{
    try {
        const { userId } = req.body
        const curso = await Course.findById(req.params.id)
        if (!curso) {
            return res.status(404).json({ error: "Course not found" });
        }
        if (curso.studentsEnrolled.includes(userId)) {
            return res.status(400).json({ error: "User already enrolled in this course" });
        }
        curso.studentsEnrolled.push(userId)
        await curso.save()
        1
    } catch (err) {
        console.error("Error enrolling in course:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}
)
router.post('/curso/:id/desmatricular', async (req, res)=>{
    try {
        const { userId } = req.body
        const curso = await Course.findById(req.params.id)
        if (!curso) {
            return res.status(404).json({ error: "Course not found" });
        }
        if (!curso.studentsEnrolled.includes(userId)) {
            return res.status(400).json({ error: "User not enrolled in this course" });
        }
        curso.studentsEnrolled.pull(userId)
        await curso.save()
        res.json(curso)
    } catch (err) {
        console.error("Error unenrolling from course:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}
)
router.get('/curso/:id/alunos', async (req, res)=>{
    try {
        const curso = await Course.findById(req.params.id).populate('studentsEnrolled', 'name email')
        if (!curso) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.json(curso.studentsEnrolled)
    } catch (err) {
        console.error("Error fetching enrolled students:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}
)
router.get('/curso/:id/syllabus', async (req, res)=>{
    try {
        const curso = await Course.findById(req.params.id)
        if (!curso) {
            return res.status(404).json({ error: "Course not found" });
        }
        res.json(curso.syllabus)
    } catch (err) {
        console.error("Error fetching syllabus:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}
)
router.post('/curso/:id/syllabus', async (req, res)=>{
    try {
        const { syllabus } = req.body
        const curso = await Course.findById(req.params.id)
        if (!curso) {
            return res.status(404).json({ error: "Course not found" });
        }
        curso.syllabus.push(syllabus)
        await curso.save()
        res.json(curso)
    } catch (err) {
        console.error("Error adding syllabus:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}
)
router.delete('/curso/:id/syllabus/:syllabusId', async (req, res)=>{
    try {
        const { syllabusId } = req.params
        const curso = await Course.findById(req.params.id)
        if (!curso) {
            return res.status(404).json({ error: "Course not found" });
        }
        curso.syllabus.pull(syllabusId)
        await curso.save()
        res.json(curso)
    } catch (err) {
        console.error("Error deleting syllabus:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}
)

module.exports = router;