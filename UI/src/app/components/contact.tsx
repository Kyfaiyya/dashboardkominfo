import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { motion } from 'motion/react';

const contactMethods = [
  {
    icon: Phone,
    title: 'Call Us',
    detail: '1-800-GOV-HELP',
    subtitle: 'Mon-Fri, 8AM-6PM',
  },
  {
    icon: Mail,
    title: 'Email Us',
    detail: 'support@govportal.gov',
    subtitle: 'We respond within 24h',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    detail: '123 Government Plaza',
    subtitle: 'City Center, 12345',
  },
];

export function Contact() {
  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We're here to help and answer any questions you might have
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {contactMethods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group p-8 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0A4D9C] to-[#42A5F5] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-lg text-[#0A4D9C] font-semibold mb-1">{method.detail}</p>
                <p className="text-sm text-gray-600">{method.subtitle}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-8 sm:p-12 rounded-2xl border border-gray-200/50 shadow-lg bg-white">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Send Us a Message
              </h3>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      className="rounded-xl border-gray-200 focus:border-[#0A4D9C] focus:ring-[#0A4D9C]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="rounded-xl border-gray-200 focus:border-[#0A4D9C] focus:ring-[#0A4D9C]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="How can we help you?"
                    className="rounded-xl border-gray-200 focus:border-[#0A4D9C] focus:ring-[#0A4D9C]"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    rows={6}
                    placeholder="Tell us more about your inquiry..."
                    className="rounded-xl border-gray-200 focus:border-[#0A4D9C] focus:ring-[#0A4D9C] resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#0A4D9C] via-[#1E88E5] to-[#42A5F5] text-white rounded-full px-8 text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                >
                  Send Message
                  <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
