export const FormFeedback = ({error,success,}: {
  error?: string;
  success?: string;
}) => (
  <>
    {error && (
      <div className="formFeedback errorFeedback" role="alert">
        {error}
      </div>
    )}
    {success && (
      <div className="formFeedback successFeedback" role="status">
        {success}
      </div>
    )}
  </>
);
