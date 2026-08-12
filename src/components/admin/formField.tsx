import type { PropsWithChildren } from "react";
interface Props extends PropsWithChildren {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
}
export const FormField = ({ label, htmlFor, error, required = false, children }: Props) => (
  <div className="formField">
    <label htmlFor={htmlFor}>
      {label}
      {required && (
        <span className="requiredMark" aria-hidden="true"> *</span>
      )}
      {required && <span className="visuallyHidden"> (required)</span>}
    </label>
    {children}
    {error && <span className="fieldError">{error}</span>}
  </div>
);
