import { Link } from 'react-router-dom'
import { PageShell } from '../components/common/pageShell'
export const NotFoundPage = () => <PageShell title="Page Not Found"><p>The page you requested does not exist.</p><Link className="button" to="/">Return home</Link></PageShell>
