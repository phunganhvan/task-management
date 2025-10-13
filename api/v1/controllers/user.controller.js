const md5 = require('md5');
const User = require("../models/user.model");
// [POST]  /api/v1/users/create
module.exports.register = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });
    if (!existEmail) {
        req.body.password = md5(req.body.password);
        // console.log(req.body);
        const user= new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password
        })
        user.save();
        const token= user.token;
        res.cookie("token", token)
        res.json({
            code: 200,
            message: "Đăng kí tài khoản thành công",
            tokenUser: token
        })
    }
    else {
        res.json({
            code: 400,
            message: "Email đã tồn tại"
        })
    }

}