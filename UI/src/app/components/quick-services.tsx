import { 
  FileText, 
  CreditCard, 
  Building2, 
  GraduationCap, 
  Heart, 
  Car,
  Briefcase,
  Home
} from 'lucide-react';
import { Card } from './ui/card';
import { motion } from 'motion/react';

const services = [
  { icon: FileText, name: 'Apply for Permits', color: 'from-blue-500 to-blue-600' },
  { icon: CreditCard, name: 'Pay Bills', color: 'from-purple-500 to-purple-600' },
  { icon: Building2, name: 'Property Tax', color: 'from-green-500 to-green-600' },
  { icon: GraduationCap, name: 'Education', color: 'from-orange-500 to-orange-600' },
  { icon: Heart, name: 'Healthcare', color: 'from-red-500 to-red-600' },
  { icon: Car, name: 'Transportation', color: 'from-indigo-500 to-indigo-600' },
  { icon: Briefcase, name: 'Business License', color: 'from-teal-500 to-teal-600' },
  { icon: Home, name: 'Housing', color: 'from-pink-500 to-pink-600' },
];

export function QuickServices() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Quick Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access essential government services with just a few clicks
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group p-6 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer bg-white">
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-[#0A4D9C] transition-colors">
                    {service.name}
                  </h3>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
