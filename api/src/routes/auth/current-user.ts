import { ParameterizedContext } from 'koa';
import { Route } from '../router.js';
import authorized from '../../middleware/authorized.js';

async function handler(ctx: ParameterizedContext<{user:Schema.User}>) {
  ctx.body = ctx.state.user;
}

const route: Route = {
  method: 'get',
  path: '/auth',
  middleware: [
    authorized(),
    handler
  ]
}

export default route
