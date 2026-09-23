import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { usePageTitle } from "../../hooks/usePageTitle";
import { getLoginErrorMessage } from "../../services/authApi";

interface FormErrors {
  email?: string;
  password?: string;
}
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AdminLoginPage = () => {
  usePageTitle("Admin Login");
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const nextErrors: FormErrors = {};
    if (!email.trim()) nextErrors.email = "Email is required.";
    else if (!emailPattern.test(email.trim()))
      nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    setSubmitError("");
    if (Object.keys(nextErrors).length) return;
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      const requestedPath = (location.state as { from?: unknown } | null)?.from;
      navigate(
        typeof requestedPath === "string" &&
          requestedPath.startsWith("/admin") &&
          requestedPath !== "/admin/login"
          ? requestedPath
          : "/admin",
        { replace: true },
      );
    } catch (error: unknown) {
      setSubmitError(getLoginErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="adminLoginPage">
      <section className="adminLoginCard">
        <header>
          <p>Catalogue CMS</p>
          <h1>Admin login</h1>
        </header>
        {submitError && (
          <div className="loginError" role="alert">
            {submitError}
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="admin-email">
            Email <span className="requiredMark" aria-hidden="true">*</span>
            <span className="visuallyHidden"> (required)</span>
          </label>
          <input
            id="admin-email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "admin-email-error" : undefined}/>
          {errors.email && (
            <span id="admin-email-error" className="fieldError">
              {errors.email}
            </span>
          )}
          <label htmlFor="admin-password">
            Password <span className="requiredMark" aria-hidden="true">*</span>
            <span className="visuallyHidden"> (required)</span>
          </label>
          <div className="passwordField">
            <input
              id="admin-password"
              name="password"
              type={passwordVisible ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? "admin-password-error" : undefined
              }
            />
            <button
              className="passwordVisibilityButton"
              type="button"
              aria-label={passwordVisible ? "Hide password" : "Show password"}
              aria-pressed={passwordVisible}
              onClick={() => setPasswordVisible((visible) => !visible)}
            >
              {passwordVisible ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            </button>
          </div>
          {errors.password && (
            <span id="admin-password-error" className="fieldError">
              {errors.password}
            </span>
          )}
          <button
            className="button adminLoginButton"
            type="submit"
            disabled={submitting}>
            {submitting ? "Signing in…" : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
};
