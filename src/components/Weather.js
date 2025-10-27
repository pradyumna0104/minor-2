import React, { useState, useEffect } from 'react';
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
  InputLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Badge,
  Paper,
  Alert,
  AlertTitle,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import anime from 'animejs';

// Styled components
const WeatherCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid #9CAF88',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(45, 80, 22, 0.15)',
  },
}));

const AlertCard = styled(Paper)(({ severity, theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 8,
  borderLeft: '4px solid',
  ...(severity === 'warning' && {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
  }),
  ...(severity === 'info' && {
    backgroundColor: '#d1ecf1',
    borderColor: '#17a2b8',
  }),
  ...(severity === 'success' && {
    backgroundColor: '#d4edda',
    borderColor: '#28a745',
  }),
  ...(severity === 'error' && {
    backgroundColor: '#f8d7da',
    borderColor: '#dc3545',
  }),
}));

const ForecastDay = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #e3f2fd, #f8f9fa)',
  borderRadius: 12,
  padding: theme.spacing(2),
  textAlign: 'center',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #bbdefb, #e3f2fd)',
    transform: 'scale(1.05)',
  },
}));

function Weather({ language, translations, userLocation }) {
  const [currentLocation, setCurrentLocation] = useState('nashik');
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showReportDialog, setShowReportDialog] = useState(false);

  // Sample weather data for different locations
  const weatherDataMap = {
    nashik: {
      location: 'Nashik, Maharashtra',
      current: {
        temp: 32,
        feelsLike: 35,
        humidity: 65,
        windSpeed: 15,
        rainChance: 20,
        condition: 'Partly Cloudy',
        icon: '🌤️',
      },
      alerts: [
        {
          type: 'warning',
          title: 'Light Rain Expected Tomorrow',
          message: 'Ideal time for fertilizer application. Avoid irrigation today.',
          icon: '🌧️',
        },
        {
          type: 'info',
          title: 'Temperature Rising',
          message: 'Monitor soil moisture levels. Increase irrigation frequency.',
          icon: '🌡️',
        },
      ],
      forecast: [
        { day: 'Today', icon: '🌤️', high: 32, low: 24, rain: 20 },
        { day: 'Tomorrow', icon: '🌧️', high: 28, low: 22, rain: 70 },
        { day: 'Thursday', icon: '⛅', high: 30, low: 23, rain: 30 },
        { day: 'Friday', icon: '☀️', high: 34, low: 25, rain: 10 },
        { day: 'Saturday', icon: '☀️', high: 35, low: 26, rain: 5 },
      ],
      cropAdvisories: [
        {
          crop: 'Wheat',
          icon: '🌾',
          advisory: 'Good time for top dressing with nitrogen. Monitor for yellow rust.',
          severity: 'good',
        },
        {
          crop: 'Cotton',
          icon: '🌱',
          advisory: 'Avoid irrigation before rainfall. Check for bollworm infestation.',
          severity: 'warning',
        },
        {
          crop: 'Tomatoes',
          icon: '🍅',
          advisory: 'Harvest mature fruits before rain. Stake plants properly.',
          severity: 'urgent',
        },
        {
          crop: 'Soybean',
          icon: '🫘',
          advisory: 'Ideal conditions for growth. Monitor leaf spot diseases.',
          severity: 'info',
        },
      ],
      farmingActivities: [
        {
          activity: 'Fertilizer Application',
          recommendation: 'Recommended',
          reason: 'Light rain tomorrow will help nutrient absorption',
          icon: '🌱',
        },
        {
          activity: 'Irrigation',
          recommendation: 'Not Recommended',
          reason: 'Rain expected tomorrow, conserve water',
          icon: '💧',
        },
        {
          activity: 'Pest Control',
          recommendation: 'Recommended',
          reason: 'Dry weather conditions favor pest control effectiveness',
          icon: '🐛',
        },
        {
          activity: 'Harvesting',
          recommendation: 'Urgent',
          reason: 'Harvest mature crops before tomorrow\'s rain',
          icon: '🚜',
        },
      ],
    },
  };

  // Sample data for the next 7 days
  const weatherChartData = [
    { date: 'Jan 15', temperature: 32, rainfall: 0 },
    { date: 'Jan 16', temperature: 28, rainfall: 15 },
    { date: 'Jan 17', temperature: 30, rainfall: 5 },
    { date: 'Jan 18', temperature: 34, rainfall: 0 },
    { date: 'Jan 19', temperature: 35, rainfall: 0 },
    { date: 'Jan 20', temperature: 33, rainfall: 8 },
    { date: 'Jan 21', temperature: 31, rainfall: 12 },
  ];

  useEffect(() => {
    setWeatherData(weatherDataMap[currentLocation]);
    setLoading(false);

    // Animate on load
    setTimeout(() => {
      anime({
        targets: '.weather-card',
        translateY: [30, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        duration: 600,
        easing: 'easeOutExpo',
      });
    }, 300);
  }, [currentLocation]);

  const handleLocationChange = (location) => {
    setCurrentLocation(location);
  };

  const addWeatherReport = () => {
    setShowReportDialog(true);
  };

  const submitWeatherReport = () => {
    alert('Weather report submitted! Thank you for contributing.');
    setShowReportDialog(false);
  };

  const communityReports = [
    {
      farmer: 'Ramesh Yadav',
      location: 'Nashik',
      report: 'Light drizzle started, good for crops',
      time: '2 hours ago',
      icon: '🌦️',
    },
    {
      farmer: 'Priya Sharma',
      location: 'Pune',
      report: 'Heavy fog this morning, visibility very low',
      time: '4 hours ago',
      icon: '🌫️',
    },
    {
      farmer: 'Ajay Patel',
      location: 'Ahmedabad',
      report: 'Strong winds, secure your equipment',
      time: '6 hours ago',
      icon: '💨',
    },
  ];

  if (loading || !weatherData.current) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ backgroundColor: 'primary.main', color: 'white', p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              🌦️ Weather Advisory
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Location-based weather forecasts for farmers
            </Typography>
          </Box>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={currentLocation}
              onChange={(e) => handleLocationChange(e.target.value)}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                borderRadius: 3,
                '& .MuiSelect-icon': { color: 'white' },
              }}
            >
              <MenuItem value="nashik">Nashik, MH</MenuItem>
              <MenuItem value="pune">Pune, MH</MenuItem>
              <MenuItem value="mumbai">Mumbai, MH</MenuItem>
              <MenuItem value="ahmedabad">Ahmedabad, GJ</MenuItem>
              <MenuItem value="patiala">Patiala, PB</MenuItem>
              <MenuItem value="lucknow">Lucknow, UP</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Current Location Weather */}
        <WeatherCard sx={{ backgroundColor: 'rgba(255,255,255,0.1)', border: 'none' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {weatherData.location}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {new Date().toLocaleString('en-IN', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {weatherData.current.temp}°C
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Feels like {weatherData.current.feelsLike}°C
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </WeatherCard>
      </Box>

      {/* Current Weather Details */}
      <Box sx={{ px: 2, mb: 4 }}>
        <WeatherCard>
          <CardContent>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ mb: 1, animation: 'float 3s ease-in-out infinite' }}>
                    🌡️
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'info.main', fontWeight: 'bold' }}>
                    {weatherData.current.temp}°C
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Temperature
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ mb: 1, animation: 'float 3s ease-in-out infinite' }}>
                    💧
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    {weatherData.current.humidity}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Humidity
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ mb: 1, animation: 'float 3s ease-in-out infinite' }}>
                    💨
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                    {weatherData.current.windSpeed}km/h
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Wind Speed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ mb: 1, animation: 'float 3s ease-in-out infinite' }}>
                    🌧️
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'warning.main', fontWeight: 'bold' }}>
                    {weatherData.current.rainChance}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Rain Chance
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ mb: 1, animation: 'float 3s ease-in-out infinite' }}>
                {weatherData.current.icon}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {weatherData.current.condition}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Today's weather condition
              </Typography>
            </Box>
          </CardContent>
        </WeatherCard>
      </Box>

      {/* Weather Alerts */}
      <Box sx={{ px: 2, mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          🚨 Weather Alerts
        </Typography>
        <Box sx={{ spaceY: 2 }}>
          {weatherData.alerts?.map((alert, index) => (
            <Alert
              key={index}
              severity={alert.type}
              sx={{ mb: 2, borderRadius: 2 }}
              icon={<span style={{ fontSize: '1.5rem' }}>{alert.icon}</span>}
            >
              <AlertTitle sx={{ fontWeight: 'bold' }}>{alert.title}</AlertTitle>
              {alert.message}
            </Alert>
          ))}
        </Box>
      </Box>

      {/* 5-Day Forecast */}
      <Box sx={{ px: 2, mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          📅 5-Day Forecast
        </Typography>
        <Grid container spacing={2}>
          {weatherData.forecast?.map((day, index) => (
            <Grid item xs={6} sm={4} md={2.4} key={index}>
              <ForecastDay>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {day.day}
                </Typography>
                <Typography variant="h3" sx={{ mb: 1 }}>
                  {day.icon}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                  {day.high}°
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {day.low}°
                </Typography>
                <Typography variant="caption" sx={{ color: 'info.main', mt: 1 }}>
                  {day.rain}% rain
                </Typography>
              </ForecastDay>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Crop-Specific Advisories */}
      <Box sx={{ px: 2, mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
          🌾 Crop-Specific Advisories
        </Typography>
        <Grid container spacing={2}>
          {weatherData.cropAdvisories?.map((advisory, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <AlertCard severity={advisory.severity}>
                <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                  <Typography variant="h4">{advisory.icon}</Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {advisory.crop}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {advisory.advisory}
                    </Typography>
                    <Chip
                      label={advisory.severity.toUpperCase()}
                      size="small"
                      color={
                        advisory.severity === 'urgent'
                          ? 'error'
                          : advisory.severity === 'warning'
                          ? 'warning'
                          : advisory.severity === 'info'
                          ? 'info'
                          : 'success'
                      }
                    />
                  </Box>
                </Box>
              </AlertCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Weather Chart */}
      <Box sx={{ px: 2, mb: 4 }}>
        <WeatherCard>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              📊 Temperature & Rainfall Trends
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weatherChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="temp" orientation="left" />
                  <YAxis yAxisId="rain" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="temp"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#ff6b6b"
                    name="Temperature (°C)"
                    strokeWidth={2}
                  />
                  <Bar yAxisId="rain" dataKey="rainfall" fill="#4ecdc4" name="Rainfall (mm)" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </WeatherCard>
      </Box>

      {/* Farming Activities */}
      <Box sx={{ px: 2, mb: 4 }}>
        <WeatherCard>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              🚜 Recommended Farming Activities
            </Typography>
            <Box sx={{ spaceY: 2 }}>
              {weatherData.farmingActivities?.map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    backgroundColor: 'grey.100',
                    borderRadius: 2,
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h4">{activity.icon}</Typography>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {activity.activity}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {activity.reason}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={activity.recommendation}
                    color={
                      activity.recommendation === 'Recommended'
                        ? 'success'
                        : activity.recommendation === 'Not Recommended'
                        ? 'error'
                        : activity.recommendation === 'Urgent'
                        ? 'warning'
                        : 'info'
                    }
                  />
                </Box>
              ))}
            </Box>
          </CardContent>
        </WeatherCard>
      </Box>

      {/* Weather Tips */}
      <Box sx={{ px: 2, mb: 4 }}>
        <WeatherCard>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              💡 Weather Tips
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                  <AlertTitle sx={{ fontWeight: 'bold' }}>🌡️ Temperature Management</AlertTitle>
                  High temperatures expected. Increase irrigation frequency and provide shade for
                  sensitive crops.
                </Alert>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                  <AlertTitle sx={{ fontWeight: 'bold' }}>💧 Water Conservation</AlertTitle>
                  Rain expected tomorrow. Reduce irrigation today to conserve water and prevent
                  waterlogging.
                </Alert>
              </Grid>
            </Grid>
          </CardContent>
        </WeatherCard>
      </Box>

      {/* Community Weather Reports */}
      <Box sx={{ px: 2, mb: 4 }}>
        <WeatherCard>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                👥 Community Reports
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addWeatherReport}
                sx={{ textTransform: 'none' }}
              >
                Add Report
              </Button>
            </Box>

            <Box sx={{ spaceY: 2 }}>
              {communityReports.map((report, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'start',
                    gap: 2,
                    p: 2,
                    backgroundColor: 'grey.100',
                    borderRadius: 2,
                    mb: 2,
                  }}
                >
                  <Typography variant="h4">{report.icon}</Typography>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {report.farmer}
                      </Typography>
                      <Chip label={report.location} size="small" variant="outlined" />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {report.time}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {report.report}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </WeatherCard>
      </Box>

      {/* Weather Report Dialog */}
      <Dialog open={showReportDialog} onClose={() => setShowReportDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Add Weather Report</Typography>
            <IconButton onClick={() => setShowReportDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ spaceY: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Weather Observation"
              placeholder="Describe the current weather conditions in your area..."
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Weather Type</InputLabel>
              <Select label="Weather Type">
                <MenuItem value="rain">🌧️ Rain</MenuItem>
                <MenuItem value="sun">☀️ Sunny</MenuItem>
                <MenuItem value="cloud">☁️ Cloudy</MenuItem>
                <MenuItem value="wind">💨 Windy</MenuItem>
                <MenuItem value="fog">🌫️ Foggy</MenuItem>
                <MenuItem value="storm">⛈️ Storm</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth label="Your Location" placeholder="e.g., Nashik, Maharashtra" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReportDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitWeatherReport}>
            Submit Report
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Weather;