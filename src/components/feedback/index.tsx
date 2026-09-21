import { Dialog } from "@kobalte/core/dialog";
import { X } from "lucide-solid";
import { createSignal, Show } from "solid-js";

import { buttonVariants } from "@/components/ui/button";

import FeedbackForm from "./form";

export default function Feedback() {
  const [open, setOpen] = createSignal(false);
  const [captchaChallengeOpen, setCaptchaChallengeOpen] = createSignal(false);

  return (
    <Dialog
      modal={!captchaChallengeOpen()}
      open={open()}
      onOpenChange={setOpen}
      preventScroll
    >
      <Dialog.Trigger class={buttonVariants({ variant: "default" })}>
        Feedback
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          class="fixed inset-0 z-50 bg-black/80 data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0"
          data-test="feedback-overlay"
        />
        <Dialog.Content
          class="fixed left-1/2 top-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border-2 border-neutral-900 bg-secondary-background p-6 shadow-lg duration-200 data-[expanded]:animate-in data-[closed]:animate-out data-[closed]:fade-out-0 data-[expanded]:fade-in-0 data-[closed]:zoom-out-95 data-[expanded]:zoom-in-95 sm:max-w-[425px] dark:border-neutral-800"
          onInteractOutside={(event) => {
            if (captchaChallengeOpen()) {
              event.preventDefault();
            }
          }}
        >
          <div class="flex flex-col gap-2 text-center sm:text-left">
            <Dialog.Title class="text-lg font-heading">Feedback</Dialog.Title>
            <Dialog.Description class="sr-only">
              Rate the site and optionally send notes.
            </Dialog.Description>
          </div>
          <Show when={open()}>
            <FeedbackForm
              onCaptchaChallengeChange={setCaptchaChallengeOpen}
              onDone={() => setOpen(false)}
            />
          </Show>
          <Dialog.CloseButton class="absolute right-4 top-4 rounded-base opacity-100 ring-offset-white focus:outline-hidden focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:pointer-events-none">
            <X class="size-4" />
            <span class="sr-only">Close</span>
          </Dialog.CloseButton>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
