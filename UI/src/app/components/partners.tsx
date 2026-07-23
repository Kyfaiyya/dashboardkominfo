import { motion } from 'motion/react';
import { Handshake } from 'lucide-react';

// Using text logos for partners to avoid additional image dependencies
const partners = [
  { name: 'TechCorp', color: 'text-blue-600' },
  { name: 'GreenEnergy', color: 'text-green-600' },
  { name: 'SmartSolutions', color: 'text-purple-600' },
  { name: 'DataViz Inc', color: 'text-orange-600' },
  { name: 'CloudFirst', color: 'text-cyan-600' },
  { name: 'InnovateLab', color: 'text-pink-600' },
  { name: 'SecureNet', color: 'text-indigo-600' },
  { name: 'FutureTech', color: 'text-teal-600' },
];

export function Partners() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0A4D9C]/10 to-[#42A5F5]/10 rounded-full mb-6">
            <Handshake className="w-4 h-4 text-[#0A4D9C]" />
            <span className="text-sm font-semibold text-[#0A4D9C]">Collaboration</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Our Partners
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Working together with leading organizations to deliver excellence
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="h-32 rounded-2xl border border-gray-200/50 bg-white shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center p-6 hover:-translate-y-1">
                <div className={`text-2xl font-bold ${partner.color} group-hover:scale-110 transition-transform`}>
                  {partner.name}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">
            Interested in partnering with us?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#0A4D9C] via-[#1E88E5] to-[#42A5F5] text-white font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <Handshake className="w-5 h-5" />
            Become a Partner
          </a>
        </motion.div>
      </div>
    </section>
  );
}
