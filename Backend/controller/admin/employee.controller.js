const Employee = require("../../model/employee.model");

module.exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.getEmployees();
        res.json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.addEmployee = async (req, res) => {
    try {
        await Employee.addEmployee(req.body.data);
        res.status(201).json({ message: "Employee added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.deleteEmployee = async (req, res) => {
    try {
        const id = req.body.id;
        await Employee.deleteEmployee(id);
        res.status(200).json({message: "Employee deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error"});
    }
}