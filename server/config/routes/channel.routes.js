
import * as ChannelController from './../../controllers/channels';

export default (router) => {
             
  router.route('/channels/:channelId')
    .get(ChannelController.show)
    .post(ChannelController.update); // Object Keys (one or the other or both): {name: data, purpose: data}  should update channel with post data and return channel object or errors

  router.route('/teams/:teamId/channels')
    .post(ChannelController.create); //Object Keys: {personaId: data, teamName: data, purpose: data, private: boolean} should create new channel with post data, returns channel object or errors
  
  router.route('/teams/:teamId/channels/:channelId/delete')
    .post(ChannelController.delete); // Object Keys: None just needs the channelId and it should delete channel from team and posts/comments in channel and return success or errors

  router.route('/channels/:channelId/invite')
    .post(ChannelController.invite); // Object Keys: {personaId: data} will find channel and add persona to invite from post data, maybe also send user an email/message of some sort

};

