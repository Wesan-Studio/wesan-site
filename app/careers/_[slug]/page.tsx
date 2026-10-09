// Role pages are off while Wesan is not hiring: the leading underscore keeps this folder out of routing.
// To publish roles again, rename the folder back to [slug].
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DetailHero, sentence } from '../../_components/detail-hero';
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

  const division = DIVISION_NAME[role.div] ?? sentence(role.div);
  const mail = `mailto:hello@wesan.com?subject=Application · ${encodeURIComponent(role.name)}`;

  return (
    <>
      <DetailHero
        back={{ href: '/careers', label: '← All roles' }}
        meta={[division, sentence(role.team), sentence(role.type)]}
        title={role.name}
        lede={role.lede}
      >
        <a href={mail} className="btn solid">Apply by email <span className="arr">→</span></a>
      </DetailHero>

      <article className="read">
        <div className="read-col">
          <dl className="facts">
            <div><dt>Location</dt><dd>{role.where}</dd></div>
            <div><dt>Reports to</dt><dd>{role.reportingTo}</dd></div>
            <div><dt>Compensation</dt><dd>{role.comp}</dd></div>
            <div><dt>Team</dt><dd>{role.teamMeta}</dd></div>
          </dl>

          <h2>{labels.responsibilitiesHead.title}</h2>
          <ul>{role.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul>

          <h2>{labels.firstSixHead.title}</h2>
          {labels.firstSixHead.sub && <p>{labels.firstSixHead.sub}</p>}
          <ol>{role.firstSixMonths.map((step, i) => <li key={i}>{step}</li>)}</ol>

          <h2>{sentence(labels.requirementsLabel)}</h2>
          <ul>{role.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>

          <h3>Nice to have</h3>
          <ul>{role.niceToHave.map((r, i) => <li key={i}>{r}</li>)}</ul>

          <h2>{labels.applyHead.title}</h2>
          <p dangerouslySetInnerHTML={{ __html: labels.applyBody.replace('{{name}}', role.name) }} />
          <ul>{labels.applyChecklist.map((item, i) => <li key={i}>{item}</li>)}</ul>
          <p className="small">{sentence(labels.applyFooter)}</p>
          <div className="detail-actions">
            <a href={mail} className="btn solid">hello@wesan.com <span className="arr">→</span></a>
          </div>

          {others.length > 0 && (
            <>
              <h2>{labels.otherHead.title}</h2>
              <ul className="link-list">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/careers/${o.slug}`}>{o.name}<span className="m">{sentence(o.team)}</span></Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </article>
    </>
  );
}

const DIVISION_NAME: Record<string, string> = { SFT: 'Software', STU: 'Studio', IND: 'Industries' };
