import { describe, expect, test } from "bun:test";
import {
  EMAIL_ERROR,
  feedbackSchema,
  serializeFeedback,
  submitFeedback,
} from "./model";

describe("feedbackSchema", () => {
  test("applies the current defaults", () => {
    expect(feedbackSchema.parse({ design: 1, speed: 1, email: "" })).toEqual({
      design: 1,
      speed: 1,
      isEmail: false,
      email: "",
    });
  });

  test("requires a valid email when contact is requested", () => {
    const result = feedbackSchema.safeParse({
      design: 1,
      speed: 1,
      isEmail: true,
      email: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.at(-1)?.message).toBe(EMAIL_ERROR);
    }
  });

  test("keeps malformed nonempty email invalid when contact is off", () => {
    const result = feedbackSchema.safeParse({
      design: 1,
      speed: 1,
      isEmail: false,
      email: "not-an-email",
    });

    expect(result.success).toBe(false);
  });

  test("limits notes to 1000 characters", () => {
    const valid = feedbackSchema.safeParse({
      design: 1,
      speed: 1,
      email: "",
      feedback: "a".repeat(1000),
    });
    const invalid = feedbackSchema.safeParse({
      design: 1,
      speed: 1,
      email: "",
      feedback: "a".repeat(1001),
    });

    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });
});

test("serializeFeedback removes isEmail and sorts the request keys", () => {
  expect(serializeFeedback({
    feedback: "Fast and clear",
    speed: 3,
    design: 2,
    isEmail: true,
    email: "test@example.com",
  })).toBe(
    '{"design":2,"email":"test@example.com","feedback":"Fast and clear","speed":3}',
  );
});

test("submitFeedback signs the exact body and accepts HTTP 304", async () => {
  const signed: string[] = [];
  const requests: Array<{ input: string; init: RequestInit | undefined }> = [];

  await submitFeedback(
    {
      feedback: "Fast and clear",
      speed: 3,
      design: 2,
      isEmail: false,
      email: "",
    },
    {
      sign: async (content) => {
        signed.push(content);
        return "test-signature";
      },
      request: async (input, init) => {
        requests.push({ input: input.toString(), init });
        return new Response(null, { status: 304 });
      },
    },
  );

  const expectedBody =
    '{"design":2,"email":"","feedback":"Fast and clear","speed":3}';
  expect(signed).toEqual([expectedBody]);
  expect(requests).toHaveLength(1);
  expect(requests[0]?.input).toBe(
    "https://zxzffkjcu0.execute-api.us-east-1.amazonaws.com/save-feedback",
  );
  expect(requests[0]?.init).toEqual({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-signature": "test-signature",
    },
    body: expectedBody,
  });
});

test("submitFeedback stops after three failed attempts", async () => {
  let attempts = 0;

  const submission = submitFeedback(
    { speed: 1, design: 1, isEmail: false, email: "" },
    {
      sign: async () => "test-signature",
      request: async () => {
        attempts += 1;
        return new Response(null, { status: 500 });
      },
    },
  );

  await expect(submission).rejects.toThrow("Failed to save feedback");
  expect(attempts).toBe(3);
});
