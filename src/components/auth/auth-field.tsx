import type { InputHTMLAttributes } from "react";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function AuthField({ label, id, ...props }: AuthFieldProps) {
  const fieldId = id ?? props.name;

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </span>
      <input
        id={fieldId}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
        {...props}
      />
    </label>
  );
}