import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getAllResearchMeta, getResearchContent, getResearchMeta, getResearchSlugs } from '@/lib/research';

export async function generateStaticParams() {
  const slugs = await getResearchSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = await getResearchMeta(slug);
  if (!meta) return { title: 'Research note not found' };
  return { title: `${meta.title} · Research · Wesan`, description: meta.topic };
}

export default async function ResearchPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const md = await getResearchContent(slug);
  if (!md) notFound();

  const others = (await getAllResearchMeta()).filter((m) => m.slug !== slug);

  return (
    <>
      <div className="detail" style={{ paddingBottom: 0 }}>
        <div className="read-col">
          <Link href="/research" className="back-link">← Research</Link>
        </div>
      </div>

      <section>
        <article className="read-col research-prose read" style={{ paddingTop: 0 }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
        </article>
      </section>

      {others.length > 0 && (
        <section className="read" style={{ paddingTop: 0 }}>
          <div className="read-col">
            <h2>Other research</h2>
            <ul className="link-list">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={`/research/${o.slug}`}>{o.title}<span className="m">{o.date}</span></Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
