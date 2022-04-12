// implement your posts router here
const express = require("express");
const Post = require("./posts-model");

const router = express.Router();

// #### 1 [GET] /api/posts
router.get("/", (req, res) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The posts information could not be retrieved" });
    });
});

// #### 2 [GET] /api/posts/:id

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist" });
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The post information could not be retrieved" });
    });
});

// #### 3 [POST] /api/posts
router.post("/", (req, res) => {
  let title = req.body.title;
  let contents = req.body.contents;
  let newPost = {
    title: title,
    contents: contents,
  };
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Post.insert(newPost)
      .then((newPost) => {
        res.status(201).json(newPost);
      })
      .catch(() => {
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }
});

// - If the request body is missing the `title` or `contents` property:

//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON: `{  }`.

// - If the information about the _post_ is valid:

//   - save the new _post_ the the database.
//   - return HTTP status code `201` (Created).
//   - return the newly created _post_.

// - If there's an error while saving the _post_:
//   - respond with HTTP status code `500` (Server Error).
//   - return the following JSON: `{  }`.

// #### 4 [PUT] /api/posts/:id

// - If the _post_ with the specified `id` is not found:

//   - return HTTP status code `404` (Not Found).
//   - return the following JSON: `{ message: "The post with the specified ID does not exist" }`.

// - If the request body is missing the `title` or `contents` property:

//   - respond with HTTP status code `400` (Bad Request).
//   - return the following JSON: `{ message: "Please provide title and contents for the post" }`.

// - If there's an error when updating the _post_:

//   - respond with HTTP status code `500`.
//   - return the following JSON: `{ message: "The post information could not be modified" }`.

// - If the post is found and the new information is valid:

//   - update the post document in the database using the new information sent in the `request body`.
//   - return HTTP status code `200` (OK).
//   - return the newly updated _post_.

// #### 5 [DELETE] /api/posts/:id

// - If the _post_ with the specified `id` is not found:

//   - return HTTP status code `404` (Not Found).
//   - return the following JSON: `{ message: "The post with the specified ID does not exist" }`.

// - If there's an error in removing the _post_ from the database:

//   - respond with HTTP status code `500`.
//   - return the following JSON: `{ message: "The post could not be removed" }`.

// #### 6 [GET] /api/posts/:id/comments

// - If the _post_ with the specified `id` is not found:

//   - return HTTP status code `404` (Not Found).
//   - return the following JSON: `{ message: "The post with the specified ID does not exist" }`.

// - If there's an error in retrieving the _comments_ from the database:

//   - respond with HTTP status code `500`.
//   - return the following JSON: `{ message: "The comments information could not be retrieved" }`.

module.exports = router;
