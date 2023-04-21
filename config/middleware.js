const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sequelize = require('./config/connection');
const { User } = require('./models');

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

const addAuthUserToLocals = async (req, res, next) => {
  res.locals.authenticated = false;
  if (req.session.authenticated) {
    const user = await User.findByPk(req.session.user_id);
    res.locals.authenticated = true;
    res.locals.username = user.username;
  }
  next();
};

module.exports = { session: session(sess), addAuthUserToLocals };
