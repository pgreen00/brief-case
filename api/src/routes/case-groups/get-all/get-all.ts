import { ParameterizedContext } from 'koa';
import authenticated from '../../../middleware/authenticated.js';
import { Route } from '../../router.js';
import db from '../../../infrastructure/database.js';
import sql from '../../../infrastructure/sql.js';
import authorized from '../../..//middleware/authorized.js';

type CaseGroupWithDepth = Schema.CaseGroup & { depth: number, path: number[] }
type CaseGroupWithChildren = Schema.CaseGroup & { children: CaseGroupWithChildren[] }

function buildCaseGroupTree(flatData: CaseGroupWithDepth[]) {
  const idMap = new Map<number, CaseGroupWithChildren>();
  const tree: CaseGroupWithChildren[] = [];

  // First, map all items by id
  flatData.forEach(item => {
    idMap.set(item.id, { ...item, children: [] });
  });

  // Then, construct the tree
  flatData.forEach(item => {
    const node = idMap.get(item.id);
    if (node && item.parent_id === null) {
      tree.push(node); // Top-level node
    } else if (node && item.parent_id) {
      const parent = idMap.get(item.parent_id);
      if (parent) {
        parent.children.push(node); // Nest under parent
      }
    }
  });

  return tree;
}

async function handler(ctx: ParameterizedContext) {
  ctx.body = buildCaseGroupTree(
    await db.many<CaseGroupWithDepth>(
      sql(import.meta.url, './get-all-case-groups.sql')
    )
  )
}

const route: Route = {
  method: 'get',
  path: '/case_groups',
  middleware: [
    authenticated(),
    authorized('case_groups:write'),
    handler
  ]
}

export default route
