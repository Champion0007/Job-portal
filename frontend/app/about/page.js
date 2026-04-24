import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Testimonials from "../../components/Testimonials";

const team = [
  { id: 1, name: 'Aisha Khan', role: 'CEO', bio: 'Passionate about building products that connect people to opportunity.' },
  { id: 2, name: 'Ravi Patel', role: 'CTO', bio: 'Leads engineering and AI initiatives to improve job matching.' },
  { id: 3, name: 'Maya Chen', role: 'Head of Product', bio: 'Designs delightful experiences for job seekers and employers.' }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Navbar />

      <main className="container mx-auto px-6 py-12 flex-grow">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-800 mb-4">About JobPortal</h1>
            <p className="text-lg text-gray-700 mb-6">JobPortal is a modern job board connecting talent with great companies. We make job search simple, fast and relevant — combining smart matching, easy applications and helpful tools.</p>
            <div className="space-y-3">
              <p className="flex items-start gap-3"><span className="inline-block bg-indigo-600 text-white px-2 py-1 rounded mr-2">✓</span> Personalized job recommendations</p>
              <p className="flex items-start gap-3"><span className="inline-block bg-indigo-600 text-white px-2 py-1 rounded mr-2">✓</span> One-click applications and resume parsing</p>
              <p className="flex items-start gap-3"><span className="inline-block bg-indigo-600 text-white px-2 py-1 rounded mr-2">✓</span> Secure employer tools and analytics</p>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-indigo-800 mb-3">Our Mission</h3>
            <p className="text-gray-700">To help every job seeker find work they love and help companies find great talent — faster and fairer.</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Meet the team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map(member => (
              <div key={member.id} className="p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition animate-pop">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-semibold">{member.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                  <div>
                    <div className="font-semibold text-gray-800">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.role}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-700">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <Testimonials />
        </section>

        <section className="mb-12 bg-gradient-to-r from-indigo-50 to-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-3">Contact & Partnerships</h2>
          <p className="text-gray-700 mb-4">For inquiries, partnerships, or press, reach out to <a href="mailto:support@jobportal.example" className="text-indigo-700 hover:underline">support@jobportal.example</a>.</p>
          <a href="/contact" className="inline-block bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800">Contact us</a>
        </section>
      </main>

      <Footer />
    </div>
  );
}

