'use client';
import { type FC, type InputHTMLAttributes } from 'react';
import { Star } from 'lucide-react';

// export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
export interface InputProps {
  name: string,
  size: number,
  value?: number,
  disabled?: boolean,
  onRatingChange?: (size: number) => void,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
}

export const Rating: FC<InputProps> = ({
  name,
  size = 3,
  value = 0,
  disabled = false,
  onRatingChange,
  onChange,
}: InputProps) => {
  const handleClick = (index: number) => {
    console.warn('handle click', index, { disabled });
    if (disabled) {
      return;
    }

    onRatingChange?.(index);
    onChange?.(
      {
        target: {
          name,
          value: index,
          type: 'rating',
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        } as unknown as HTMLInputElement
      } as React.ChangeEvent<HTMLInputElement>
    );
  };

  // right to left, n to 1
  const stars = [];
  for (let index = size; index; index -= 1) {
    stars.push(
      <Star
        key={index}
        onClick={() => handleClick(index)}
        className={`
          cursor-pointer
          peer peer-hover:text-yellow-400 hover:text-yellow-400
          transition-all duration-100
          ${index <= value ? 'text-yellow-400' : 'text-gray-600 dark:text-gray-500'}
          ${disabled ? 'cursor-default opacity-25' : 'cursor-pointer'}
        `}
        width="23"
        height="23"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        stroke="currentColor"
      />
    );
  }

  return (
    <div className="text-center">
      <span
        className={`
          flex flex-row-reverse
          ${Number(size) === Number(value) ? 'animate-pulse' : 'animate-none'}
        `}
      >
        {stars}
      </span>
    </div>
  );
};

export default Rating;
