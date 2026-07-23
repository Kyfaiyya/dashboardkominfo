import { useEffect, useState } from 'react';
import { Building2, Users, Leaf, Award } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';

const stats = [
  { 
    icon: Building2, 
    value: 500, 
    suffix: '+', 
    label: 'Smart Buildings',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    icon: Users, 
    value: 2.1, 
    suffix: 'M', 
    label: 'Happy Citizens',
    color: 'from-purple-500 to-purple-600'
  },
  { 
    icon: Leaf, 
    value: 35, 
    suffix: '%', 
    label: 'Carbon Reduction',
    color: 'from-green-500 to-green-600'
  },
  { 
    icon: Award, 
    value: 15, 
    suffix: '+', 
    label: 'Awards Won',
    color: 'from-orange-500 to-orange-600'
  },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    if (suffix === 'M') {
      return latest.toFixed(1);
    }
    return Math.round(latest);
  });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      onUpdate: (latest) => {
        if (suffix === 'M') {
          setDisplayValue(latest.toFixed(1));
        } else {
          setDisplayValue(Math.round(latest).toString());
        }
      }
    });

    return controls.stop;
  }, [count, value, suffix]);

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  );
}

export function Statistics() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0A4D9C] via-[#1E88E5] to-[#42A5F5] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Impact By Numbers
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Real achievements in building a sustainable and connected future
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-300 hover:-translate-y-2">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold text-white mb-2">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-lg text-white/90 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
