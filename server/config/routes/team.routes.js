import * as TeamController from './../../controllers/teams';

export default (router) => {
             
  router.route('/teams')
    .get(TeamController.index)    //  should return full list of teams
    .post(TeamController.create); //  should create new team with post data, returns team object or errors

  router.route('/teams/:teamUrl')
    .get(TeamController.show);    //  should return the object for a specific team or errors if not found

  router.route('/teams/:teamUrl/login')
    .post(TeamController.login)   //  should log a specific persona in to a specific team by finding the team by teamUrl, then the persona by email, then authenticating the password. will return errors or success

  router.route('/teams/:teamUrl/invite')
    .post(TeamController.invite)  //  should find team and invite a user to join via the email passed in post data
 
};