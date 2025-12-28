const pool = require('../config/pool');

class Product {
    static async getAllProducts() {
        try {
            const query = `SELECT c.name AS cat_name, c.slug, p.id, p.name, p.images, p.price FROM category c
            JOIN product p ON c.id = p.category_id ORDER BY c.name`;
            const cat =  await pool.query(query);
            let res = [];
            for(let i = 0; i < cat.rows.length; i++){
                if(i == 0 || cat.rows[i].cat_name != cat.rows[i-1].cat_name){
                    let currCat = {
                        category: cat.rows[i].cat_name,
                        slug: cat.rows[i].slug,
                    };
                    let items = [];
                    for(let j = i; j < cat.rows.length; j++){
                        if(cat.rows[j].cat_name == cat.rows[i].cat_name){
                            items.push({
                                id: cat.rows[j].id,
                                name: cat.rows[j].name,
                                image: cat.rows[j].images,
                                price: cat.rows[j].price,
                            });
                            i = j;
                        } else {
                            break;
                        }
                    }
                    currCat.items = items;
                    res.push(currCat);
                }
            }
            return res;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getStock() {
        try {
            const query = `SELECT p.id, p.name, price, stock, c.name as category, p.description FROM product p
                            JOIN category c ON p.category_id = c.id
                            ORDER BY p.id;`
            const res = await pool.query(query);
            return res.rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getMenu() {
        try {
            const query = `SELECT id, name, price FROM product ORDER BY name`;
            const res= await pool.query(query);
            return res.rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async addProduct(data) {
        try {
            let cat_id = await pool.query(`SELECT id FROM category WHERE name = $1`, [data.category]);
            if(cat_id.rows.length === 0 ) {
                cat_id = await pool.query(`INSERT INTO category (name, slug) VALUES ($1, $2) RETURNING id`, [data.category, data.slug]); 
            }
            const query = `INSERT INTO product (name, category_id, price, provide_id, images, id, stock, description, status) VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9);`;
            const values = [data.productName, cat_id.rows[0].id, data.price, 1, data.image, data.sku, data.count, data.description, data.status];
            await pool.query(query, values);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async deleteProduct(id) {
        try {
            const query = `DELETE FROM product WHERE id = $1`;
            await pool.query(query, [id]);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async getProductDetails(id) {
        try {
            const query = `SELECT p.name, description, images, p.id, price, c.name AS category, stock, status
                            FROM product p
                            JOIN category c ON p.category_id = c.id
                            WHERE p.id = $1`;
            const res = await pool.query(query, [id]);
            return res.rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    static async updateProduct(data) {
        try {
            const query = `UPDATE product
                            SET name = $1, price = $2, description = $3, stock = $4, status = $5
                            WHERE id = $6`;
            const values = [data.productName, data.price, data.description, data.count, data.status, data.sku];
            const res = await pool.query(query, values);
            return res.rows[0];
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

module.exports = Product;