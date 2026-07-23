import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ZoomIn } from 'lucide-react';

const galleryImages = [
  {
    src: 'https://images.unsplash.com/photo-1703107819041-5c1d6c35c085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBnb3Zlcm5tZW50JTIwYnVpbGRpbmclMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzgyNjUyNTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Government Plaza',
    category: 'Architecture',
  },
  {
    src: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbiUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzgyNDg5Njc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Digital Innovation Hub',
    category: 'Technology',
  },
  {
    src: 'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGNpdHklMjB1cmJhbiUyMHNreWxpbmV8ZW58MXx8fHwxNzgyNjUyNTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Smart City Skyline',
    category: 'Urban Planning',
  },
  {
    src: 'https://images.unsplash.com/photo-1622675363311-3e1904dc1885?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwYnVzaW5lc3MlMjBwcm9mZXNzaW9uYWxzJTIwbWVldGluZ3xlbnwxfHx8fDE3ODI2NTI1NDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Leadership Summit',
    category: 'Events',
  },
  {
    src: 'https://images.unsplash.com/photo-1666875753105-c63a6f3bdc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGFuYWx5dGljc3xlbnwxfHx8fDE3ODI1Mzg4NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Data Analytics Center',
    category: 'Technology',
  },
  {
    src: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjb2xsYWJvcmF0aW9uJTIwdGVhbXdvcmt8ZW58MXx8fHwxNzgyNjUyNTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    title: 'Community Outreach',
    category: 'Programs',
  },
];

export function Gallery() {
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
            Gallery
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our facilities, events, and community initiatives
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer aspect-square"
            >
              <ImageWithFallback
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="text-sm font-semibold text-[#42A5F5] mb-2">
                    {image.category}
                  </div>
                  <h3 className="text-xl font-bold">{image.title}</h3>
                </div>
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
