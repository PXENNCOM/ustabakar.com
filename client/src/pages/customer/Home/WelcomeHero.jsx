import { useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../store/AuthContext';
import { Plus, MessageSquareText } from 'lucide-react';
import { geoMercator, geoPath } from 'd3-geo';

const TURKEY_GEOJSON = {
  type: 'Feature',
  geometry: {
    type: 'MultiPolygon',
    coordinates: [
      [[[26.04,41.96],[26.32,41.71],[26.63,41.60],[26.76,41.32],[26.60,40.97],
        [26.29,40.78],[26.04,40.73],[25.87,40.84],[25.62,40.72],[25.13,40.67],
        [24.93,40.87],[24.73,40.93],[24.61,41.06],[24.49,41.43],[24.70,41.57],
        [25.20,41.23],[25.50,41.34],[25.86,41.32],[26.04,41.96]]],
      [[[44.77,37.17],[44.54,37.45],[44.29,37.00],[44.13,37.04],[43.50,37.24],
        [42.78,37.38],[42.56,37.15],[42.35,37.23],[41.84,37.07],[41.21,37.07],
        [40.69,37.10],[39.95,37.15],[39.37,37.11],[38.69,37.16],[38.20,37.02],
        [37.67,36.81],[36.65,36.80],[36.24,36.60],[36.11,36.17],[35.79,36.28],
        [35.48,36.18],[34.60,36.78],[33.63,36.89],[33.27,36.61],[32.83,36.54],
        [32.38,36.46],[31.89,36.68],[31.39,36.99],[30.87,37.01],[30.57,36.90],
        [30.39,36.73],[30.06,36.85],[29.83,36.87],[29.48,36.64],[28.73,37.00],
        [28.30,37.12],[28.11,37.39],[27.49,37.66],[27.26,37.98],[26.78,38.18],
        [26.72,38.53],[27.04,38.48],[27.26,38.74],[27.76,38.98],[28.48,39.07],
        [29.10,39.07],[29.48,38.95],[29.73,39.13],[30.56,39.16],[31.14,39.06],
        [31.79,38.79],[32.56,38.72],[33.02,38.87],[33.71,38.92],[34.15,39.26],
        [34.37,39.49],[34.74,39.64],[35.10,39.46],[35.66,39.44],[36.26,39.36],
        [36.93,39.63],[37.18,39.58],[37.92,39.79],[38.48,39.79],[39.09,40.00],
        [39.63,39.85],[40.27,39.98],[40.95,40.25],[41.15,40.51],[41.51,40.65],
        [41.57,41.10],[41.77,41.26],[41.90,41.70],[42.39,41.76],[42.53,41.43],
        [43.06,41.27],[43.47,41.07],[43.66,40.89],[43.93,40.75],[44.42,40.70],
        [44.77,40.39],[45.00,39.98],[44.94,39.69],[44.46,39.42],[44.23,39.39],
        [43.87,39.67],[43.36,39.65],[43.04,39.36],[42.71,39.30],[42.56,39.53],
        [42.07,38.96],[42.05,38.50],[41.50,38.37],[41.21,38.47],[40.58,38.35],
        [40.08,38.36],[39.43,38.27],[38.76,38.39],[38.08,38.50],[37.94,38.11],
        [36.94,38.05],[36.36,38.01],[35.62,38.38],[34.61,38.38],[34.00,38.03],
        [33.56,37.82],[33.27,37.97],[33.07,37.66],[32.76,37.65],[32.73,37.31],
        [32.36,37.18],[31.65,37.09],[30.56,37.32],[30.39,37.57],[30.54,37.86],
        [30.87,37.84],[31.24,37.72],[31.93,37.64],[32.27,37.85],[32.47,37.67],
        [32.93,37.75],[33.12,38.24],[33.68,37.99],[34.32,38.09],[34.84,37.77],
        [35.31,37.81],[35.59,37.60],[36.11,37.37],[36.25,37.63],[36.55,37.63],
        [36.87,37.33],[37.06,37.09],[37.59,36.99],[37.88,37.21],[38.33,37.22],
        [38.73,37.44],[39.12,37.51],[39.56,37.30],[40.14,37.14],[40.52,37.07],
        [40.70,37.41],[41.00,37.52],[41.24,37.71],[41.71,37.96],[42.38,38.00],
        [42.63,38.10],[43.06,38.12],[43.35,38.41],[43.95,38.23],[44.04,38.50],
        [44.50,38.58],[44.77,37.17]]],
    ],
  },
};

const CITIES = [
  { name: 'İstanbul',   lon: 28.97, lat: 41.01, r: 4   },
  { name: 'Ankara',     lon: 32.86, lat: 39.93, r: 3.5 },
  { name: 'İzmir',      lon: 27.14, lat: 38.42, r: 3   },
  { name: 'Antalya',    lon: 30.71, lat: 36.90, r: 2.5 },
  { name: 'Bursa',      lon: 29.06, lat: 40.18, r: 2.5 },
  { name: 'Adana',      lon: 35.32, lat: 37.00, r: 2.5 },
  { name: 'Gaziantep',  lon: 37.38, lat: 37.07, r: 2   },
  { name: 'Konya',      lon: 32.49, lat: 37.87, r: 2   },
  { name: 'Trabzon',    lon: 39.72, lat: 41.00, r: 2   },
  { name: 'Erzurum',    lon: 41.27, lat: 39.90, r: 2   },
  { name: 'Diyarbakır', lon: 40.23, lat: 37.91, r: 2   },
  { name: 'Samsun',     lon: 36.33, lat: 41.29, r: 2   },
  { name: 'Kayseri',    lon: 35.47, lat: 38.73, r: 2   },
];

const W = 900, H = 340;

const TurkeyMap = memo(function TurkeyMap() {
  const { mapPaths, cityPoints } = useMemo(() => {
    const projection = geoMercator().center([35.5, 39.0]).scale(2600).translate([W / 2, H / 2]);
    const pathGen = geoPath(projection);
    const mapPaths = [pathGen(TURKEY_GEOJSON)].filter(Boolean);
    const cityPoints = CITIES.map(c => {
      const pt = projection([c.lon, c.lat]);
      return pt ? { ...c, x: pt[0], y: pt[1] } : null;
    }).filter(Boolean);
    return { mapPaths, cityPoints };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" className="absolute right-0 top-1/2 -translate-y-1/2 h-[130%] w-auto opacity-[0.25]" preserveAspectRatio="xMidYMid meet">
        {mapPaths.map((d, i) => (
          <path key={i} d={d} fill="rgba(255,225,25,0.04)" stroke="rgba(255,225,25,0.35)" strokeWidth="1.4" strokeLinejoin="round" />
        ))}
        {cityPoints.map(c => (
          <g key={c.name}>
            <circle cx={c.x} cy={c.y} r={c.r + 5} fill="none" stroke="rgba(255,225,25,0.15)" strokeWidth="0.8" />
            <circle cx={c.x} cy={c.y} r={c.r} fill="rgba(255,225,25,0.70)" />
          </g>
        ))}
      </svg>
    </div>
  );
});

export default function WelcomeHero({ onSupportClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-[#1A2238] border border-zinc-800 rounded-3xl shadow-xl relative overflow-hidden min-h-[160px]">
      
      <TurkeyMap />
      
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-[#ffe119]/5 to-transparent rounded-bl-full pointer-events-none z-0" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-zinc-900 rounded-full blur-2xl pointer-events-none z-0" />

      <div className="relative z-10">
        <h1 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
          Merhaba, {user?.name || 'Sürücü'} 👋
        </h1>
        <p className="text-xs md:text-sm text-zinc-400 mt-1.5 max-w-xl font-medium leading-relaxed">
          Almayı düşündüğün aracı usta gözüyle yerinde inceletmek ve güvenle satın almak için tüm ekspertiz taleplerini buradan yönetebilirsin.
        </p>
      </div>

      <div className="relative z-10 shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {onSupportClick && (
          <button
            onClick={onSupportClick}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-wider px-5 py-4 rounded-xl transition-all duration-200 active:scale-95"
          >
            <MessageSquareText size={15} className="text-[#ffe119]" strokeWidth={2.5} />
            <span>Destek Talebi</span>
          </button>
        )}
        <button
          onClick={() => navigate('/musteri/yeni-talep')}
          className="flex items-center justify-center gap-2 bg-[#ffe119] text-[#1A2238] hover:bg-white hover:text-[#1A2238] font-black text-xs uppercase tracking-widest px-6 py-4 rounded-xl shadow-lg shadow-amber-400/10 active:scale-98 transition-all duration-300"
        >
          <Plus size={16} className="stroke-[3]" />
          <span>Yeni Talep Oluştur</span>
        </button>
      </div>
    </div>
  );
}