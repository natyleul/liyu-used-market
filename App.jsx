import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Shield, MapPin, MessageSquare, Heart, Star, Phone, CheckCircle, 
  Tag, Filter, AlertTriangle, ArrowUpDown, Bell, Eye, User, X, Sliders, 
  Send, Compass, Layers, Check, ShieldCheck, ChevronRight, Share2, ThumbsUp, PlusCircle, Camera,
  SlidersHorizontal, DollarSign, UserCheck, ShieldAlert, Activity, CheckSquare, XCircle,
  MessageCircle, ExternalLink, Bot, Radio, Globe, Smartphone, Laptop,
  Sun, Moon, LogIn, UserPlus, LogOut, Lock, Mail, Key, Settings
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
const CITIES = [
  { id: 'all', name: 'All Cities', amharic: 'ሁሉም ከተሞች' },
  { id: 'addis-ababa', name: 'Addis Ababa', amharic: 'አዲስ አበባ' },
  { id: 'hawassa', name: 'Hawassa', amharic: 'ሐዋሳ' },
  { id: 'adama', name: 'Adama', amharic: 'አዳማ' },
  { id: 'bishoftu', name: 'Bishoftu', amharic: 'ቢሾፍቱ' },
  { id: 'bahir-dar', name: 'Bahir Dar', amharic: 'ባሕር ዳር' },
];

const SUBCITIES = {
  'addis-ababa': ['Bole', 'Kirkos', 'Yeka', 'Arada', 'Nifas Silk', 'Gullele', 'Lideta', 'Akaky Kaliti'],
  'hawassa': ['Tabor', 'Hayek Dar', 'Menehariya'],
  'adama': ['Bole', 'Daka', 'Luku'],
  'bishoftu': ['Center', 'Industrial Area'],
  'bahir-dar': ['Belay Zeleke', 'Gish Abay']
};

const CITY_COORDINATES = [
  { id: 'addis-ababa', latitude: 9.03, longitude: 38.74 },
  { id: 'hawassa', latitude: 7.05, longitude: 38.47 },
  { id: 'adama', latitude: 8.54, longitude: 39.27 },
  { id: 'bishoftu', latitude: 8.75, longitude: 38.98 },
  { id: 'bahir-dar', latitude: 11.59, longitude: 37.39 },
];

const nearestCityId = (latitude, longitude) => {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const distanceTo = (city) => {
    const latitudeDelta = toRadians(city.latitude - latitude);
    const longitudeDelta = toRadians(city.longitude - longitude);
    const haversine =
      Math.sin(latitudeDelta / 2) ** 2 +
      Math.cos(toRadians(latitude)) *
        Math.cos(toRadians(city.latitude)) *
        Math.sin(longitudeDelta / 2) ** 2;
    return 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  };

  return CITY_COORDINATES.reduce((nearest, city) =>
    distanceTo(city) < distanceTo(nearest) ? city : nearest,
  ).id;
};

const MOCK_CATEGORIES = [
  { id: 'all', name: 'All Categories', amharic: 'ሁሉም' },
  { id: 'phones', name: 'Phones & Tech', amharic: 'ስልኮች እና ቴክ' },
  { id: 'vehicles', name: 'Vehicles', amharic: 'መኪኖች' },
  { id: 'real-estate', name: 'Real Estate / Rent', amharic: 'ቤት እና ሪል እስቴት' },
  { id: 'agriculture', name: 'Livestock & Ag', amharic: 'እርሻ እና እንስሳት' },
  { id: 'electronics', name: 'Electronics', amharic: 'ኤሌክትሮኒክስ' },
  { id: 'furniture', name: 'Furniture', amharic: 'የቤት ዕቃዎች' },
  { id: 'gym-fitness', name: 'Gym & Fitness', amharic: 'ጂም እና ስፖርት' },
  { id: 'books-education', name: 'Books & Education', amharic: 'መጻሕፍት' },
  { id: 'fashion-apparel', name: 'Fashion & Apparel', amharic: 'ልብሶች እና ጫማዎች' },
  { id: 'beauty-cosmetics', name: 'Beauty & Cosmetics', amharic: 'ኮስሞቲክስ' },
];

const INITIAL_LISTINGS = [
  {
    id: 101,
    title: 'iPhone 13 Pro Max - 256GB Sierra Blue',
    titleAmharic: 'አይፎን 13 ፕሮ ማክስ - 256ጂቢ',
    category: 'phones',
    price: 95000,
    condition: 'Like New',
    city: 'addis-ababa',
    subcity: 'Bole',
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=600&q=80',
    verified: true,
    createdDate: '2026-02-20',
    safeSpot: 'Bole Medhanialem Police Station Compound',
    telegramHandle: '@abebe_tech_et',
    seller: {
      name: 'Abebe Kebede',
      rating: 4.9,
      reviewCount: 28,
      phone: '+251 91 123 4567'
    },
    description: 'Factory unlocked iPhone 13 Pro Max. Comes with original cable and silicone case. Battery health is at 89%.'
  },
  {
    id: 102,
    title: 'Toyota Vitz 2018 - Automatic, Low Mileage',
    titleAmharic: 'ቶዮታ ቪትዝ 2018 - አውቶማቲክ',
    category: 'vehicles',
    price: 1850000,
    condition: 'Excellent',
    city: 'addis-ababa',
    subcity: 'Kirkos',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
    verified: true,
    createdDate: '2026-02-22',
    safeSpot: 'Kazanchis Commercial Bank Compound',
    telegramHandle: '@tigist_auto',
    seller: {
      name: 'Tigist Assefa',
      rating: 4.8,
      reviewCount: 15,
      phone: '+251 92 345 6789'
    },
    description: 'Very clean Toyota Vitz. First owner in Ethiopia. Well maintained with regular service records.'
  },
  {
    id: 103,
    title: '2-Bedroom Apartment Rent in Bole Atlas',
    titleAmharic: 'ባለ 2 መኝታ ቤት ኪራይ ቦሌ አትላስ',
    category: 'real-estate',
    price: 45000,
    condition: 'Furnished',
    city: 'addis-ababa',
    subcity: 'Bole',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80',
    verified: false,
    createdDate: '2026-02-25',
    safeSpot: 'Atlas Hotel Intersection',
    telegramHandle: '@bole_rentals',
    seller: {
      name: 'Yonas Tadesse',
      rating: 4.5,
      reviewCount: 9,
      phone: '+251 93 456 7890'
    },
    description: 'Fully furnished apartment including high-speed internet, backup generator, and 24/7 security guard.'
  },
  {
    id: 104,
    title: 'Foldable Treadmill - Home Workout',
    titleAmharic: 'የቤት ውስጥ ትሬድሚል',
    category: 'gym-fitness',
    price: 42000,
    condition: 'Good',
    city: 'addis-ababa',
    subcity: 'Yeka',
    image: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=600&q=80',
    verified: true,
    createdDate: '2026-10-25',
    safeSpot: 'Megenagna Police Station Compound',
    telegramHandle: '@fitfinds_addis',
    seller: { name: 'Marta Bekele', rating: 4.8, reviewCount: 12, phone: '+251 91 234 5678' },
    description: 'Compact foldable treadmill with working speed controls and safety key. Great for home workouts.'
  },
  {
    id: 105,
    title: 'Dumbbell Set - 2 x 10kg',
    titleAmharic: 'የዱምቤል ስብስብ - 2 x 10 ኪ.ግ',
    category: 'gym-fitness',
    price: 6500,
    condition: 'Good',
    city: 'hawassa',
    subcity: 'Tabor',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80',
    verified: false,
    createdDate: '2026-10-24',
    safeSpot: 'Tabor Police Station Compound',
    telegramHandle: '@hawassa_sports',
    seller: { name: 'Samuel Tadesse', rating: 4.6, reviewCount: 7, phone: '+251 92 345 6780' },
    description: 'Pair of sturdy adjustable dumbbells, suitable for strength training at home.'
  },
  {
    id: 106,
    title: 'Adjustable Bench Press with Bar',
    titleAmharic: 'የቤንች ፕሬስ ከባር ጋር',
    category: 'gym-fitness',
    price: 18000,
    condition: 'Excellent',
    city: 'adama',
    subcity: 'Daka',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    verified: true,
    createdDate: '2026-10-23',
    safeSpot: 'Adama City Administration Compound',
    telegramHandle: '@adama_fitness',
    seller: { name: 'Dawit Girma', rating: 4.9, reviewCount: 18, phone: '+251 93 456 7891' },
    description: 'Adjustable weight bench and barbell set. Stable frame with multiple incline positions.'
  },
  {
    id: 107,
    title: 'Grade 10 Textbooks - Complete Set',
    titleAmharic: 'የ10ኛ ክፍል መጻሕፍት ሙሉ ስብስብ',
    category: 'books-education',
    price: 1800,
    condition: 'Good',
    city: 'bahir-dar',
    subcity: 'Belay Zeleke',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    verified: false,
    createdDate: '2026-10-22',
    safeSpot: 'Bahir Dar Public Library Entrance',
    telegramHandle: '@books_bahir',
    seller: { name: 'Hana Alemu', rating: 4.7, reviewCount: 5, phone: '+251 94 567 8901' },
    description: 'A complete set of gently used Grade 10 textbooks. Pages are clean and all books are included.'
  },
  {
    id: 108,
    title: 'Traditional Dress and Leather Shoes',
    titleAmharic: 'ባህላዊ ቀሚስ እና የቆዳ ጫማ',
    category: 'fashion-apparel',
    price: 3800,
    condition: 'Like New',
    city: 'bishoftu',
    subcity: 'Center',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    verified: false,
    createdDate: '2026-10-21',
    safeSpot: 'Bishoftu Police Station Compound',
    telegramHandle: '@bishoftu_style',
    seller: { name: 'Rahel Mulu', rating: 4.8, reviewCount: 11, phone: '+251 95 678 9012' },
    description: 'Beautifully kept traditional outfit paired with leather shoes. Worn only a few times.'
  },
  {
    id: 109,
    title: 'Skincare and Makeup Gift Set',
    titleAmharic: 'የቆዳ እንክብካቤ እና ሜካፕ ስብስብ',
    category: 'beauty-cosmetics',
    price: 2400,
    condition: 'Like New',
    city: 'addis-ababa',
    subcity: 'Bole',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
    verified: true,
    createdDate: '2026-10-20',
    safeSpot: 'Bole Medhanialem Police Station Compound',
    telegramHandle: '@beautyfinds_et',
    seller: { name: 'Selamawit Hailu', rating: 4.9, reviewCount: 14, phone: '+251 96 789 0123' },
    description: 'Gently used gift set with unopened skincare products and makeup accessories.'
  }
];

const readStoredValue = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.error(`Could not read ${key} from local storage.`, error);
    return fallback;
  }
};

const cityName = (cityId) =>
  CITIES.find((city) => city.id === cityId)?.name || cityId;

const safelyCallTelegram = (action, callback) => {
  try {
    return callback();
  } catch (error) {
    console.warn(`Telegram ${action} is unavailable.`, error);
    return undefined;
  }
};

const getTelegramProfile = (webApp) =>
  safelyCallTelegram('profile detection', () => {
    const tgUser = webApp?.initDataUnsafe?.user;
    if (!tgUser || typeof tgUser !== 'object') return null;

    const firstName = typeof tgUser.first_name === 'string' ? tgUser.first_name.trim() : '';
    const lastName = typeof tgUser.last_name === 'string' ? tgUser.last_name.trim() : '';
    const username = typeof tgUser.username === 'string' ? tgUser.username.trim() : '';
    const id = Number.isSafeInteger(tgUser.id) ? tgUser.id : undefined;
    const photoUrl =
      typeof tgUser.photo_url === 'string' && tgUser.photo_url.startsWith('https://')
        ? tgUser.photo_url
        : undefined;
    const name = `${firstName} ${lastName}`.trim();

    if (!name && !username && id === undefined) return null;
    return {
      name: name || username || 'Telegram User',
      firstName,
      lastName,
      username: username ? `@${username}` : '',
      ...(id !== undefined ? { id } : {}),
      ...(photoUrl ? { photoUrl } : {}),
      isTelegramUser: true,
    };
  });

export default function App() {
  // --- THEME STATE (Dark Mode / Light Mode) ---
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('liyu_theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (darkMode) {
      root.classList.add('dark');
      body.classList.add('dark', 'bg-slate-900', 'text-slate-100');
      body.classList.remove('bg-slate-50', 'text-slate-900');
      localStorage.setItem('liyu_theme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark', 'bg-slate-900', 'text-slate-100');
      body.classList.add('bg-slate-50', 'text-slate-900');
      localStorage.setItem('liyu_theme', 'light');
    }
  }, [darkMode]);

  // --- AUTHENTICATION STATE ---
  const [user, setUser] = useState(() => {
    return readStoredValue('liyu_user', null);
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authNotice, setAuthNotice] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [hideLocation, setHideLocation] = useState(
    () => readStoredValue('liyu_hide_location', false) === true,
  );
  const [authTab, setAuthTab] = useState('signin'); // 'signin' or 'signup'
  const [authForm, setAuthForm] = useState({ name: '', phone: '', password: '' });
  const [sellError, setSellError] = useState('');
  const [savedIds, setSavedIds] = useState(() => readStoredValue('liyu_saved', []));
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sellCity, setSellCity] = useState('addis-ababa');
  const citySelectionChanged = useRef(false);
  const [locationStatus, setLocationStatus] = useState('pending');

  // --- APP STATES ---
  const [lang, setLang] = useState('EN');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedSubcity, setSelectedSubcity] = useState('all');
  const [listings, setListings] = useState(() =>
    (() => {
      const storedListings = readStoredValue('liyu_listings', null);
      if (!Array.isArray(storedListings)) return INITIAL_LISTINGS;

      const newListings = INITIAL_LISTINGS.filter(
        (initialListing) =>
          !storedListings.some((storedListing) => storedListing.id === initialListing.id),
      );
      return [...newListings, ...storedListings];
    })(),
  );
  const [selectedListing, setSelectedListing] = useState(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  // Initialize Telegram WebApp and safely read the optional Telegram profile.
  useEffect(() => {
    const webApp = safelyCallTelegram('WebApp detection', () => window.Telegram?.WebApp);
    if (!webApp) return;

    safelyCallTelegram('ready()', () => webApp.ready?.());
    safelyCallTelegram('expand()', () => webApp.expand?.());

    const tgProfile = getTelegramProfile(webApp);
    if (tgProfile) {
      setUser(tgProfile);
      try {
        localStorage.setItem('liyu_user', JSON.stringify(tgProfile));
      } catch (error) {
        console.error('Could not save the Telegram profile locally.', error);
      }
    }
  }, []);

  useEffect(() => {
    const webApp = safelyCallTelegram('WebApp detection', () => window.Telegram?.WebApp);
    if (!webApp) return;

    const headerColor = darkMode ? '#1e293b' : '#047857';
    const backgroundColor = darkMode ? '#0f172a' : '#f8fafc';
    safelyCallTelegram('setHeaderColor()', () => webApp.setHeaderColor?.(headerColor));
    safelyCallTelegram('setBackgroundColor()', () =>
      webApp.setBackgroundColor?.(backgroundColor),
    );
  }, [darkMode]);

  useEffect(() => {
    const webApp = safelyCallTelegram('BackButton detection', () => window.Telegram?.WebApp);
    const backButton = webApp?.BackButton;
    if (!backButton || !(activeChat || selectedListing || showSellModal || showAuthModal || showSettingsModal)) {
      return undefined;
    }

    const handleBack = () => {
      if (activeChat) setActiveChat(null);
      else if (selectedListing) setSelectedListing(null);
      else if (showSellModal) setShowSellModal(false);
      else if (showAuthModal) setShowAuthModal(false);
      else if (showSettingsModal) setShowSettingsModal(false);
    };

    safelyCallTelegram('BackButton.onClick()', () => backButton.onClick?.(handleBack));
    safelyCallTelegram('BackButton.show()', () => backButton.show?.());

    return () => {
      safelyCallTelegram('BackButton.offClick()', () => backButton.offClick?.(handleBack));
      safelyCallTelegram('BackButton.hide()', () => backButton.hide?.());
    };
  }, [activeChat, selectedListing, showSellModal, showAuthModal, showSettingsModal]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      return undefined;
    }

    let active = true;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!active || citySelectionChanged.current) return;
        setSelectedCity(nearestCityId(coords.latitude, coords.longitude));
        setSelectedSubcity('all');
        setLocationStatus('detected');
      },
      () => {
        if (active) setLocationStatus('unavailable');
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('liyu_listings', JSON.stringify(listings));
    } catch (error) {
      console.error('Could not save marketplace listings locally.', error);
    }
  }, [listings]);

  useEffect(() => {
    try {
      localStorage.setItem('liyu_saved', JSON.stringify(savedIds));
    } catch (error) {
      console.error('Could not save favorites locally.', error);
    }
  }, [savedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('liyu_hide_location', JSON.stringify(hideLocation));
    } catch (error) {
      console.error('Could not save location privacy preference locally.', error);
    }
  }, [hideLocation]);

  const triggerHaptic = () => {
    const hapticFeedback = safelyCallTelegram(
      'haptic feedback detection',
      () => window.Telegram?.WebApp?.HapticFeedback,
    );
    if (typeof hapticFeedback?.impactOccurred === 'function') {
      safelyCallTelegram('haptic feedback', () => hapticFeedback.impactOccurred('light'));
    }
  };

  const handleTelegramSignIn = () => {
    triggerHaptic();
    const webApp = safelyCallTelegram('WebApp detection', () => window.Telegram?.WebApp);
    const telegramProfile = getTelegramProfile(webApp);

    if (!telegramProfile) {
      setAuthNotice(
        'Open this app inside Telegram to sign in automatically. Browser-based Telegram Login requires a bot Login Widget configured by the app owner.',
      );
      return;
    }

    setUser(telegramProfile);
    try {
      localStorage.setItem('liyu_user', JSON.stringify(telegramProfile));
    } catch (error) {
      console.error('Could not save the Telegram profile locally.', error);
    }
    setAuthNotice('');
    setShowAuthModal(false);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    if (!authForm.phone || !authForm.password) return;
    triggerHaptic();

    const userData = {
      name: authTab === 'signup' ? authForm.name : (authForm.name || 'Liyu Member'),
      phone: authForm.phone,
      isTelegramUser: false
    };

    setUser(userData);
    localStorage.setItem('liyu_user', JSON.stringify(userData));
    setShowAuthModal(false);
    setAuthForm({ name: '', phone: '', password: '' });
    setAuthNotice('');
  };

  const handleLogout = () => {
    triggerHaptic();
    setUser(null);
    localStorage.removeItem('liyu_user');
  };

  const handleSellRequest = () => {
    triggerHaptic();
    if (!user) {
      setAuthTab('signin');
      setShowAuthModal(true);
      return;
    }
    setSellError('');
    setShowSellModal(true);
  };

  const handleSellSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const city = String(formData.get('city') || '');
    const subcity = String(formData.get('subcity') || '');
    const price = Number(formData.get('price'));
    const title = String(formData.get('title') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const safeSpot = String(formData.get('safeSpot') || '').trim();

    if (!title || !price || !city || !subcity || !phone || !safeSpot) {
      setSellError(lang === 'EN' ? 'Complete all required fields.' : 'እባክዎ አስፈላጊ መረጃዎችን ይሙሉ።');
      return;
    }

    const newListing = {
      id: Date.now(),
      title,
      titleAmharic: String(formData.get('titleAmharic') || '').trim() || title,
      category: String(formData.get('category') || 'phones'),
      price,
      condition: String(formData.get('condition') || 'Good'),
      city,
      subcity,
      image:
        String(formData.get('image') || '').trim() ||
        'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=85',
      verified: Boolean(user.isTelegramUser),
      createdDate: new Date().toISOString().slice(0, 10),
      safeSpot,
      telegramHandle: String(formData.get('telegramHandle') || '')
        .trim()
        .replace(/^@/, ''),
      seller: {
        name: user.name,
        rating: 0,
        reviewCount: 0,
        phone,
        ...(user.id != null ? { ownerId: user.id } : {}),
        ...(user.phone ? { ownerPhone: user.phone } : {}),
      },
      hideLocation: formData.has('hideLocation'),
      description: String(formData.get('description') || '').trim(),
    };

    setListings((current) => [newListing, ...current]);
    setSelectedCategory('all');
    citySelectionChanged.current = true;
    setLocationStatus('manual');
    setSelectedCity('all');
    setSelectedSubcity('all');
    setShowSavedOnly(false);
    setShowSellModal(false);
    setSellError('');
    triggerHaptic();
  };

  const toggleSaved = (id) => {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id],
    );
    triggerHaptic();
  };

  const isListingLocationHidden = (item) => {
    if (item.hideLocation === true) return true;
    if (!hideLocation || item.hideLocation === false) return false;

    const seller = item.seller || {};
    if (user?.id != null && seller.ownerId != null) {
      return String(user.id) === String(seller.ownerId);
    }
    if (user?.phone && seller.ownerPhone) {
      return user.phone === seller.ownerPhone;
    }
    return Boolean(user?.name && seller.name === user.name);
  };

  // Filtered Listings Calculation
  const filteredListings = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return listings.filter(item => {
      const searchableText = [
        item.title,
        item.titleAmharic,
        item.description,
        item.subcity,
        cityName(item.city),
        item.seller.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesCity = selectedCity === 'all' || item.city === selectedCity;
      const matchesSubcity = selectedSubcity === 'all' || item.subcity === selectedSubcity;
      const matchesMinPrice = !minPrice || item.price >= Number(minPrice);
      const matchesMaxPrice = !maxPrice || item.price <= Number(maxPrice);
      const matchesSaved = !showSavedOnly || savedIds.includes(item.id);

      return matchesSearch && matchesCategory && matchesCity && matchesSubcity &&
        matchesMinPrice && matchesMaxPrice && matchesSaved;
    });
  }, [
    listings,
    searchTerm,
    selectedCategory,
    selectedCity,
    selectedSubcity,
    minPrice,
    maxPrice,
    showSavedOnly,
    savedIds,
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    triggerHaptic();
    const newMsg = { id: Date.now(), text: messageInput, sender: 'user', time: 'Just now' };
    setChatMessages(prev => [...prev, newMsg]);
    setMessageInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev, 
        { id: Date.now() + 1, text: 'እሺ ሰላም። እቃው አለ፤ መቼ መገናኘት እንችላለን?', sender: 'seller', time: 'Just now' }
      ]);
    }, 1000);
  };

  return (
    <div dir="ltr" className={`min-h-screen font-sans transition-colors duration-200 text-left ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* --- HEADER NAVBAR --- */}
      <header className={`sticky top-0 z-30 shadow-md transition-colors ${darkMode ? 'bg-slate-800 text-white border-b border-slate-700' : 'bg-emerald-700 text-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <button type="button" className="flex items-center space-x-3 cursor-pointer text-left" onClick={() => { setSelectedCategory('all'); citySelectionChanged.current = true; setLocationStatus('manual'); setSelectedCity('all'); setSelectedSubcity('all'); setShowSavedOnly(false); }}>
            <div className="w-10 h-10 rounded-2xl bg-amber-400 flex items-center justify-center text-emerald-950 font-black text-base shadow-inner">
              ልዩ
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight leading-none">Liyu Market</h1>
              <p className="text-[10px] text-amber-300 font-semibold tracking-wider uppercase">Ethiopia Hub</p>
            </div>
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input 
              type="text" 
              placeholder={lang === 'EN' ? "Search phones, cars, apartments..." : "እቃዎችን እዚህ ይፈልጉ..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                darkMode ? 'bg-slate-700 text-white placeholder-slate-400' : 'bg-emerald-800/60 text-white placeholder-emerald-200'
              }`}
            />
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-amber-300" />
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Sell Button */}
            <button 
              onClick={handleSellRequest}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1 shadow-md transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'EN' ? 'Sell Item' : 'ሸጡ'}</span>
            </button>

            {/* Dark Mode Toggle Switch */}
            <button 
              onClick={() => { triggerHaptic(); setDarkMode(!darkMode); }}
              className={`p-2 rounded-xl transition ${darkMode ? 'bg-slate-700 text-amber-400 hover:bg-slate-600' : 'bg-emerald-800 text-amber-300 hover:bg-emerald-900'}`}
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => { triggerHaptic(); setShowSettingsModal(true); }}
              className={`p-2 rounded-xl transition ${darkMode ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-emerald-800 text-white hover:bg-emerald-900'}`}
              title={lang === 'EN' ? 'Settings' : 'ቅንብሮች'}
              aria-label={lang === 'EN' ? 'Open settings' : 'ቅንብሮችን ክፈት'}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <button 
              onClick={() => { triggerHaptic(); setLang(lang === 'EN' ? 'AM' : 'EN'); }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition ${darkMode ? 'bg-slate-700 text-slate-200' : 'bg-emerald-800 text-white'}`}
            >
              {lang === 'EN' ? 'አማ' : 'EN'}
            </button>

            {/* Auth / Profile Area */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-amber-300">
                    {user.isTelegramUser
                      ? [user.firstName, user.lastName].filter(Boolean).join(' ') || user.name
                      : user.name}
                  </span>
                  <span className="text-[10px] text-slate-300">
                    {user.isTelegramUser ? user.username || 'Telegram User' : user.phone || user.username}
                  </span>
                </div>
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={`${user.name}'s Telegram profile`}
                    referrerPolicy="no-referrer"
                    className="h-9 w-9 rounded-full border border-white/30 object-cover"
                  />
                ) : (
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-800 text-amber-300">
                    <User className="h-4 w-4" />
                  </span>
                )}
                <button 
                  onClick={handleLogout}
                  className="p-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-xl transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-1.5">
                <button 
                  onClick={() => { triggerHaptic(); setAuthTab('signin'); setShowAuthModal(true); }}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 transition"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{lang === 'EN' ? 'Sign In' : 'ግቡ'}</span>
                </button>
                <button 
                  onClick={() => { triggerHaptic(); setAuthTab('signup'); setShowAuthModal(true); }}
                  className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 transition hidden sm:flex"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{lang === 'EN' ? 'Sign Up' : 'ተመዝገቡ'}</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </header>

      {/* --- FILTER & CATEGORY TOOLBAR --- */}
      <div className={`border-b transition-colors ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">
          
          {/* Mobile Search Input */}
          <div className="md:hidden relative">
            <input 
              type="text" 
              placeholder={lang === 'EN' ? "Search items..." : "እቃዎችን ይፈልጉ..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 ${
                darkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'
              }`}
            />
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          </div>

          {/* Cities Dropdown Filters */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar items-center pb-1">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> City:
            </span>
            {CITIES.map(city => (
              <button
                key={city.id}
                onClick={() => { triggerHaptic(); citySelectionChanged.current = true; setLocationStatus('manual'); setSelectedCity(city.id); setSelectedSubcity('all'); }}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCity === city.id 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {lang === 'EN' ? city.name : city.amharic}
              </button>
            ))}
          </div>
          {locationStatus === 'pending' && (
            <p role="status" className="text-[11px] text-slate-400">
              {lang === 'EN' ? 'Detecting your nearby city…' : 'በአቅራቢያዎ ያለው ከተማ እየተፈለገ ነው…'}
            </p>
          )}
          {locationStatus === 'unavailable' && (
            <p role="status" className="text-[11px] text-slate-400">
              {lang === 'EN' ? 'Location unavailable. Showing all cities.' : 'አካባቢዎ አልተገኘም። ሁሉም ከተሞች እየታዩ ነው።'}
            </p>
          )}

          {/* Subcity Selector */}
          {selectedCity !== 'all' && SUBCITIES[selectedCity] && (
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar items-center pt-1 border-t border-slate-100 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-400">Area:</span>
              <button
                onClick={() => setSelectedSubcity('all')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold ${selectedSubcity === 'all' ? 'bg-amber-400 text-emerald-950' : 'text-slate-400'}`}
              >
                All Areas
              </button>
              {SUBCITIES[selectedCity].map(sub => (
                <button
                  key={sub}
                  onClick={() => { triggerHaptic(); setSelectedSubcity(sub); }}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold whitespace-nowrap ${
                    selectedSubcity === sub ? 'bg-amber-400 text-emerald-950' : 'text-slate-400 hover:text-amber-400'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2 dark:border-slate-700">
            <button
              type="button"
              onClick={() => { triggerHaptic(); setShowSavedOnly((current) => !current); }}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                showSavedOnly
                  ? 'bg-rose-600 text-white'
                  : darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-700'
              }`}
            >
              <Heart className="h-3.5 w-3.5" fill={showSavedOnly ? 'currentColor' : 'none'} />
              {lang === 'EN' ? 'Saved' : 'የተቀመጡ'}
            </button>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              {lang === 'EN' ? 'ETB min' : 'ዝቅተኛ ብር'}
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(event) => setMinPrice(event.target.value)}
                placeholder="0"
                className={`w-24 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-amber-400 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
              />
            </label>
            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              {lang === 'EN' ? 'ETB max' : 'ከፍተኛ ብር'}
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(event) => setMaxPrice(event.target.value)}
                placeholder={lang === 'EN' ? 'No limit' : 'ገደብ የለም'}
                className={`w-24 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-amber-400 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                citySelectionChanged.current = true;
                setLocationStatus('manual');
                setSelectedCity('all');
                setSelectedSubcity('all');
                setMinPrice('');
                setMaxPrice('');
                setSearchTerm('');
                setShowSavedOnly(false);
              }}
              className="ml-auto text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
            >
              {lang === 'EN' ? 'Clear filters' : 'ማጣሪያዎችን አጽዳ'}
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pt-1">
            {MOCK_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => { triggerHaptic(); setSelectedCategory(cat.id); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat.id 
                    ? 'bg-amber-400 text-emerald-950 shadow-sm' 
                    : darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {lang === 'EN' ? cat.name : cat.amharic}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* --- MAIN FEED --- */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-black">
            {lang === 'EN' ? 'Recent Marketplace Listings' : 'ቅርብ ጊዜ የወጡ እቃዎች'}
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            {filteredListings.length} {lang === 'EN' ? 'items found' : 'እቃዎች ተገኝተዋል'}
          </span>
        </div>

        {filteredListings.length === 0 ? (
          <div className="text-center py-12 bg-slate-100 dark:bg-slate-800 rounded-3xl">
            <Search className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <p className="text-sm font-bold text-slate-400">
              {lang === 'EN' ? 'No items found matching your filters.' : 'የመረጡትን ማጣሪያ የሚያሟላ ዕቃ አልተገኘም።'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredListings.map((item) => (
              <div 
                key={item.id}
                onClick={() => { triggerHaptic(); setSelectedListing(item); }}
                className={`rounded-2xl overflow-hidden border shadow-sm hover:shadow-md cursor-pointer transition ${
                  darkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="relative">
                  <img src={item.image} alt={lang === 'EN' ? item.title : item.titleAmharic || item.title} className="w-full h-44 object-cover" />
                  <button
                    type="button"
                    aria-label={savedIds.includes(item.id) ? 'Remove from saved items' : 'Save item'}
                    onClick={(event) => { event.stopPropagation(); toggleSaved(item.id); }}
                    className="absolute top-2 left-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-rose-600 shadow"
                  >
                    <Heart className="h-4 w-4" fill={savedIds.includes(item.id) ? 'currentColor' : 'none'} />
                  </button>
                  {item.verified && (
                    <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h3 className="font-bold text-sm line-clamp-1">{lang === 'EN' ? item.title : item.titleAmharic || item.title}</h3>
                    <span className="bg-amber-400/20 text-amber-600 dark:text-amber-300 text-xs font-black px-2 py-0.5 rounded-lg whitespace-nowrap">
                      ETB {item.price.toLocaleString('en-ET')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                    <span>
                      {isListingLocationHidden(item)
                        ? (lang === 'EN' ? 'Location Hidden by Seller' : 'አካባቢው በሻጩ ተደብቋል')
                        : `${item.subcity}, ${lang === 'EN' ? cityName(item.city) : CITIES.find((city) => city.id === item.city)?.amharic || cityName(item.city)}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100 dark:border-slate-700">
                    <span className="font-medium text-slate-400">{item.seller.name}</span>
                    <span className="text-emerald-500 font-bold">{item.safeSpot ? (lang === 'EN' ? '🛡️ Safe Spot' : '🛡️ ደህንነቱ የተጠበቀ') : ''}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- SELL LISTING MODAL --- */}
      {showSellModal && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowSellModal(false);
          }}
        >
          <section className={`my-0 max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-t-3xl p-5 shadow-2xl transition-colors sm:my-8 sm:rounded-3xl sm:p-6 ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
            <div className="mb-5 flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                  Liyu Used Market
                </p>
                <h2 className="mt-1 text-xl font-black">
                  {lang === 'EN' ? 'Create a listing' : 'አዲስ ዕቃ ያቅርቡ'}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  {lang === 'EN' ? 'Add item details so nearby buyers can find it.' : 'በአቅራቢያዎ ያሉ ገዢዎች እንዲያገኙት ዝርዝሩን ያስገቡ።'}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close listing form"
                onClick={() => setShowSellModal(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSellSubmit} className="space-y-3">
              <label className="block text-xs font-bold">
                {lang === 'EN' ? 'Item title *' : 'የዕቃ ስም *'}
                <input
                  name="title"
                  required
                  maxLength="90"
                  placeholder="e.g. iPhone 12, 128GB"
                  className={`mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:ring-slate-600`}
                />
              </label>
              <label className="block text-xs font-bold">
                {lang === 'EN' ? 'Title in Amharic (optional)' : 'የዕቃው ስም በአማርኛ (አማራጭ)'}
                <input
                  name="titleAmharic"
                  maxLength="90"
                  placeholder="አማርኛ ርዕስ"
                  className="mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:ring-slate-600"
                />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-xs font-bold">
                  {lang === 'EN' ? 'Category *' : 'ምድብ *'}
                  <select
                    name="category"
                    required
                    className="mt-1.5 w-full rounded-xl px-3 py-2.5 text-sm outline-none ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:ring-slate-600"
                  >
                    {MOCK_CATEGORIES.filter((item) => item.id !== 'all').map((item) => (
                      <option key={item.id} value={item.id}>
                        {lang === 'EN' ? item.name : item.amharic}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-bold">
                  {lang === 'EN' ? 'Price (ETB) *' : 'ዋጋ (ብር) *'}
                  <input
                    name="price"
                    type="number"
                    min="1"
                    step="1"
                    required
                    placeholder="0"
                    className="mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:ring-slate-600"
                  />
                </label>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-xs font-bold">
                  {lang === 'EN' ? 'Condition' : 'ሁኔታ'}
                  <select
                    name="condition"
                    className="mt-1.5 w-full rounded-xl px-3 py-2.5 text-sm outline-none ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:ring-slate-600"
                  >
                    {['Like New', 'Excellent', 'Good', 'Fair', 'Used'].map((condition) => (
                      <option key={condition}>{condition}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-bold">
                  {lang === 'EN' ? 'City *' : 'ከተማ *'}
                  <select
                    name="city"
                    required
                    value={sellCity}
                    onChange={(event) => setSellCity(event.target.value)}
                    className="mt-1.5 w-full rounded-xl px-3 py-2.5 text-sm outline-none ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:ring-slate-600"
                  >
                    {CITIES.filter((item) => item.id !== 'all').map((item) => (
                      <option key={item.id} value={item.id}>
                        {lang === 'EN' ? item.name : item.amharic}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block text-xs font-bold">
                {lang === 'EN' ? 'Subcity / area *' : 'ክፍለ ከተማ / አካባቢ *'}
                <select
                  name="subcity"
                  required
                  className="mt-1.5 w-full rounded-xl px-3 py-2.5 text-sm outline-none ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:ring-slate-600"
                >
                  {SUBCITIES[sellCity].map((area) => (
                    <option key={area}>{area}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-3 text-xs dark:border-slate-600">
                <input
                  type="checkbox"
                  name="hideLocation"
                  defaultChecked={hideLocation}
                  className="mt-0.5 h-4 w-4 accent-emerald-600"
                />
                <span>
                  <span className="block font-bold">
                    {lang === 'EN' ? 'Hide my city and area for this listing' : 'ለዚህ ማስታወቂያ ከተማዬን እና አካባቢዬን ደብቅ'}
                  </span>
                  <span className="mt-1 block font-normal text-slate-400">
                    {lang === 'EN' ? 'Buyers will see that your location is hidden.' : 'ገዢዎች አካባቢዎ እንደተደበቀ ያያሉ።'}
                  </span>
                </span>
              </label>
              <label className="block text-xs font-bold">
                {lang === 'EN' ? 'Safe meeting spot *' : 'ደህንነቱ የተጠበቀ መገናኛ *'}
                <input
                  name="safeSpot"
                  required
                  maxLength="120"
                  placeholder="e.g. Bole Medhanialem Police Station Compound"
                  className="mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:ring-slate-600"
                />
              </label>
              <label className="block text-xs font-bold">
                {lang === 'EN' ? 'Image URL (optional)' : 'የምስል አድራሻ (አማራጭ)'}
                <input
                  name="image"
                  type="url"
                  placeholder="https://..."
                  className="mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:ring-slate-600"
                />
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block text-xs font-bold">
                  {lang === 'EN' ? 'Phone number *' : 'ስልክ ቁጥር *'}
                  <input
                    name="phone"
                    type="tel"
                    required
                    defaultValue={user?.phone || ''}
                    placeholder="+251 91 123 4567"
                    className="mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:ring-slate-600"
                  />
                </label>
                <label className="block text-xs font-bold">
                  {lang === 'EN' ? 'Telegram username' : 'የቴሌግራም ስም'}
                  <input
                    name="telegramHandle"
                    defaultValue={user?.username || ''}
                    placeholder="@username"
                    className="mt-1.5 w-full rounded-xl px-3.5 py-2.5 text-sm outline-none ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:ring-slate-600"
                  />
                </label>
              </div>
              <label className="block text-xs font-bold">
                {lang === 'EN' ? 'Description' : 'መግለጫ'}
                <textarea
                  name="description"
                  rows="3"
                  maxLength="500"
                  placeholder={lang === 'EN' ? 'Describe your item...' : 'ዕቃውን ይግለጹ...'}
                  className="mt-1.5 w-full resize-y rounded-xl px-3.5 py-2.5 text-sm outline-none ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-emerald-500 dark:bg-slate-700 dark:ring-slate-600"
                />
              </label>
              {sellError && <p role="alert" className="text-xs font-semibold text-red-500">{sellError}</p>}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3 text-sm font-black text-white shadow-md transition hover:bg-emerald-800"
              >
                <PlusCircle className="h-4 w-4" />
                {lang === 'EN' ? 'Publish Listing' : 'ዕቃውን አቅርብ'}
              </button>
            </form>
          </section>
        </div>
      )}

      {/* --- LISTING DETAIL MODAL --- */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`rounded-3xl max-w-lg w-full p-6 shadow-2xl relative my-8 transition-colors ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
            <button 
              onClick={() => setSelectedListing(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <img src={selectedListing.image} alt={selectedListing.title} className="w-full h-56 object-cover rounded-2xl mb-4" />

            <div className="flex justify-between items-start mb-3">
              <h3 className="font-black text-lg">{lang === 'EN' ? selectedListing.title : selectedListing.titleAmharic || selectedListing.title}</h3>
              <span className="text-lg font-black text-amber-500 whitespace-nowrap">
                ETB {selectedListing.price.toLocaleString('en-ET')}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">{selectedListing.description}</p>

            <div className="p-3 bg-emerald-500/10 rounded-2xl mb-4 text-xs space-y-1">
              <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Recommended Safe Meeting Spot:
              </div>
              <div className="text-slate-600 dark:text-slate-300 font-medium pl-5">
                {isListingLocationHidden(selectedListing)
                  ? (lang === 'EN' ? 'Meeting location shared privately with the buyer.' : 'የመገናኛ ቦታ ከገዢው ጋር በግል ይጋራል።')
                  : selectedListing.safeSpot}
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-700">
              <span className="font-semibold">{selectedListing.seller.name}</span>
              {selectedListing.seller.rating > 0 && (
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  {selectedListing.seller.rating} ({selectedListing.seller.reviewCount})
                </span>
              )}
              <span className="text-slate-400">
                {isListingLocationHidden(selectedListing)
                  ? (lang === 'EN' ? 'Ethiopia (Location Hidden)' : 'ኢትዮጵያ (አካባቢው ተደብቋል)')
                  : `${selectedListing.subcity}, ${cityName(selectedListing.city)}`}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <a 
                href={`tel:${selectedListing.seller.phone.replace(/[^\d+]/g, '')}`}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" /> Call Seller
              </a>
              {selectedListing.telegramHandle && (
                <a
                  href={`https://t.me/${selectedListing.telegramHandle.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={triggerHaptic}
                  className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
                >
                  <Send className="w-4 h-4" /> Telegram
                </a>
              )}
              <button 
                onClick={() => {
                  setActiveChat(selectedListing);
                  setChatMessages([{ id: 1, text: `Hi! Is "${selectedListing.title}" still available?`, sender: 'user', time: 'Just now' }]);
                  setSelectedListing(null);
                }}
                className="bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" /> In-App Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- IN-APP CHAT MODAL --- */}
      {activeChat && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full h-[500px] flex flex-col p-4 shadow-2xl relative transition-colors ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h4 className="font-bold text-sm">{activeChat.seller.name}</h4>
                <p className="text-[10px] text-slate-400">{activeChat.title}</p>
              </div>
              <button onClick={() => setActiveChat(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs ${
                    msg.sender === 'user' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-200 dark:border-slate-700 flex gap-2">
              <input 
                type="text" 
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className={`flex-1 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
              />
              <button type="submit" className="p-2 bg-amber-400 text-emerald-950 rounded-xl font-bold">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- AUTHENTICATION MODAL (SIGN IN & SIGN UP) --- */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full p-6 shadow-2xl relative transition-colors ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5 pr-8">
              <h2 className="text-xl font-black">
                {lang === 'EN' ? 'Welcome to Liyu Market' : 'ወደ ልዩ ገበያ እንኳን በደህና መጡ'}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {lang === 'EN' ? 'Sign in or create an account to sell and chat.' : 'ለመሸጥ እና ለመወያየት ይግቡ ወይም መለያ ይፍጠሩ።'}
              </p>
            </div>

            {/* Auth Tab Buttons */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
              <button 
                onClick={() => setAuthTab('signin')}
                className={`flex-1 py-2 text-sm font-bold border-b-2 text-center transition ${
                  authTab === 'signin' 
                    ? 'border-amber-400 text-amber-500' 
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                {lang === 'EN' ? 'Sign In' : 'ግቡ'}
              </button>
              <button 
                onClick={() => setAuthTab('signup')}
                className={`flex-1 py-2 text-sm font-bold border-b-2 text-center transition ${
                  authTab === 'signup' 
                    ? 'border-amber-400 text-amber-500' 
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                {lang === 'EN' ? 'Sign Up' : 'ተመዝገቡ'}
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authTab === 'signup' && (
                <div>
                  <label className="text-xs font-bold mb-1 block">
                    {lang === 'EN' ? 'Full Name' : 'ሙሉ ስም'}
                  </label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g. Abebe Kebede"
                      value={authForm.name}
                      onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
                      required
                    />
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold mb-1 block">
                  {lang === 'EN' ? 'Phone Number' : 'ስልክ ቁጥር'}
                </label>
                <div className="relative">
                  <input 
                    type="tel" 
                    placeholder="+251 91 123 4567"
                    value={authForm.phone}
                    onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
                    required
                  />
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold mb-1 block">
                  {lang === 'EN' ? 'Password' : 'የይለፍ ቃል'}
                </label>
                <div className="relative">
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 ${darkMode ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-900'}`}
                    required
                  />
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-black py-3 rounded-xl text-xs shadow-md transition"
              >
                {authTab === 'signin' 
                  ? (lang === 'EN' ? 'Sign In' : 'ግቡ') 
                  : (lang === 'EN' ? 'Create Account' : 'መለያ ክፈት')}
              </button>
            </form>
            <div className="my-4 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              {lang === 'EN' ? 'or' : 'ወይም'}
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>
            <button
              type="button"
              onClick={handleTelegramSignIn}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 py-3 text-xs font-black text-white transition hover:bg-sky-700"
            >
              <Send className="h-4 w-4" />
              {lang === 'EN' ? 'Sign In with Telegram' : 'በቴሌግራም ይግቡ'}
            </button>
            {authNotice && (
              <p role="status" className="mt-3 text-center text-xs text-amber-600 dark:text-amber-300">
                {authNotice}
              </p>
            )}
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowSettingsModal(false);
          }}
        >
          <section className={`relative w-full max-w-md rounded-3xl p-6 shadow-2xl ${darkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>
            <button
              type="button"
              aria-label={lang === 'EN' ? 'Close settings' : 'ቅንብሮችን ዝጋ'}
              onClick={() => setShowSettingsModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mb-5 pr-8">
              <h2 className="text-xl font-black">
                {lang === 'EN' ? 'Settings' : 'ቅንብሮች'}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {lang === 'EN' ? 'Choose what location details to share on your listings.' : 'በማስታወቂያዎችዎ ላይ የሚጋሩትን የአካባቢ መረጃ ይምረጡ።'}
              </p>
            </div>
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-600">
              <span>
                <span className="block text-sm font-bold">
                  {lang === 'EN' ? 'Hide my exact location / area' : 'ትክክለኛ አካባቢዬን ደብቅ'}
                </span>
                <span className="mt-1 block text-xs text-slate-400">
                  {lang === 'EN' ? 'Use this as the default for new listings. You can change it per post.' : 'ለአዳዲስ ማስታወቂያዎች ነባሪ ያድርጉት። ለእያንዳንዱ ማስታወቂያ መቀየር ይችላሉ።'}
                </span>
              </span>
              <input
                type="checkbox"
                checked={hideLocation}
                onChange={(event) => setHideLocation(event.target.checked)}
                className="h-5 w-5 shrink-0 accent-emerald-600"
                aria-label={lang === 'EN' ? 'Hide my exact location or area' : 'ትክክለኛ አካባቢዬን ደብቅ'}
              />
            </label>
          </section>
        </div>
      )}

    </div>
  );
}