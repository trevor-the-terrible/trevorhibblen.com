import { onCleanup, onMount } from "solid-js";

const GOOGLE_SITE_KEY = "6LfHB7EqAAAAAFwPuNhCwRCuNwcjVbWoDI8X5JTd";

type RecaptchaApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
    },
  ) => number;
  reset: (widgetId?: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: RecaptchaApi;
  }
}

type CaptchaProps = {
  onChallengeChange: (open: boolean) => void;
  onChange: (token: string | null) => void;
};

export const Captcha = (props: CaptchaProps) => {
  let container: HTMLDivElement | undefined;
  let retryTimer: ReturnType<typeof setTimeout> | undefined;
  let challengeObserver: MutationObserver | undefined;
  let challengeOpen = false;
  let widgetId: number | undefined;
  let disposed = false;

  const setChallengeOpen = (open: boolean) => {
    if (disposed || challengeOpen === open) {
      return;
    }

    challengeOpen = open;
    document.body.style.pointerEvents = open ? "auto" : "none";
    props.onChallengeChange(open);
  };

  const isVisible = (element: HTMLElement) => {
    if (typeof element.checkVisibility === "function") {
      return element.checkVisibility({
        checkOpacity: true,
        checkVisibilityCSS: true,
      });
    }

    for (
      let current: HTMLElement | null = element;
      current;
      current = current.parentElement
    ) {
      const style = getComputedStyle(current);
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        style.opacity === "0"
      ) {
        return false;
      }
    }

    return element.getClientRects().length > 0;
  };

  const updateChallengeState = () => {
    const isOpen = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[title*="recaptcha challenge" i]',
      ),
    ).some(isVisible);

    setChallengeOpen(isOpen);
  };

  const handleInvalidCaptcha = () => {
    if (disposed) {
      return;
    }
    setChallengeOpen(false);
    props.onChange(null);
  };

  const renderCaptcha = () => {
    if (disposed || !container) {
      return;
    }

    const recaptcha = window.grecaptcha;
    if (!recaptcha || typeof recaptcha.render !== "function") {
      retryTimer = setTimeout(renderCaptcha, 50);
      return;
    }

    widgetId = recaptcha.render(container, {
      sitekey: GOOGLE_SITE_KEY,
      callback: (token) => {
        if (disposed) {
          return;
        }
        setChallengeOpen(false);
        props.onChange(token);
      },
      "expired-callback": handleInvalidCaptcha,
      "error-callback": handleInvalidCaptcha,
    });
  };

  onMount(() => {
    challengeObserver = new MutationObserver(updateChallengeState);
    challengeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style"],
      childList: true,
      subtree: true,
    });
    renderCaptcha();
  });

  onCleanup(() => {
    if (challengeOpen) {
      document.body.style.pointerEvents = "none";
    }
    disposed = true;
    challengeObserver?.disconnect();
    props.onChallengeChange(false);
    if (retryTimer) {
      clearTimeout(retryTimer);
    }
    if (widgetId !== undefined) {
      window.grecaptcha?.reset(widgetId);
    }
  });

  return <div ref={container} />;
};

export default Captcha;
