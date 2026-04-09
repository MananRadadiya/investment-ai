export default function SkeletonCard({ className = '', lines = 3 }) {
  return (
    <div className={`panel-static ${className}`} style={{ padding: '24px' }}>
      <div className="shimmer" style={{ height: '16px', width: '128px', borderRadius: '8px', marginBottom: '16px' }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="shimmer" style={{ height: '12px', borderRadius: '8px', marginBottom: '8px', width: `${85 - i * 15}%` }} />
      ))}
    </div>
  );
}
