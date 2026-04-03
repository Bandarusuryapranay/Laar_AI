import { Link } from "react-router-dom";
import { SiX } from "react-icons/si";
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope, FaRobot } from "react-icons/fa";

export default function Footer() {
  return (
    /* Background exactly matches your new Midnight Slate theme (#020617) */
    <footer className="bg-[#020617] text-white border-t border-white/5 transition-colors duration-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6 group">
              <div className="p-2 bg-[#2563EB] rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/20">
                <FaRobot className="text-white text-2xl" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">Laar AI</span>
            </div>
            <p className="text-lg text-slate-400 mb-8 max-w-md font-medium leading-relaxed">
              Master your interview skills with AI-powered practice sessions, real-time feedback, 
              and personalized insights to help you land your dream job.
            </p>
            
            {/* Social Icons with Cyan Glow hover */}
            <div className="flex space-x-5">
              <SocialIcon 
                href="https://github.com/Bandarusuryapranay" 
                icon={<FaGithub className="h-6 w-6" />} 
                label="GitHub" 
              />
              <SocialIcon 
                href="#" 
                icon={<SiX className="h-5 w-5 mt-0.5" />} 
                label="Twitter" 
              />
              <SocialIcon 
                href="https://www.linkedin.com/in/bandaru-surya-pranay-3363442b0" 
                icon={<FaLinkedin className="h-6 w-6" />} 
                label="LinkedIn" 
              />
              <SocialIcon 
                href="mailto:suryapranay1824@gmail.com" 
                icon={<FaEnvelope className="h-6 w-6" />} 
                label="Email" 
              />
            </div>
          </div>
      
          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6">
              <u>Quick Links</u>
            </h3>
            <ul className="space-y-4">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/interview/setup">Practice</FooterLink>
              <FooterLink to="/resources">Resources</FooterLink>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white mb-6">
              <u>Support</u>
            </h3>
            <ul className="space-y-4">
              <FooterLink to="/contact">Contact Us</FooterLink>
              <FooterLink to="#">Help Center</FooterLink>
              <FooterLink to="#">Privacy Policy</FooterLink>
              <FooterLink to="#">Terms of Service</FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} Laar AI. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-6 md:mt-0">
            <Link to="#" className="text-slate-500 hover:text-cyan-400 text-sm font-bold transition-colors">
              Privacy
            </Link>
            <Link to="#" className="text-slate-500 hover:text-cyan-400 text-sm font-bold transition-colors">
              Terms
            </Link>
            <Link to="#" className="text-slate-500 hover:text-cyan-400 text-sm font-bold transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper Components for Cleaner Code
function FooterLink({ to, children }) {
  return (
    <li>
      <Link 
        to={to} 
        className="text-slate-400 hover:text-cyan-400 font-bold transition-all duration-200 inline-block hover:translate-x-1"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all duration-300"
      aria-label={label}
    >
      {icon}
    </a>
  );
}