
import * as CommentController from './../../controllers/comments';

export default (router) => {
             
  router.route('/posts/:postId/commments')
    .post(CommentController.create); // Object Keys: {personaId : cookieId, content: data } should create a new comment for a specific post, returns comment object or errors
  
  router.route('/posts/:postId/comments/:commentId/delete')  
    .post(CommentController.delete); 

  router.route('/comments/:commentId')
    .post(CommentController.update)

};

