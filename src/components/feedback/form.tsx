import { createMemo, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { Loader2 } from "lucide-solid";

import Rating from "@/components/rating";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

import { Captcha } from "./recaptcha";
import {
  feedbackSchema,
  submitFeedback,
  type Feedback,
  type RatingValue,
  type SubmissionState,
} from "./model";

type FeedbackDraft = {
  design: RatingValue;
  email: string;
  feedback: string;
  isEmail: boolean;
  speed: RatingValue;
};

type FeedbackFormProps = {
  onCaptchaChallengeChange: (open: boolean) => void;
  onDone: () => void;
};

const waitForSuccessFeedback = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 1500));

export const FeedbackForm = (props: FeedbackFormProps) => {
  const [form, setForm] = createStore<FeedbackDraft>({
    design: 1,
    email: "",
    feedback: "",
    isEmail: false,
    speed: 1,
  });
  const [captchaToken, setCaptchaToken] = createSignal<string | null>(null);
  const [emailTouched, setEmailTouched] = createSignal(false);
  const [feedbackTouched, setFeedbackTouched] = createSignal(false);
  const [submitted, setSubmitted] = createSignal(false);
  const [submission, setSubmission] = createSignal<SubmissionState>({
    kind: "editing",
  });

  const validation = createMemo(() => feedbackSchema.safeParse(form));
  const isInputDisabled = () =>
    submission().kind === "submitting" || submission().kind === "success";
  const submissionError = () => {
    const state = submission();
    return state.kind === "error" ? state.message : undefined;
  };

  const fieldError = (field: keyof Feedback) => {
    const result = validation();
    if (result.success) {
      return undefined;
    }

    return result.error.issues.find((issue) => issue.path[0] === field)?.message;
  };

  const changeContactPreference = (isEmail: boolean) => {
    setForm("isEmail", isEmail);
    if (!isEmail) {
      setForm("email", "");
      setEmailTouched(false);
    }
  };

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    setSubmitted(true);

    const result = validation();
    if (!result.success || !captchaToken()) {
      return;
    }

    setSubmission({ kind: "submitting" });
    try {
      await Promise.all([
        submitFeedback(result.data),
        waitForSuccessFeedback(),
      ]);
      setSubmission({ kind: "success" });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save feedback 😓";
      setSubmission({ kind: "error", message });
    }
  };

  return (
    <form class="relative grid gap-4 py-4" onSubmit={handleSubmit}>
      <div class="grid grid-cols-4 items-center gap-4">
        <Label>Design</Label>
        <Rating
          disabled={isInputDisabled()}
          label="Design rating"
          name="design"
          onChange={(value) => setForm("design", value)}
          value={form.design}
        />
      </div>

      <div class="grid grid-cols-4 items-center gap-4">
        <Label>Site performance</Label>
        <Rating
          disabled={isInputDisabled()}
          label="Site performance rating"
          name="speed"
          onChange={(value) => setForm("speed", value)}
          value={form.speed}
        />
      </div>

      <div class="grid grid-cols-4 items-center gap-4">
        <Label for="feedback">Notes?&nbsp;&nbsp;✍️</Label>
        <div class="col-span-3">
          <Textarea
            autofocus
            disabled={isInputDisabled()}
            id="feedback"
            maxlength={1001}
            onBlur={() => setFeedbackTouched(true)}
            onInput={(event) => setForm("feedback", event.currentTarget.value)}
            value={form.feedback}
          />
          <Show when={(feedbackTouched() || submitted()) && fieldError("feedback")}>
            {(message) => (
              <p class="mt-2 text-sm italic text-red-800 dark:text-red-400">
                {message()}
              </p>
            )}
          </Show>
        </div>
      </div>

      <div class="grid grid-cols-4 items-center gap-4">
        <Label class="w-full cursor-pointer" for="isemail">
          Want to reach out?
        </Label>
        <input
          checked={form.isEmail}
          class="size-4 cursor-pointer accent-black disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isInputDisabled()}
          id="isemail"
          onChange={(event) => changeContactPreference(event.currentTarget.checked)}
          type="checkbox"
        />
      </div>

      <Show when={form.isEmail}>
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right" for="email">
            Email
          </Label>
          <Input
            class="col-span-3"
            disabled={isInputDisabled()}
            id="email"
            onBlur={() => setEmailTouched(true)}
            onInput={(event) => setForm("email", event.currentTarget.value)}
            placeholder="me@mailinator.com"
            type="email"
            value={form.email}
          />
          <p>&nbsp;</p>
          <p class="col-span-3 block p-0 text-sm italic text-red-800 dark:text-red-400">
            <Show when={(emailTouched() || submitted()) && fieldError("email")}>
              {(message) => message()}
            </Show>
          </p>
        </div>
      </Show>

      <Show when={submission().kind === "success"}>
        <div>
          <p class="block rounded bg-green-100 p-4 text-center font-bold text-green-800 subpixel-antialiased">
            Thank you 🎉
          </p>
          <Button class="mt-4 w-full" onClick={props.onDone} type="button">
            Close
          </Button>
        </div>
      </Show>

      <Show when={submission().kind !== "success"}>
        <div class="flex w-full flex-col gap-2">
          <Separator class="my-4" />
          <Button
            class="w-full"
            disabled={!validation().success || isInputDisabled() || !captchaToken()}
            type="submit"
          >
            <Show when={submission().kind === "submitting"}>
              <Loader2 class="mr-2 size-4 animate-spin" />
            </Show>
            {submission().kind === "submitting" ? "Sending..." : "Send"}
          </Button>
          <Button
            class="w-full"
            disabled={submission().kind === "submitting"}
            onClick={props.onDone}
            type="button"
            variant="neutral"
          >
            Nevermind
          </Button>
          <Show when={submissionError()}>
            {(message) => (
              <div class="error flex flex-col gap-2 rounded-md bg-red-100 p-2 text-red-800">
                <p>{message()}</p>
              </div>
            )}
          </Show>
        </div>
        <div class="flex w-full justify-center">
          <Captcha
            onChallengeChange={props.onCaptchaChallengeChange}
            onChange={setCaptchaToken}
          />
        </div>
      </Show>
    </form>
  );
};

export default FeedbackForm;
