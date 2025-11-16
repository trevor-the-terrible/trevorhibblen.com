import util from 'node:util';

const log = util.debuglog('test');

log('test', 'test');
log('test', 'test:this');
log('test', 'test:this:again', { test: 'test' });
