const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expiresAfter: {
            type: Date,
            // TTL index: xóa khi thời điểm này đã qua
            expires: 120
        }
    },
    {
        timestamps: true,
    }
);
const ForgotPassword = mongoose.model("ForgotPassword", forgotPasswordSchema, "forgot-password");
module.exports = ForgotPassword;