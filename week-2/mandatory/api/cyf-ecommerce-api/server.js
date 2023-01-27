const express = require("express");
const app = express();

const {
    Pool
} = require('pg');

const pool = new Pool({
    user: 'ann',
    host: 'localhost',
    database: 'cyf_ecommerce',
    password: '',
    port: 5432
});

const bodyParser = require("body-parser");
app.use(bodyParser.json());


app.get("/customers", function (req, res) {
    pool.query('SELECT * FROM customers', (error, result) => {
        res.json(result.rows);
    });
});

app.get("/suppliers", function (req, res) {
    pool.query('SELECT * FROM suppliers', (error, result) => {
        res.json(result.rows);
    });
});

app.get("/orders", function (req, res) {
    pool.query('SELECT * FROM orders', (error, result) => {
        res.json(result.rows);
    });
});

app.get("/products", function (req, res) {
    pool.query('SELECT product_name, supplier_name FROM products, suppliers WHERE products.supplier_id = suppliers.id', (error, result) => {
        res.json(result.rows);
    });
});

// app.get("/products", function (req, res) {
//     const productNameQuery = req.query.product_name;
//     let query = `SELECT product_name FROM products`;

//     if (productNameQuery) {
//       query = `SELECT product_name FROM products WHERE 
//       product_name LIKE '${productNameQuery}' 
//       OR product_name LIKE '${productNameQuery} %' 
//       OR product_name LIKE '% ${productNameQuery}' 
//       OR product_name LIKE '% ${productNameQuery} %' 
//     `
//     }

//     pool
//       .query(query)
//       .then((result) => res.json(result.rows))
//       .catch((e) => console.error(e));
//   });


app.get("/customers/:customerId", function (req, res) {
    const customerId = req.params.customerId;

    pool
        .query("SELECT * FROM customers WHERE id=$1", [customerId])
        .then((result) => res.json(result.rows))
        .catch((e) => console.error(e));
});



app.post("/customers", function (req, res) {
    const newCustomerName = req.body.name;
    const newCustomerAddress = req.body.address;
    const newCustomerCity = req.body.city;
    const newCustomerCountry = req.body.country;

    pool
        .query("SELECT * FROM customers WHERE name=$1", [newCustomerName])
        .then((result) => {
            if (result.rows.length > 0) {
                return res
                    .status(400)
                    .send("A customer with the same name already exists!");
            } else {
                const query =
                    "INSERT INTO customers (name, address, city, country) VALUES ($1, $2, $3, $4)";

                pool
                    .query(query, [newCustomerName, newCustomerAddress, newCustomerCity, newCustomerCountry])
                    .then(() => res.send("Customer created!"))
                    .catch((e) => console.error(e));
            }
        });
})



app.post("/products", function (req, res) {
    const newProductName = req.body.product_name;
    const newProductPrice = req.body.unit_price;
    const newProductSupplierID = req.body.supplier_id;

    if (!Number.isInteger(newProductPrice) || newProductPrice <= 0) {
        return res
            .status(400)
            .send("The price should be a positive integer.");
    }

    pool
        .query("SELECT * FROM products WHERE supplier_id=$1", [newProductSupplierID])
        .then((result) => {
            if (result.rows.length == 0) {
                return res
                    .status(400)
                    .send("A product with the supplier id does not exist!");
            } else {
                const query =
                    "INSERT INTO products (product_name, unit_price, supplier_id) VALUES ($1, $2, $3)";

                pool
                    .query(query, [newProductName, newProductPrice, newProductSupplierID])
                    .then(() => res.send("Product created!"))
                    .catch((e) => console.error(e));
            }
        });
});


app.post("/customers/:customerId/orders", function (req, res) {
    const customerId = req.params.customerId;
    const newOrdersDate = req.body.order_date;
    const newOrderReference = req.body.order_reference;
    const newCustomerID = customerId;
  

    pool
        .query("SELECT * FROM customers WHERE id=$1", [customerId])
        .then((result) => {
            if (result.rows.length == 0) {
                return res
                    .status(400)
                    .send("A customer does not exist!");
            } else {
                const query =
                    "INSERT INTO orders (order_date, order_reference, customer_id) VALUES ($1, $2, $3)";

                pool
                    .query(query, [newOrdersDate, newOrderReference, newCustomerID])
                    .then(() => res.send("Orders created!"))
                    .catch((e) => console.error(e));
            }
        });
})


app.put("/customers/:customerId", function (req, res) {
    const customerId = req.params.customerId;
    const newName = req.body.name;
    const newAddress = req.body.address;
    const newCity = req.body.city;
    const newCountry = req.body.country;

  
    pool
      .query("UPDATE customers SET name=$1, address=$2, city=$3, country=$4  WHERE id=$5", [newName, newAddress, newCity, newCountry, customerId])
      .then(() => res.send(`Customer ${customerId} updated!`))
      .catch((e) => console.error(e));
  });




app.delete("/orders/:orderId", function (req, res) {
    const orderId = req.params.orderId;
  
    pool
      .query("DELETE FROM order_items WHERE order_id=$1", [orderId])
      .then(() => {
        pool
          .query("DELETE FROM orders WHERE id=$1", [orderId])
          .then(() => res.send(`Order ${orderId} deleted!`))
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  });


app.delete("/customers/:customerId", function (req, res) {
    const customerId = req.params.customerId;

    pool
        .query("SELECT FROM orders WHERE customer_id=$1", [customerId])
        .then((result) => {
            if (result.rowCount == 0) {
                pool
                    .query("DELETE FROM customers WHERE id=$1", [customerId])
                    .then(() => res.send(`Customer ${customerId} deleted!`))
                    .catch((e) => console.error(e));
            } else {
                res.send(`Can not delete customer ${customerId}`)
            }
        })
        .catch((e) => console.error(e));
});


app.get("/customers/:customerId/orders", function (req, res) {
    const customerId = req.params.customerId;
        // let query = `
        // SELECT 
        // order_date, order_reference, product_name, unit_price, supplier_name, quantity 
        // FROM 
        // orders, products, suppliers, order_items
        // WHERE 
        // products.supplier_id = suppliers.id
        // AND 
        // orders.id = order_items.order_id
        // AND
        // order_items.product_id = products.id
        // AND
        // orders.customer_id =  $1`;
    
    
        pool
          .query(" SELECT order_date, order_reference, product_name, unit_price, supplier_name, quantity FROM orders, products, suppliers, order_items WHERE products.supplier_id = suppliers.id AND orders.id = order_items.order_id AND order_items.product_id = products.id AND orders.customer_id =$1",  [customerId])
          .then((result) => res.json(result.rows))
          .catch((e) => console.error(e));
})





app.listen(3002, function () {
    console.log("Server is listening on port 3002. Ready to accept requests!");
});