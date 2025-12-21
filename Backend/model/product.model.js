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

    static async addProduct(data) {
        try {
            const query = `INSERT INTO product (name, category_id, price, provider_id, images, id, stock) VALUES
            ($1, $2, $3, $4, $5, $6, 0);`;
            const values = [data.name, data.categoryId, data.price, data.providerId, data.images, data,id];
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
}

module.exports = Product;