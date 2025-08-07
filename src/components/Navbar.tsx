import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-2xl font-bold">
        <Link href="/" className="text-white no-underline">
          BDP Recruitment Portal
        </Link>
      </div>

      <div className="flex space-x-4">
        <Link href="/" className="text-white no-underline">
          Home
        </Link>
        <Link href="/recruitment-form" className="text-white no-underline">
          Recruitment Form
        </Link>
        <Link href="/login" className="text-white no-underline">
          Login
        </Link>
      </div>
    </nav>
  );
}
