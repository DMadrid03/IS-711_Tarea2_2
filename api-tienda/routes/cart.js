import { Router ,json} from "express";

const cartRouter = Router();

cartRouter.use(json());

cartRouter.get("/:userID", (req, res) => {
    res.json({ message: "Hello world (get/:userID)" });
});

cartRouter.post("/", (req, res) => {
    res.json({ message: "Hello world from cartRouter (post)" });
})

cartRouter.delete("/:id", (req, res) => {
    res.json({ message: "Hello world from cartRouter (delete/:id)" });
})

export default cartRouter;