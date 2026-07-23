import { Calendar, ArrowRight } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const news = [
  {
    title: 'New Digital Services Platform Launches',
    excerpt: 'Experience our redesigned portal with enhanced features and improved accessibility for all citizens.',
    date: 'June 25, 2026',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbiUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzgyNDg5Njc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Smart City Initiative Expansion',
    excerpt: 'IoT sensors and AI-powered analytics bring real-time insights to urban management and planning.',
    date: 'June 22, 2026',
    category: 'Smart City',
    image: 'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGNpdHklMjB1cmJhbiUyMHNreWxpbmV8ZW58MXx8fHwxNzgyNjUyNTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Community Engagement Program Results',
    excerpt: 'Record participation in citizen feedback sessions shapes future development and policy decisions.',
    date: 'June 20, 2026',
    category: 'Community',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjb2xsYWJvcmF0aW9uJTIwdGVhbXdvcmt8ZW58MXx8fHwxNzgyNjUyNTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function LatestNews() {
  return (
    <section id="news" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-16"
        >
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Latest News
            </h2>
            <p className="text-xl text-gray-600">
              Stay updated with the latest developments and announcements
            </p>
          </div>
          <Button
            variant="outline"
            className="hidden sm:flex rounded-full border-2 hover:border-[#0A4D9C] hover:bg-gray-50 group"
          >
            View All
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white h-full">
                <div className="relative h-56 overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white">
                    {item.category}
                  </Badge>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {item.date}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0A4D9C] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 line-clamp-3">
                    {item.excerpt}
                  </p>
                  
                  <div className="pt-2">
                    <span className="inline-flex items-center text-[#0A4D9C] font-semibold group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
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
