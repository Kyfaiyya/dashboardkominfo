import { motion, AnimatePresence } from 'motion/react';
import { Wifi, WifiOff, RefreshCw, Clock } from 'lucide-react';
import { useRealtimeData } from '../context/RealtimeContext';
import { useState } from 'react';

export function ConnectionStatus() {
  const { connectionStatus, lastUpdate, requestRefresh } = useRealtimeData();
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    connected: {
      icon: Wifi,
      color: 'bg-emerald-500',
      ringColor: 'ring-emerald-400/30',
      gradientFrom: 'from-emerald-500',
      gradientTo: 'to-green-500',
      label: 'Live',
      description: 'Realtime connection active',
      pulse: true,
    },
    connecting: {
      icon: RefreshCw,
      color: 'bg-amber-500',
      ringColor: 'ring-amber-400/30',
      gradientFrom: 'from-amber-500',
      gradientTo: 'to-yellow-500',
      label: 'Reconnecting...',
      description: 'Attempting to reconnect',
      pulse: false,
    },
    disconnected: {
      icon: WifiOff,
      color: 'bg-red-500',
      ringColor: 'ring-red-400/30',
      gradientFrom: 'from-red-500',
      gradientTo: 'to-rose-500',
      label: 'Offline',
      description: 'Showing cached data',
      pulse: false,
    },
  };

  const config = statusConfig[connectionStatus];
  const StatusIcon = config.icon;

  const formattedTime = lastUpdate
    ? new Date(lastUpdate).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : '--:--:--';

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        className={`cursor-pointer rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-300`}
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${config.color}`} />
            {config.pulse && (
              <div className={`absolute inset-0 w-3 h-3 rounded-full ${config.color} animate-ping`} />
            )}
          </div>

          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} flex items-center justify-center shadow-lg`}>
            <StatusIcon className={`w-4 h-4 text-white ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`} />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">{config.label}</span>
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-slate-400"
                >
                  {config.description}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400 ml-2">
            <Clock className="w-3 h-3" />
            <span>{formattedTime}</span>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-3"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  requestRefresh();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Data
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
