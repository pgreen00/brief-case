import { ParameterizedContext } from 'koa';
import authorized from '~/middleware/authorized.js';

async function handler(ctx: ParameterizedContext<{ user: Schema.User }>) {
  ctx.body = ctx.state.user;
}

export default [
  authorized(),
  handler
]
