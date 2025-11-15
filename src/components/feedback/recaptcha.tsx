'use client';

import Recaptcha from 'react-google-recaptcha';

export const Captcha = ({ onSuccess }: { onSuccess: (token: string) => void }) => {
  const GOOGLE_SITE_KEY = '6LfHB7EqAAAAAFwPuNhCwRCuNwcjVbWoDI8X5JTd';
  // alert dialog normally blocks pointer events on body, but that breaks recaptcha
  // i'd prefer only breaking that behavior when recaptcha is active, but that's not an event
  const onRecaptchaSuccess = (token: string) => {
    window.setTimeout(() => {
      console.warn('recaptcha: block pointer events on body...');
      document.getElementsByTagName('body')[0].style.pointerEvents = 'none';
    }, 0);
    onSuccess(token);
  };
  const onCaptchaLoad = () => {
    window.setTimeout(() => {
      console.warn('recaptcha: allow pointer events on body...');
      document.getElementsByTagName('body')[0].style.pointerEvents = 'auto';
    }, 0);
  };

  return (
    <Recaptcha
      sitekey={GOOGLE_SITE_KEY}
      render="explicit"
      onChange={onRecaptchaSuccess}
      onExpired={onCaptchaLoad}
      onError={onCaptchaLoad}
      asyncScriptOnLoad={onCaptchaLoad}
    />
  );
};

export default Captcha;
