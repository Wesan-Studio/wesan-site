import { getContent, getNewsItems, type NewsroomIndexContent } from '@/lib/content';
import { NewsroomClient } from './newsroom-client';

export const metadata = {
  title: 'Newsroom',
  description: 'Every release Wesan and its divisions have published, newest first.',
};

export default async function NewsroomPage() {
  const content = await getContent();
  const c = content.pages.newsroomIndex as NewsroomIndexContent;
  const items = await getNewsItems();

  return <NewsroomClient c={c} items={items} />;
}
