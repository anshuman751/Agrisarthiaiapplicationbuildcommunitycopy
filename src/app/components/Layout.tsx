import { Outlet, Link, useLocation } from 'react-router';
import { AIAssistant } from './AIAssistant';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Camera, 
  Activity, 
  Sprout, 
  Beaker, 
  Droplets, 
  AlertTriangle, 
  Cloud, 
  TrendingUp, 
  DollarSign, 
  Award,
  Users,
  Menu,
  X,
  Search,
  Bell,
  LogOut,
  Info
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { FIREBASE_ENABLED } from '../../firebase';
import { HF_ENABLED } from '../../services/chatService';
import { WEATHER_API_ENABLED } from '../../services/weatherService';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Crop Disease', href: '/crop-disease', icon: Camera },
  { name: 'Monitoring', href: '/monitoring', icon: Activity },
  { name: 'Recommendations', href: '/recommendation', icon: Sprout },
  { name: 'Soil Intelligence', href: '/soil', icon: Beaker },
  { name: 'Irrigation', href: '/irrigation', icon: Droplets },
  { name: 'Risk Prediction', href: '/risk', icon: AlertTriangle },
  { name: 'Weather Alerts', href: '/weather', icon: Cloud },
  { name: 'Yield Estimation', href: '/yield', icon: TrendingUp },
  { name: 'Market Prices', href: '/market', icon: DollarSign },
  { name: 'Govt. Schemes', href: '/schemes', icon: Award },
  { name: 'Community', href: '/community', icon: Users },
];

export function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, demoMode } = useAuth();
  const [showDemoInfo, setShowDemoInfo] = useState(false);
  const demoInfoRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
  };

  const isAnyDemoMode = demoMode || !FIREBASE_ENABLED || !HF_ENABLED || !WEATHER_API_ENABLED;

  // Close demo info when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (demoInfoRef.current && !demoInfoRef.current.contains(event.target as Node)) {
        setShowDemoInfo(false);
      }
    }

    if (showDemoInfo) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDemoInfo]);

  return (
    <div className="min-h-screen bg-[#F8FAF9] selection:bg-emerald-200">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Glassmorphic */}
      <aside className={`
        fixed top-0 left-0 z-[70] h-screen w-80 glass-card !bg-white/80 border-r border-emerald-50 transform transition-all duration-500 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex h-full flex-col">
          {/* Logo Section */}
          <div className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity rounded-full"></div>
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-xl shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <Sprout className="h-8 w-8" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-none">
                  AgriSarthi <span className="text-emerald-600 italic">AI</span>
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mt-1">Smart Farming Partner</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="ml-auto lg:hidden p-2 text-gray-400 hover:text-gray-900"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="space-y-1.5 h-[calc(100vh-250px)] overflow-y-auto pr-2 scrollbar-hide">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      group flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-bold transition-all duration-300
                      ${isActive 
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 translate-x-1' 
                        : 'text-gray-500 hover:bg-emerald-50 hover:text-emerald-700 hover:translate-x-1'
                      }
                    `}
                  >
                    <item.icon className={`h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-emerald-600'}`} />
                    {item.name}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile Card at bottom */}
          <div className="mt-auto p-6 border-t border-emerald-50 bg-emerald-50/30">
             <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                   {user?.email?.[0].toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                   <p className="text-xs font-black text-gray-900 truncate">{user?.email}</p>
                   <p className="text-[10px] text-gray-500 font-bold">VERIFIED FARMER</p>
                </div>
                <Bell className="h-4 w-4 text-gray-400 hover:text-emerald-600 cursor-pointer shrink-0" />
             </div>
             <Button
               variant="outline"
               className="w-full h-9 rounded-xl border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 text-sm font-bold"
               onClick={handleLogout}
             >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
             </Button>
          </div>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="lg:pl-80 flex flex-col min-h-screen">
        {/* Global Cinematic Header */}
        <header className="sticky top-0 z-[50] flex h-20 items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-emerald-50/50">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-emerald-50 text-emerald-600"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative hidden md:block max-w-md w-full">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
               <Input 
                 placeholder="Search for crop advice, market prices..." 
                 className="pl-10 h-10 bg-gray-100/50 border-none rounded-xl focus-visible:ring-emerald-500/50"
               />
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-emerald-700 tracking-wider">LIVE MARKET SYNC</span>
             </div>
             <Button variant="outline" className="rounded-full h-10 w-10 p-0 border-emerald-100">
                <Bell className="h-4 w-4 text-gray-600" />
             </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8 lg:p-12 overflow-x-hidden">
           <div className="max-w-7xl mx-auto">
             <Outlet />
           </div>
        </main>
        
        {/* Global AI Assistant */}
        <AIAssistant />
      </div>
    </div>
  );
}