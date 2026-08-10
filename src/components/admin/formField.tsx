import type { PropsWithChildren } from "react";
interface Props extends PropsWithChildren {
  label: string;
  htmlFor?: string;
  error?: string;
}
export const FormField = ({ label, htmlFor, error, children }: Props) => (
  <div className="formField">
    <label htmlFor={htmlFor}>{label}</label>
    {children}
    {error && <span className="fieldError">{error}</span>}
  </div>
);
