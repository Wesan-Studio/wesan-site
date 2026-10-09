import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SectionHead } from '../../_components/lib';
import { DetailHero, sceneForDivision } from '../../_components/detail-hero';
import { getContent, getRole, getRoles, staticContent } from '@/lib/content';

export function generateStaticParams() {
  return staticContent.collections.careers.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = await getRole(slug);
  if (!r) return { title: 'Role not found · Wesan' };
  return {
    title: `${r.name} · ${r.team} · Wesan careers`,
    description: r.desc,
  };
}

export default async function RolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = await getRole(slug);
  if (!role) notFound();

  const labels = (await getContent()).pages.careers.detail;
  const others = (await getRoles()).filter((r) => r.slug !== role.slug);

  return (
    <>
      <DetailHero
        back={{ href: '/careers', label: '← All roles' }}
        scene={sceneForDivision(role.div)}
        seed={role.slug.length}
        title={role.name}
        lede={role.lede}
        meta={
          <>
            <span className="tag accent glass">{role.div}</span>
            <span className="mono" style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.08em' }}>{role.team}</span>
            <span className="tag glass">{role.type}</span>
            <span className="tag glass">{role.where}</span>
          </>
        }
      >
        <a href={`mailto:hello@wesan.com?subject=Application · ${encodeURIComponent(role.name)}`} className="btn solid">
          Apply by email <span className="arr">→</span>
        </a>
        <Link href="/careers" className="btn">Back to all roles</Link>
      </DetailHero>

      <div className="container">
        <div className="telemetry">
          <div><strong>{role.div}</strong> · {labels.telemetryLabels[0]}</div>
          <div><strong>{role.team}</strong> · {labels.telemetryLabels[1]}</div>
          <div><strong>{role.type}</strong> · {labels.telemetryLabels[2]}</div>
          <div><strong>{role.where.split(' ·')[0]}</strong> · {labels.telemetryLabels[3]}</div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <SectionHead num={labels.responsibilitiesHead.num!} label={labels.responsibilitiesHead.label!} title={labels.responsibilitiesHead.title!} />
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '8px' }}>
            {role.responsibilities.map((r, i, a) => (
              <li key={i} className="about-tl-grid" style={{
                display: 'grid', gridTemplateColumns: '40px 1fr', gap: '20px',
                padding: '20px 0', borderTop: '1px solid var(--rule)',
                ...(i === a.length - 1 ? { borderBottom: '1px solid var(--rule)' } : {}),
              }}>
                <span className="mono" style={{ fontSize: '12px', color: 'var(--accent)', letterSpacing: '0.1em', paddingTop: '2px' }}>{String(i + 1).padStart(2, '0')}</span>
                <span className="serif" style={{ fontSize: '18px', lineHeight: 1.5 }}>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="container">
          <SectionHead num={labels.firstSixHead.num!} label={labels.firstSixHead.label!} title={labels.firstSixHead.title!} sub={labels.firstSixHead.sub} />
          <ol style={{ listStyle: 'none', padding: 0, marginTop: '8px' }}>
            {role.firstSixMonths.map((step, i, a) => (
              <li key={i} className="about-tl-grid" style={{
                display: 'grid', gridTemplateColumns: '120px 1fr', gap: '32px',
                padding: '22px 0', borderTop: '1px solid var(--rule)',
                ...(i === a.length - 1 ? { borderBottom: '1px solid var(--rule)' } : {}),
              }}>
                <span className="mono" style={{ fontSize: '12px', color: 'var(--accent)', letterSpacing: '0.1em' }}>STEP {String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--ink-2)' }}>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="row row-2" style={{ gap: '32px' }}>
            <div className="card">
              <div className="eyebrow mb-4">{labels.requirementsLabel}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {role.requirements.map((r, i, a) => (
                  <li key={i} style={{ padding: '14px 0', borderBottom: i < a.length - 1 ? '1px solid var(--rule)' : 'none', fontSize: '14.5px', color: 'var(--ink-2)', lineHeight: 1.55 }}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="card">
              <div className="eyebrow mb-4">{labels.niceLabel}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {role.niceToHave.map((r, i, a) => (
                  <li key={i} style={{ padding: '14px 0', borderBottom: i < a.length - 1 ? '1px solid var(--rule)' : 'none', fontSize: '14.5px', color: 'var(--ink-2)', lineHeight: 1.55 }}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)', color: 'var(--ink)' }}>
        <div className="container">
          <div className="section-label" style={{ color: 'var(--ink-3)' }}>
            <span className="num" style={{ color: 'var(--ink)', borderColor: 'var(--paper)' }}>{labels.compHead.num}</span>
            <span>{labels.compHead.title}</span>
            <span className="rule" style={{ background: 'var(--rule)' }} />
          </div>
          <div className="row row-3" style={{ gap: '32px' }}>
            <div>
              <div className="mono mb-2" style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.12em' }}>COMPENSATION</div>
              <p className="serif" style={{ fontSize: '19px', color: 'var(--ink)', lineHeight: 1.5 }}>{role.comp}</p>
            </div>
            <div>
              <div className="mono mb-2" style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.12em' }}>REPORTING TO</div>
              <p className="serif" style={{ fontSize: '19px', color: 'var(--ink)', lineHeight: 1.5 }}>{role.reportingTo}</p>
            </div>
            <div>
              <div className="mono mb-2" style={{ fontSize: '11px', color: 'var(--ink-3)', letterSpacing: '0.12em' }}>TEAM</div>
              <p className="serif" style={{ fontSize: '19px', color: 'var(--ink)', lineHeight: 1.5 }}>{role.teamMeta}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-narrow">
          <SectionHead num={labels.applyHead.num!} label={labels.applyHead.label!} title={labels.applyHead.title!} />
          <div className="card">
            <p
              style={{ fontSize: '15.5px', color: 'var(--ink-2)', lineHeight: 1.7, marginBottom: '16px' }}
              dangerouslySetInnerHTML={{ __html: labels.applyBody.replace('{{name}}', role.name) }}
            />
            <ul style={{ paddingLeft: '20px', color: 'var(--ink-2)', fontSize: '14.5px', lineHeight: 1.7 }}>
              {labels.applyChecklist.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <p className="mono mt-4" style={{ fontSize: '11.5px', color: 'var(--ink-3)', letterSpacing: '0.06em' }}>{labels.applyFooter}</p>
          </div>
          <div className="gap-12 mt-8" style={{ flexWrap: 'wrap' }}>
            <a href={`mailto:hello@wesan.com?subject=Application · ${encodeURIComponent(role.name)}`} className="btn solid">
              hello@wesan.com <span className="arr">→</span>
            </a>
            <Link href="/careers" className="btn">All roles</Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--paper-2)' }}>
        <div className="container">
          <SectionHead num={labels.otherHead.num!} label={labels.otherHead.label!} title={labels.otherHead.title!} />
          <div className="row row-4 mt-8">
            {others.map((o) => (
              <Link key={o.slug} href={`/careers/${o.slug}`} className="card" style={{ display: 'block', color: 'inherit', textDecoration: 'none', cursor: 'pointer' }}>
                <div className="gap-8 mb-2" style={{ alignItems: 'baseline' }}>
                  <span className="tag accent">{o.div}</span>
                  <span className="mono" style={{ fontSize: '10.5px', color: 'var(--ink-3)', letterSpacing: '0.08em' }}>{o.team}</span>
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 500, lineHeight: 1.3, marginBottom: '12px' }}>{o.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--ink-3)', lineHeight: 1.55 }}>{o.where}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
