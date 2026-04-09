const queueCards = [
  { title: 'Briefs', count: 0 },
  { title: 'Drafts', count: 0 },
  { title: 'QA Review Queue', count: 0 },
  { title: 'Published Content', count: 0 },
  { title: 'Refresh Queue', count: 0 },
  { title: 'Internal Linking Opportunities', count: 0 }
];

const runStages = [
  'Generating brief',
  'Building outline',
  'Drafting article',
  'Running QA',
  'Preparing publish-ready version',
  'Exporting PDF'
];

export default function DashboardPage() {
  return (
    <main className="container">
      <h1>Dashboard Overview</h1>
      <p className="muted">Single-pane workflow across all your brands.</p>

      <section className="grid grid-3" style={{ marginTop: 16 }}>
        {queueCards.map((card) => (
          <article key={card.title} className="card">
            <div className="muted">{card.title}</div>
            <div className="kpi">{card.count}</div>
            <span className="badge">MVP placeholder</span>
          </article>
        ))}
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <h2>Generation Status States</h2>
        <ul>
          {runStages.map((stage) => (
            <li key={stage}>{stage}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
