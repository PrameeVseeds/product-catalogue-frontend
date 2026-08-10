export const AdminPlaceholderPage = ({ title }: { title: string }) => (
  <section>
    <header className="adminPageHeader">
      <p>Administration</p>
      <h1>{title}</h1>
    </header>
    <div className="adminPanel">
      <p>This area is ready for the next CMS implementation step.</p>
    </div>
  </section>
);
