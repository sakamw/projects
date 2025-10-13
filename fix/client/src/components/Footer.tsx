import { Wrench } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="h-6 w-6 text-accent" />
              <span className="text-xl font-bold">CampusFix</span>
            </div>
            <p className="text-primary-foreground/70 text-sm">
              Making campus maintenance smarter, faster, and more efficient.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link to="/#features" className="hover:text-accent transition-colors">Features</Link></li>
              <li><Link to="/#how-it-works" className="hover:text-accent transition-colors">How It Works</Link></li>
              <li><Link to="/auth" className="hover:text-accent transition-colors">Get Started</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#about" className="hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-accent transition-colors">Contact</a></li>
              <li><a href="#careers" className="hover:text-accent transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><a href="#privacy" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-accent transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} CampusFix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
