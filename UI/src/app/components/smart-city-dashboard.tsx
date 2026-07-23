import { Activity, Zap, Droplets, Wind, TrendingUp, Users } from 'lucide-react';
import { Card } from './ui/card';
import { motion } from 'motion/react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRealtimeData } from '../context/RealtimeContext';
import { useState, useEffect } from 'react';

const iconMap: Record<string, typeof Zap> = {
  energy: Zap,
  water: Droplets,
  air: Wind,
  citizens: Users,
};

const colorMap: Record<string, { color: string; bgColor: string }> = {
  energy: { color: 'from-yellow-500 to-orange-500', bgColor: 'bg-yellow-50' },
  water: { color: 'from-blue-500 to-cyan-500', bgColor: 'bg-blue-50' },
  air: { color: 'from-green-500 to-emerald-500', bgColor: 'bg-green-50' },
  citizens: { color: 'from-purple-500 to-pink-500', bgColor: 'bg-purple-50' },
};

export function SmartCityDashboard() {
  const { metrics, energyChart, trafficChart, connectionStatus } = useRealtimeData();
  const [flashingIds, setFlashingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (metrics.length === 0) return;
    const ids = new Set(metrics.map((m) => m.id));
    setFlashingIds(ids);
    const timeout = setTimeout(() => setFlashingIds(new Set()), 1000);
    return () => clearTimeout(timeout);
  }, [metrics]);

  return (
    <section id="smart-city" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0A4D9C]/10 to-[#42A5F5]/10 rounded-full mb-6">
            <Activity className="w-4 h-4 text-[#0A4D9C]" />
            <span className="text-sm font-semibold text-[#0A4D9C]">Real-Time Monitoring</span>
            {connectionStatus === 'connected' && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
            )}
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Smart City Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Live insights into our city's infrastructure and services
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => {
            const Icon = iconMap[metric.id] || Activity;
            const colors = colorMap[metric.id] || { color: 'from-gray-500 to-gray-600', bgColor: 'bg-gray-50' };
            const isFlashing = flashingIds.has(metric.id);

            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`p-6 rounded-2xl border border-gray-200/50 shadow-sm hover:shadow-lg transition-all duration-300 ${colors.bgColor} ${isFlashing ? 'ring-2 ring-[#42A5F5]/50' : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      {metric.trend}
                    </div>
                  </div>
                  <motion.div
                    key={metric.value}
                    initial={{ scale: 1.1, color: '#0A4D9C' }}
                    animate={{ scale: 1, color: '#111827' }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-bold text-gray-900 mb-1"
                  >
                    {metric.value}
                  </motion.div>
                  <div className="text-sm text-gray-600">{metric.label}</div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 rounded-2xl border border-gray-200/50 shadow-sm bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Energy Consumption (24h)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={energyChart}>
                  <defs>
                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0A4D9C" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#42A5F5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0A4D9C"
                    strokeWidth={2}
                    fill="url(#colorEnergy)"
                    isAnimationActive={true}
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-6 rounded-2xl border border-gray-200/50 shadow-sm bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Traffic Flow (Weekly)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trafficChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="url(#barGradient)"
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={800}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1E88E5" />
                      <stop offset="100%" stopColor="#42A5F5" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
