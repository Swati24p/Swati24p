const express= require("express")
const router= express.Router()
const collegeController = require("../controller/collegeController1")
const internController = require("../controller/internController");



router.post('/functionup/colleges', collegeController.createCollege )

router.post('/functionup/interns', internController.createInterns )

router.get('/functionup/collegeDetails',internController.getCollegeDetails)



module.exports = router;