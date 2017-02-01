'use strict';

// Load Module Dependencies
var express      = require('express');
var bodyParser   = require('body-parser');
var responseTime = require('response-time');
var xtend        = require('xtend');
var mongoose     = require('mongoose');
var async        = require('async');

// Load Controllers
var articleController = require('./controllers/article');
var commentController = require('./controllers/comment');

var authenticate      = require('./lib/authenticate');
var authorize         = require('./lib/authorize');

var app = express();

mongoose.connect('mongodb://localhost/blog');

mongoose.connection.on('connected', function connectionListener() {
  console.log('I cant wait to go home!');
});

// Setup Middleware
app.use(bodyParser.json());

app.use(responseTime());

app.use(authenticate({
  set_auth: true
}));
// - ARTICLES -
// GET /articles
app.get('/articles', authorize(['admin']), articleController.getArticles);
// GET /articles/:id
app.get('/articles/:articleId', authorize(['admin', 'consumer']), articleController.getArticle);
// GET /articles/:id/comments
app.get('/articles/:articleId/comments', authorize(['admin', 'consumer']), articleController.getArticleComments);
// POST /articles
app.post('/articles', authorize(['admin', 'consumer']), articleController.createArticle);
// DELETE /articles
app.delete('/articles', authorize(['admin']),  articleController.deleteArticles);
// PUT /articles/:id/comments
app.put('/articles/:articleId/comments', articleController.updateArticle);
// DELETE /articles/:id
app.delete('/articles/:articleId', authorize(['admin', 'consumer']),  deleteArticle);
// - COMMENTS -
// GET /comments
app.get('/comments',commentController.getAllComments);
// GET /comments/:id
// Retrieve a specific Comment with a given id
app.get('/comments/:commentId', authorize(['consumer', 'admin']),commentController.getComment);
// POST /comments
app.post('/comments', authorize(['consumer', 'admin' ]), commentController.createComment);
// DELETE /comments
app.delete('/comments', authorize(['admin']), commentController.deleteComments);
// DELETE /comments/:id
app.delete('/comments/:commentId', authorize(['admin', 'consumer']),commentController.deleteComment);
// DELETE /articles/:id/comments
app.delete('/articles/:articleId/comments', authorize(['admin']),commentController.deleteArticleComments );
// - PUT(Updating a resource)
//  - /articles
//  - /comments
//  - /articles/:id
//  - /comments/:id
//  - /articles/:id/comments
// PUT /articles
app.put('/articles', authorize(['admin']), articleController.updateArticles);

// PUT /comments
app.put('/comments', authorize(['admin']), commentController.updateComments);

// PUT /articles/:id
app.put('/articles/:articleId', authorize(['consumer', 'admin']), articleController.updateArticle );

// PUT /comments/:id
app.put('/comments/:commentId', authorize(['admin', 'consumer']),commentController.updateComment);

// Error Handling Middleware
app.use(function errorHandler(err, req, res, next) {
  if(err.name === 'CastError') {
    err.STATUS = 400;
  }
  res.status(err.STATUS || 500);
  res.json({
    error: true,
    message: err.message,
    type: err.name,
    status: err.STATUS || 500
  });
});
app.listen(8000, function connectionListener() {
  console.log('API Server running on port 8000');
});
