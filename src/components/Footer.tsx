import Link from "next/link";

interface FooterLinkProps {
  href: string;
  label: string;
}

function FooterLink({ href, label }: FooterLinkProps) {
  return (
    <Link
      href={href}
      className="text-sm hover:text-white transition-colors duration-200"
    >
      {label}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer className="py-12 px-6 bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © 2025 Batara Dharma Persada. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <FooterLink
              href="https://www.bataramining.com/"
              label="Batara Homepage"
            />
            <FooterLink href="/privacy" label="Privacy" />
            <FooterLink href="/terms" label="Terms" />
            <FooterLink href="/support" label="Support" />
          </div>
        </div>
      </div>
    </footer>
  );
}
