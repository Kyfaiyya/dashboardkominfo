import { AlertCircle, Info, CheckCircle, Bell } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { motion } from 'motion/react';

const announcements = [
  {
    icon: CheckCircle,
    type: 'success',
    title: 'New Online Services Available',
    message: 'You can now renew your business licenses online. No more waiting in lines!',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
  },
  {
    icon: Info,
    type: 'info',
    title: 'System Maintenance Notice',
    message: 'Scheduled maintenance on July 30th from 2 AM to 4 AM. Some services may be temporarily unavailable.',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
  },
  {
    icon: AlertCircle,
    type: 'warning',
    title: 'Important Policy Update',
    message: 'New parking regulations take effect August 1st. Please review the updated guidelines.',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconColor: 'text-orange-600',
  },
];

export function Announcements() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0A4D9C]/10 to-[#42A5F5]/10 rounded-full mb-6">
            <Bell className="w-4 h-4 text-[#0A4D9C]" />
            <span className="text-sm font-semibold text-[#0A4D9C]">Stay Informed</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Announcements
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Important updates and notices for our community
          </p>
        </motion.div>

        <div className="grid gap-6 max-w-4xl mx-auto">
          {announcements.map((announcement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Alert className={`${announcement.bgColor} ${announcement.borderColor} border-2 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300`}>
                <div className="flex gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-white flex items-center justify-center ${announcement.iconColor}`}>
                    <announcement.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">
                      {announcement.title}
                    </h3>
                    <AlertDescription className="text-gray-700 leading-relaxed">
                      {announcement.message}
                    </AlertDescription>
                  </div>
                </div>
              </Alert>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
