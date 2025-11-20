// const productRoute = require("./product.route");
const homeRoute = require("./home.route");
const authRoute = require("./auth.route");

module.exports = (app) => {
    app.use('/', homeRoute);

    app.use('/auth', authRoute);

    // app.use("/products", productRoute);
}