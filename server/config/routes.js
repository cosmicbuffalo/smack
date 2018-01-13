
import { Router } from 'express';
import users      from './routes/user.routes';
import teams      from './routes/team.routes';
import posts      from './routes/post.routes';
import channels   from './routes/channel.routes';
import files      from './routes/file.routes';
import comments   from './routes/comment.routes';
import personas   from './routes/persona.routes';

const router = new Router();

users(router)
teams(router)
posts(router)
channels(router)
files(router)
comments(router)
personas(router)

export default router;
