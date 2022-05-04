const express= require("express")
const router= express.Router()
const collegeController = require("../controller/collegeController")



router.post('/functionup/colleges', collegeController.createCollege )

router.post('/functionup/interns', collegeController.createInterns )





module.exports = router;