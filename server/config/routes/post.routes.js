
import * as PostController from './../../controllers/posts';

export default (router) => {
             
  router.route('/channels/:channelId/posts')
    .get(PostController.allForChannel) //should retrieve all the posts associated with a specific channel and return them in order from oldest to newest
    .post(PostController.create); //should create a new post in a specific channel, returns post object or errors {_persona:personaID, content:text, **OPTIONAL** file:file}

  // router.route('/posts/:postId')
  //   .post(PostController.update); //should update post with post data and return post object or errors
  
};

