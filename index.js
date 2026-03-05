import express from "express";  
import db from "./db/db.js";
const app = express();

import productsRoutes from "./routes/products.routes.js";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/products", productsRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});