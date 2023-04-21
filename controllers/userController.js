const { User } = require('../models');
const bcrypt = require('bcrypt');

const userController = {
  async create(req, res) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
        username: req.body.username,
        password: hashedPassword
      });
      req.session.save(() => {
        req.session.user_id = user.id;
        req.session.username = user.username;
        req.session.logged_in = true;
        res.status(201).json(user);
      });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  async login(req, res) {
    try {
      const user = await User.findOne({ where: { username: req.body.username } });
      if (!user) {
        res.status(400).json({ message: 'Incorrect username or password. Please try again.' });
        return;
      }
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect username or password. Please try again.' });
        return;
      }
      req.session.save(() => {
        req.session.user_id = user.id;
        req.session.username = user.username;
        req.session.logged_in = true;
        res.json({ user, message: 'You are now logged in!' });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  },

  logout(req, res) {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  }
};

module.exports = userController;
