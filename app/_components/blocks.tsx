import Image from 'next/image';
import type { MissionBlock } from '@/lib/content';

/** Long-form content blocks, styled by the surrounding `.read` article. */
export function renderBlock(b: MissionBlock, i: number) {
  switch (b.kind) {
    case 'p':
      return <p key={i} className={b.lead ? 'lead-p' : undefined} dangerouslySetInnerHTML={{ __html: b.text }} />;
    case 'h2':
      return <h2 key={i}>{b.text}</h2>;
    case 'figure':
      return (
        <figure key={i}>
          <Image unoptimized width={1200} height={800} className="wmsketch" src={b.src} alt={b.alt} style={{ width: '100%', maxWidth: '720px', height: 'auto', margin: '0 auto' }} />
          <figcaption>{b.caption} · {b.credit}</figcaption>
        </figure>
      );
    case 'hr':
      return <hr key={i} />;
    case 'quote':
      return <blockquote key={i}>&ldquo;{b.text}&rdquo;</blockquote>;
    case 'sign':
      return <p key={i} className="small">{b.text}</p>;
  }
}
