import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
  const input = event.currentTarget;
  input.value = input.value.replace(/[^0-9]/g, '');
};

// Function to handle keydown and prevent non-numeric key presses
export const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      event.preventDefault();
  }
};