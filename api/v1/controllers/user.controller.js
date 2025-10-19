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
            password: req.body.password,
            token: generateHelper.generateRandomString(30),
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
        res.status(400).json({
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
            res.status(400).json({
                code: 400,
                message: "Sai mật khẩu",
            });
            return;
        }
    } else {
        res.status(400).json({
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
        res.status(400).json({
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

// [POST] /api/v1/users/password/otpPassword

module.exports.otpPassword = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    // console.log(email, otp);

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })
    if (!result) {
        res.status(400).json({
            code: 400,
            message: "Mã OTP không hợp lệ",
        });
        return;
    }
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    const token = user.token;
    res.cookie("token", token);
    res.json({
        code: 200,
        message: "Xác thực thành công",
        token: token
    })
}

// [POST]  /api/v1/users/password/resetPassword

module.exports.resetPassword = async (req, res) => {
    const token = req.cookies.token;
    const password = md5(req.body.password);


    const user = await User.findOne({
        token: token,
    });
    if (!user) {
        res.status(400).json({
            code: 400,
            message: "Không tìm thấy tài khoản"
        })
    }
    await User.updateOne(
        {
            token: token,
        },
        {
            password: password
        }
    )
    res.json({
        code: 200,
        message: "Đặt lại mật khẩu thành công",
    })
}

// [GET] api/v1/users/detail

module.exports.detail = async(req, res) =>{
    try {
        // const token = req.cookies.token;
        // const user= await User.findOne({
        //     token: token,
        //     deleted: false
        // }).select("-password -token");
    
        // if(!user){
        //     res.status(400).json({
        //         code: 400,
        //         message: "Không tìm thấy người dùng"
        //     });
        // }
        res.json(
            {
                code: 200,
                message: "Trang cá nhân",
                infoUser: req.user
            }
        )
    } catch (error) {
        res.status(400).json({
            code: 400,
            message: "Đã có lỗi xảy ra"
        })
    }
}

// [GET]  api/v1/users/list

module.exports.list = async(req, res) =>{
    const users = await User.find({
        deleted: false
    }).select("fullName email avarta");
    res.json({
        code: 200,
        message: "Thành công",
        users: users
    })
}
