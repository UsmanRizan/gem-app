import { Link } from 'react-router-dom';
import { Diamond, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-neutral-950 text-neutral-300 mt-16">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Diamond className="h-8 w-8 text-primary-500" />
              <span className="font-display text-xl font-semibold text-white">GemMarket</span>
            </Link>
            <p className="text-sm text-neutral-400 max-w-xs">
              The premier marketplace for rare and precious gemstones, connecting buyers and sellers in a secure environment.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-primary-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/auth" className="text-neutral-400 hover:text-primary-500 transition-colors">Sign In</Link>
              </li>
              <li>
                <Link to="/buy-credits" className="text-neutral-400 hover:text-primary-500 transition-colors">Buy Credits</Link>
              </li>
              <li>
                <Link to="/profile" className="text-neutral-400 hover:text-primary-500 transition-colors">Profile</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors">Refund Policy</a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-primary-500 transition-colors">Cookie Policy</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
                <span className="text-neutral-400">123 Gem Street, Treasure City, TC 12345</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary-500 mr-2" />
                <span className="text-neutral-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary-500 mr-2" />
                <span className="text-neutral-400">contact@gemmarket.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-sm text-neutral-500">
          <p>&copy; {currentYear} GemMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;