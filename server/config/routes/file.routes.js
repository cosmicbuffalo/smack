import * as FileController from './../../controllers/files';

export default (router) => {
             
  router.route('/files/upload')
    .post(FileController.create);

  router.route('/channels/:channelId/files')
    .get(FileController.allForChannel);

  router.route('/personas/:personaId/files')
    .post(FileController.allForUser);

};