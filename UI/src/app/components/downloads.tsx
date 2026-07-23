import { FileText, Download, Calendar } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';

const documents = [
  {
    title: 'Annual Report 2026',
    description: 'Comprehensive overview of city achievements and financial summary',
    size: '4.2 MB',
    format: 'PDF',
    date: 'June 15, 2026',
    downloads: '1.2K',
    category: 'Reports',
  },
  {
    title: 'Smart City Strategy 2027-2030',
    description: 'Long-term vision and implementation roadmap for digital transformation',
    size: '2.8 MB',
    format: 'PDF',
    date: 'May 20, 2026',
    downloads: '890',
    category: 'Strategy',
  },
  {
    title: 'Budget Allocation Guide',
    description: 'Detailed breakdown of city budget and spending priorities',
    size: '1.5 MB',
    format: 'PDF',
    date: 'April 10, 2026',
    downloads: '650',
    category: 'Finance',
  },
  {
    title: 'Citizen Handbook 2026',
    description: 'Essential information about city services and how to access them',
    size: '3.1 MB',
    format: 'PDF',
    date: 'January 5, 2026',
    downloads: '2.5K',
    category: 'Guides',
  },
];

export function Downloads() {
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
            Document Library
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access important documents, reports, and resources
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {documents.map((doc, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group p-6 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0A4D9C] to-[#42A5F5] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 group-hover:text-[#0A4D9C] transition-colors">
                        {doc.title}
                      </h3>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100 flex-shrink-0">
                        {doc.category}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {doc.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {doc.date}
                      </span>
                      <span>{doc.format}</span>
                      <span>{doc.size}</span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {doc.downloads} downloads
                      </span>
                    </div>

                    <Button
                      size="sm"
                      className="w-full sm:w-auto rounded-full bg-gradient-to-r from-[#0A4D9C] to-[#42A5F5] text-white hover:shadow-lg"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
