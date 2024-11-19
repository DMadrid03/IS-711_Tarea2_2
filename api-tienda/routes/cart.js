import { Router ,json} from "express";
import {CartController} from "../controllers/cartController.js";
const cartRouter = Router();

cartRouter.use(json());

cartRouter.get("/:userID", CartController.getCartByUser);

cartRouter.post("/", CartController.addToCart);

cartRouter.delete("/:producto_id", CartController.removeFromCart)


//ruta por defecto para rutas inexistentes
cartRouter.all("*", (req, res) => res.status(404).json({ message: "Ruta no encontrada" }));
export default cartRouter;