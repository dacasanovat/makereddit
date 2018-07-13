const express = require('express');
const auth = require('./helpers/auth');
const Room = require('../models/room');
const posts = require('./posts');
const Post = require('../models/post');

const router = express.Router();

// Rooms index
router.get('/', (req, res) => {
  Room.find({}, 'topic', (err, rooms) => {
    if (err) {
      console.error(err);
    } else {
      res.render('rooms/index', { rooms });
    }
  });
});

// Rooms new
router.get('/new', auth.requireLogin, (req, res) => {
  res.render('rooms/new');
});

// Rooms show
router.get('/:id', auth.requireLogin, (req, res) => {
  Room.findById(req.params.id, (err, room) => {
    if (err) { console.error(err); }

    Post.find({ room }).populate('comments').exec((err, posts) => { // No entiendo porque el "posts" esta con el "err"
      if (err) { console.error(err); }

      res.render('rooms/show', { room, posts });
    });
  });
});

// Rooms edit
router.get('/:id/edit', auth.requireLogin, (req, res) => {
  Room.findById(req.params.id, (err, room) => {
    if (err) { console.error(err); }

    res.render('rooms/edit', { room });
  });
});

// Rooms update
router.post('/:id', auth.requireLogin, (req, res) => {
  Room.findByIdAndUpdate(req.params.id, req.body, (err) => {
    if (err) { console.error(err); }

    res.redirect(`/rooms/${req.params.id}`);
  });
});

// Rooms create
router.post('/', auth.requireLogin, (req, res) => {
  const room = new Room(req.body);

  room.save((err) => {
    if (err) { console.error(err); }

    return res.redirect('/rooms');
  });
});

router.use('/:id/posts', posts);

module.exports = router;
