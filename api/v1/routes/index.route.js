const taskRoute = require("../routes/task.route")
const userRoute = require("../routes/user.route")

const authMiddlewares = require("../middlewares/auth.middlewares");
module.exports = (app) => {
    const version = "/api/v1"
    app.use(version+ `/tasks`, authMiddlewares.requireAuth ,taskRoute);
    app.use(version+ '/users', userRoute);
}