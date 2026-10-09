import { SectionHead, SpotlightCard } from '../_components/lib';
import { getContent } from '@/lib/content';

export const metadata = {
  title: 'Calendar',
  description: 'Public dates from Wesan: releases, talks and the annual field report.',
};

interface CalendarContent {
  head: { num: string; label: string; title: string; sub: string };
  events: { when: string; weekday: string; time: string; where: string; type: string; title: string; who: string; lede: string; cta: string; status: string }[];
  footnote: string;
  speakBlock: { eyebrow: string; title: string; body: string; email: string };
}

const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const monthName = (date: string) => months[parseInt(date.split('.')[1], 10) - 1];

export default async function CalendarPage() {
  const c = ((await getContent()).pages.calendar as unknown) as CalendarContent;

  return (
    <>
      <section className="section" style={{ paddingTop: '64px', paddingBottom: '32px' }}>
        <div className="container">
          <SectionHead num={c.head.num} label={c.head.label} title={c.head.title} sub={c.head.sub} />
        </div>
      </section>

      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          {c.events.map((e, i) => (
            <SpotlightCard key={i} as="article" className="card mb-4" style={{ display: 'block', padding: '0', overflow: 'hidden' }}>
              <div className="event-grid" style={{ display: 'grid', gridTemplateColumns: '160px 1fr 200px', gap: '0', alignItems: 'stretch' }}>
                <div style={{ padding: '28px 24px', borderRight: '1px solid var(--rule)', background: 'var(--paper-3)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                  <div className="mono" style={{ fontSize: '10.5px', color: 'var(--ink-3)', letterSpacing: '0.12em' }}>{e.weekday}</div>
                  <div className="mono" style={{ fontSize: '28px', color: 'var(--ink)', letterSpacing: '0.02em', lineHeight: 1.1, fontFamily: 'var(--font-mono)', marginTop: '6px' }}>{e.when.split('.')[2]}</div>
                  <div className="mono" style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.06em', marginTop: '4px' }}>{monthName(e.when)} {e.when.split('.')[0]}</div>
                  <div className="mono" style={{ fontSize: '10.5px', color: 'var(--accent)', marginTop: '12px', letterSpacing: '0.08em' }}>{e.time}</div>
                </div>
                <div style={{ padding: '28px 28px' }}>
                  <div className="gap-8 mb-4" style={{ flexWrap: 'wrap' }}>
                    <span className="tag accent">{e.type}</span>
                    <span className="tag">{e.where}</span>
                    <span className="tag status-on" style={{ marginLeft: 'auto' }}>{e.status}</span>
                  </div>
                  <h3 className="h-2 mb-4" style={{ fontSize: '26px' }}>{e.title}</h3>
                  <p style={{ fontSize: '14.5px', color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: '10px' }}>{e.lede}</p>
                  <p className="mono" style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.08em' }}>HOSTED BY · {e.who}</p>
                </div>
                <div style={{ padding: '24px', borderLeft: '1px solid var(--rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper-3)' }}>
                  <button className="btn solid">{e.cta} <span className="arr">→</span></button>
                </div>
              </div>
            </SpotlightCard>
          ))}
          <div className="mt-12 mono" style={{ fontSize: '11.5px', color: 'var(--ink-3)', textAlign: 'center', letterSpacing: '0.12em' }}>{c.footnote}</div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)', color: 'var(--ink)', textAlign: 'center' }}>
        <div className="container-narrow">
          <span className="eyebrow" style={{ color: 'var(--ink-3)' }}>{c.speakBlock.eyebrow}</span>
          <h2 className="h-1 mt-4 mb-6" style={{ color: 'var(--ink)' }}>{c.speakBlock.title}</h2>
          <p style={{ fontSize: '16px', color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: '32px' }}>{c.speakBlock.body}</p>
          <a href={`/contact?topic=${c.speakBlock.email}#write`} className="btn">
            Write to us <span className="arr">→</span>
          </a>
        </div>
      </section>
    </>
  );
}
