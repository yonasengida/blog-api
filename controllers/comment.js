//Load Module Dependecies
var Comment = require('../dal/comment');

// Get all comments
exports.getAllComments= function getComments(req, res, next) {

  // Retrieve all the Comments
  Article.find({}, function getAllArticles(err, docs) {
    if(err) {
      return next(err);
    }

    res.json(docs);
  });

};

// Get Specfic Comment
exports.getComment = function getComment(req, res, next) {

  var commentId = req.params.commentId;

  // Query DB for the specific comment with the given ID
  Comment.findById(commentId, function findComment(err, comment) {
    if(err) {
      return next(err);
    }

    // If comment find return it
    if(comment) {
      res.json(comment);

    } else {
      res.status(404);
      res.json({
        error: true,
        message: 'Comment Requested Not Found!',
        status: 404
      });

    }
  });

};

//Create Comment

exports.createComment= function createComment(req, res, next) {
  var body    = req.body;
  var now     = new Date();

  var newComment = {
    article: body.article,
    content: body.content,
    author: body.author,
    last_updated: now,
    created_at: now
  };

  // SAVE THE NEW COMMENT TO THE DB
  newComment.save(function cb(err, comment) {
    if(err) {
      return next(err);
    }

    // Return Comment
    res.status(201);
    res.json(comment);

  });

};

// DELETE All COMMENT
exports.deleteComments=function deleteComments(req, res, next) {

  // Remove All Documents in the comments collection
  Comment.remove({}, function removeAll(err) {
    if(err) {
      return next(err);
    }

    res.json({
      message: 'Comments Deleted!'
    });
  });

};

//Delete A comment
exports.deleteComment= function deleteComment(req, res, next) {

  var commentId = req.params.commentId;

  // Find the comment with the given Id and Remove it
  Comment.findOneAndRemove({ _id: commentId }, function removeComment(err, comment) {
    if(err) {
      return next(err);
    }

    if(!comment) {
      res.status(404);
      res.json({
        error: true,
        message: 'Comment To Be Deleted Not Found!',
        status: 404
      });
    }

    // Remove Comment from Article Consequently By Updating the comments attribute
    Article.findOneAndUpdate({ _id: comment.article }, { $pull: { comments: comment._id } }, function updateArticle(err, article) {
      if(err) {
        return next(err);
      }

      res.json(comment);
    });
  });

};

//Delete Article Comments

exports.deleteArticleComments = function deleteArticleComments(req, res, next) {

  var articleId = req.params.articleId;

  // Reset Comments attribute for a given Article
  Article.findOneAndUpdate({ _id: comment.article }, { $set: { comments: [] } }, function updateArticle(err, article) {
    if(err) {
      return next(err);
    }

    res.json(article);
  });

}

//Update Comment

exports.updateComment = function updateComment(req, res, next) {
  var body      = req.body;
  var commentId = req.params.commentId;

  // Update the given Comment using the body data
  Comment.findByIdAndUpdate(commentId, body, function update(err, comment) {
    if(err) {
      return next(err);
    }

    if(!comment) {
      res.status(404);
      res.json({
        error: true,
        message: 'Comment To Be Updated Not Found!',
        status: 404
      });
      return;

    } else {
      res.json(comment);

    }
  });
};
// update all comments
exports.updateComments=function updateComments(req, res, next) {
  var body = req.body;

  // Update all articles using the given body data;
  Comment.update(body, function updateAll(err) {
    if(err) {
      return next(err);
    }

    res.json({
      message: 'All Comments updated successfully'
    });

  });

}