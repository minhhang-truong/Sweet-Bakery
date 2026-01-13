const Employee = require("../../model/employee.model");
const bcrypt = require('bcrypt');

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
        // Chuẩn hóa dữ liệu đầu vào
        req.body.gender = req.body.gender ? req.body.gender.toLowerCase() : 'other';
        // empId không còn cần thiết nếu ID tự tăng, nhưng giữ để tránh lỗi nếu FE có gửi
        if(req.body.empId) req.body.empId = Number(req.body.empId);
        
        req.body.password = await bcrypt.hash(req.body.password, 10);
        
        // Model đã sửa để xử lý tách tên và insert vào 2 bảng user_account & employee
        await Employee.addEmployee(req.body);
        
        res.status(201).json({ message: "Employee added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports.deleteEmployee = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await Employee.deleteEmployee(id);
        res.status(200).json({message: "Employee deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error"});
    }
}

module.exports.editEmployee = async (req, res) => {
    try {
        // req.body chứa thông tin cần update. Model sẽ xử lý update bảng nào.
        await Employee.editEmployee(req.body);
        res.status(200).json({ message: "Employee updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports.getEmployeeDetails = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const employee = await Employee.getEmployeeDetails(id);
        res.json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error"});
    }
}