import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary border-t border-secondary/20">
      <div className="max-w-[120rem] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h3 className="font-heading text-2xl font-bold text-limegreen mb-4">
              CreativeValidator
            </h3>
            <p className="font-paragraph text-sm text-softgray">
              Validate your retail ad creatives before submission with AI-powered simulation and analysis.
            </p>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold text-primary-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="font-paragraph text-sm text-softgray hover:text-brightblue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/upload" className="font-paragraph text-sm text-softgray hover:text-brightblue transition-colors">
                  Upload Creative
                </Link>
              </li>
              <li>
                <Link to="/simulation" className="font-paragraph text-sm text-softgray hover:text-brightblue transition-colors">
                  Simulation Dashboard
                </Link>
              </li>
              <li>
                <Link to="/export" className="font-paragraph text-sm text-softgray hover:text-brightblue transition-colors">
                  Export Report
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-semibold text-primary-foreground mb-4">
              Contact
            </h4>
            <p className="font-paragraph text-sm text-softgray mb-2">
              support@creativevalidator.com
            </p>
            <p className="font-paragraph text-sm text-softgray">
              Available 24/7 for your validation needs
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-secondary/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-sm text-softgray">
              © {currentYear} CreativeValidator. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="font-paragraph text-sm text-softgray hover:text-brightblue transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="font-paragraph text-sm text-softgray hover:text-brightblue transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
