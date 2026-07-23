import { Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react';
import { motion } from 'motion/react';

const footerLinks = {
  'Services': [
    'Apply for Permits',
    'Pay Bills',
    'Property Tax',
    'Business License',
    'Education Services',
    'Healthcare Portal',
  ],
  'Resources': [
    'Open Data',
    'Smart City Dashboard',
    'News & Updates',
    'Events Calendar',
    'Document Library',
    'API Documentation',
  ],
  'About': [
    'Our Mission',
    'Leadership Team',
    'Transparency',
    'Careers',
    'Partnerships',
    'Awards & Recognition',
  ],
  'Support': [
    'Help Center',
    'Contact Us',
    'Report Issue',
    'Accessibility',
    'Privacy Policy',
    'Terms of Service',
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0A4D9C] via-[#1E88E5] to-[#42A5F5] flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">GovPortal</h3>
                  <p className="text-sm text-gray-400">Digital Government</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Building a smarter, more connected future for all citizens through innovative digital services.
              </p>
              <div className="flex gap-3 pt-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-br hover:from-[#0A4D9C] hover:to-[#42A5F5] flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links], index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="font-bold text-lg mb-6">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center group"
                    >
                      <span className="group-hover:translate-x-1 transition-transform inline-block">
                        {link}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-12 mb-12"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-2xl font-bold mb-4">Stay Updated</h4>
            <p className="text-gray-400 mb-6">
              Subscribe to our newsletter for the latest updates and announcements
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#42A5F5]"
              />
              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-[#0A4D9C] via-[#1E88E5] to-[#42A5F5] text-white font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>© 2026 GovPortal. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
