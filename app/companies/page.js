import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CompaniesPage() {
  const dummyCompanies = [
    { id: '1', name: 'Tech Corp', location: 'San Francisco, CA', logo: '/file.svg' },
    { id: '2', name: 'Innovate LLC', location: 'Bengaluru, India', logo: '/vercel.svg' },
    { id: '3', name: 'Global Systems', location: 'Remote', logo: '/next.svg' },
    { id: '4', name: 'Designly', location: 'Berlin, Germany', logo: '/window.svg' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900">
      <Navbar />
      <main className="container mx-auto px-6 py-10 flex-grow">
        <h1 className="text-4xl font-bold mb-6">Companies hiring</h1>
        <p className="text-neutral-600 mb-6">Explore companies and see open roles.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dummyCompanies.map((c) => (
            <div key={c.id} className="p-4 bg-white rounded shadow hover:shadow-lg transition">
              <div className="flex items-center gap-3">
                <img src={c.logo} alt={c.name} className="w-12 h-12 object-contain" />
                <div>
                  <h3 className="text-lg font-semibold text-indigo-600">{c.name}</h3>
                  <p className="text-sm text-neutral-600">{c.location}</p>
                </div>
              </div>
              <div className="mt-4">
                <a href="#" className="text-sm text-blue-600">View jobs →</a>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
