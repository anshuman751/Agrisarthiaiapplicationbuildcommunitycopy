import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
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
  ArrowRight,
  Sparkles,
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const features = [
  {
    name: 'Crop Disease Detection',
    description: 'AI-powered disease identification from crop images with treatment solutions',
    icon: Camera,
    href: '/crop-disease',
    color: 'from-rose-500 to-orange-500',
    bgColor: 'bg-rose-50'
  },
  {
    name: 'Crop Monitoring',
    description: 'Track crop health over time and get improvement insights',
    icon: Activity,
    href: '/monitoring',
    color: 'from-blue-500 to-indigo-500',
    bgColor: 'bg-blue-50'
  },
  {
    name: 'Crop Recommendation',
    description: 'Get AI suggestions for best crops based on soil and weather',
    icon: Sprout,
    href: '/recommendation',
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50'
  },
  {
    name: 'Soil Intelligence',
    description: 'Analyze soil health and get fertilizer recommendations',
    icon: Beaker,
    href: '/soil',
    color: 'from-amber-500 to-orange-400',
    bgColor: 'bg-amber-50'
  },
  {
    name: 'Smart Irrigation',
    description: 'Optimize water usage with intelligent irrigation scheduling',
    icon: Droplets,
    href: '/irrigation',
    color: 'from-cyan-500 to-blue-400',
    bgColor: 'bg-cyan-50'
  },
  {
    name: 'Risk Prediction',
    description: 'Predict and prevent crop risks using ML algorithms',
    icon: AlertTriangle,
    href: '/risk',
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-50'
  },
  {
    name: 'Weather Alerts',
    description: 'Real-time weather alerts and farming advisories',
    icon: Cloud,
    href: '/weather',
    color: 'from-indigo-400 to-purple-600',
    bgColor: 'bg-indigo-50'
  },
  {
    name: 'Yield Estimation',
    description: 'Predict crop yield and calculate expected profits',
    icon: TrendingUp,
    href: '/yield',
    color: 'from-purple-500 to-fuchsia-600',
    bgColor: 'bg-purple-50'
  },
  {
    name: 'Market Prices',
    description: 'Live market prices and trends for better selling decisions',
    icon: DollarSign,
    href: '/market',
    color: 'from-teal-500 to-emerald-400',
    bgColor: 'bg-teal-50'
  },
  {
    name: 'Government Schemes',
    description: 'Check eligibility for agricultural schemes and subsidies',
    icon: Award,
    href: '/schemes',
    color: 'from-pink-500 to-rose-400',
    bgColor: 'bg-pink-50'
  },
  {
    name: 'Farmer Community',
    description: 'Connect with farmers, share experiences and learn together',
    icon: Users,
    href: '/community',
    color: 'from-teal-600 to-green-500',
    bgColor: 'bg-teal-50'
  }
];

export function Dashboard() {
  const heroImage = "https://images.unsplash.com/photo-1685563346588-272aacc8b079?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWF0aWMlMjBzdW5zZXQlMjBmYXJtJTIwbGFuZHNjYXBlJTIwNGt8ZW58MXx8fHwxNzcxMDExMjc4fDA&ixlib=rb-4.1.0&q=80&w=1920";

  return (
    <div className="space-y-12 pb-12">
      {/* Cinematic Hero Section */}
      <section className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl group">
        <ImageWithFallback 
          src={heroImage} 
          alt="Cinematic Farm" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-12 text-white">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-emerald-400/30">
               <Sparkles className="h-4 w-4 text-emerald-400" />
               <span className="text-xs font-bold tracking-widest uppercase">Next Gen Agricultural AI</span>
            </div>
            <h1 className="text-6xl font-black leading-tight tracking-tighter">
              Empowering Every <span className="text-emerald-400">Farmer</span> With Intelligence.
            </h1>
            <p className="text-xl text-gray-200 font-medium leading-relaxed">
              AgriSarthi AI brings precision to your palm. From disease detection to market trends, 
              we're your 24/7 digital partner in the field.
            </p>
            <div className="flex gap-4 pt-4">
              <Link to="/monitoring">
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-6 text-lg rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-1">
                  Start Monitoring
                </Button>
              </Link>
              <Link to="/community">
                <Button variant="outline" className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white/20 font-bold px-8 py-6 text-lg rounded-xl transition-all">
                  Join Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating Stats Card */}
        <div className="absolute bottom-8 right-12 hidden lg:flex gap-4">
           {[
             { label: 'Reliability', val: '99.9%', icon: Zap },
             { label: 'Farmers', val: '10k+', icon: Users },
             { label: 'Models', val: '12', icon: Activity }
           ].map((stat, i) => (
             <div key={i} className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl min-w-[140px] text-center shadow-2xl">
                <stat.icon className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-2xl font-black text-white">{stat.val}</p>
                <p className="text-xs text-gray-400 font-bold uppercase">{stat.label}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Quick Dashboard Cards */}
      <div className="grid gap-8 md:grid-cols-3">
        {[
          { title: 'Soil Intelligence', val: 'FERTILE', sub: 'PH Level: 6.8', color: 'emerald', icon: Beaker },
          { title: 'Weather Status', val: 'SUNNY', sub: 'Rain expected at 4PM', color: 'blue', icon: Cloud },
          { title: 'System Health', val: 'ACTIVE', sub: 'All sensors online', color: 'orange', icon: Activity }
        ].map((item, i) => (
          <Card key={i} className="glass-card overflow-hidden group hover:-translate-y-2 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-black uppercase text-gray-500 tracking-wider">
                {item.title}
              </CardTitle>
              <item.icon className={`h-5 w-5 text-${item.color}-500`} />
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-black text-${item.color}-600 tracking-tight`}>{item.val}</div>
              <p className="text-sm text-gray-600 mt-1 font-medium">{item.sub}</p>
              <div className="mt-4 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                 <div className={`h-full bg-${item.color}-500 w-3/4 rounded-full`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Showcase */}
      <div>
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">
              AI Command Center
            </h2>
            <p className="text-gray-500 mt-2 font-medium">Explore 12 specialized tools for intelligent farming</p>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none font-bold py-1 px-4">
             v2.4.0 Live
          </Badge>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature) => (
            <Link key={feature.name} to={feature.href} className="group">
              <Card className="h-full border border-gray-100 bg-white hover:bg-gray-50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 rounded-2xl shine-effect">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold group-hover:text-emerald-700 transition-colors">
                    {feature.name}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed line-clamp-2">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Access Dashboard <ArrowRight className="h-3 w-3" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Pro Tip - Glassmorphic */}
      <div className="relative p-12 rounded-[2rem] overflow-hidden bg-slate-900 text-white shadow-2xl">
         <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
           <ImageWithFallback src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5zZXQlMjBmaWVsZHxlbnwxfHx8fDE3NzEwMTEzMzF8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Field" className="w-full h-full object-cover" />
         </div>
         <div className="relative z-10 max-w-2xl">
           <h3 className="text-3xl font-black mb-4">Precision Fertilizer Guide</h3>
           <p className="text-slate-400 text-lg leading-relaxed mb-8">
             Did you know that applying urea after 5 PM increases absorption efficiency by 15% due to reduced evaporation? 
             Use our Soil Intelligence tool to get the exact dosage your crops need tonight.
           </p>
           <Button className="bg-white text-slate-900 hover:bg-gray-200 font-black px-8 py-6 rounded-xl text-lg">
             Analyze My Soil
           </Button>
         </div>
      </div>
    </div>
  );
}
