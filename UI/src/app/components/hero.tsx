import { ArrowRight, Play } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A4D9C]/10 via-[#1E88E5]/5 to-[#42A5F5]/10" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-br from-[#0A4D9C]/20 to-[#42A5F5]/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-gradient-to-br from-[#1E88E5]/20 to-[#42A5F5]/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-sm"
            >
              <div className="w-2 h-2 bg-gradient-to-r from-[#0A4D9C] to-[#42A5F5] rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Digital-First Government</span>
            </motion.div>

            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Building a{' '}
                <span className="bg-gradient-to-r from-[#0A4D9C] via-[#1E88E5] to-[#42A5F5] bg-clip-text text-transparent">
                  Smarter Future
                </span>{' '}
                Together
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Experience seamless digital services, real-time city insights, and innovative
                solutions designed to enhance your quality of life in our smart city.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#0A4D9C] via-[#1E88E5] to-[#42A5F5] text-white rounded-full px-8 text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
              >
                Explore Services
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-lg border-2 border-gray-300 hover:border-[#0A4D9C] hover:bg-gray-50 transition-all duration-300 group"
              >
                <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Watch Video
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-8 pt-8"
            >
              {[
                { value: '2M+', label: 'Citizens' },
                { value: '150+', label: 'Services' },
                { value: '99.9%', label: 'Uptime' },
              ].map((stat, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-3xl font-bold bg-gradient-to-r from-[#0A4D9C] to-[#42A5F5] bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1703107819041-5c1d6c35c085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBnb3Zlcm5tZW50JTIwYnVpbGRpbmclMjBhcmNoaXRlY3R1cmV8ZW58MXx8fHwxNzgyNjUyNTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Modern government building architecture"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/50 max-w-xs"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#0A4D9C] to-[#42A5F5] rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">🏆</span>
                </div>
                <div>
                  <div className="font-bold text-gray-900">Award Winning</div>
                  <div className="text-sm text-gray-600">Digital Excellence 2026</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
