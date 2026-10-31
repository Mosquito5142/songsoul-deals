"use client";

export function ConfirmSubmitButton({
  label,
  message,
}: {
  label: string;
  message: string;
}) {
  return (
    <button
      type="submit"
      className="inline-flex h-11 items-center justify-center rounded-xl border border-line bg-white px-4 text-sm font-medium text-danger hover:border-danger"
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {label}
    </button>
  );
}
