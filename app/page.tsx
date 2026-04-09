import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container">
      <h1>AI SEO Content System</h1>
      <p className="muted">
        Netlify-ready Next.js scaffold for multi-brand SEO writing operations.
      </p>

      <div className="card" style={{ marginTop: 16 }}>
        <h2>What is included right now</h2>
        <ul>
          <li>Landing page and working route (fixes 404 on root).</li>
          <li>Dashboard shell with MVP queue cards.</li>
          <li>Health API endpoint for deployment verification.</li>
          <li>Supabase schema migration starter.</li>
        </ul>
        <p style={{ marginTop: 16 }}>
          <Link href="/dashboard" className="badge">
            Open dashboard
          </Link>
        </p>
      </div>
    </main>
  );
}
