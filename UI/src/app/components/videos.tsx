import { Play, Clock, Eye } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const videos = [
  {
    title: 'Smart City Overview 2026',
    duration: '5:42',
    views: '12.5K',
    category: 'Overview',
    thumbnail: 'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGNpdHklMjB1cmJhbiUyMHNreWxpbmV8ZW58MXx8fHwxNzgyNjUyNTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'How to Use Our Digital Services',
    duration: '8:15',
    views: '8.2K',
    category: 'Tutorial',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbiUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzgyNDg5Njc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Community Success Stories',
    duration: '6:30',
    views: '15.8K',
    category: 'Stories',
    thumbnail: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjb2xsYWJvcmF0aW9uJTIwdGVhbXdvcmt8ZW58MXx8fHwxNzgyNjUyNTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function Videos() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Video Library
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Watch tutorials, updates, and inspiring stories from our community
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white">
                <div className="relative h-56 overflow-hidden">
                  <ImageWithFallback
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-[#0A4D9C] group-hover:to-[#42A5F5] transition-all duration-300 shadow-xl">
                      <Play className="w-7 h-7 text-gray-900 group-hover:text-white ml-1" fill="currentColor" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <Badge className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white hover:bg-black/60">
                    <Clock className="w-3 h-3 mr-1" />
                    {video.duration}
                  </Badge>

                  {/* Category Badge */}
                  <Badge className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white/90">
                    {video.category}
                  </Badge>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#0A4D9C] transition-colors line-clamp-2">
                    {video.title}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>{video.views} views</span>
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
