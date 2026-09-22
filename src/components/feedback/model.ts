import { z } from "zod";
import signString from "./sign-string";

export const EMAIL_ERROR =
  'Please enter your email. Or uncheck "Want to reach out?"';

export const feedbackSchema = z.object({
  feedback: z.string().max(1000).optional(),
  speed: z.number().min(1).max(3),
  design: z.number().min(1).max(3),
  isEmail: z.boolean().default(false),
  email: z.string().email(EMAIL_ERROR).optional().or(z.literal("")),
}).refine(
  (feedback) => !feedback.isEmail || z.string().email().safeParse(feedback.email).success,
  {
    message: EMAIL_ERROR,
    path: ["email"],
  },
);

export type Feedback = z.infer<typeof feedbackSchema>;

export type RatingValue = 1 | 2 | 3;

export type SubmissionState =
  | { kind: "editing" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

type RequestFeedback = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

type SubmitDependencies = {
  request?: RequestFeedback;
  sign?: typeof signString;
};

const SAVE_FEEDBACK_URL =
  "https://zxzffkjcu0.execute-api.us-east-1.amazonaws.com/save-feedback";
const MAX_ATTEMPTS = 3;

export const serializeFeedback = (feedback: Feedback): string => {
  const entries = Object.entries(feedback)
    .filter(([key]) => key !== "isEmail")
    .sort(([left], [right]) => left.localeCompare(right));

  return JSON.stringify(Object.fromEntries(entries));
};

export const submitFeedback = async (
  feedback: Feedback,
  dependencies: SubmitDependencies = {},
): Promise<void> => {
  const content = serializeFeedback(feedback);
  const request = dependencies.request ?? globalThis.fetch;
  const sign = dependencies.sign ?? signString;
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      const signature = await sign(content);
      const response = await request(SAVE_FEEDBACK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-signature": signature,
        },
        body: content,
      });

      if (response.ok || response.status === 304) {
        return;
      }

      lastError = new Error("Failed to save feedback 😓");
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw new Error("Failed to save feedback 😓");
};
