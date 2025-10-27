import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Avatar,
  Tabs,
  Tab,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  // Badge, // Removed unused import
  // Rating, // Removed unused import
  // Fab, // Removed unused import
  // Paper, // Removed unused import
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Removed unused Line imports
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Removed unused import
// import SettingsIcon from '@mui/icons-material/Settings'; // Removed unused import
import anime from 'animejs';

// --- Placeholder Data ---
const useSampleUserData = () => {
    return useCallback(() => ({ // Wrap the object in useCallback
      name: 'Ramesh Yadav',
      location: 'Nashik, Maharashtra',
      farmSize: '15 acres',
      phone: '+91 9876543210',
      email: 'ramesh.farmer@email.com',
      avatar: '👨‍🌾',
      stats: { monthlyIncome: 240000, activeListings: 12, rating: 4.8, totalSales: 156, },
      recentActivity: [
        { type: 'sale', crop: 'Wheat', amount: 50000, date: '2024-01-15', status: 'completed' },
        { type: 'listing', crop: 'Cotton', quantity: 25, date: '2024-01-14', status: 'active' },
        { type: 'purchase', item: 'Seeds', amount: 15000, date: '2024-01-13', status: 'completed' },
        { type: 'alert', message: 'Weather warning for your area', date: '2024-01-12', status: 'warning' },
      ],
      crops: [
        { name: 'Wheat', icon: '🌾', status: 'growing', progress: 75, harvestDate: '2024-03-15', area: '5 acres' },
        { name: 'Cotton', icon: '🌱', status: 'ready', progress: 95, harvestDate: '2024-02-01', area: '3 acres' },
        { name: 'Tomatoes', icon: '🍅', status: 'harvested', progress: 100, harvestDate: '2024-01-10', area: '2 acres' },
        { name: 'Soybean', icon: '🫘', status: 'growing', progress: 45, harvestDate: '2024-04-20', area: '4 acres' },
      ],
      listings: [
        { id: 1, crop: 'Wheat', quantity: 50, price: 2420, status: 'active', views: 23, inquiries: 5 },
        { id: 2, crop: 'Cotton', quantity: 25, price: 7100, status: 'active', views: 18, inquiries: 3 },
        { id: 3, crop: 'Tomatoes', quantity: 15, price: 1800, status: 'sold', views: 45, inquiries: 8 },
      ],
    }), []); // Empty dependency array as it's static data
};

const incomeChartData = [
    { month: 'Aug', income: 180000, expenses: 50000 },
    { month: 'Sep', income: 220000, expenses: 60000 },
    { month: 'Oct', income: 195000, expenses: 45000 },
    { month: 'Nov', income: 240000, expenses: 70000 },
    { month: 'Dec', income: 210000, expenses: 55000 },
    { month: 'Jan', income: 240000, expenses: 65000 },
];
// --- End Placeholder Data ---


const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 80, height: 80, background: 'linear-gradient(135deg, #2D5016, #9CAF88)', fontSize: '2rem',
}));

const StatCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #9CAF88, #D4A574)', color: 'white', textAlign: 'center',
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  backgroundColor: '#e5e7eb', borderRadius: 10, '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #2D5016, #9CAF88)', borderRadius: 10, },
}));

const CropStatusCard = styled(Card)(({ status, theme }) => ({
  borderLeft: '4px solid',
  ...(status === 'growing' && { backgroundColor: '#f0f9ff', borderColor: '#0ea5e9', }),
  ...(status === 'ready' && { backgroundColor: '#f0fdf4', borderColor: '#22c55e', }),
  ...(status === 'harvested' && { backgroundColor: '#fefce8', borderColor: '#eab308', }),
}));

// Removed unused FloatingActionButton
// const FloatingActionButton = styled(Fab)(({ theme }) => ({ ... }));

// Props now include auth for sign out
function Profile({ language, translations, userLocation, db, currentUser, appId, auth }) {
  const [currentTab, setCurrentTab] = useState(0);
  const [userData, setUserData] = useState({});
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddCropDialog, setShowAddCropDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const getSampleUserData = useSampleUserData(); // Get the memoized function

  useEffect(() => {
    // --- TODO: Fetch real user data from Firestore using currentUser.uid ---
    // const fetchUserData = async () => { ... }
    // fetchUserData();
    // For now, use sample data:
    setUserData(getSampleUserData()); // Call the function to get data
    setLoading(false);
    // --- End TODO ---

    setTimeout(() => {
      anime({
        targets: '.profile-card', translateY: [30, 0], opacity: [0, 1], delay: anime.stagger(100), duration: 800, easing: 'easeOutExpo',
      });
    }, 300);
  }, [currentUser, getSampleUserData]); // Added getSampleUserData as dependency


  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const editProfile = () => setShowEditDialog(true);
  const addCrop = () => setShowAddCropDialog(true);
  const createListing = () => window.location.href = '/marketplace';
  const checkWeather = () => window.location.href = '/weather';
  const viewReports = () => alert('Reports feature coming soon!');
  const manageCrop = (cropName) => alert(`Managing ${cropName}...`);
  const editListing = (listingId) => alert(`Editing listing ${listingId}...`);
  const viewInquiries = (listingId) => alert(`Viewing inquiries for listing ${listingId}...`);
  const saveSettings = () => alert('Settings saved successfully!');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'sale': return '💰';
      case 'listing': return '🏪';
      case 'purchase': return '🛒';
      case 'alert': return '⚠️';
      default: return '📝';
    }
  };

  const getActivityColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'info';
      case 'warning': return 'warning';
      default: return 'default';
    }
  };

  const handleSignOut = () => {
    if (auth) {
      auth.signOut().then(() => {
        console.log("User signed out successfully.");
        // App.js onAuthStateChanged will handle redirecting to AuthForm
      }).catch((error) => {
        console.error("Sign out error:", error);
        alert("Failed to sign out. Please try again.");
      });
    }
  };

  if (loading || !userData.name) { // Check if userData has loaded
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 8 }}> {/* Add padding-bottom */}
      <Box sx={{ backgroundColor: 'primary.main', color: 'white', p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              👤 Farmer Profile
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Manage your farming activities
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={editProfile}
              sx={{ borderColor: 'rgba(255,255,255,0.7)', color: 'white', '&:hover': { borderColor: 'white' } }}
            >
              Edit
            </Button>
             <Button
                variant="contained"
                onClick={handleSignOut}
                color="secondary" // Or another appropriate color
             >
                Sign Out
             </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 2, mb: 4 }}>
        <Card className="profile-card" sx={{ textAlign: 'center', p: 4 }}>
          <ProfileAvatar sx={{ mx: 'auto', mb: 3 }}>{userData.avatar}</ProfileAvatar>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            {userData.name}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
            {userData.location} • {userData.farmSize}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, textAlign: 'center' }}>
            <Box> <Typography variant="body2" sx={{ color: 'text.secondary' }}> 📱 {userData.phone} </Typography> </Box>
            <Box> <Typography variant="body2" sx={{ color: 'text.secondary' }}> 📧 {userData.email} </Typography> </Box>
          </Box>
        </Card>
      </Box>

      <Box sx={{ px: 2, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <StatCard className="profile-card">
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}> ₹{(userData.stats?.monthlyIncome / 1000).toFixed(1)}K </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}> This Month </Typography>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard className="profile-card">
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}> {userData.stats?.activeListings} </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}> Active Listings </Typography>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard className="profile-card">
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}> {userData.stats?.rating}★ </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}> Rating </Typography>
              </CardContent>
            </StatCard>
          </Grid>
          <Grid item xs={6} sm={3}>
            <StatCard className="profile-card">
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}> {userData.stats?.totalSales} </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}> Total Sales </Typography>
              </CardContent>
            </StatCard>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ px: 2, mb: 4 }}>
        <Card className="profile-card">
          <Tabs value={currentTab} onChange={handleTabChange} variant="fullWidth" sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tab label="📊 Dashboard" sx={{ textTransform: 'none' }} />
            <Tab label="🌾 My Crops" sx={{ textTransform: 'none' }} />
            <Tab label="🏪 Market" sx={{ textTransform: 'none' }} />
            <Tab label="⚙️ Settings" sx={{ textTransform: 'none' }} />
          </Tabs>

          {currentTab === 0 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}> Quick Actions </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}> <Button fullWidth variant="contained" onClick={addCrop} sx={{ backgroundColor: 'success.light', color: 'success.dark', py: 3, borderRadius: 2, textTransform: 'none', '&:hover': { backgroundColor: 'success.main', color: 'white' }, }}> <Box sx={{ textAlign: 'center' }}> <Typography variant="h4" sx={{ mb: 1 }}> 🌱 </Typography> <Typography variant="body2">Add Crop</Typography> </Box> </Button> </Grid>
                  <Grid item xs={6} sm={3}> <Button fullWidth variant="contained" onClick={createListing} sx={{ backgroundColor: 'info.light', color: 'info.dark', py: 3, borderRadius: 2, textTransform: 'none', '&:hover': { backgroundColor: 'info.main', color: 'white' }, }}> <Box sx={{ textAlign: 'center' }}> <Typography variant="h4" sx={{ mb: 1 }}> 🏪 </Typography> <Typography variant="body2">Create Listing</Typography> </Box> </Button> </Grid>
                  <Grid item xs={6} sm={3}> <Button fullWidth variant="contained" onClick={checkWeather} sx={{ backgroundColor: 'warning.light', color: 'warning.dark', py: 3, borderRadius: 2, textTransform: 'none', '&:hover': { backgroundColor: 'warning.main', color: 'white' }, }}> <Box sx={{ textAlign: 'center' }}> <Typography variant="h4" sx={{ mb: 1 }}> 🌦️ </Typography> <Typography variant="body2">Weather Alert</Typography> </Box> </Button> </Grid>
                  <Grid item xs={6} sm={3}> <Button fullWidth variant="contained" onClick={viewReports} sx={{ backgroundColor: 'secondary.light', color: 'secondary.dark', py: 3, borderRadius: 2, textTransform: 'none', '&:hover': { backgroundColor: 'secondary.main', color: 'white' }, }}> <Box sx={{ textAlign: 'center' }}> <Typography variant="h4" sx={{ mb: 1 }}> 📊 </Typography> <Typography variant="body2">View Reports</Typography> </Box> </Button> </Grid>
                </Grid>
              </Box>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}> Recent Activity </Typography>
                <List>
                  {userData.recentActivity?.map((activity, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar> <Avatar sx={{ backgroundColor: 'transparent', fontSize: '1.5rem' }}> {getActivityIcon(activity.type)} </Avatar> </ListItemAvatar>
                        <ListItemText primary={ activity.type === 'sale' ? `Sold ${activity.crop} for ₹${activity.amount?.toLocaleString()}` : activity.type === 'listing' ? `Listed ${activity.crop} (${activity.quantity} qtls)` : activity.type === 'purchase' ? `Purchased ${activity.item} for ₹${activity.amount?.toLocaleString()}` : activity.message } secondary={formatDate(activity.date)} />
                        <Chip label={activity.status} size="small" color={getActivityColor(activity.status)} />
                      </ListItem>
                      {index < userData.recentActivity.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}> Monthly Income </Typography>
                <Card>
                  <CardContent>
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={incomeChartData}>
                          <CartesianGrid strokeDasharray="3 3" /> <XAxis dataKey="month" /> <YAxis />
                          <Tooltip formatter={(value) => `₹${value}`} /> <Legend />
                          <Bar dataKey="income" fill="#22c55e" name="Income" />
                          <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          )}
          {currentTab === 1 && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}> My Crops </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={addCrop} sx={{ textTransform: 'none' }}> Add Crop </Button>
              </Box>
              <Grid container spacing={3}>
                {userData.crops?.map((crop, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <CropStatusCard status={crop.status}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h4">{crop.icon}</Typography>
                            <Box> <Typography variant="h6" sx={{ fontWeight: 'bold' }}> {crop.name} </Typography> <Typography variant="body2" sx={{ color: 'text.secondary' }}> {crop.area} </Typography> </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Chip label={crop.status.toUpperCase()} size="small" color={ crop.status === 'ready' ? 'success' : crop.status === 'growing' ? 'info' : 'warning' } />
                            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}> {crop.progress}% </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ mb: 2 }}> <ProgressBar variant="determinate" value={crop.progress} /> </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}> Harvest: {formatDate(crop.harvestDate)} </Typography>
                          <Button size="small" onClick={() => manageCrop(crop.name)} sx={{ textTransform: 'none' }}> Manage </Button>
                        </Box>
                      </CardContent>
                    </CropStatusCard>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          {currentTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}> My Listings </Typography>
              <Box sx={{ spaceY: 3 }}>
                {userData.listings?.map((listing, index) => (
                  <Card key={index} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box> <Typography variant="h6" sx={{ fontWeight: 'bold' }}> {listing.crop} </Typography> <Typography variant="body2" sx={{ color: 'text.secondary' }}> {listing.quantity} quintals • ₹{listing.price}/quintal </Typography> </Box>
                        <Chip label={listing.status} color={listing.status === 'active' ? 'success' : 'default'} variant="outlined" />
                      </Box>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item> <Box sx={{ textAlign: 'center' }}> <Typography variant="h6" sx={{ color: 'info.main' }}> {listing.views} </Typography> <Typography variant="caption" sx={{ color: 'text.secondary' }}> Views </Typography> </Box> </Grid>
                        <Grid item> <Box sx={{ textAlign: 'center' }}> <Typography variant="h6" sx={{ color: 'success.main' }}> {listing.inquiries} </Typography> <Typography variant="caption" sx={{ color: 'text.secondary' }}> Inquiries </Typography> </Box> </Grid>
                        <Grid item> <Box sx={{ textAlign: 'center' }}> <Typography variant="h6"> {listing.status === 'sold' ? '✓' : '⏳'} </Typography> <Typography variant="caption" sx={{ color: 'text.secondary' }}> Status </Typography> </Box> </Grid>
                      </Grid>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => editListing(listing.id)} sx={{ textTransform: 'none' }}> Edit </Button>
                        <Button size="small" variant="contained" startIcon={<PhoneIcon />} onClick={() => viewInquiries(listing.id)} sx={{ textTransform: 'none' }}> Inquiries </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          )}
          {currentTab === 3 && (
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}> Account Settings </Typography>
              <Card>
                <CardContent>
                  <Box sx={{ spaceY: 4 }}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}> Language Preference </Typography>
                      <FormControl fullWidth>
                        <InputLabel>Language</InputLabel>
                        <Select value={language} label="Language" disabled> {/* Disable for now, handled in App.js */}
                          <MenuItem value="en">🇺🇸 English</MenuItem> <MenuItem value="hi">🇮🇳 हिन्दी</MenuItem> <MenuItem value="mr">🇮🇳 मराठी</MenuItem> <MenuItem value="te">🇮🇳 తెలుగు</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}> Notification Preferences </Typography>
                      <Box sx={{ spaceY: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}> <input type="checkbox" defaultChecked style={{ marginRight: 8 }} /> <Typography variant="body2">Price Alerts</Typography> </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}> <input type="checkbox" defaultChecked style={{ marginRight: 8 }} /> <Typography variant="body2">Weather Updates</Typography> </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}> <input type="checkbox" style={{ marginRight: 8 }} /> <Typography variant="body2">Market News</Typography> </Box>
                      </Box>
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}> Farm Information </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}> <TextField fullWidth label="Farm Size (acres)" placeholder="e.g., 15" /> </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl fullWidth>
                            <InputLabel>Primary Crop Type</InputLabel>
                            <Select label="Primary Crop Type">
                              <MenuItem value="grains">Grains</MenuItem> <MenuItem value="vegetables">Vegetables</MenuItem> <MenuItem value="fruits">Fruits</MenuItem> <MenuItem value="pulses">Pulses</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button variant="contained" onClick={saveSettings}> Save Changes </Button>
                      <Button variant="outlined">Reset</Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </Card>
      </Box>

      <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle> <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> <Typography variant="h6">Edit Profile</Typography> <IconButton onClick={() => setShowEditDialog(false)}> <CloseIcon /> </IconButton> </Box> </DialogTitle>
        <DialogContent>
          <Box sx={{ spaceY: 3 }}>
            <TextField fullWidth label="Name" defaultValue={userData.name} sx={{ mb: 2 }} />
            <TextField fullWidth label="Email" defaultValue={userData.email} sx={{ mb: 2 }} />
            <TextField fullWidth label="Phone" defaultValue={userData.phone} sx={{ mb: 2 }} />
            <TextField fullWidth label="Location" defaultValue={userData.location} sx={{ mb: 2 }} />
            <TextField fullWidth label="Farm Size" defaultValue={userData.farmSize} />
          </Box>
        </DialogContent>
        <DialogActions> <Button onClick={() => setShowEditDialog(false)}>Cancel</Button> <Button variant="contained" onClick={() => setShowEditDialog(false)}> Save Changes </Button> </DialogActions>
      </Dialog>

      <Dialog open={showAddCropDialog} onClose={() => setShowAddCropDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle> <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> <Typography variant="h6">Add New Crop</Typography> <IconButton onClick={() => setShowAddCropDialog(false)}> <CloseIcon /> </IconButton> </Box> </DialogTitle>
        <DialogContent>
          <Box sx={{ spaceY: 3 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Crop Type</InputLabel>
              <Select label="Crop Type">
                <MenuItem value="wheat">🌾 Wheat</MenuItem> <MenuItem value="rice">🌾 Rice</MenuItem> <MenuItem value="cotton">🌱 Cotton</MenuItem> <MenuItem value="soybean">🫘 Soybean</MenuItem> <MenuItem value="tomato">🍅 Tomato</MenuItem> <MenuItem value="potato">🥔 Potato</MenuItem>
              </Select>
            </FormControl>
            <TextField fullWidth label="Area (acres)" type="number" sx={{ mb: 2 }} />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select label="Status"> <MenuItem value="growing">Growing</MenuItem> <MenuItem value="ready">Ready to Harvest</MenuItem> <MenuItem value="harvested">Harvested</MenuItem> </Select>
            </FormControl>
            <TextField fullWidth label="Expected Harvest Date" type="date" InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} /> {/* Added InputLabelProps */}
            <TextField fullWidth multiline rows={3} label="Notes" placeholder="Additional information..." />
          </Box>
        </DialogContent>
        <DialogActions> <Button onClick={() => setShowAddCropDialog(false)}>Cancel</Button> <Button variant="contained" onClick={() => setShowAddCropDialog(false)}> Add Crop </Button> </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Profile;