import React, { useState, useEffect, useRef, useCallback } from 'react'; // Added useRef, useCallback
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  // Slide, // Removed unused import
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import anime from 'animejs';
import Typed from 'typed.js';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #2D5016 0%, #9CAF88 50%, #D4A574 100%)',
  backgroundSize: '400% 400%',
  animation: 'gradientShift 8s ease-in-out infinite',
  color: 'white',
  padding: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  '@keyframes gradientShift': {
    '0%, 100%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
  },
}));

const AnimatedCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(45, 80, 22, 0.15)',
  },
}));

// --- Placeholder Data ---
// Using useCallback for potentially memoizing this data if it were dynamic
const usePlaceholderData = () => {
  const initialCropData = useCallback(() => [
    { name: 'Wheat', nameHi: 'गेहूं', nameMr: 'गहू', nameTe: 'గోధుమ', icon: '🌾', currentPrice: 2425, previousPrice: 2275, unit: 'per quintal', trend: 'up', change: 150, changePercent: 6.6, },
    { name: 'Rice', nameHi: 'चावल', nameMr: 'तांदूळ', nameTe: 'బియ్యం', icon: '🍚', currentPrice: 2300, previousPrice: 2183, unit: 'per quintal', trend: 'up', change: 117, changePercent: 5.4, },
    { name: 'Cotton', nameHi: 'कपास', nameMr: 'कापूस', nameTe: 'పత్తి', icon: '🌱', currentPrice: 7121, previousPrice: 6620, unit: 'per quintal', trend: 'up', change: 501, changePercent: 7.6, },
    { name: 'Soybean', nameHi: 'सोयाबीन', nameMr: 'सोयाबीन', nameTe: 'సోయాబీన్', icon: '🫘', currentPrice: 4892, previousPrice: 4600, unit: 'per quintal', trend: 'up', change: 292, changePercent: 6.3, },
    { name: 'Maize', nameHi: 'मक्का', nameMr: 'मका', nameTe: 'మొక్కజొన్న', icon: '🌽', currentPrice: 2225, previousPrice: 2090, unit: 'per quintal', trend: 'up', change: 135, changePercent: 6.5, },
    { name: 'Tur (Pigeon Pea)', nameHi: 'तूर', nameMr: 'तूर', nameTe: 'కంది', icon: '🍛', currentPrice: 7550, previousPrice: 7000, unit: 'per quintal', trend: 'up', change: 550, changePercent: 7.9, },
  ], []);

  const sampleWeatherData = useCallback(() => ({ temp: 32, humidity: 65, windSpeed: 15, rainChance: 20, condition: 'Partly Cloudy', icon: '🌤️', }), []);

  const priceChartData = useCallback(() => [
    { date: 'Jan 15', wheat: 2400, rice: 2280, cotton: 7100 }, { date: 'Jan 16', wheat: 2420, rice: 2290, cotton: 7120 }, { date: 'Jan 17', wheat: 2410, rice: 2275, cotton: 7080 }, { date: 'Jan 18', wheat: 2435, rice: 2300, cotton: 7150 }, { date: 'Jan 19', wheat: 2425, rice: 2285, cotton: 7121 }, { date: 'Jan 20', wheat: 2440, rice: 2310, cotton: 7180 }, { date: 'Jan 21', wheat: 2425, rice: 2300, cotton: 7121 },
  ], []);

  return { initialCropData, sampleWeatherData, priceChartData };
};
// --- End Placeholder Data ---


function Dashboard({ language, setLanguage, translations, languages, userLocation, db, currentUser, appId }) {
  const [cropData, setCropData] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const typedInstanceRef = useRef(null);

  // Use the hook to get placeholder data functions
  const { initialCropData, sampleWeatherData } = usePlaceholderData();

  const fetchData = useCallback(async (isMountedRef) => {
    try {
        // --- TODO: Replace with actual async data fetching ---
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        const fetchedCropData = initialCropData(); // Call the function
        const fetchedWeatherData = sampleWeatherData(); // Call the function
        // --- End TODO ---

        if (isMountedRef.current) {
            setCropData(fetchedCropData);
            setWeatherData(fetchedWeatherData);
        }
    } catch (fetchError) {
        console.error("Error fetching dashboard data:", fetchError);
        if (isMountedRef.current) {
            setError("Could not load dashboard data. Please try again later.");
            setCropData([]);
            setWeatherData(null);
        }
    } finally {
        if (isMountedRef.current) {
            setLoading(false);
        }
    }
  }, [initialCropData, sampleWeatherData]); // Added dependencies

  useEffect(() => {
    const isMountedRef = { current: true };
    setLoading(true);
    setError(null);

    fetchData(isMountedRef);
    updateDateTime();

    const interval = setInterval(() => {
        // simulatePriceUpdates(); // Uncomment to keep simulation
    }, 30000);

    return () => {
        isMountedRef.current = false;
        clearInterval(interval);
        if (typedInstanceRef.current) {
            console.log("Destroying Typed instance");
            typedInstanceRef.current.destroy();
            typedInstanceRef.current = null;
        }
    };
  }, [language, userLocation, fetchData]); // Include fetchData in dependencies


  const initializeAnimations = useCallback(() => {
    if (typedInstanceRef.current) {
        typedInstanceRef.current.destroy();
        typedInstanceRef.current = null;
    }

    const heroMessages = {
      en: ['Empowering Farmers with Technology', 'Better Prices, Better Harvest', 'Your Digital Farming Partner'],
      hi: ['प्रौद्योगिकी से सशक्त किसान', 'बेहतर कीमतें, बेहतर फसल', 'आपका डिजिटल खेती साथी'],
      mr: ['तंत्रज्ञानाने सशक्त शेतकरी', 'उत्तम दर, उत्तम पिक', 'तुमचा डिजिटल शेती साथीदार'],
      te: ['సాంకేతికతతో రైతుల సాధికారత', 'మెరుగైన ధరలు, మెరుగైన పంట', 'మీ డిజిటల్ వ్యవసాయ భాగస్వామి'],
    };
    const heroTextElement = document.getElementById('heroText');
    if (heroTextElement) {
        heroTextElement.innerHTML = '';
        typedInstanceRef.current = new Typed('#heroText', {
            strings: heroMessages[language] || heroMessages.en,
            typeSpeed: 50, backSpeed: 30, backDelay: 2000, loop: true, showCursor: true, cursorChar: '|',
        });
        console.log("Initialized Typed instance");
    } else {
        console.warn("Hero text element not found for Typed.js");
    }

    anime({
      targets: '.animated-card:not(.has-animated)',
      translateY: [30, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 800,
      easing: 'easeOutExpo',
      complete: (anim) => {
          anim.animatables.forEach(a => a.target.classList.add('has-animated'));
      }
    });
  }, [language]); // Depend on language

  // Run animations effect
  useEffect(() => {
    if (!loading && !error) {
        initializeAnimations();
    }
  }, [loading, error, initializeAnimations]); // Added initializeAnimations dependency


  const updateDateTime = () => {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', });
    setCurrentDate(dateString);
  };

  const simulatePriceUpdates = () => {
    if(loading) return;
    setCropData((prevData) =>
      prevData.map((crop) => {
        const priceChangePercentage = (Math.random() - 0.45) * 0.02;
        const change = crop.currentPrice * priceChangePercentage;
        const newPrice = Math.round(crop.currentPrice + change);
        const previousPrice = crop.currentPrice;
        const changeAbsolute = Math.round(Math.abs(newPrice - previousPrice));
        const changePercent = previousPrice === 0 ? 0 : ((newPrice - previousPrice) / previousPrice * 100);
        return {
          ...crop,
          currentPrice: newPrice,
          previousPrice: previousPrice,
          trend: newPrice > previousPrice ? 'up' : newPrice < previousPrice ? 'down' : 'stable',
          change: changeAbsolute,
          changePercent: parseFloat(changePercent.toFixed(1))
        };
      })
    );
  };

  const refreshPrices = useCallback(() => { // Wrap in useCallback
    // setLoading(true); // Uncomment when using real fetch
    // fetchData({ current: true }); // Uncomment when using real fetch
    simulatePriceUpdates(); // Keep simulation for now
    console.log("Simulating price refresh...");
  }, []); // Added dependency array for useCallback

  const setPriceAlert = useCallback((cropName) => { // Wrap in useCallback
    const crop = cropData.find((c) => c.name === cropName);
    const alertPrice = prompt(`Set price alert for ${cropName}. Current price: ₹${crop?.currentPrice}`);
    if (alertPrice && !isNaN(alertPrice)) {
      alert(`Price alert set for ${cropName} at ₹${alertPrice}`);
    } else if (alertPrice !== null) {
        alert("Invalid price entered.");
    }
  }, [cropData]); // Added dependency

  const showComingSoon = useCallback(() => { // Wrap in useCallback
    alert('This feature is coming soon!');
  }, []); // Added dependency array

  const getCropName = useCallback((crop) => { // Wrap in useCallback
    const nameKey = `name${language.charAt(0).toUpperCase() + language.slice(1)}`;
    return crop[nameKey] || crop.name;
  }, [language]); // Added dependency

  // Use the hook to get chart data function
  const { priceChartData: priceChartDataFunc } = usePlaceholderData();
  const chartData = priceChartDataFunc(); // Call function to get data


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} sx={{ color: 'primary.main' }} />
        <Typography sx={{ ml: 2, color: 'text.secondary'}}>Loading Dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
     return (
       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', p: 3 }}>
         <Alert severity="error" sx={{ width: '100%', maxWidth: 600 }}>{error}</Alert>
       </Box>
     );
   }

  if (!weatherData) {
       return (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', p: 3 }}>
           <Alert severity="warning" sx={{ width: '100%', maxWidth: 600 }}>Weather data could not be loaded.</Alert>
         </Box>
       );
  }

  return (
    <Box>
      <HeroSection>
         <Box sx={{ maxWidth: 1200, mx: 'auto', position: 'relative' }}>
           <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
             <Box>
               <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                 🌾 {translations.appName}
               </Typography>
               <Typography variant="body2" sx={{ opacity: 0.9 }}>
                 {translations.tagline}
               </Typography>
             </Box>
             <Box sx={{ textAlign: 'right' }}>
               <FormControl size="small" sx={{ minWidth: 100, mb: 1 }}>
                 <Select
                   value={language}
                   onChange={(e) => setLanguage(e.target.value)}
                   sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: 3, '& .MuiSelect-icon': { color: 'white' }, }}
                 >
                   {Object.entries(languages).map(([key, lang]) => ( <MenuItem key={key} value={key}> {lang.flag} {lang.name} </MenuItem> ))}
                 </Select>
               </FormControl>
               <Typography variant="caption" sx={{ display: 'block', opacity: 0.75 }}>
                 📍 {userLocation || 'Unknown Location'}
               </Typography>
               <Typography variant="caption" sx={{ display: 'block', opacity: 0.75, mt: 0.5 }}>
                  🗓️ {currentDate}
               </Typography>
             </Box>
           </Box>
           <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: -1 }}>
              <Typography sx={{ position: 'absolute', top: '10%', left: '10%', fontSize: '3rem', opacity: 0.05, transform: 'rotate(-15deg)' }}>🌾</Typography>
              <Typography sx={{ position: 'absolute', top: '20%', right: '15%', fontSize: '2.5rem', opacity: 0.05, transform: 'rotate(10deg)' }}>🚜</Typography>
              <Typography sx={{ position: 'absolute', bottom: '15%', left: '30%', fontSize: '3.5rem', opacity: 0.05, transform: 'rotate(5deg)' }}>🌱</Typography>
              <Typography sx={{ position: 'absolute', bottom: '25%', right: '25%', fontSize: '2rem', opacity: 0.05, transform: 'rotate(-5deg)' }}>🌽</Typography>
            </Box>
         </Box>
      </HeroSection>

      <Box sx={{ py: 4, px: 2, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary', mb: 2, minHeight: '2.5em' }}>
          <span id="heroText"></span>
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          {language === 'en' && 'Real-time crop prices, weather alerts, and direct market access'}
          {language === 'hi' && 'वास्तविक समय फसल कीमतें, मौसम चेतावनियाँ, और सीधा बाजार पहुंच'}
          {language === 'mr' && 'ठराविक वेळेत पिकांचे दर, हवामान अलर्ट, आणि थेट बाजार प्रवेश'}
          {language === 'te' && 'నిజ సమయ పంట ధరలు, వాతావరణ హెచ్చరికలు, మరియు ప్రత్యక్ష మార్కెట్ యాక్సెస్'}
        </Typography>
      </Box>

        <Box sx={{ px: 2, mb: 4 }}>
            <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                    <AnimatedCard className="animated-card">
                        <CardContent sx={{ textAlign: 'center' }}>
                            <Typography variant="h4" sx={{ mb: 1 }}>📈</Typography>
                            <Typography variant="h5" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                {cropData && cropData.length > 0 ? cropData.length : '-'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                Active Prices
                            </Typography>
                        </CardContent>
                    </AnimatedCard>
                </Grid>
                 <Grid item xs={6} md={3}> <AnimatedCard className="animated-card"> <CardContent sx={{ textAlign: 'center' }}> <Typography variant="h4" sx={{ mb: 1 }}>🌦️</Typography> <Typography variant="h5" sx={{ color: 'info.main', fontWeight: 'bold' }}> 3 </Typography> <Typography variant="body2" sx={{ color: 'text.secondary' }}> Weather Alerts </Typography> </CardContent> </AnimatedCard> </Grid>
                 <Grid item xs={6} md={3}> <AnimatedCard className="animated-card"> <CardContent sx={{ textAlign: 'center' }}> <Typography variant="h4" sx={{ mb: 1 }}>🏪</Typography> <Typography variant="h5" sx={{ color: 'warning.main', fontWeight: 'bold' }}> 127 </Typography> <Typography variant="body2" sx={{ color: 'text.secondary' }}> Market Deals </Typography> </CardContent> </AnimatedCard> </Grid>
                 <Grid item xs={6} md={3}> <AnimatedCard className="animated-card"> <CardContent sx={{ textAlign: 'center' }}> <Typography variant="h4" sx={{ mb: 1 }}>👥</Typography> <Typography variant="h5" sx={{ color: 'secondary.main', fontWeight: 'bold' }}> 2.4K </Typography> <Typography variant="body2" sx={{ color: 'text.secondary' }}> Active Farmers </Typography> </CardContent> </AnimatedCard> </Grid>
            </Grid>
        </Box>

      <Box sx={{ px: 2, mb: 4 }}>
         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
           <Typography variant="h5" sx={{ fontWeight: 'bold' }}> Live Crop Prices </Typography>
           <Button variant="contained" onClick={refreshPrices} sx={{ borderRadius: 3, textTransform: 'none' }} disabled={loading}>
             🔄 Refresh
           </Button>
         </Box>
        {cropData.length === 0 && !loading && (
            <Alert severity="info" sx={{mb: 2}}>No crop price data available at the moment.</Alert>
        )}
        <Grid container spacing={2}>
          {cropData.map((crop, index) => {
            const cropName = getCropName(crop);
            const trendIcon = crop.trend === 'up' ? '📈' : crop.trend === 'down' ? '📉' : '➖';
            const trendColor = crop.trend === 'up' ? 'success.main' : crop.trend === 'down' ? 'error.main' : 'text.secondary';
            const changePrefix = crop.trend === 'up' ? '+' : crop.trend === 'down' ? '-' : '';

            return (
              <Grid item xs={12} sm={6} md={4} key={crop.name || index}>
                <AnimatedCard className="animated-card">
                    <CardContent>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                 <Typography variant="h4">{crop.icon}</Typography>
                                 <Typography variant="h6" sx={{ fontWeight: 'bold' }}> {cropName} </Typography>
                             </Box>
                             <Typography variant="h5" sx={{ color: trendColor }}> {trendIcon} </Typography>
                         </Box>
                         <Box sx={{ mb: 2 }}>
                             <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}> ₹{crop.currentPrice?.toLocaleString() || 'N/A'} </Typography>
                             <Typography variant="body2" sx={{ color: 'text.secondary' }}> {crop.unit} </Typography>
                         </Box>
                         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <Typography variant="body2" sx={{ color: trendColor, fontWeight: 'bold', }}>
                                {changePrefix}{crop.change?.toLocaleString() || '0'} ({crop.changePercent !== undefined ? `${crop.changePercent}%` : 'N/A'})
                             </Typography>
                             <Button size="small" onClick={() => setPriceAlert(crop.name)} sx={{ textTransform: 'none' }}> 🔔 Alert </Button>
                         </Box>
                    </CardContent>
                  </AnimatedCard>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      <Box sx={{ px: 2, mb: 4 }}>
        <AnimatedCard className="animated-card">
           <CardContent>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
               <Typography variant="h5" sx={{ fontWeight: 'bold' }}> Weather Advisory </Typography>
               <Typography variant="h3" sx={{ animation: 'float 3s ease-in-out infinite' }}> {weatherData.icon} </Typography>
             </Box>
             <Grid container spacing={3} sx={{ mb: 4 }}>
               <Grid item xs={6} md={3}> <Box sx={{ textAlign: 'center' }}> <Typography variant="h4" sx={{ color: 'info.main', fontWeight: 'bold' }}> {weatherData.temp}°C </Typography> <Typography variant="body2" sx={{ color: 'text.secondary' }}> Temperature </Typography> </Box> </Grid>
               <Grid item xs={6} md={3}> <Box sx={{ textAlign: 'center' }}> <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}> {weatherData.humidity}% </Typography> <Typography variant="body2" sx={{ color: 'text.secondary' }}> Humidity </Typography> </Box> </Grid>
               <Grid item xs={6} md={3}> <Box sx={{ textAlign: 'center' }}> <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 'bold' }}> {weatherData.windSpeed}km/h </Typography> <Typography variant="body2" sx={{ color: 'text.secondary' }}> Wind Speed </Typography> </Box> </Grid>
               <Grid item xs={6} md={3}> <Box sx={{ textAlign: 'center' }}> <Typography variant="h4" sx={{ color: 'warning.main', fontWeight: 'bold' }}> {weatherData.rainChance}% </Typography> <Typography variant="body2" sx={{ color: 'text.secondary' }}> Rain Chance </Typography> </Box> </Grid>
             </Grid>
             <Box sx={{ p: 2, backgroundColor: 'warning.light', borderRadius: 2, borderLeft: 4, borderColor: 'warning.main' }}>
               <Typography variant="body2" sx={{ color: 'warning.dark' }}> ⚠️ Light rainfall expected tomorrow. Ideal time for fertilizer application. </Typography>
             </Box>
           </CardContent>
        </AnimatedCard>
      </Box>

      <Box sx={{ px: 2, mb: 4 }}>
        <AnimatedCard className="animated-card">
          <CardContent>
             <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}> Price Trends (7 Days) </Typography>
             <Box sx={{ height: 300 }}>
                 <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={chartData}> {/* Use the fetched chart data */}
                         <CartesianGrid strokeDasharray="3 3" />
                         <XAxis dataKey="date" />
                         <YAxis />
                         <Tooltip formatter={(value) => `₹${value}`} />
                         <Legend />
                         <Area type="monotone" dataKey="wheat" stackId="1" stroke="#2D5016" fill="#2D5016" fillOpacity={0.3} />
                         <Area type="monotone" dataKey="rice" stackId="1" stroke="#D4A574" fill="#D4A574" fillOpacity={0.3} />
                         <Area type="monotone" dataKey="cotton" stackId="1" stroke="#9CAF88" fill="#9CAF88" fillOpacity={0.3} />
                     </AreaChart>
                 </ResponsiveContainer>
             </Box>
          </CardContent>
        </AnimatedCard>
      </Box>

      <Box sx={{ px: 2, mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}> Quick Actions </Typography>
         <Grid container spacing={2}>
           <Grid item xs={6} md={3}> <Button fullWidth variant="contained" onClick={() => window.location.href = '/marketplace'} sx={{ backgroundColor: 'success.light', color: 'success.dark', py: 3, borderRadius: 2, textTransform: 'none', '&:hover': { backgroundColor: 'success.main', color: 'white' }, }}> <Box sx={{ textAlign: 'center' }}> <Typography variant="h4" sx={{ mb: 1 }}>🏪</Typography> <Typography variant="body2">Marketplace</Typography> </Box> </Button> </Grid>
           <Grid item xs={6} md={3}> <Button fullWidth variant="contained" onClick={() => window.location.href = '/weather'} sx={{ backgroundColor: 'info.light', color: 'info.dark', py: 3, borderRadius: 2, textTransform: 'none', '&:hover': { backgroundColor: 'info.main', color: 'white' }, }}> <Box sx={{ textAlign: 'center' }}> <Typography variant="h4" sx={{ mb: 1 }}>🌦️</Typography> <Typography variant="body2">Weather</Typography> </Box> </Button> </Grid>
           <Grid item xs={6} md={3}> <Button fullWidth variant="contained" onClick={showComingSoon} sx={{ backgroundColor: 'warning.light', color: 'warning.dark', py: 3, borderRadius: 2, textTransform: 'none', '&:hover': { backgroundColor: 'warning.main', color: 'white' }, }}> <Box sx={{ textAlign: 'center' }}> <Typography variant="h4" sx={{ mb: 1 }}>📱</Typography> <Typography variant="body2">Crop Doctor</Typography> </Box> </Button> </Grid>
           <Grid item xs={6} md={3}> <Button fullWidth variant="contained" onClick={showComingSoon} sx={{ backgroundColor: 'secondary.light', color: 'secondary.dark', py: 3, borderRadius: 2, textTransform: 'none', '&:hover': { backgroundColor: 'secondary.main', color: 'white' }, }}> <Box sx={{ textAlign: 'center' }}> <Typography variant="h4" sx={{ mb: 1 }}>📚</Typography> <Typography variant="body2">Learn</Typography> </Box> </Button> </Grid>
         </Grid>
      </Box>
    </Box>
  );
}

export default Dashboard;