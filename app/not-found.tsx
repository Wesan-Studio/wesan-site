import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section">
      <div className="nf">
        <span className="tag dashed mb-8">Error 404</span>
        <h1 className="h-1 mb-4">This sheet is not in the set.</h1>
        <p className="lead mb-8" style={{ marginInline: 'auto' }}>
          The page may have moved, or the link was mistyped. Start again from the index.
        </p>
        <div className="gap-12" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn solid">Back to home <span className="arr">→</span></Link>
          <Link href="/sitemap" className="btn ghost">View sitemap</Link>
        </div>
      </div>
    </section>
  );
}
