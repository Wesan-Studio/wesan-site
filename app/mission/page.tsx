import Link from 'next/link';
import { DetailHero } from '../_components/detail-hero';
import { renderBlock } from '../_components/blocks';
import { getContent } from '@/lib/content';

export const metadata = {
  title: 'Mission',
  description: 'What Wesan means when it says it builds for the next century.',
};

export default async function MissionPage() {
  const c = (await getContent()).pages.mission;

  return (
    <>
      <DetailHero title={c.title} figure={{ scene: 'horizon', seed: 5 }} />
      <article className="read">
        <div className="read-col">
          {c.body.map((b, i) => renderBlock(b, i))}
          <hr />
          <ul className="link-list">
            {c.continue.links.map((l) => (
              <li key={l.href + l.label}>
                <Link href={l.href}>{l.label.replace(/ →$/, '')}<span className="m">→</span></Link>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </>
  );
}
