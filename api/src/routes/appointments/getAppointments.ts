import Database from '../../infrastructure/database.js';
import { Route } from '../../infrastructure/routes.js';

const route: Route = {
  method: 'get',
  path: '/appointments',
  middleware: [
    async (ctx, next) => {
      console.log('Before handler', ctx.ip);
      await next();
      console.log('After handler');
    },
    async (ctx) => {
      using db = new Database();
      ctx.body = await db.query({
        text: 'select * from games'
      })
    }
  ]
}

export default route
