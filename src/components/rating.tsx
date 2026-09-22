import { For } from "solid-js";
import { Star } from "lucide-solid";

import type { RatingValue } from "@/components/feedback/model";

const RATING_VALUES: readonly RatingValue[] = [1, 2, 3];

type RatingProps = {
  disabled?: boolean;
  label: string;
  name: string;
  onChange: (value: RatingValue) => void;
  value: RatingValue;
};

export const Rating = (props: RatingProps) => (
  <fieldset
    aria-label={props.label}
    class={`flex gap-1 hover:[&>label:has(~label:hover)>svg]:text-yellow-400 ${
      props.value === 3 ? "motion-safe:animate-pulse" : ""
    }`}
    disabled={props.disabled}
  >
    <For each={RATING_VALUES}>
      {(rating) => (
        <label class="group cursor-pointer">
          <input
            aria-label={`${rating} of 3 stars`}
            checked={props.value === rating}
            class="peer sr-only"
            name={props.name}
            onChange={() => props.onChange(rating)}
            type="radio"
            value={rating}
          />
          <Star
            aria-hidden="true"
            class={`size-[23px] transition-colors duration-100 group-hover:text-yellow-400 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-black dark:peer-focus-visible:outline-white ${
              rating <= props.value
                ? "text-yellow-400"
                : "text-gray-600 dark:text-gray-500"
            } ${props.disabled ? "cursor-default opacity-25" : ""}`}
            fill="currentColor"
          />
        </label>
      )}
    </For>
  </fieldset>
);

export default Rating;
