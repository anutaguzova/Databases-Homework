const express = require("express");
const app = express();

const { Pool } = require('pg');

const pool = new Pool({
    user: 'ann',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: '',
    port: 5432
});

app.listen(3002, function() {
    console.log("Server is listening on port 3002. Ready to accept requests!");
});

app.get("/customers", function(req, res) {
    pool.query('SELECT * FROM customers', (error, result) => {
        res.json(result.rows);
    });
});

app.get("/suppliers", function(req, res) {
    pool.query('SELECT * FROM suppliers', (error, result) => {
        res.json(result.rows);
    });
});

// app.get("/products", function(req, res) {
//     pool.query('SELECT product_name, supplier_name FROM products, suppliers WHERE products.supplier_id = suppliers.id', (error, result) => {
//         res.json(result.rows);
//     });
// });
