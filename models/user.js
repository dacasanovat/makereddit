const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// eslint-disable-next-line
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

UserSchema.pre('save', function (next) {
  const user = this;

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) return next(err);

    user.password = hash;
    return next();
  });
});

UserSchema.statics.authenticate = (username, password, next) => {
  User.findOne({ username })
    .exec((err, user) => {
      if (err) {
        return next(err);
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
      return next(err);
      }
      bcrypt.compare(password, user.password, (err, result) => {
        if (result === true) {
          return next(null, user);
        }
        return next();
      });
    });
}

const User = mongoose.model('User', UserSchema);
module.exports = User;
