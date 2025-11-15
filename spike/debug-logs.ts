import util from 'node:util';
import log from './debug';

// const debug = util.debuglog('test');
// debug('test');
// debug('test:this');
// debug('test:this:again', { test: 'test' });

log('test', 'test');
log('test', 'test:this');
log('test', 'test:this:again', { test: 'test' });
