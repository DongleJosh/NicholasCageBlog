const { Post, User, Comment } = require('../models');

const homeController = {
  // Get all posts and display them on the homepage
  async getAllPosts(req, res) {
    try {
      const postsData = await Post.findAll({
        include: [User],
        order: [['created_at', 'DESC']]
      });
      const posts = postsData.map(post => post.get({ plain: true }));

      res.render('homepage', { posts, loggedIn: req.session.loggedIn });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Get a single post and display it on the page
  async getOnePost(req, res) {
    try {
      const postData = await Post.findByPk(req.params.id, {
        include: [
          User,
          {
            model: Comment,
            include: [User]
          }
        ]
      });

      if (!postData) {
        res.status(404).json({ message: 'No post found with this id!' });
        return;
      }

      const post = postData.get({ plain: true });

      res.render('single-post', { post, loggedIn: req.session.loggedIn });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
};

module.exports = homeController;
