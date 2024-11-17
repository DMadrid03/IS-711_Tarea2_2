import express from "express";
import productRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";

const PORT = 3000 || process.env.PORT;
const app = express();

app.use("/products", productRouter);
app.use("/cart", cartRouter);


app.listen(PORT, () =>{
    console.log("Servidor corriendo en el puerto " + PORT);
})

