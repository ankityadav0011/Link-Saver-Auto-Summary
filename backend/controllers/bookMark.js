const express = require("express"
);
const fetchMetadata = require("../utils/fetchMetadata")
const auth = require("../middleware/auth")
const Bookmark = require("../models/Bookmark")
const axios = require("axios")


async function addBookmark(req, res) {
  const { url,tags } = req.body;

  if (!url) {
    return res.status(400).json({
      message: "url not available, please enter url",
    });
  }

  const { title, favicon } = await fetchMetadata(url);
  if (!title || !favicon) {
    return res.status(404).json({
      success: false,
      message: "title and favicon not extracted",
    });
  }

  let summary = "Summary Unavailable";

  try {
    const target = encodeURIComponent(url);
    const response = await axios.get(`https://r.jina.ai/${target}`);
    summary = response.data;
  } catch (e) {
    console.warn("Error fetching summary:", e.message);
    // Continue without breaking
  }

  // Now create the bookmark
  try {
    const bookMark = await Bookmark.create({
      userId: req.user.id,
      url,
      title,
      favicon,
      summary,
      tags,
    });

    return res.status(200).json({
      success: true,
      message: "Bookmark created successfully",
      bookMark,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Error while creating Bookmark",
      error: e.message,
    });
  }
}



// get bookmark by id 

async function getBookmarkById(req, res) {
  try {
    const id = req.user.id;
    const bookMark = await Bookmark.find({ userId: id });
    if (!bookMark || bookMark.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookmarks found for this user ID",
      });
    }
    return res.status(200).json(bookMark); // Return the array directly
  } catch (e) {
    return res.status(500).json({
      message: "Error while fetching bookmarks by this ID",
    });
  }
}


// get bookmark by tags
async function getBookmarkByTags(req, res) {
  try {
    const tag = req.query.tag;
    const filter = tag ? { userId: req.user.id, tags: tag } : { userId: req.user.id };
    const bookmarks = await Bookmark.find(filter);
    if (!bookmarks || bookmarks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookmarks found for this tag",
      });
    }
    return res.status(200).json(bookmarks); // Return the array directly
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching bookmarks by this tag",
    });
  }
}



// delete bookmark for given id 

async function deleteBookmarkById(req, res) {
  try {
    const id = req.params.id;
    const bookmark = await Bookmark.findById(id);

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: "No bookmark available by this ID"
      });
    }

    await Bookmark.findByIdAndDelete(id);  

    return res.status(200).json({
      success: true,
      message: "Bookmark deleted successfully"
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: "Error while deleting bookmark by this ID"
    });
  }
}




module.exports = {
  addBookmark,
  getBookmarkById,
  deleteBookmarkById,
  getBookmarkByTags,
};


