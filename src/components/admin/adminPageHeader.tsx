interface Props {
  title: string;
  description?: string;
  action?: React.ReactNode;
}
export const AdminPageHeader = ({ title, description, action }: Props) => (
  <header className="adminPageHeader adminPageHeaderRow">
    <div>
      <p>Content management</p>
      <h1>{title}</h1>
      {description && <span>{description}</span>}
    </div>
    {action}
  </header>
);
