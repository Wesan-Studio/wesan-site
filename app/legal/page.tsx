import { getContent } from '@/lib/content';
import { LegalClient, type LegalContent } from './legal-client';

export const metadata = {
  title: 'Legal',
  description: 'Privacy policy, terms, cookies, trademarks and DPA for wesan.co and Wesan products.',
};

export default async function LegalPage() {
  const c = ((await getContent()).pages.legal as unknown) as LegalContent;
  return <LegalClient c={c} />;
}
