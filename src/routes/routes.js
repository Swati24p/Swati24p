const express= require("express")
const router= express.Router()
const collegeController = require("../controller/collegeController1")
const internController = require("../controller/internController");



router.post('/functionup/colleges', collegeController.createCollege )   //1

router.post('/functionup/interns', internController.createInterns )     //2

router.get('/functionup/collegeDetails',collegeController.getCollegeDetails)  //3



module.exports = router;