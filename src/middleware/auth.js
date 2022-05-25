const jwt = require('jsonwebtoken');



const authentication = async function (req, res, next) {
    try {
        let token1 = req.headers['authorization'];
        if (!token1) token1 = req.headers["Authorization"];
        if (!token1) {
            return res.status(400).send({ Error: "Enter Token In BearerToken !!!" });
        }

        let token2=token1.split(" ")
        let token=token2[1]
            let checktoken = jwt.verify(token, "GroupNo14");
            if (!checktoken) {
            return res.status(404).send({ Status: false, msg: "Enter Valid Token !!!" });
        }
        req['userId'] = checktoken.userId;
        next();
    }

    catch (err) {
        res.status(500).send({ msg: err.message });
    }
};



module.exports = { authentication };