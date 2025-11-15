import {test, expect} from "bun:test";
import { verifySignature } from './lambda.mjs';
import signString from './sign-string';

test('verify-signature:happy:simple', async () => {
  // const feedback = {
  //   feedback: 'test',
  //   speed: 1,
  //   design: 1,
  //   email: 'test@test.com',
  //   recaptchaToken: 'test',
  // };
  const feedback = {
    test: 'test',
  };

  let content = JSON.parse(JSON.stringify(feedback));
  content = JSON.stringify(content, Object.keys(content).sort());

  const signature = await signString(content);
  const res = await verifySignature(content, signature);

  expect(res).toBe(true);
});

test('verify-signature:happy:complex', async () => {
  const feedback = {
    feedback: 'test',
    speed: 1,
    design: 1,
    email: 'test@test.com',
    recaptchaToken: 'test',
  };

  let content = JSON.parse(JSON.stringify(feedback));
  content = JSON.stringify(content, Object.keys(content).sort());

  const signature = await signString(content);
  const res = await verifySignature(content, signature);

  expect(res).toBe(true);
});
