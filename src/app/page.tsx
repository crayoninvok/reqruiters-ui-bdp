import Image from "next/image";
import Link from "next/link"; // For navigation between pages

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-6 sm:px-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <h1 className="text-4xl sm:text-5xl font-semibold leading-tight mb-4">
          Welcome to Database HR BDP
        </h1>
        <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto">
          Simplifying HR management with seamless CRUD operations for employee
          data.
        </p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full text-lg transition duration-300"
          >
            Login to Database
          </Link>
          <Link
            href="/login"
            className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white font-semibold py-3 px-6 rounded-full text-lg transition duration-300"
          >
            Direct Input Form
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 sm:px-12 bg-white dark:bg-gray-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="feature-card text-center p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-xl">
            <Image
              src="/team.svg"
              alt="User Icon"
              width={50}
              height={50}
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Employee Management</h3>
            <p>
              Efficiently manage employee data, including personal details,
              roles, and documents.
            </p>
          </div>
          <div className="feature-card text-center p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-xl">
            <Image
              src="/documentation.svg"
              alt="Document Icon"
              width={50}
              height={50}
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">Document Uploads</h3>
            <p>
              Securely upload and manage essential employee documents such as
              CVs, certificates, and IDs.
            </p>
          </div>
          <div className="feature-card text-center p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-xl">
            <Image
              src="/settings.svg"
              alt="Settings Icon"
              width={50}
              height={50}
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">
              Customizable Settings
            </h3>
            <p>
              Tailor the platform to suit your company's specific HR needs with
              customizable options.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-6 sm:px-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-4">
          Ready to streamline your HR operations?
        </h2>
        <p className="text-lg sm:text-xl text-center mb-8 max-w-3xl mx-auto">
          Start managing your employee data effortlessly with our platform.
        </p>
        <div className="flex justify-center">
          <Link
            href="/login"
            className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-full text-lg transition duration-300 hover:bg-gray-100"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-8 px-6 bg-gray-800 text-white text-center">
        <p className="text-sm">
          &copy; 2025 Database HR Batara Dharma Persada. All Rights Reserved.
        </p>
        <div className="flex justify-center gap-8 mt-4">
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:underline"
          >
            <Image
              src="https://nextjs.org/icons/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            <span>Learn</span>
          </a>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:underline"
          >
            <Image
              src="https://nextjs.org/icons/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            <span>Examples</span>
          </a>
          <a
            href="https://vercel.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 hover:underline"
          >
            <Image
              src="https://nextjs.org/icons/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            <span>Go to Next.js</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
