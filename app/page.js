import Navbar from "../components/Navbar";
import HeroSection from "../components/Herosection";
import Footer from "../components/Footer";
import Jobcard from "../components/Jobcard";

const featured = [
  { _id: '1', title: 'Frontend Engineer', company: 'Tech Corp', location: 'New York', jobType: 'Full-time' },
  { _id: '2', title: 'Backend Developer', company: 'Innovate LLC', location: 'Remote', jobType: 'Part-time' },
  { _id: '3', title: 'Product Designer', company: 'Designly', location: 'Bengaluru', jobType: 'Full-time' }
];

export default function Home() {
  return (
    <div className="bg-white text-gray-900">
      <Navbar />
      <HeroSection />

      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-6 lg:px-8">
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">Featured jobs</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((j) => (
              <Jobcard key={j._id} job={j} />
            ))}
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold">Get personalized job recommendations</h3>
              <p className="text-neutral-700">Create your profile and receive daily job alerts tailored to your skills.</p>
            </div>
            <div className="text-center md:text-right">
              <a href="/register" className="inline-block rounded bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700">Create profile</a>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">How it works</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded bg-white p-6 shadow">
              <h4 className="font-semibold mb-2">Search jobs</h4>
              <p className="text-sm text-neutral-600">Find roles using keyword, location and filters.</p>
            </div>
            <div className="rounded bg-white p-6 shadow">
              <h4 className="font-semibold mb-2">Apply with one click</h4>
              <p className="text-sm text-neutral-600">Submit your profile or upload a resume to apply instantly.</p>
            </div>
            <div className="rounded bg-white p-6 shadow">
              <h4 className="font-semibold mb-2">Interview & hire</h4>
              <p className="text-sm text-neutral-600">Coordinate interviews and chat with employers.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
