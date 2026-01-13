module.exports.generateRandomString = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let res = "";
    for(let i = 0; i < length; i++){
        res += characters.charAt(Math.floor(Math.random() * characters.length));
    }
     return res;
}

// Thêm hàm này để tạo ID đơn hàng đúng chuẩn Database mới
module.exports.generateOrderId = () => {
    const numbers = "0123456789";
    let res = "ORD"; // Bắt buộc phải có prefix này
    
    // Random thêm 9 số
    for(let i = 0; i < 9; i++){
        res += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    return res;
}