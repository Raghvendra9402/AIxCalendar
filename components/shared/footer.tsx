import { Calendar } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-semibold text-lg">
                Cal <span className="text-blue-400">AI</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              The intelligent calendar assistant that manages your time so you
              don&apos;t have to.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-sm">
            {[
              {
                heading: "Product",
                links: ["Features", "How it works", "Pricing", "Changelog"],
              },
              {
                heading: "Company",
                links: ["About", "Blog", "Careers", "Press"],
              },
              {
                heading: "Legal",
                links: ["Privacy", "Terms", "Security", "Cookies"],
              },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <p className="text-white font-semibold text-xs uppercase tracking-widest mb-4">
                  {heading}
                </p>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        href="#"
                        className="hover:text-white transition-colors duration-200"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} CalAI. All rights reserved.</p>
          <p className="text-slate-600">Built with ❤️ and a lot of AI</p>
        </div>
      </div>
    </footer>
  );
}
