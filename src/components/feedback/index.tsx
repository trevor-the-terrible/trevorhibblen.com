 import { useState, useEffect, type SetStateAction } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import FeedbackForm from './form';
import BgNoise from '../bg-noise';

export default () => {
  const [status, setStatus] = useState<'open' | 'closed'>('closed');

  return (
    <Dialog
      open={status !== 'closed'}
      onOpenChange={(open) => setStatus(open ? 'open' : 'closed')}
    >
      <DialogTrigger asChild>
        <Button variant="default">
          Feedback
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[425px] rounded-lg bg-secondary-background"
      >
        <DialogHeader>
          <DialogTitle>
            Feedback
          </DialogTitle>

          <DialogDescription className="hidden">
          </DialogDescription>
        </DialogHeader>

        <FeedbackForm
          onDone={() => setStatus('closed')}
        />
      </DialogContent>
    </Dialog>
  );
}
