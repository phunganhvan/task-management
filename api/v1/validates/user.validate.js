module.exports.registerPost=  (req, res, next) =>{

    if(!req.body.fullName || !req.body.email ||!req.body.password){
        res.json(
            {
                code: 400,
                message: "Vui lòng nhập đủ thông tin"
            }
        )
        return;
    }
    // console.log("OK")
    next();
}

module.exports.loginPost=  (req, res, next) =>{

    if(!req.body.email ||!req.body.password){
        res.json(
            {
                code: 400,
                message: "Vui lòng nhập đủ thông tin"
            }
        )
        return;
    }
    // console.log("OK")
    next();
}

module.exports.forgotPasswordPost=  (req, res, next) =>{

    if(!req.body.email){
        res.json(
            {
                code: 400,
                message: "Vui lòng email"
            }
        )
        return;
    }
    // console.log("OK")
    next();
}

module.exports.resetPasswordPost=  (req, res, next) =>{

    if(!req.body.password){
        res.json(
            {
                code: 400,
                message: "Vui lòng nhập mật khẩu"
            }
        )
        return;
    }
    if(!req.body.confirmPassword){
        res.json(
            {
                code: 400,
                message: "Vui lòng xác nhận mật khẩu"
            }
        )
        return;
    }
    if(req.body.password !== req.body.confirmPassword){
        res.json(
            {
                code: 400,
                message: "Mật khẩu không trùng khớp. Vui lòng kiểm tra lại!"
            }
        )
        return;
    }
    // console.log("OK")
    next();
}
