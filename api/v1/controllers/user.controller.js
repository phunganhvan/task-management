const md5 = require('md5');
const User = require("../models/user.model");
// [POST]  /api/v1/users/register
module.exports.register = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false
    });
    if (!existEmail) {
        req.body.password = md5(req.body.password);
        // console.log(req.body);
        const user = new User({
            fullName: req.body.fullName,
            email: req.body.email,
            password: req.body.password
        })
        user.save();
        const token = user.token;
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

// [POST] /api/v1/users/login

module.exports.login = async (req, res) => {
    const email = req.body.email;
    const password = md5(req.body.password);

    const user = await User.findOne({
        email: email,
        deleted: false
    });
    if (user) {
        if (password === user.password) {
            const token= user.token;
            res.cookie("token", token);
            res.json({
                code: 200,
                message: "Đăng nhập thành công",
                token: user.token
            });
            return;
        } else {
            res.json({
                code: 400,
                message: "Sai mật khẩu",
            });
            return;
        }
    } else {
        res.json({
            code: 400,
            message: "Email không tồn tại",
        });
        return;
    }

}