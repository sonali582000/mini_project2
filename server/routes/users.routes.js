const User = require("../models/User.model")
const router = require("express").Router();

router.get("/users/:id", async(req, res)=> {
    const {id} = req.params;
    try {
        const user = await User.findById(id)
    res.status(200).json(user)
    } catch (error) {
        res.status(500).json({error: "error occurs"})
    }
    
})

module.exports = router;