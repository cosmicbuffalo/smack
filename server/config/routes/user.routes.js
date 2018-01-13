import * as UserController from './../../controllers/users';

export default (router) => {
             
  router.route('/users')
    .get(UserController.index)    //  should return full list of teams
 
};