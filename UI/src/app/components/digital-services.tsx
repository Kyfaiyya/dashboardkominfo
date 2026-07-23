import { Smartphone, Globe, Shield, Zap, Cloud, Lock } from 'lucide-react';
import { Card } from './ui/card';
import { motion } from 'motion/react';

const features = [
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Access all services seamlessly on any device with our responsive platform.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Shield,
    title: 'Bank-Level Security',
    description: 'Your data is protected with military-grade encryption and multi-factor authentication.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized infrastructure ensures instant loading and smooth interactions.',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    icon: Cloud,
    title: 'Cloud-Based',
    description: 'Access your documents and services from anywhere, anytime with cloud sync.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    description: 'Available in 12 languages to serve our diverse community effectively.',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Full compliance with GDPR and local data protection regulations.',
    color: 'from-red-500 to-red-600',
  },
];

export function DigitalServices() {
  return (
    <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Digital Services Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Built with cutting-edge technology to provide the best citizen experience
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group p-8 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 bg-white h-full">
                <div className="space-y-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0A4D9C] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Platform Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid sm:grid-cols-3 gap-8 p-8 rounded-2xl bg-gradient-to-br from-[#0A4D9C]/5 to-[#42A5F5]/5 border border-gray-200/50"
        >
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-[#0A4D9C] to-[#42A5F5] bg-clip-text text-transparent mb-2">
              99.9%
            </div>
            <div className="text-gray-600 font-medium">Platform Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-[#0A4D9C] to-[#42A5F5] bg-clip-text text-transparent mb-2">
              &lt;2s
            </div>
            <div className="text-gray-600 font-medium">Average Load Time</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-[#0A4D9C] to-[#42A5F5] bg-clip-text text-transparent mb-2">
              150+
            </div>
            <div className="text-gray-600 font-medium">Active Services</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
