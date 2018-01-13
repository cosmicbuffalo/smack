import * as PersonaController from './../../controllers/personas';

export default (router) => {
             
  router.route('/teams/:teamUrl/personas')
    .post(PersonaController.create); //should create new persona for specific team, add the persona to the user specified in post data, and return persona object or errors

  router.route('/personas/:personaId')
    .get(PersonaController.getPersona);

  router.route('/personas/:personaId/login')
    .post(PersonaController.update)

};