// Workshop Index design: metric cards are compact ledger modules, using a cobalt tab rather than decorative rounded containers.

export default function MetricCard({
  label,
  value,
  note,
  tone = 'ink',
}) {
  return (
    <article className={`metric-card ${tone}`}>
      <div className="metric-tab" />

      <p>{label}</p>

      <strong>{value}</strong>

      <small>{note}</small>
    </article>
  );
}