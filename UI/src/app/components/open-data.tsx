import { Database, Download, Eye, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';

const datasets = [
  {
    title: 'Population Demographics',
    description: 'Comprehensive census data and population statistics updated quarterly',
    downloads: '12.4K',
    updated: '2 days ago',
    format: ['CSV', 'JSON', 'XML'],
    category: 'Demographics'
  },
  {
    title: 'Transportation Network',
    description: 'Real-time public transit routes, schedules, and traffic flow data',
    downloads: '8.9K',
    updated: 'Today',
    format: ['JSON', 'GeoJSON'],
    category: 'Transport'
  },
  {
    title: 'Environmental Monitoring',
    description: 'Air quality, water quality, and environmental sensor readings',
    downloads: '6.2K',
    updated: '1 day ago',
    format: ['CSV', 'API'],
    category: 'Environment'
  },
  {
    title: 'Business Registry',
    description: 'Complete database of registered businesses and licenses',
    downloads: '15.1K',
    updated: '3 days ago',
    format: ['CSV', 'JSON'],
    category: 'Business'
  },
];

export function OpenData() {
  return (
    <section id="data" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0A4D9C]/10 to-[#42A5F5]/10 rounded-full mb-6">
            <Database className="w-4 h-4 text-[#0A4D9C]" />
            <span className="text-sm font-semibold text-[#0A4D9C]">Transparency First</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Open Data Portal
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access public datasets for research, development, and innovation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {datasets.map((dataset, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group p-6 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl transition-all duration-300 bg-white h-full">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="bg-[#0A4D9C]/10 text-[#0A4D9C] hover:bg-[#0A4D9C]/20">
                      {dataset.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Download className="w-4 h-4" />
                      {dataset.downloads}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0A4D9C] transition-colors">
                      {dataset.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {dataset.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {dataset.format.map((format) => (
                      <span
                        key={format}
                        className="px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full"
                      >
                        {format}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      Updated {dataset.updated}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border-2 hover:border-[#0A4D9C]"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="rounded-full bg-gradient-to-r from-[#0A4D9C] to-[#42A5F5] text-white hover:shadow-lg"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="inline-block p-8 rounded-2xl border border-gray-200/50 shadow-sm bg-gradient-to-br from-[#0A4D9C]/5 to-[#42A5F5]/5">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0A4D9C] to-[#42A5F5] flex items-center justify-center shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Explore All Datasets
                </h3>
                <p className="text-gray-600 mb-4">
                  Browse our complete catalog of 250+ open datasets
                </p>
                <Button className="bg-gradient-to-r from-[#0A4D9C] via-[#1E88E5] to-[#42A5F5] text-white rounded-full px-6 hover:shadow-xl">
                  View Catalog
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
