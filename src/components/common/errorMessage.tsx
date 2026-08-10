interface ErrorMessageProps { message: string }
export const ErrorMessage = ({ message }: ErrorMessageProps) => <div className="errorMessage" role="alert">{message}</div>
