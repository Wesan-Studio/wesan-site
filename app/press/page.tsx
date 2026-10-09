import Link from 'next/link';
import { SectionHead } from '../_components/lib';
import { Icon } from '../_components/icons';
import { getContent } from '@/lib/content';

export const metadata = {
  title: 'Press',
  description: 'Press kit for Wesan: boilerplate, facts, logos and contacts.',
};

interface Logo { label: string; file: string; fg: string; bg: string; markOnly: boolean }
interface TypeDef { fam: string; use: string; sample: string; cssFam: string }
interface Boiler { len: string; body: string }

interface PressContent {
  head: { num: string; label: string; title: string; sub: string };
  kitDownload: string;
  contactLabel: string;
  logosHead: { num: string; label: string; title: string };
  logos: Logo[];
  downloadSvgLabel: string;
  colorsHead: { num: string; label: string; title: string };
  colors: [string, string, string, string][];
  typeHead: { num: string; label: string; title: string };
  typography: TypeDef[];
  boilerplateHead: { num: string; label: string; title: string };
  boilerplate: Boiler[];
  factsEyebrow: string;
  factsLeft: [string, string][];
  factsRight: [string, string][];
}

function WMark({ color = 'currentColor', size = 32 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true">
      <g fill={color}>
        <path d="M5 7 L7 7 Q9 7 7.5 11 L4.5 19 L7 19 L11 11 Q12 7 10 7 L8 7 Z" />
        <path d="M10 7 L12 7 Q14 7 12.5 11 L9.5 19 Q9 20 10 20 L12 20 Q13 20 13.5 19 L16.5 11 Q18 7 16 7 L13 7 Z" opacity="0.85" />
        <path d="M16 7 L18 7 Q20 7 18.5 11 L14.5 20 L16.5 20 Q18 20 19 18.5 L23 11 Q24 7 22 7 Z" opacity="0.7" />
      </g>
    </svg>
  );
}

function Lockup({ color, size }: { color: string; size: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <WMark color={color} size={size + 14} />
      <span style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 600, letterSpacing: '0.06em', color, textTransform: 'uppercase' }}>Wesan</span>
    </div>
  );
}

export default async function PressPage() {
  const c = ((await getContent()).pages.press as unknown) as PressContent;

  return (
    <>
      <section className="section" style={{ paddingTop: '64px', paddingBottom: '32px' }}>
        <div className="container">
          <SectionHead num={c.head.num} label={c.head.label} title={c.head.title} sub={c.head.sub} />
          <div className="gap-8 mt-8">
            <a href="#" className="btn solid"><Icon name="ext" size={13} /> {c.kitDownload}</a>
            <Link href="/contact" className="btn">{c.contactLabel}</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="container">
          <SectionHead num={c.logosHead.num} label={c.logosHead.label} title={c.logosHead.title} />
          <div className="row row-4">
            {c.logos.map((p) => (
              <article key={p.label} className="card" style={{ padding: '0', background: 'var(--paper-3)' }}>
                <div style={{ background: p.bg, aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--rule)' }}>
                  {p.markOnly ? <WMark color={p.fg} size={48} /> : <Lockup color={p.fg} size={20} />}
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div className="mono mb-2" style={{ fontSize: '10px', color: 'var(--ink-3)', letterSpacing: '0.12em' }}>{p.label}</div>
                  <div className="mono" style={{ fontSize: '11.5px', color: 'var(--ink-2)' }}>{p.file}</div>
                  <a href="#" className="mono" style={{ fontSize: '11px', color: 'var(--accent)', marginTop: '8px', display: 'inline-block', letterSpacing: '0.08em' }}>{c.downloadSvgLabel}</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead num={c.colorsHead.num} label={c.colorsHead.label} title={c.colorsHead.title} />
          <div className="row row-4">
            {c.colors.map(([name, hex, bg, fg]) => (
              <article key={name} className="card" style={{ padding: '0' }}>
                <div style={{ background: bg, aspectRatio: '4/3', position: 'relative' }}>
                  <span className="mono" style={{ position: 'absolute', bottom: '14px', left: '16px', color: fg, fontSize: '11px', letterSpacing: '0.1em' }}>{name}</span>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div className="mono" style={{ fontSize: '12px', color: 'var(--ink)' }}>{hex}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="container">
          <SectionHead num={c.typeHead.num} label={c.typeHead.label} title={c.typeHead.title} />
          <div className="row row-3">
            {c.typography.map((t) => (
              <article key={t.fam} className="card" style={{ padding: '32px 28px' }}>
                <div className="mono mb-4" style={{ fontSize: '10.5px', color: 'var(--ink-3)', letterSpacing: '0.14em' }}>{t.use}</div>
                <div style={{ fontFamily: t.cssFam, fontSize: '56px', letterSpacing: '-0.025em', lineHeight: 1, marginBottom: '20px' }}>{t.sample}</div>
                <div className="mono" style={{ fontSize: '11.5px', color: 'var(--ink-2)' }}>{t.fam}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow">
          <SectionHead num={c.boilerplateHead.num} label={c.boilerplateHead.label} title={c.boilerplateHead.title} />
          {c.boilerplate.map((b) => (
            <article key={b.len} className="card mb-6" style={{ padding: '24px 28px' }}>
              <div className="between mb-4">
                <span className="eyebrow">{b.len}</span>
                <button className="btn ghost" style={{ padding: '6px 12px', fontSize: '10.5px' }}>Copy</button>
              </div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', lineHeight: 1.6, color: 'var(--ink-2)', whiteSpace: 'pre-wrap' }}>{b.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)', color: 'var(--ink)' }}>
        <div className="container">
          <span className="eyebrow" style={{ color: 'var(--ink-3)' }}>{c.factsEyebrow}</span>
          <div className="row row-2 mt-6" style={{ gap: '0' }}>
            {[c.factsLeft, c.factsRight].map((tbl, ti) => (
              <table key={ti} style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                <tbody>
                  {tbl.map(([k, v], i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--rule)' }}>
                      <td style={{ padding: '14px 0', color: 'var(--ink-3)', width: '40%' }}>{k.toUpperCase()}</td>
                      <td style={{ padding: '14px 0', color: 'var(--ink)' }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
