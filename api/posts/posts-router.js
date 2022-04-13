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
  let { title, contents } = req.body;

  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Post.insert({ title, contents })
      .then(({ id }) => {
        return Post.findById(id);
      })
      .then((post) => {
        res.status(201).json(post);
      })
      .catch(() => {
        res.status(500).json({
          message: "There was an error while saving the post to the database",
        });
      });
  }
});

// #### 4 [PUT] /api/posts/:id

router.put("/:id", (req, res) => {
  let { title, contents } = req.body;

  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Please provide title and contents for the post" });
  } else {
    Post.findById(req.params.id)
      .then((post) => {
        if (!post) {
          res
            .status(404)
            .json({ message: "The post with the specified ID does not exist" });
        } else {
          return Post.update(req.params.id, req.body);
        }
      })
      .then((post) => {
        if (post) {
          return Post.findById(req.params.id);
        }
      })
      .then((post) => {
        res.status(200).json(post);
      })
      .catch(() => {
        res
          .status(500)
          .json({ message: "The post information could not be modified" });
      });
  }
});

// - If the post is found and the new information is valid:

//   - update the post document in the database using the new information sent in the `request body`.
//   - return HTTP status code `200` (OK).
//   - return the newly updated _post_.

// #### 5 [DELETE] /api/posts/:id
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      await Post.remove(req.params.id);
      res.json(post);
    }
  } catch (err) {
    res.status(500).json({ message: "The post could not be removed" });
  }
});

// #### 6 [GET] /api/posts/:id/comments
// router.get('/:id/comments', (req, res) => {
//     Post.findCommentById(req.params.id)
//         .then(post => {
//             if()
//         })
// })

// - If the _post_ with the specified `id` is not found:

//   - return HTTP status code `404` (Not Found).
//   - return the following JSON: `{ message: "The post with the specified ID does not exist" }`.

// - If there's an error in retrieving the _comments_ from the database:

//   - respond with HTTP status code `500`.
//   - return the following JSON: `{ message: "The comments information could not be retrieved" }`.

module.exports = router;
