import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-green-50 font-sans">
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-green-800">FarmFresh</div>
          <div>
            <Link
              href="/login"
              className="text-green-600 hover:text-green-800 mx-2"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main className="grow">
        <section
          className="bg-cover bg-center h-96 lg:h-150 text-white flex items-center relative"
          style={{ backgroundImage: "url('/imgs/OIP.webp')" }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="container mx-auto px-6 text-center relative">
            <h1 className="text-5xl font-bold mb-4">
              From Our Farm to Your Table
            </h1>
            <p className="text-xl mb-8">
              Fresh, organic, and locally sourced produce.
            </p>
            <Link
              href="/buyers-view/products"
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full"
            >
              Shop Now
            </Link>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-green-800 mb-6">
              Why Choose FarmFresh?
            </h2>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="max-w-sm p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-green-700 mb-2">
                  Always Fresh
                </h3>
                <p className="text-gray-600">
                  We harvest our produce daily to ensure you get the freshest
                  products possible.
                </p>
              </div>
              <div className="max-w-sm p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-green-700 mb-2">
                  Locally Sourced
                </h3>
                <p className="text-gray-600">
                  By sourcing locally, we support our community and reduce our
                  carbon footprint.
                </p>
              </div>
              <div className="max-w-sm p-6 bg-white rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-green-700 mb-2">
                  100% Organic
                </h3>
                <p className="text-gray-600">
                  Our farming practices are 100% organic, free from harmful
                  pesticides and chemicals.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-3xl font-bold text-green-800 mb-4">
                  For Buyers: Fresh Produce, Direct from Farmers
                </h2>
                <p className="text-gray-600 mb-6">
                  Browse a wide selection of fresh, locally grown produce and agricultural products listed directly by farmers.
                  By shopping on our platform, you get farm-fresh goods at fair prices while supporting local farmers and
                  strengthening your community&apos;s food system. No middlemen, just quality produce from farm to table.
                </p>
                <Link
                  href="/buyers-view/farmers"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full inline-block transition duration-300"
                >
                  Browse Farmers
                </Link>
              </div>
              <div className="md:w-1/2 w-full h-64 lg:h-96 relative">
                <Image
                  src="/imgs/landing-img.png"
                  alt="Happy customer buying produce"
                  fill
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-8">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-3xl font-bold text-green-800 mb-4">
                  For Farmers: Grow Your Business with Us
                </h2>
                <p className="text-gray-600 mb-6">
                  Join our community of local farmers and reach a wider
                  audience. Our platform makes it easy to manage your inventory,
                  connect with customers, and grow your business.
                </p>
                <Link
                  href="/register"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full"
                >
                  Join as a Farmer
                </Link>
              </div>
              <div className="md:w-1/2 w-full h-64 lg:h-96 relative">
                <Image
                  src="/imgs/landing-img2.png"
                  alt="Farmer in a field"
                  fill
                  className="rounded-lg shadow-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-green-800 text-white py-6">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} FarmFresh. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}