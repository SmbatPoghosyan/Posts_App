const passport = require('passport');
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt')
const User = require('../models/userModel')
const dotenv = require('dotenv')

dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(options, async (jwtPayload, done) => {
  try {
    const user = await User.query().findById(jwtPayload.user_id)

    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (err) {
    return done(err, false);
  }
}))

module.exports = passport;