const { Post, User } = require('../models');

const dashboardController = {
  // Get all the posts for the logged in user and render the dashboard
  async getDashboard(req, res) {
    try {
      const posts = await Post.findAll({
        where: {
          user_id: req.session.user_id,
        },
        include: [
          {
            model: User,
            attributes: ['username'],
          },
        ],
      });

      const postsData = posts.map((post) => post.get({ plain: true }));

      res.render('dashboard', { posts: postsData });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Render the form to create a new post
  createNewPost(req, res) {
    res.render('new-post');
  },

  // Create a new post for the logged in user
  async postNewPost(req, res) {
    try {
      const { title, content } = req.body;

      const newPost = await Post.create({
        title,
        content,
        user_id: req.session.user_id,
      });

      res.status(200).json(newPost);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Render the form to update an existing post
  async updatePost(req, res) {
    try {
      const post = await Post.findOne({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });

      if (!post) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      const postData = post.get({ plain: true });

      res.render('update-post', { post: postData });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Update an existing post for the logged in user
  async putUpdatePost(req, res) {
    try {
      const { title, content } = req.body;

      const updatedPost = await Post.update(
        {
          title,
          content,
        },
        {
          where: {
            id: req.params.id,
            user_id: req.session.user_id,
          },
        }
      );

      if (updatedPost[0] === 0) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      res.status(200).json(updatedPost);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Delete an existing post for the logged in user
  async deletePost(req, res) {
    try {
      const deletedPost = await Post.destroy({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });

      if (!deletedPost) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      res.status(200).json(deletedPost);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};

module.exports = dashboardController;
