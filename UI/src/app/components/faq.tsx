import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { motion } from 'motion/react';

const faqs = [
  {
    question: 'How do I access digital government services?',
    answer: 'You can access all digital services through our online portal by creating a free account. Simply click on "My Account" in the navigation menu and follow the registration process. Once registered, you\'ll have access to over 150 services including permit applications, bill payments, and more.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept various payment methods including credit/debit cards, bank transfers, digital wallets, and mobile payments. All transactions are secured with industry-standard encryption and comply with international payment security standards.',
  },
  {
    question: 'How can I report a public infrastructure issue?',
    answer: 'Use our "Report an Issue" feature in the Quick Services section. You can submit reports with photos, location details, and descriptions. You\'ll receive a tracking number and regular updates on the resolution progress.',
  },
  {
    question: 'Is my personal data secure?',
    answer: 'Yes, we implement the highest security standards to protect your data. Our platform uses end-to-end encryption, multi-factor authentication, and complies with all data protection regulations. We never share your personal information without explicit consent.',
  },
  {
    question: 'How do I access open government data?',
    answer: 'Visit our Open Data Portal to browse, preview, and download public datasets. All datasets are available in multiple formats (CSV, JSON, XML) and are regularly updated. You can also access real-time data through our API.',
  },
  {
    question: 'What accessibility features are available?',
    answer: 'Our platform is designed to meet WCAG 2.1 AA standards. Features include screen reader compatibility, keyboard navigation, high contrast modes, text resizing, and multilingual support. We\'re committed to ensuring equal access for all citizens.',
  },
];

export function FAQ() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0A4D9C]/10 to-[#42A5F5]/10 rounded-full mb-6">
            <HelpCircle className="w-4 h-4 text-[#0A4D9C]" />
            <span className="text-sm font-semibold text-[#0A4D9C]">Help Center</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Find answers to common questions about our services
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-gray-200/50 rounded-2xl px-6 bg-white shadow-sm hover:shadow-md transition-all duration-300"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
