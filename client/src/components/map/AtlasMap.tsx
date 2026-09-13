import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Recipe, CountryPin } from '../../types';
import { api } from '../../services/api';
import { useApp } from '../../store/AppContext';
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  Plus, 
  MapPin, 
  Clock, 
  ChefHat, 
  Flame, 
  Layers,
  ChevronRight
} from 'lucide-react';

// Custom Glowing Encarta DivIcon
const createGlowingIcon = (isSelected: boolean) => {
  const color = isSelected ? '#06B6D4' : '#8B5CF6';
  const pulseClass = isSelected ? 'animate-ping' : '';
  
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        <div class="${pulseClass}" style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background-color: ${color}; opacity: 0.35;"></div>
        <div style="width: 26px; height: 26px; border-radius: 50%; background: #0B0F19; border: 2px solid ${color}; box-shadow: 0 0 12px ${color}; display: flex; align-items: center; justify-content: center; cursor: pointer; transform: scale(${isSelected ? 1.25 : 1}); transition: transform 0.2s ease;">
          <div style="width: 10px; height: 10px; border-radius: 50%; background: ${color};"></div>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
};

// Map FlyTo controller
const MapFlyTo: React.FC<{ coords: [number, number] | null }> = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 5, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
};

export const AtlasMap: React.FC = () => {
  const { setSelectedRecipe, addToBanquet, t } = useApp();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [countries, setCountries] = useState<CountryPin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [flyCoords, setFlyCoords] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getRecipes(), api.getCountries()])
      .then(([recipeList, countryList]) => {
        setRecipes(recipeList);
        setCountries(countryList);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Atlas error:', err);
        setLoading(false);
      });
  }, []);

  const handlePinClick = (pin: CountryPin) => {
    setSelectedCity(pin.city);
    setFlyCoords([pin.lat, pin.lng]);
  };

  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.original_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCity) {
      return matchesSearch && r.city.toLowerCase() === selectedCity.toLowerCase();
    }
    return matchesSearch;
  });

  const activeCityRecipes = selectedCity
    ? recipes.filter((r) => r.city.toLowerCase() === selectedCity.toLowerCase())
    : [];

  return (
    <div className="relative w-full h-[calc(100vh-136px)] min-h-[500px] flex flex-col md:flex-row overflow-hidden bg-dark-950 isolate">
      {/* Top Search & Filter Bar (Float on map) */}
      <div className="absolute top-4 left-4 right-4 md:left-5 md:right-auto md:w-[360px] z-20 pointer-events-auto">
        <div className="glass-modal p-2.5 sm:p-3 rounded-2xl shadow-glow-combined border border-violet-700/50 backdrop-blur-xl">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-cyan-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full pl-8 pr-3 py-1.5 bg-dark-900/90 text-xs text-slate-100 placeholder-slate-400 rounded-xl border border-violet-800/40 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans"
            />
          </div>

          {/* Quick Region Pills */}
          <div className="flex items-center space-x-1 mt-2 overflow-x-auto pb-0.5 text-[11px] no-scrollbar">
            <button
              onClick={() => {
                setSelectedCity(null);
                setSearchQuery('');
                setFlyCoords([20, 0]);
              }}
              className={`px-2 py-0.5 rounded-md transition-all shrink-0 font-medium ${
                !selectedCity && !searchQuery
                  ? 'bg-cyan-500 text-dark-950 font-semibold shadow-glow-cyan'
                  : 'bg-dark-800/80 text-slate-300 hover:text-white hover:bg-violet-900/40 border border-violet-900/30'
              }`}
            >
              Todo el Orbe
            </button>
            {countries.map((c) => (
              <button
                key={c.city}
                onClick={() => handlePinClick(c)}
                className={`px-2 py-0.5 rounded-md transition-all shrink-0 font-medium ${
                  selectedCity === c.city
                    ? 'bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-semibold shadow-glow-cyan'
                    : 'bg-dark-800/80 text-slate-300 hover:text-white hover:bg-violet-900/40 border border-violet-900/30'
                }`}
              >
                {c.city}, {c.country_code}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="flex-1 w-full h-full relative">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-dark-950">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
              <span className="text-sm font-mono text-cyan-400 tracking-wider">
                CARGANDO ATLAS CARTOGRÁFICO ENCARTA...
              </span>
            </div>
          </div>
        ) : (
          <MapContainer
            center={[20, 0]}
            zoom={2.5}
            minZoom={2}
            maxZoom={12}
            scrollWheelZoom={true}
            zoomControl={false}
            className="w-full h-full"
          >
            <ZoomControl position="bottomright" />
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=cb1_3itm_1_50ccf92c6b58e119b4d0c978"
            />

            <MapFlyTo coords={flyCoords} />

            {countries.map((pin) => {
              const isSelected = selectedCity === pin.city;
              return (
                <Marker
                  key={pin.city}
                  position={[pin.lat, pin.lng]}
                  icon={createGlowingIcon(isSelected)}
                  eventHandlers={{
                    click: () => handlePinClick(pin),
                  }}
                >
                  <Popup>
                    <div className="p-3 max-w-[260px] bg-dark-900 text-slate-100 font-sans">
                      <div className="flex items-center justify-between border-b border-violet-900/40 pb-2 mb-2">
                        <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                          {pin.city}, {pin.country}
                        </span>
                        <span className="text-[10px] bg-violet-900/60 text-violet-300 px-2 py-0.5 rounded font-mono">
                          {pin.country_code}
                        </span>
                      </div>
                      <div className="text-xs text-slate-300 mb-3">
                        {pin.total_recipes} {pin.total_recipes === 1 ? 'receta ancestral documentada' : 'recetas ancestrales documentadas'} en esta latitud.
                      </div>
                      <button
                        onClick={() => handlePinClick(pin)}
                        className="w-full py-1.5 px-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-lg text-xs font-semibold hover:opacity-90 flex items-center justify-center space-x-1"
                      >
                        <span>Explorar Región</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>

      {/* Floating Side Drawer for Active Location / Recipes (Responsive) */}
      <div className={`w-full md:w-[420px] bg-dark-900/95 border-t md:border-t-0 md:border-l border-violet-800/40 flex flex-col backdrop-blur-xl z-20 max-h-[50vh] md:max-h-full transition-all duration-300`}>
        {/* Drawer Header */}
        <div className="p-4 border-b border-violet-900/40 bg-gradient-to-r from-dark-900 via-violet-950/40 to-dark-900 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-glow-cyan animate-pulse"></div>
            <h2 className="font-serif font-bold text-base text-slate-100">
              {selectedCity ? `Ficha: ${selectedCity}` : 'Artículos Disponibles'}
            </h2>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
            {filteredRecipes.length} {filteredRecipes.length === 1 ? 'artículo' : 'artículos'}
          </span>
        </div>

        {/* Recipe Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <MapPin className="w-10 h-10 mx-auto text-violet-500/40 mb-2" />
              <p className="text-sm">No se encontraron recetas para esta búsqueda o región.</p>
            </div>
          ) : (
            filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="group relative bg-dark-850/80 border border-violet-900/40 hover:border-cyan-400/60 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-glow-cyan cursor-pointer"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="flex h-28">
                  {/* Thumbnail */}
                  <div className="w-28 relative shrink-0 overflow-hidden">
                    <img
                      src={recipe.image_url}
                      alt={recipe.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent"></div>
                    <span className="absolute bottom-1 left-1.5 text-[10px] font-mono text-cyan-300 bg-dark-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
                      {recipe.country_code}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-violet-400">
                          {recipe.city}, {recipe.country}
                        </span>
                        <span className="text-[11px] font-semibold text-amber-400 flex items-center space-x-0.5">
                          <span>★</span>
                          <span>{recipe.average_rating}</span>
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {recipe.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                        "{recipe.original_name}"
                      </p>
                    </div>

                    {/* Metadata & Actions */}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                      <div className="flex items-center space-x-2">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{recipe.prep_time + recipe.cook_time}m</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Flame className="w-3 h-3 text-violet-400" />
                          <span>{recipe.nutrition_facts?.calories || 450} kcal</span>
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToBanquet(recipe);
                        }}
                        title="Añadir a mi Banquete"
                        className="px-2 py-1 rounded bg-violet-950/80 hover:bg-cyan-500 hover:text-dark-950 text-cyan-300 border border-violet-700/50 transition-colors flex items-center space-x-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span className="text-[10px] font-semibold">Banquete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
