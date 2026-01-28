import { promises as fs } from 'fs';

export default class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        const data = await fs.readFile(this.path, 'utf-8');
        return JSON.parse(data);
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(product => product.id === id);
    }

    async addProduct(product) {
        const {
            title,
            description,
            code,
            price,
            stock,
            category,
        } = product;

        if (
            !title || !description || !code ||
            typeof price !== 'number' ||
            typeof stock !== 'number' ||
            !category
        ) {
            throw new Error("Campos inválidos o incompletos");
        }

        const products = await this.getProducts();

        const newId = products.length > 0
            ? Math.max(...products.map(p => p.id)) + 1
            : 1;

        const newProduct = {
            id: newId,
            title,
            description,
            code,
            price,
            stock,
            category
        };

        products.push(newProduct);

        await fs.writeFile(this.path, JSON.stringify(products, null, 2));

        return newProduct;
    }

    /*Para crear nuevos productos en Postman usar este formato:
    {
    "title": " ",
    "description": " ",
    "code": " ",
    "price": 15000,
    "status": true,
    "stock": 20,
    "category": " ",
    "thumbnails": []
    }
    */

    async updateProduct(id, updateField) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);
        if (index === -1) return null;
        products[index] = { ...products[index], ...updateField, id };
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return products[index];
    }

    async deleteProduct(id) {
        let products = await this.getProducts();
        const idNumber = Number(id);

        const newProducts = products.filter(product => product.id !== idNumber);
        if (newProducts.length === products.length) return null;
        await fs.writeFile(this.path, JSON.stringify(newProducts, null, 2));
        return true;
    }
}