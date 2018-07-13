const express = require('express');
const auth = require('./helpers/auth');
const Room = require('../models/room');
const Post = require('../models/post');
const comments = require('./comments');

const router = express.Router({ mergeParams: true });

// Posts new
router.get('/new', auth.requireLogin, (req, res) => {
  Room.findById(req.params.id, (err, room) => {
    if (err) { console.error(err); }

    console.log(room);

    res.render('posts/new', { room });
  });
});

// Posts create
router.post('/', auth.requireLogin, (req, res) => {
  Room.findById(req.params.id, (err, room) => {
    if (err) { console.error(err); }

    const post = new Post(req.body);
    post.room = room;

    post.save((err) => {
      if (err) { console.error(err); }
      return res.redirect(`/rooms/${room._id}`);
    });
  });
});

// added
router.use('/:id/comments', comments); // vamos a ver como nos va con :id

module.exports = router;
