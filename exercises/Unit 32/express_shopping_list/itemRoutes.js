const express = require("express")
const ExpressError = require('./expressError');
const ITEMS = require('./fakeDb');
const router = new express.Router();

router.get("/", (req, res) => {
    return res.json({ ITEMS });
});

router.post("/", (req, res, next) => {
    try{
        if (!req.body.name || !req.body.price) throw new ExpressError("Name or Price is missing", 400);
        const foundItem = ITEMS.find(i => i.name === req.body.name);
        if (foundItem) throw new ExpressError("Item already exists, try a patch request to update item", 400);
        const newItem = {name: req.body.name, price: req.body.price};
        ITEMS.push(newItem);
        return res.status(201).json( { added: newItem })
    }catch(e){
        return next(e);
    }
});

router.get("/:name", (req, res, next) => {
    try{
        const foundItem = ITEMS.find(i => i.name === req.params.name)
        if (!foundItem) throw new ExpressError("Item not found", 404);
        return res.json( foundItem );
    }catch(e){
        return next(e);
    }
});

router.patch("/:name", (req, res,next) => {
    try{
        const foundItem = ITEMS.find(i => i.name === req.params.name);
        if (!foundItem) throw new ExpressError("Item not found", 404);
        foundItem.name = req.body.name || foundItem.name;
        foundItem.price = req.body.price || foundItem.price;
        return res.json({ updated: foundItem });
    }catch(e){
        return next(e);
    }
});

router.delete("/:name", (req, res, next) => {
    try{
        const foundItemIndex = ITEMS.findIndex(i => i.name === req.params.name);
        if (foundItemIndex === -1) throw new ExpressError("Item not found", 404);
        ITEMS.splice(foundItemIndex, 1);
        return res.json({ message: "Deleted" });
    }catch(e){
        return next(e);
    }
});

module.exports = router;