import { ExternalLink, Calendar, MapPin } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const projects = [
  {
    title: 'Smart Transportation Hub',
    description: 'Multi-modal transit center integrating bus, rail, and bike-sharing with real-time tracking.',
    status: 'In Progress',
    completion: '65%',
    location: 'Downtown District',
    deadline: 'Dec 2026',
    image: 'https://images.unsplash.com/photo-1518235506717-e1ed3306a89b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGNpdHklMjB1cmJhbiUyMHNreWxpbmV8ZW58MXx8fHwxNzgyNjUyNTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Green Energy Initiative',
    description: 'Solar panel installation across government buildings to reduce carbon footprint by 40%.',
    status: 'Completed',
    completion: '100%',
    location: 'Citywide',
    deadline: 'Jan 2026',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbiUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzgyNDg5Njc5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    title: 'Community Digital Centers',
    description: 'Network of accessible tech hubs providing free internet and digital literacy training.',
    status: 'Planning',
    completion: '25%',
    location: 'All Districts',
    deadline: 'Mar 2027',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBjb2xsYWJvcmF0aW9uJTIwdGVhbXdvcmt8ZW58MXx8fHwxNzgyNjUyNTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function Projects() {
  return (
    <section id="projects" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Major Projects
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Infrastructure and innovation initiatives shaping our city's future
          </p>
        </motion.div>

        <div className="space-y-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-2xl transition-all duration-500 bg-white">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative h-80 md:h-auto overflow-hidden">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent md:bg-gradient-to-r" />
                  </div>

                  <div className="p-8 flex flex-col justify-between">
                    <div className="space-y-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-[#0A4D9C] transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                        <Badge
                          variant={project.status === 'Completed' ? 'default' : 'secondary'}
                          className={
                            project.status === 'Completed'
                              ? 'bg-green-100 text-green-700 hover:bg-green-100'
                              : project.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{project.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">Target: {project.deadline}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">Progress</span>
                          <span className="font-bold text-[#0A4D9C]">{project.completion}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: project.completion }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full bg-gradient-to-r from-[#0A4D9C] to-[#42A5F5] rounded-full"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto rounded-full border-2 hover:border-[#0A4D9C] hover:bg-gray-50 group/btn"
                      >
                        View Details
                        <ExternalLink className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
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
