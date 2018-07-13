const express = require('express');
const auth = require('./helpers/auth');
const Room = require('../models/room');
const Post = require('../models/post');
const Comment = require('../models/comment');

const router = express.Router({ mergeParams: true });

// comment New
router.get('/new', auth.requireLogin, (req, res) => {
  Room.findById(req.params.id, (err, room) => {
    if (err) { console.error(err); }

    console.log(room);


    Post.findById(req.params.id, (err, post) => {
      if (err) { console.error(err); }

      console.log(room);
      console.log(post);

      res.render('comments/new', { post, room });
    });
  });
});

// comment create
router.post('/', auth.requireLogin, (req, res) => {

  console.log('TEST====');
  Room.findById(req.params.id, (err, room) => {
    if (err) { console.error(err); }

    Post.findById(req.params.id, (err, post) => {
      if (err) { console.error(err); }

      const comment = new Comment(req.body);
      post.comments.unshift(comment);

      post.save((err) => {
        if (err) { console.error(err); }

        comment.save((err) => {
          if (err) { console.error(err); }

          console.log('I am here');

          return res.redirect(`/rooms/${room.id}`);
        });
      });
    });
  });
});

module.exports = router;
