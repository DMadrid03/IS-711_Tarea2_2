import { Router,json } from "express";
import {ProductsController} from "../controllers/productsController.js";


const productRouter = Router();

productRouter.use(json());
productRouter.get("/", ProductsController.getAllProducts);

productRouter.get("/:id", ProductsController.getProductById);

productRouter.post("/", ProductsController.createProduct);

productRouter.put("/:id", ProductsController.updateProduct)

productRouter.delete("/:id", ProductsController.deleteProduct)
export default productRouter;