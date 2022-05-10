const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");

//-----------------------------------------------basic Validations-------------------------------------------------------------//

const isValidRequestBody = function (value) {
    return Object.keys(value).length > 0
}

const isValid = (value) => {
    if (typeof value == 'undefined' || typeof value == null) return false;
    if (typeof value == 'string' && value.trim().length == 0) return false;
    return true
}

const isValidTitle = function (title) {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) != -1
}


//-------------------------------------------------API-1 [/register]--------------------------------------------------//

const createUser = async function (req, res) {
    try {
        let requestBody = req.body

        //validation for request body and its keys --
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: "invalid request parameters.plzz provide user details" })
            return
        }

        //Validate attributes --
        const { title, name, email, password, phone, address } = requestBody

        if (!isValid(title)) {
            res.status(400).send({ status: false, message: "Title is required" })
            return
        }
        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, message: "plzz enter valid title" })
        }

        if (!isValid(name)) {
            res.status(400).send({ status: false, message: "name is required" })
            return
        }

        if (!/^[A-Za-z\s]{1,}[\.]{0,1}[A-Za-z\s]{0,}$/.test(name)) {
            return res.status(400).send({ status: false, message: "Please enter valid user name." })
        }

        //Email Validation --
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "plzz enter email" })
        }
        const emailPattern = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})/

        if (!email.match(emailPattern)) {
            return res.status(400).send({ status: false, msg: "This is not a valid email" })
        }

        const emailExt = await userModel.findOne({ email: email })
        if (emailExt) {
            return res.status(409).send({ status: false, message: "Email already exists" })
        }

        //Password Validations--
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "plzz enter password" })
        }
        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, message: "plzz enter valid password" })
        }


        //Phone Validations--
        if (!isValid(phone)) {
            return res.status(400).send({ status: false, message: "plzz enter mobile" })
        }

        if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone)) {
            return res.status(400).send({ status: false, message: "Please enter valid 10 digit mobile number." })
        }

        const phoneExt = await userModel.findOne({ phone: phone })
        if (phoneExt) {
            return res.status(409).send({ status: false, message: "phone number already exists" })
        }

        //for address--
        const { street, city, pincode } = address

        if (!/^[a-zA-Z]+$/.test(city)) {
            return res.status(400).send({ status: false, msg: "city field have to fill by alpha characters" });
          }
      
        if (pincode.length > 6 || pincode.length < 6) {
            return res.status(400).send({ status: false, message: "plzz enter valid pincode" })
        }
        if(typeof pincode === NaN){
            return res.status(400).send({ status: false, message: "please mention pincode in numbers format only." })
        }

        //Creation of data--
        let saveData = await userModel.create(requestBody)
        return res.status(201).send({ status: true, message: "success", data: saveData })
    }
    catch (err) {
        return res.status(500).send({ status: "error", msg: err.message })
    }
}



//------------------------------------------------API-2 [/loginUser]-------------------------------------------------------//

const loginUser = async function (req, res) {
    try {
        const data = req.body;
        if (!isValidRequestBody(data)) return res.status(400).send({ status: false, msg: "Please enter  mail and password" })

        const { email, password } = data

        // validation for login
        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "please enter email" })
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return res.status(400).send({ status: false, msg: "please enter valid email address" })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, msg: "please enter password" })
        }
//pasword length should be min 8 and max 15 characters --
        if (password.length < 8 || password.length > 15) {
            return res.status(400).send({ status: false, message: "plzz enter valid password" })
        }

        let user = await userModel.findOne({ email, password });
        if (!user)
            return res.status(404).send({ status: false, msg: "Please enter email address and password" });

        let token = jwt.sign(
            {
                userId: user._id.toString(),
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 10 * 2 * 60
            },
            "project-3"
        );

        res.setHeader("x-api-key", token);
        return res.status(200).send({ status: true, message: "success", data: token });
    }
    catch (err) {
        console.log(err.message)
        return res.status(500).send({ status: "error", msg: err.message })
    }
}


module.exports.loginUser = loginUser;
module.exports.createUser = createUser;
