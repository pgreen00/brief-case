import { before, describe, it } from 'node:test';
import assert from 'node:assert';
import { port, startServer } from '../setup.js';
import db from '~/infrastructure/database.js'

describe('Businesses', () => {
  before(async () => {
    await startServer()
  })
  it('should fetch businesses', async () => {
    const {count} = await db.one<{count:number}>('select count(id) as count from businesses')
    const response = await fetch(`http://localhost:${port}/businesses`);
    const businesses = await response.json();
    assert.strictEqual(response.status, 200);
    assert(Array.isArray(businesses))
    assert.equal(businesses.length, count)
  });
});
