import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';

const events = [
  {
    date: { day: '15', month: 'Jul' },
    title: 'Digital Government Summit 2026',
    time: '9:00 AM - 5:00 PM',
    location: 'City Convention Center',
    attendees: '500+',
    type: 'Conference',
    color: 'from-blue-500 to-blue-600',
  },
  {
    date: { day: '22', month: 'Jul' },
    title: 'Smart City Innovation Workshop',
    time: '2:00 PM - 6:00 PM',
    location: 'Tech Hub, Building 5',
    attendees: '150',
    type: 'Workshop',
    color: 'from-purple-500 to-purple-600',
  },
  {
    date: { day: '05', month: 'Aug' },
    title: 'Community Town Hall Meeting',
    time: '6:00 PM - 8:00 PM',
    location: 'City Hall Auditorium',
    attendees: '300',
    type: 'Town Hall',
    color: 'from-green-500 to-green-600',
  },
  {
    date: { day: '12', month: 'Aug' },
    title: 'Open Data Hackathon',
    time: '10:00 AM - 10:00 PM',
    location: 'Innovation District',
    attendees: '200',
    type: 'Hackathon',
    color: 'from-orange-500 to-orange-600',
  },
];

export function Events() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join us for workshops, conferences, and community gatherings
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group p-6 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white">
                <div className="flex gap-6">
                  {/* Date Badge */}
                  <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${event.color} flex flex-col items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <div className="text-2xl font-bold">{event.date.day}</div>
                    <div className="text-xs font-semibold uppercase">{event.date.month}</div>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#0A4D9C] transition-colors">
                          {event.title}
                        </h3>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100 flex-shrink-0">
                          {event.type}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span>{event.attendees} Expected Attendees</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        size="sm"
                        className="rounded-full bg-gradient-to-r from-[#0A4D9C] to-[#42A5F5] text-white hover:shadow-lg"
                      >
                        Register Now
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
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            className="rounded-full border-2 hover:border-[#0A4D9C] hover:bg-gray-50"
          >
            <Calendar className="mr-2 w-5 h-5" />
            View Full Calendar
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
