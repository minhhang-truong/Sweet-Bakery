const employeeRoute = require("./employee.route");
const productRoute = require("./product.route");
const authRoute = require("./auth.route");

module.exports = (app) => {
    //app.use('/', homeRoute);

    app.use('/manager/auth', authRoute);

    app.use("/manager/employees", employeeRoute);

    app.use("/manager/products", productRoute);
}