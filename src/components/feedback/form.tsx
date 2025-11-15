'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Star } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import Rating from '@/components/rating';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import signString from './sign-string';
import { Captcha } from './recaptcha';

const feedbackSchema = z.object({
  feedback: z.string().max(1000).optional(),
  speed: z.number().min(1).max(3),
  design: z.number().min(1).max(3),
  isEmail: z.boolean().default(false),
  email: z.string()
    .email('Please enter your email. Or uncheck "Want to reach out?"')
    .optional()
    // shouldn't optional, handle this already?
    .or(z.literal('')),
}).refine((data) => {
  if (data.isEmail) {
    return z.string().email().safeParse(data.email).success;
  }
  return true;
}, {
  message: 'Please enter your email. Or uncheck "Want to reach out?"',
  path: ['email'],
});

export type Feedback = z.infer<typeof feedbackSchema>;

export type ChangeEventProxy = {
  target: {
    name: string;
    value: string|boolean;
  };
};

export const FeedbackForm = ({ onDone }: { onDone: () => void }) => {
  const { handleSubmit, register, formState, setValue, ...form } = useForm<Feedback>({
    defaultValues: {
      design: 1,
      speed: 1,
      isEmail: false,
      email: '',
    },
    mode: 'onBlur',
    resolver: zodResolver(feedbackSchema),
  });
  const isInputDisabled = formState.isSubmitting || formState.isSubmitSuccessful;
  const [validCaptcha, setValidCaptcha] = useState(false);

  const onHandleSubmit: SubmitHandler<Feedback> = async (data) => {
    await Promise.all([
      retry(() => saveFeedback(data)),
      (
        new Promise((resolve) => {
          setTimeout(() => {
            resolve('done');
          }, 1500);
        })
      ),
    ]);
  };

  // these need to be watched to update the form state
  const design = form.watch('design');
  const speed = form.watch('speed');
  const isEmail = form.watch('isEmail');

  // required for design and speed to be updated
  const onFormChange = (e: ChangeEventProxy) => {
    setValue(e.target.name as keyof Feedback, e.target.value);
  };

  // Clear email field if isEmail is unchecked
  useEffect(() => {
    setValue('email', '');
    form.trigger('email');
  }, [isEmail]);

  return (
    <form
        className="grid gap-4 py-4 relative"
        onSubmit={handleSubmit(onHandleSubmit)}
      >
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="design">
            Design
          </Label>

          <Rating
            {...register('design', {
              disabled: isInputDisabled,
              valueAsNumber: true,
              onChange: onFormChange,
              value: design,
            })}
            size={3}
            value={design}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="speed">
            Site performance
          </Label>

          <Rating
            {...register('speed', {
              disabled: isInputDisabled,
              valueAsNumber: true,
              onChange: onFormChange,
              value: speed,
            })}
            size={3}
            value={speed}
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="feedback">
            Notes?&nbsp;&nbsp;✍️
          </Label>

          <div className="col-span-3">
          <Textarea
              {...register('feedback', {
                disabled: isInputDisabled,
              })}
              autoFocus
              id="feedback"
              defaultValue=""
            />

            {formState.errors.feedback?.message && (
              <p className='text-sm italic text-red-800 dark:text-red-400 mt-2'>
                {formState.errors.feedback?.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="isemail" className="w-full cursor-pointer">
            Want to reach out?
          </Label>

          <Checkbox
            id="isemail"
            checked={isEmail}
            onCheckedChange={(checked) => setValue('isEmail', !!checked)}
            {...register('isEmail', {
              disabled: isInputDisabled,
            })}
          />
        </div>

        {isEmail && (
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>

            <Input
              {...register('email', {
                disabled: isInputDisabled,
              })}

              id="email"
              type="email"
              defaultValue=""
              className="col-span-3"
              placeholder="me@mailinator.com"
            />

            <p>&nbsp;</p>
            <p className='
              block col-span-3 p-0
              text-sm italic
              text-red-800 dark:text-red-400
            '>
              {formState.errors.email?.message}
            </p>
          </div>
        )}

        {formState.isSubmitSuccessful && (
          <div>
            <p
              className="
                block
                rounded
                p-4
                bg-green-100
                font-bold
                text-green-800
                subpixel-antialiased
                text-center
              "
            >
              Thank you 🎉
            </p>

            <Button
              variant="default"
              onClick={onDone}
              type="button"
              className="w-full mt-4"
            >
              Close
            </Button>
          </div>
        )}

        {!formState.isSubmitSuccessful && (
          <div className="flex flex-col gap-2 w-full">
          <Separator className='my-4' />

            <Button
              type="submit"
              disabled={
                !formState.isValid
                || isInputDisabled
                || !validCaptcha
              }
              className='w-full'
            >
              {formState.isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {formState.isSubmitting ? 'Sending...' : 'Send'}
            </Button>

            <Button
              variant="neutral"
              onClick={onDone}
              type="button"
              className="w-full"
              disabled={formState.isSubmitting}
            >
              Nevermind
            </Button>

            {formState.isSubmitted && !formState.isSubmitSuccessful && (
                <div className='flex flex-col gap-2 error bg-red-100 text-red-800 p-2 rounded-md'>
                  <p>
                    Failed to save feedback 😓
                  </p>
                </div>
              )}
          </div>
        )}

        {/* recaptcha */
        !formState.isSubmitSuccessful && (
          <div className='w-full flex justify-center'>
            <Captcha
              onSuccess={() => setValidCaptcha(true)}
            />
          </div>
        )}
    </form>
  );
}

export default FeedbackForm;

const saveFeedback = async (feedback: Feedback) => {
  let content = JSON.parse(JSON.stringify(feedback));
  delete content.isEmail;
  content = JSON.stringify(content, Object.keys(content).sort());

  const signature = await signString(content);
  const url = 'https://zxzffkjcu0.execute-api.us-east-1.amazonaws.com/save-feedback';
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-signature": signature,
    },
    body: content,
  });

  if (!res.ok && res.status !== 304) {
    throw new Error('Failed to save feedback 😓');
  }
};

const retry = async (fn: () => Promise<any>, tries = 3, error?: any) => {
  console.log('retries remaining :>> ', tries);
  if (!tries) {
    throw error;
  }

  try {
    await fn();
  } catch (error) {
    console.warn('error :>> ', error);
    await retry(fn, tries - 1, error);
  }
};
