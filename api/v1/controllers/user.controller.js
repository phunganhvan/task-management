const md5 = require('md5');
const User = require("../models/user.model");
const ForgotPassword = require('../models/forgotPassword.model');
const generateHelper = require("../../../helpers/generate");
const sendMailHelper = require("../../../helpers/sendMail");

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
            const token = user.token;
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

// [POST] /api/v1/users/password/forgot

module.exports.forgotPassword = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false,
    });
    if (!user) {
        res.json({
            code: 400,
            message: "Email không tồn tại"
        });
        return;
    }
    // lưu vào DB  trong 2p
    const otp = generateHelper.generateRandomOtp(6);
    const timeExp = 12;
    const objPassword = {
        email: email,
        otp: otp,
        expiresAfter: Date.now()
    }

    const forgotPassword = new ForgotPassword(objPassword);
    await forgotPassword.save();

    // gửi otp qua email user
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    const html = `
            Mã OTP để lấy lại mật khẩu là <b style="color: green; font-size: 24px">${otp}</b>. Thời hạn sử dụng là 2 phút.
            Vui lòng không chia sẻ với bất kì ai
        `;

    sendMailHelper.sendMail(email, subject, html);

    res.json({
        code: 200,
        message: "Đã gửi mã OTP xác nhận"
    })
}