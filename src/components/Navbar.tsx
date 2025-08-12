import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl border-b border-purple-500/20">
      {/* Background overlay with subtle animation */}
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        {/* Logo/Brand */}
        <div className="flex items-center">
          <Link href="/" className="group flex items-center space-x-3 text-white no-underline">
            {/* Logo icon */}
            <div className="w-10 h-10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <img 
                src="/logohr.svg" 
                alt="BDP Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                BDP Recruitment Portal
              </span>
              <span className="text-xs text-purple-300 opacity-80">
                Building Dreams Together
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-1">
          <NavLink href="/" label="Home" />
          <NavLink href="/recruitment-form" label="Apply Now" highlight />
          <NavLink href="/login" label="Login" />
        </div>
      </div>
      
      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  highlight?: boolean;
}

function NavLink({ href, label, highlight = false }: NavLinkProps) {
  const baseClasses = "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 no-underline";
  const normalClasses = "text-gray-300 hover:text-white hover:bg-white/10 hover:shadow-lg";
  const highlightClasses = "text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-lg hover:shadow-purple-500/25 hover:scale-105";
  
  return (
    <Link 
      href={href} 
      className={`${baseClasses} ${highlight ? highlightClasses : normalClasses}`}
    >
      {label}
      {/* Subtle underline effect for normal links */}
      {!highlight && (
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
      )}
    </Link>
  );
}