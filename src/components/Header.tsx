import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/upload', label: 'Upload' },
    { path: '/simulation', label: 'Simulation' },
    { path: '/suggestions', label: 'Fix Suggestions' },
    { path: '/export', label: 'Export' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-secondary/20">
      <div className="max-w-[120rem] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-heading text-xl font-bold text-limegreen hover:text-brightblue transition-colors">
            CreativeValidator
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-paragraph text-sm uppercase tracking-wider transition-colors ${
                  location.pathname === link.path
                    ? 'text-limegreen'
                    : 'text-primary-foreground hover:text-brightblue'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="md:hidden">
            <button className="text-primary-foreground hover:text-limegreen transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
