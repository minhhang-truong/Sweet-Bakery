const orderRoute = require("./order.route");
const stockRoute = require("./stock.route");
const authRoute = require("./auth.route");
const menuRoute = require("./menu.route");

module.exports = (app) => {
    app.use('/employee/menu', menuRoute);

    app.use('/employee/auth', authRoute);

    app.use("/employee/order", orderRoute);

    app.use("/employee/stock", stockRoute);
}