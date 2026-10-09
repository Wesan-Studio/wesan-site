import { getContent } from '@/lib/content';
import { InvestorsClient, type InvestorsContent } from './investors-client';

export const metadata = {
  title: 'Investors',
  description: 'Wesan is founder-owned and based in England, open to conversations with long-horizon investors.',
};

export default async function InvestorsPage() {
  const c = ((await getContent()).pages.investors as unknown) as InvestorsContent;
  return <InvestorsClient c={c} />;
}
