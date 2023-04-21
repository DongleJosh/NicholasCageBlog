const { Post, User, Comment } = require('../models');

const postController = {
  getAllPosts: async (req, res) => {
    try {
      const postData = await Post.findAll({
        include: [
          {
            model: User,
            attributes: ['username'],
          },
          {
            model: Comment,
            include: {
              model: User,
              attributes: ['username'],
            },
          },
        ],
      });

      const posts = postData.map((post) => post.get({ plain: true }));
      res.render('homepage', { posts, loggedIn: req.session.loggedIn });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  getOnePost: async (req, res) => {
    try {
      const postData = await Post.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ['username'],
          },
          {
            model: Comment,
            include: {
              model: User,
              attributes: ['username'],
            },
          },
        ],
      });

      if (!postData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      const post = postData.get({ plain: true });
      res.render('single-post', { post, loggedIn: req.session.loggedIn });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  newPost: async (req, res) => {
    try {
      const postData = await Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id,
      });
      res.status(200).json(postData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  updatePost: async (req, res) => {
    try {
      const postData = await Post.update(
        {
          title: req.body.title,
          content: req.body.content,
        },
        {
          where: {
            id: req.params.id,
            user_id: req.session.user_id,
          },
        }
      );
      if (!postData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.status(200).json(postData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  deletePost: async (req, res) => {
    try {
      const postData = await Post.destroy({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });
      if (!postData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.status(200).json(postData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
};

module.exports = postController;
