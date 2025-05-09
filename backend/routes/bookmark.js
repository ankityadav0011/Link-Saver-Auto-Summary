const express = require('express');
const auth = require('../middleware/auth');
const {addBookmark,getBookmarkById,deleteBookmarkById,getBookmarkByTags} = require("../controllers/bookMark")
const axios = require('axios');
const router = express.Router();



router.post("/",auth,addBookmark)
router.get("/",auth,getBookmarkById)
router.get("/tags/:tag", auth,getBookmarkByTags);
router.delete("/:id",auth,deleteBookmarkById)

module.exports = router;
