import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Card, CardContent, CardMedia, Grid, Typography, Button, TextField,
    Select, MenuItem, FormControl, InputLabel, Chip, Dialog, DialogTitle,
    DialogContent, DialogActions, Fab, IconButton, Slider, Rating,
    CircularProgress, Alert, Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
// import anime from 'animejs'; // Removed unused import

// Firebase Firestore imports
import { collection, getDocs, addDoc, serverTimestamp, Timestamp, query, orderBy } from 'firebase/firestore'; // Removed limit, startAfter

const FloatingActionButton = styled(Fab)(({ theme }) => ({
    position: 'fixed',
    bottom: theme.spacing(10),
    right: theme.spacing(2),
    zIndex: 1050,
}));

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 24px rgba(45, 80, 22, 0.15)',
    },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
}));


function Marketplace({ language, translations, userLocation, db, currentUser, appId }) {
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [filterPriceRange, setFilterPriceRange] = useState([0, 10000]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [filterLocation, setFilterLocation] = useState('');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showFilterDialog, setShowFilterDialog] = useState(false);
    const [loading, setLoading] = useState(true);
    const [addListingLoading, setAddListingLoading] = useState(false);
    const [addListingError, setAddListingError] = useState('');
    const [newListingData, setNewListingData] = useState({
        crop: '', quantity: '', price: '', grade: 'A',
        location: userLocation || '', contact: '', description: '', image: '',
    });
    // Removed unused pagination state
    // const [lastVisible, setLastVisible] = useState(null);
    // const [loadingMore, setLoadingMore] = useState(false);
    // const LISTINGS_PER_PAGE = 6;


    const categories = [
        { value: 'all', label: 'All Crops', icon: '🌾' }, { value: 'grains', label: 'Grains', icon: '🌾' },
        { value: 'vegetables', label: 'Vegetables', icon: '🥬' }, { value: 'fruits', label: 'Fruits', icon: '🍎' },
        { value: 'pulses', label: 'Pulses', icon: '🫘' }, { value: 'spices', label: 'Spices', icon: '🌶️' },
        { value: 'fibers', label: 'Fibers', icon: '🌱' },
    ];

    const fetchListings = useCallback(async () => {
        if (!db || !appId) {
            console.error("Firestore db or appId is not available for fetching listings.");
            setLoading(false);
            setAddListingError("Marketplace configuration error. Cannot load listings."); // Set error
            return;
        }
        setLoading(true);
        setAddListingError(''); // Clear previous errors
        console.log(`Fetching listings from: artifacts/${appId}/public/data/listings`);
        try {
            const listingsCollectionRef = collection(db, `artifacts/${appId}/public/data/listings`);
            const q = query(listingsCollectionRef, orderBy("datePosted", "desc"));
            const querySnapshot = await getDocs(q);

            const fetchedListings = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    datePosted: data.datePosted instanceof Timestamp ? data.datePosted.toDate() : (data.datePosted ? new Date(data.datePosted) : new Date(0)),
                    price: typeof data.price === 'number' ? data.price : 0,
                    rating: typeof data.rating === 'number' ? data.rating : 0,
                    reviews: typeof data.reviews === 'number' ? data.reviews : 0,
                    crop: data.crop || '',
                    farmer: data.farmer || '',
                    location: data.location || '',
                    quantity: typeof data.quantity === 'number' ? data.quantity : 0,
                };
            });

            console.log("Fetched listings:", fetchedListings.length);
            setListings(fetchedListings);
        } catch (error) {
            console.error("Error fetching listings:", error);
            setAddListingError("Could not fetch listings. Please check your connection and try again.");
            setListings([]); // Ensure listings are empty on error
        } finally {
            setLoading(false);
        }
    }, [db, appId]);

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    const filterAndSortListings = useCallback(() => {
        if (listings.length === 0 && !loading) {
            setFilteredListings([]);
            return;
        }

        let filtered = listings.filter((listing) => {
            const matchesSearch =
                (listing.crop || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (listing.farmer || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (listing.location || '').toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
            const price = typeof listing.price === 'number' ? listing.price : 0;
            const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
            const matchesLocation = !selectedLocation || (listing.location || '').toLowerCase().includes(selectedLocation.toLowerCase());

            return matchesSearch && matchesCategory && matchesPrice && matchesLocation;
        });

        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
                break;
            case 'price-high':
                filtered.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
                break;
            case 'rating':
                filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
                break;
            case 'newest':
            default:
                const getTimeSafe = (date) => (date instanceof Date && !isNaN(date) ? date.getTime() : 0);
                filtered.sort((a, b) => getTimeSafe(b.datePosted) - getTimeSafe(a.datePosted));
                break;
        }

        console.log("Filtered listings count:", filtered.length);
        setFilteredListings(filtered);

    }, [listings, searchQuery, selectedCategory, sortBy, priceRange, selectedLocation, loading]);

    useEffect(() => {
        console.log("Filters changed, re-filtering...");
        filterAndSortListings();
    }, [filterAndSortListings]);


    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewListingData(prev => ({ ...prev, [name]: value }));
    };

    const handleSliderChange = (event, newValue) => {
        setFilterPriceRange(newValue);
    };

    const handleFilterLocationChange = (event) => {
        setFilterLocation(event.target.value);
    };

    const applyFilters = () => {
        setPriceRange(filterPriceRange);
        setSelectedLocation(filterLocation);
        setShowFilterDialog(false);
    };

    const resetFilters = () => {
        setFilterPriceRange([0, 10000]);
        setFilterLocation('');
        setPriceRange([0, 10000]);
        setSelectedLocation('');
        setSearchQuery('');
        setSelectedCategory('all');
        setSortBy('newest');
        setShowFilterDialog(false);
    }

    const handleAddListingSubmit = async (event) => {
        event.preventDefault();
        setAddListingLoading(true);
        setAddListingError('');

        const requiredFields = ['crop', 'quantity', 'price', 'location', 'contact'];
        const missingField = requiredFields.find(field => !newListingData[field]?.trim());
        if (missingField) {
            setAddListingError(`Please fill in the '${missingField}' field.`);
            setAddListingLoading(false);
            return;
        }
        const quantityNum = parseFloat(newListingData.quantity);
        const priceNum = parseFloat(newListingData.price);
        if (isNaN(quantityNum) || quantityNum <= 0 || isNaN(priceNum) || priceNum <= 0) {
            setAddListingError('Quantity and Price must be valid positive numbers.');
            setAddListingLoading(false);
            return;
        }
        if (!/^\+?[0-9\s-()]{10,}$/.test(newListingData.contact)) {
            setAddListingError('Please enter a valid contact number (at least 10 digits).');
            setAddListingLoading(false);
            return;
        }


        try {
            console.log("Adding listing to Firestore...");
            const listingsCollectionRef = collection(db, `artifacts/${appId}/public/data/listings`);
            const selectedCropInfo = categories.find(c => newListingData.crop.toLowerCase().includes(c.label.toLowerCase().split(' ')[0]));

            const listingToAdd = {
                crop: newListingData.crop.trim(),
                quantity: quantityNum,
                price: priceNum,
                grade: newListingData.grade,
                location: newListingData.location.trim(),
                contact: newListingData.contact.trim(),
                description: newListingData.description?.trim() || '',
                image: newListingData.image?.trim() || '',
                farmer: currentUser?.displayName || currentUser?.email || 'Anonymous Farmer',
                farmerId: currentUser?.uid,
                datePosted: serverTimestamp(),
                status: 'active',
                views: 0,
                inquiries: 0,
                category: selectedCropInfo?.value || 'grains',
                farmerImage: '👨‍🌾',
                cropIcon: selectedCropInfo?.icon || '❓',
                rating: 0,
                reviews: 0,
            };

            if (!listingToAdd.image) {
                delete listingToAdd.image;
            }

            const docRef = await addDoc(listingsCollectionRef, listingToAdd);
            console.log("Listing added successfully with ID:", docRef.id);

            setShowAddDialog(false);
            setNewListingData({
                crop: '', quantity: '', price: '', grade: 'A',
                location: userLocation || '', contact: '', description: '', image: '',
            });
            fetchListings();

        } catch (error) {
            console.error("Error adding listing:", error);
            setAddListingError(`Failed to add listing: ${error.message}. Please try again.`);
        } finally {
            setAddListingLoading(false);
        }
    };


    const contactFarmer = useCallback((phone, farmerName) => { // Wrapped in useCallback
        console.log(`Contacting ${farmerName} at ${phone}`);
        if (window.confirm(`Call ${farmerName} at ${phone}?`)) {
            window.location.href = `tel:${phone}`;
        }
    }, []); // No dependencies needed

    const makeOffer = useCallback((listingId) => { // Wrapped in useCallback
        const listing = listings.find(l => l.id === listingId);
        if (!listing) return;
        console.log(`Making offer for listing ID: ${listingId}`);
        const offerAmount = prompt(`Make an offer for ${listing.crop} (Current price: ₹${listing.price}):`);
        if (offerAmount && !isNaN(offerAmount)) {
            alert(`Offer of ₹${offerAmount} sent to ${listing.farmer}! (Replace with backend logic)`);
        }
    }, [listings]); // Depends on listings

    const formatDate = useCallback((date) => { // Wrapped in useCallback
        if (!date) return 'Unknown date';
        const dateObj = date instanceof Date ? date : new Date(0);
        const now = new Date();
        if (isNaN(dateObj.getTime()) || dateObj.getFullYear() <= 1970) return 'Pending...';
        const diffTime = Math.abs(now - dateObj);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0 && dateObj.getDate() === now.getDate()) return 'Today';
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        if (diffDays <= 1 && dateObj.getDate() === yesterday.getDate() && dateObj.getMonth() === yesterday.getMonth() && dateObj.getFullYear() === yesterday.getFullYear()) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return dateObj.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    }, []); // No dependencies needed

    // Removed unused loadMoreListings function
    // const loadMoreListings = () => { ... };

    if (loading && listings.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} sx={{ color: 'primary.main' }} />
                <Typography sx={{ ml: 2, color: 'text.secondary' }}>Loading Listings...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ pb: { xs: 10, sm: 4 } }}>
            <Box sx={{ backgroundColor: 'primary.main', color: 'white', p: { xs: 2, sm: 3 }, mb: 3, boxShadow: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, mb: { xs: 2, sm: 0 } }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                            🏪 Kisan Bazaar
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            Direct Farmer-to-Buyer Marketplace
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'center', sm: 'flex-end' } }}>
                        <Button
                            variant="outlined"
                            startIcon={<FilterListIcon />}
                            onClick={() => {
                                setFilterPriceRange(priceRange);
                                setFilterLocation(selectedLocation);
                                setShowFilterDialog(true);
                            }}
                            sx={{ borderColor: 'rgba(255,255,255,0.7)', color: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
                        >
                            Filters
                        </Button>
                        {currentUser && !currentUser.isAnonymous && (
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => {
                                    setNewListingData({
                                        crop: '', quantity: '', price: '', grade: 'A',
                                        location: userLocation || '', contact: '', description: '', image: '',
                                    });
                                    setAddListingError('');
                                    setShowAddDialog(true);
                                }}
                                sx={{ backgroundColor: 'secondary.main', color: 'primary.dark', '&:hover': { backgroundColor: 'secondary.dark' } }}
                            >
                                Add Listing
                            </Button>
                        )}
                    </Box>
                </Box>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search crops, farmers, or locations..."
                    value={searchQuery}
                    onChange={handleSearch}
                    sx={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: 3,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 3,
                            '& fieldset': { borderColor: 'transparent' },
                            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                            '&.Mui-focused fieldset': { borderColor: 'white' },
                        },
                        '& .MuiInputBase-input': { color: 'white', py: 1.5 },
                        '& .MuiInputBase-input::placeholder': { color: 'rgba(255,255,255,0.7)', opacity: 1 },
                    }}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1 }} />,
                        endAdornment: searchQuery && (
                            <IconButton
                                aria-label="clear search"
                                onClick={() => setSearchQuery('')}
                                edge="end"
                                size="small"
                                sx={{ color: 'rgba(255,255,255,0.7)' }}
                            >
                                <CloseIcon fontSize='small' />
                            </IconButton>
                        )
                    }}
                />
            </Box>

            <Box sx={{ px: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: '4px' }, '&::-webkit-scrollbar-thumb': { backgroundColor: 'primary.light', borderRadius: '2px' } }}>
                    {categories.map((category) => (
                        <Chip
                            key={category.value}
                            label={`${category.icon} ${category.label}`}
                            onClick={() => handleCategoryChange(category.value)}
                            variant={selectedCategory === category.value ? 'filled' : 'outlined'}
                            color={selectedCategory === category.value ? 'primary' : 'default'}
                            sx={{ minWidth: 'fit-content', cursor: 'pointer', boxShadow: selectedCategory === category.value ? 1 : 0, fontWeight: selectedCategory === category.value ? 500 : 400 }}
                        />
                    ))}
                </Box>
            </Box>

            <Box sx={{ px: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {loading ? 'Loading...' : `${filteredListings.length} listing${filteredListings.length !== 1 ? 's' : ''} found`}
                </Typography>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Sort by</InputLabel>
                    <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Sort by">
                        <MenuItem value="newest">Newest First</MenuItem>
                        <MenuItem value="price-low">Price: Low to High</MenuItem>
                        <MenuItem value="price-high">Price: High to Low</MenuItem>
                        <MenuItem value="rating">Highest Rated</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ px: 2, mb: 4 }}>
                {!loading && filteredListings.length === 0 && (
                    <Box sx={{ textAlign: 'center', mt: 5, p: 3, backgroundColor: 'background.paper', borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                            No listings found matching your criteria.
                        </Typography>
                        <Typography sx={{ color: 'text.secondary', mt: 1 }}>
                            Try adjusting your search or filters.
                        </Typography>
                    </Box>
                )}
                <Grid container spacing={3}>
                    {filteredListings.map((listing) => (
                        <Grid item xs={12} sm={6} lg={4} key={listing.id}>
                            <StyledCard className="marketplace-card" elevation={1}>
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={listing.image || `https://placehold.co/400x240/9CAF88/2D5016?text=${encodeURIComponent(listing.crop || 'Crop')}`}
                                    alt={listing.crop || 'Crop image'}
                                    sx={{ objectFit: 'cover' }}
                                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/400x240/EEEEEE/777777?text=Image+Error`; }}
                                />
                                <StyledCardContent>
                                    <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                            <Typography variant="h3" component="span" role="img" aria-label="farmer icon">{listing.farmerImage || '❓'}</Typography>
                                            <Box>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', lineHeight: 1.3 }}>
                                                    {listing.farmer || 'Unknown Farmer'}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                                                    📍 {listing.location || 'Unknown Location'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                                                <Typography variant="h5" component="span" role="img" aria-label="crop icon">{listing.cropIcon || '❓'}</Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {listing.crop || 'Crop Name'}
                                                </Typography>
                                                {listing.grade && (
                                                    <Chip
                                                        label={`Grade ${listing.grade}`}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                        sx={{ height: '20px', fontSize: '0.75rem' }}
                                                    />
                                                )}
                                            </Box>
                                            <Typography variant="body2" sx={{
                                                color: 'text.secondary', mb: 2, minHeight: { xs: 0, sm: '40px' },
                                                overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                                            }}>
                                                {listing.description || 'No description provided.'}
                                            </Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main', lineHeight: 1.2 }}>
                                                    ₹{listing.price?.toLocaleString() || 'N/A'}
                                                    <Typography component="span" variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}> /qtl</Typography>
                                                </Typography>
                                                <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 500 }}>
                                                    {listing.quantity || 'N/A'} qtls
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Box sx={{ mt: 'auto' }}>
                                        <Divider sx={{ my: 1.5 }} />
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Rating value={listing.rating ?? 0} readOnly size="small" precision={0.5} />
                                                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8rem', mt: '2px' }}>
                                                    ({listing.reviews ?? 0})
                                                </Typography>
                                            </Box>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                                                {formatDate(listing.datePosted)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'space-between' }}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                startIcon={<PhoneIcon fontSize="small" />}
                                                onClick={() => contactFarmer(listing.contact, listing.farmer)}
                                                sx={{ textTransform: 'none', flexGrow: 1 }}
                                                disabled={!listing.contact || listing.status === 'sold'}
                                                color="primary"
                                            >
                                                Contact
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                startIcon={<ShoppingCartIcon fontSize="small" />}
                                                onClick={() => makeOffer(listing.id)}
                                                sx={{ textTransform: 'none', flexGrow: 1 }}
                                                disabled={listing.status === 'sold' || currentUser?.uid === listing.farmerId}
                                                color="primary"
                                            >
                                                Make Offer
                                            </Button>
                                        </Box>
                                    </Box>
                                </StyledCardContent>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Removed Load More Button logic */}

            <Dialog open={showAddDialog} onClose={() => { setShowAddDialog(false); setAddListingError(''); }} maxWidth="sm" fullWidth>
                <Box component="form" onSubmit={handleAddListingSubmit} noValidate>
                    <DialogTitle>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">Add New Listing</Typography>
                            <IconButton onClick={() => { setShowAddDialog(false); setAddListingError(''); }} disabled={addListingLoading}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        {addListingError && <Alert severity="error" sx={{ mb: 2 }}>{addListingError}</Alert>}
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required error={!newListingData.crop && !!addListingError}>
                                    <InputLabel>Crop Type</InputLabel>
                                    <Select
                                        label="Crop Type"
                                        name="crop"
                                        value={newListingData.crop}
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value="" disabled><em>Select Crop</em></MenuItem>
                                        <MenuItem value="Wheat">🌾 Wheat</MenuItem>
                                        <MenuItem value="Rice">🌾 Rice</MenuItem>
                                        <MenuItem value="Cotton">🌱 Cotton</MenuItem>
                                        <MenuItem value="Soybean">🫘 Soybean</MenuItem>
                                        <MenuItem value="Maize">🌽 Maize</MenuItem>
                                        <MenuItem value="Tur">🫘 Tur (Pigeon Pea)</MenuItem>
                                        <MenuItem value="Tomatoes">🍅 Tomatoes</MenuItem>
                                        <MenuItem value="Onions">🧅 Onions</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth required
                                    label="Quantity (quintals)"
                                    name="quantity"
                                    type="number"
                                    inputProps={{ step: "0.1", min: "0.1" }}
                                    value={newListingData.quantity}
                                    onChange={handleInputChange}
                                    error={!newListingData.quantity && !!addListingError}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth required
                                    label="Price per quintal (₹)"
                                    name="price"
                                    type="number"
                                    inputProps={{ step: "1", min: "1" }}
                                    value={newListingData.price}
                                    onChange={handleInputChange}
                                    error={!newListingData.price && !!addListingError}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Quality Grade</InputLabel>
                                    <Select
                                        label="Quality Grade"
                                        name="grade"
                                        value={newListingData.grade}
                                        onChange={handleInputChange}
                                    >
                                        <MenuItem value="A">Grade A (Premium)</MenuItem>
                                        <MenuItem value="B">Grade B (Standard)</MenuItem>
                                        <MenuItem value="C">Grade C (Regular)</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth required
                                    label="Location"
                                    name="location"
                                    placeholder="e.g., Nashik, Maharashtra"
                                    value={newListingData.location}
                                    onChange={handleInputChange}
                                    error={!newListingData.location && !!addListingError}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth required
                                    label="Contact Number"
                                    name="contact"
                                    type="tel"
                                    value={newListingData.contact}
                                    onChange={handleInputChange}
                                    error={!newListingData.contact && !!addListingError}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth multiline rows={3}
                                    label="Description (Optional)"
                                    name="description"
                                    placeholder="Describe your produce, e.g., organic, harvest date..."
                                    value={newListingData.description}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Image URL (Optional)"
                                    name="image"
                                    placeholder="https://example.com/image.jpg"
                                    value={newListingData.image}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ p: '16px 24px' }}>
                        <Button onClick={() => { setShowAddDialog(false); setAddListingError(''); }} disabled={addListingLoading}>Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={addListingLoading}
                        >
                            {addListingLoading ? <CircularProgress size={24} /> : 'Add Listing'}
                        </Button>
                    </DialogActions>
                </Box>
            </Dialog>

            <Dialog open={showFilterDialog} onClose={() => setShowFilterDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Filters</Typography>
                        <IconButton onClick={() => setShowFilterDialog(false)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                            Price Range (₹/qtl)
                        </Typography>
                        <Slider
                            value={filterPriceRange}
                            onChange={handleSliderChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={10000}
                            step={100}
                            marks={[{ value: 0, label: '₹0' }, { value: 10000, label: '₹10k+' }]}
                            sx={{ mt: 1 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2">₹{filterPriceRange[0].toLocaleString()}</Typography>
                            <Typography variant="body2">₹{filterPriceRange[1].toLocaleString()}{filterPriceRange[1] >= 10000 ? '+' : ''}</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Location (State/Region)</InputLabel>
                            <Select
                                value={filterLocation}
                                onChange={handleFilterLocationChange}
                                label="Location (State/Region)"
                            >
                                <MenuItem value=""><em>All Locations</em></MenuItem>
                                {[...new Set(listings
                                    .map(l => l.location?.split(',')[1]?.trim())
                                    .filter(Boolean)
                                )].sort().map(loc => (
                                    <MenuItem key={loc} value={loc}>{loc}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-between', p: '16px 24px' }}>
                    <Button onClick={resetFilters} color="inherit">Reset</Button>
                    <Button
                        variant="contained"
                        onClick={applyFilters}
                        color="primary"
                    >
                        Apply Filters
                    </Button>
                </DialogActions>
            </Dialog>

            {currentUser && !currentUser.isAnonymous && (
                <FloatingActionButton
                    color="primary"
                    onClick={() => {
                        setNewListingData({
                            crop: '', quantity: '', price: '', grade: 'A',
                            location: userLocation || '', contact: '', description: '', image: '',
                        });
                        setAddListingError('');
                        setShowAddDialog(true);
                    }}
                    aria-label="add listing"
                >
                    <AddIcon />
                </FloatingActionButton>
            )}
        </Box>
    );
}

export default Marketplace;