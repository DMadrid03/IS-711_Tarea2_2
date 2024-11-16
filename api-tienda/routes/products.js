import { Router,json } from "express";

const productRouter = Router();

productRouter.use(json());
productRouter.get("/", (req, res) => {
    res.json({ message: "Hello world (get)" });
});

productRouter.get("/:id", (req, res) => {
    res.json({ message: "Hello world (get/:id)" });
});

productRouter.post("/", (req, res) => {
    res.json({ message: "Hello world (post)" });
})

productRouter.put("/:id", (req, res) => {
    res.json({ message: "Hello world (put/:id)" });
})

productRouter.delete("/:id", (req, res) => {
    res.json({ message: "Hello world (delete/:id)" });
})
export default productRouter;