import {test, expect} from "bun:test";
import { handler, verifySignature } from './lambda.mjs';
import signString from './sign-string';

test('happy', async () => {
  const feedback = {
    feedback: 'tests',
    speed: 1,
    design: 1,
    email: 'test@test.com',
    recaptchaToken: 'test',
  };
  let content = JSON.parse(JSON.stringify(feedback));
  content = JSON.stringify(content, Object.keys(content).sort());

  const signature = await signString(content);
  const isValid = await verifySignature(content, signature);
  expect(isValid).toBe(true);

  const res = await handler({
    body: content,
    requestContext: {
      http: {
        sourceIp: '::1',
      },
    },
    headers: {
      'content-type': 'application/json',
      'x-signature': signature,
      'no-save': 'true',
    },
  });

  expect([200, 304]).toContain(res.statusCode);
});

test('missing:ip:404', async () => {
  const feedback = {};
  let content = JSON.parse(JSON.stringify(feedback));
  content = JSON.stringify(content, Object.keys(content).sort());

  const signature = await signString(content);
  const isValid = await verifySignature(content, signature);
  expect(isValid).toBe(true);

  const res = await handler({
    body: content,
    requestContext: {
      http: {
        sourceIp: undefined,
      },
    },
    headers: {
      'content-type': 'application/json',
      'x-signature': signature,
      'no-save': 'true',
    },
  });

  expect(res.statusCode).toBe(404);
});

test('missing:signature:404', async () => {
  const feedback = {};
  let content = JSON.parse(JSON.stringify(feedback));
  content = JSON.stringify(content, Object.keys(content).sort());

  const signature = await signString(content);
  const isValid = await verifySignature(content, signature);
  expect(isValid).toBe(true);

  const res = await handler({
    body: content,
    requestContext: {
      http: {
        sourceIp: '::1',
      },
    },
    headers: {
      'content-type': 'application/json',
      // 'x-signature': signature,
      'no-save': 'true',
    },
  });

  expect(res.statusCode).toBe(404);
});

test('missing:body:404', async () => {
  const feedback: any[] = [];
  let content = JSON.parse(JSON.stringify(feedback));
  content = JSON.stringify(content, Object.keys(content).sort());

  const signature = await signString(content);
  const isValid = await verifySignature(content, signature);
  expect(isValid).toBe(true);

  const res = await handler({
    body: content,
    requestContext: {
      http: {
        sourceIp: '::1',
      },
    },
    headers: {
      'content-type': 'application/json',
      'x-signature': signature,
      'no-save': 'true',
    },
  });

  expect(res.statusCode).toBe(404);
});

test('missing:content-type:404', async () => {
  const feedback = {};
  let content = JSON.parse(JSON.stringify(feedback));
  content = JSON.stringify(content, Object.keys(content).sort());

  const signature = await signString(content);
  const isValid = await verifySignature(content, signature);
  expect(isValid).toBe(true);

  const res = await handler({
    body: content,
    requestContext: {
      http: {
        sourceIp: '::1',
      },
    },
    headers: {
      // 'content-type': 'application/json',
      'x-signature': signature,
      'no-save': 'true',
    },
  });

  expect(res.statusCode).toBe(404);
});

// test.only('recaptcha:happy', async () => {
//   process.env.NODE_DEBUG = 'save';
//   const res = await verifyRecaptcha('');
//   expect(res).toBe(true);
// });
