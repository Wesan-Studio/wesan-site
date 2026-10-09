export const metadata = {
  title: 'Careers',
  description: 'Wesan is not hiring yet. Introduce yourself if you want to build long-horizon software with us.',
};

export default function CareersPage() {
  return (
    <section className="section">
      <div className="container">
        <h1 className="h-1" style={{ maxWidth: '20ch' }}>We are not hiring yet.</h1>
        <p className="lead mt-6">We open our first roles once Meltir and Levios AI are out. If you want to build long-horizon software with us, introduce yourself through <a href="/contact?topic=general#write" className="text-link" style={{ color: 'var(--ink)' }}>our contact page</a>: who you are, and two things you have built.</p>
      </div>
    </section>
  );
}
