const bcrypt = require('../backend/node_modules/bcryptjs');
const db = require('../backend/db');

// Indian First and Last Names for realistic customer generation
const firstNames = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan',
  'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Advaith', 'Aaryan', 'Dhruv', 'Kabir', 'Rudra', 'Rohan',
  'Ananya', 'Diya', 'Gauri', 'Isha', 'Kavya', 'Khushi', 'Mira', 'Navya', 'Pooja', 'Priya',
  'Riya', 'Saanvi', 'Shanaya', 'Shreya', 'Sneha', 'Tanvi', 'Veda', 'Zoya', 'Tara', 'Anika',
  'Rahul', 'Amit', 'Vikram', 'Deepak', 'Suresh', 'Manish', 'Neha', 'Pooja', 'Sunita', 'Rajesh'
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Patel', 'Reddy', 'Mehta', 'Nair', 'Singh', 'Chauhan', 'Iyer',
  'Kapoor', 'Kumar', 'Joshi', 'Bhat', 'Deshmukh', 'Kulkarni', 'Bose', 'Chatterjee', 'Mukherjee', 'Dutta',
  'Pillai', 'Menon', 'Rao', 'Agarwal', 'Mishra', 'Pandey', 'Saxena', 'Trivedi', 'Bhattacharya', 'Sengupta'
];

const categoriesData = [
  { id: 'cat-laptops', name: 'Laptops', slug: 'laptops', description: 'High-performance ultrabooks, coding machines, and gaming rigs.', icon: 'Laptop' },
  { id: 'cat-smartphones', name: 'Smartphones', slug: 'smartphones', description: 'Next-gen flagship and mid-range 5G devices.', icon: 'Smartphone' },
  { id: 'cat-audio', name: 'Audio', slug: 'audio', description: 'Studio monitors, ANC headphones, and wireless earbuds.', icon: 'Headphones' },
  { id: 'cat-gaming', name: 'Gaming Gear', slug: 'gaming-gear', description: 'Mechanical keyboards, high-DPI mice, and cooling pads.', icon: 'Gamepad2' },
  { id: 'cat-fitness', name: 'Fitness & Wearables', slug: 'fitness-wearables', description: 'Smartwatches, fitness bands, and biometric trackers.', icon: 'Watch' },
  { id: 'cat-accessories', name: 'Accessories', slug: 'accessories', description: 'Ergonomic laptop stands, GaN chargers, cables, and docks.', icon: 'Layers' }
];

// 100+ Realistic Products with Indian Rupee Pricing
const productsData = [
  // LAPTOPS (18 products)
  {
    name: 'ZenithBook Pro 15 (Ryzen 7 / RTX 4060)',
    category: 'Laptops',
    category_id: 'cat-laptops',
    price: 68999,
    original_price: 79999,
    rating: 4.8,
    reviews_count: 328,
    stock: 45,
    specs: { cpu: 'AMD Ryzen 7 7840HS', gpu: 'NVIDIA RTX 4060 8GB', ram: '16GB DDR5', storage: '1TB NVMe SSD', display: '15.6" QHD 165Hz', weight: '1.9 kg', battery: '80Wh' },
    description: 'Perfect balance of high-throughput programming compile speeds and smooth 1080p/1440p gaming under ₹70k budget.',
    image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80',
    tags: ['coding', 'gaming', 'bestseller', 'rtx4060']
  },
  {
    name: 'AeroCode Dev Edition 14 (Intel i7 / 32GB RAM)',
    category: 'Laptops',
    category_id: 'cat-laptops',
    price: 69500,
    original_price: 84999,
    rating: 4.9,
    reviews_count: 512,
    stock: 30,
    specs: { cpu: 'Intel Core i7-13700H', gpu: 'Intel Iris Xe', ram: '32GB LPDDR5', storage: '1TB Gen4 SSD', display: '14" 2.8K OLED 90Hz', weight: '1.38 kg', battery: '75Wh' },
    description: 'Designed exclusively for software engineers running Docker, Kubernetes, and heavy IDEs with whisper-quiet cooling.',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    tags: ['coding', 'development', 'lightweight', 'oled']
  },
  {
    name: 'Predator Nitro Strike 16 (i5 13th Gen / RTX 3050)',
    category: 'Laptops',
    category_id: 'cat-laptops',
    price: 58990,
    original_price: 69990,
    rating: 4.6,
    reviews_count: 240,
    stock: 60,
    specs: { cpu: 'Intel Core i5-13420H', gpu: 'RTX 3050 6GB', ram: '16GB DDR5', storage: '512GB SSD', display: '16" FHD 144Hz', weight: '2.1 kg', battery: '60Wh' },
    description: 'Entry-level gaming and CS student workstation with dual-fan copper cooling and full RGB tactile keyboard.',
    image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
    tags: ['gaming', 'budget', 'coding', 'students']
  },
  {
    name: 'Titan Creator Studio 16 (i9 14th Gen / RTX 4080)',
    category: 'Laptops',
    category_id: 'cat-laptops',
    price: 184990,
    original_price: 219990,
    rating: 4.9,
    reviews_count: 89,
    stock: 15,
    specs: { cpu: 'Intel Core i9-14900HX', gpu: 'RTX 4080 12GB', ram: '64GB DDR5', storage: '2TB Gen4 SSD', display: '16" Mini-LED 4K 120Hz', weight: '2.4 kg', battery: '99.9Wh' },
    description: 'Ultra-workstation for deep learning, Unreal Engine, 3D simulation, and 8K rendering.',
    image_url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80',
    tags: ['high-end', 'workstation', 'creator', 'ai']
  },
  {
    name: 'MacBook Air M3 Edition (16GB / 512GB)',
    category: 'Laptops',
    category_id: 'cat-laptops',
    price: 114900,
    original_price: 124900,
    rating: 4.9,
    reviews_count: 740,
    stock: 55,
    specs: { cpu: 'Apple M3 8-Core', gpu: '10-Core GPU', ram: '16GB Unified', storage: '512GB SSD', display: '13.6" Liquid Retina', weight: '1.24 kg', battery: '18 hrs' },
    description: 'Fanless, all-day 18-hour battery life with Apple Silicon M3 for web developers and modern digital nomads.',
    image_url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
    tags: ['apple', 'coding', 'premium', 'ultrabook']
  },
  {
    name: 'ThinkPulse Business X1 (Core Ultra 7 / 32GB)',
    category: 'Laptops',
    category_id: 'cat-laptops',
    price: 132000,
    original_price: 148000,
    rating: 4.7,
    reviews_count: 142,
    stock: 25,
    specs: { cpu: 'Intel Core Ultra 7 155H', gpu: 'Intel Arc Graphics', ram: '32GB LPDDR5X', storage: '1TB SSD', display: '14" 2.8K IPS', weight: '1.1 kg', battery: '65Wh' },
    description: 'Enterprise executive grade with carbon-fiber chassis, mil-spec drop testing, and hardware TPM.',
    image_url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80',
    tags: ['business', 'enterprise', 'coding']
  },
  {
    name: 'IdeaBook Slim 5 (Ryzen 5 / 16GB / 512GB)',
    category: 'Laptops',
    category_id: 'cat-laptops',
    price: 46990,
    original_price: 54990,
    rating: 4.5,
    reviews_count: 420,
    stock: 80,
    specs: { cpu: 'AMD Ryzen 5 7530U', gpu: 'Radeon Vega 7', ram: '16GB DDR4', storage: '512GB SSD', display: '15.6" FHD IPS', weight: '1.77 kg', battery: '56Wh' },
    description: 'Everyday coding, browsing, and academic productivity notebook with backlit keyboard.',
    image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80',
    tags: ['budget', 'coding', 'students']
  },
  {
    name: 'Vortex G16 CyberRacer (i7 13th / RTX 4070)',
    category: 'Laptops',
    category_id: 'cat-laptops',
    price: 119990,
    original_price: 139990,
    rating: 4.8,
    reviews_count: 165,
    stock: 20,
    specs: { cpu: 'Intel Core i7-13650HX', gpu: 'RTX 4070 8GB', ram: '16GB DDR5 (exp. 64GB)', storage: '1TB NVMe', display: '16" 240Hz QHD+', weight: '2.5 kg', battery: '90Wh' },
    description: 'Competitive eSports machine delivering 240+ FPS on Valorant, CS2, and AAA titles at ultra settings.',
    image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
    tags: ['gaming', 'esports', 'rtx4070']
  },

  // SMARTPHONES (16 products)
  {
    name: 'Nova Pro 5G (Snapdragon 8 Gen 3 / 256GB)',
    category: 'Smartphones',
    category_id: 'cat-smartphones',
    price: 54999,
    original_price: 64999,
    rating: 4.7,
    reviews_count: 450,
    stock: 65,
    specs: { soc: 'Snapdragon 8 Gen 3', display: '6.78" 144Hz AMOLED LTPO', camera: '50MP OIS Sony LYT-808', battery: '5500mAh 120W FlashCharge', ram: '12GB' },
    description: 'Next-gen flagship with vapor chamber cooling, studio camera sensors, and 20-minute full charge.',
    image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
    tags: ['flagship', '5g', 'fastcharge']
  },
  {
    name: 'PixelCraft 8 Studio (Tensor G3 / 128GB)',
    category: 'Smartphones',
    category_id: 'cat-smartphones',
    price: 62999,
    original_price: 75999,
    rating: 4.8,
    reviews_count: 610,
    stock: 40,
    specs: { soc: 'Google Tensor G3', display: '6.2" Actua OLED 120Hz', camera: '50MP + 12MP Ultra-wide with Magic Eraser', battery: '4575mAh', os: 'Clean Android 15' },
    description: 'The golden standard of computational photography, on-device AI voice transcribing, and pure UI.',
    image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    tags: ['camera', 'clean-android', 'ai']
  },
  {
    name: 'HyperSpeed 12R (Snapdragon 8+ / 16GB RAM)',
    category: 'Smartphones',
    category_id: 'cat-smartphones',
    price: 39999,
    original_price: 44999,
    rating: 4.6,
    reviews_count: 820,
    stock: 90,
    specs: { soc: 'Snapdragon 8 Gen 2', display: '6.74" 120Hz ProXDR', camera: '50MP IMX890', battery: '5500mAh 100W SUPERVOOC', ram: '16GB' },
    description: 'Flagship killer under ₹40,000 for hardcore mobile gamers and power multitaskers.',
    image_url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80',
    tags: ['value-flagship', 'gaming', 'bestseller']
  },
  {
    name: 'NeoLite 5G (Dimensity 7200 / 8GB / 256GB)',
    category: 'Smartphones',
    category_id: 'cat-smartphones',
    price: 21999,
    original_price: 25999,
    rating: 4.4,
    reviews_count: 940,
    stock: 120,
    specs: { soc: 'MediaTek Dimensity 7200 Ultra', display: '6.67" 120Hz AMOLED', camera: '200MP OIS HP3', battery: '5000mAh 67W Turbo', ram: '8GB' },
    description: 'Sensational 200MP camera and curved AMOLED screen at an unbeatable budget pricing.',
    image_url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
    tags: ['budget', 'camera', 'popular']
  },

  // AUDIO & HEADPHONES (18 products)
  {
    name: 'AcousticPure Studio ANC 700 Wireless',
    category: 'Audio',
    category_id: 'cat-audio',
    price: 24999,
    original_price: 29999,
    rating: 4.9,
    reviews_count: 530,
    stock: 50,
    specs: { driver: '40mm Custom Dynamic', anc: 'Dual-chip Hybrid Active Noise Cancelling', battery: '40 Hours (ANC on)', codecs: 'LDAC, AAC, SBC', weight: '250g' },
    description: 'Silences crowded cafes and open-plan offices with studio-level sound precision and multi-point Bluetooth.',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    tags: ['audiophile', 'anc', 'coding-companion']
  },
  {
    name: 'SoundWave AirBuds Pro 3 (Lossless Audio)',
    category: 'Audio',
    category_id: 'cat-audio',
    price: 8999,
    original_price: 11999,
    rating: 4.7,
    reviews_count: 1120,
    stock: 140,
    specs: { driver: '11mm Titanium + 6mm planar tweeter', anc: '49dB Smart ANC', latency: '40ms Game Mode', battery: '38 Hours with Case' },
    description: 'Pocketable spatial audio earbuds with dual drivers and crystal-clear triple mic ENC call quality.',
    image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    tags: ['earbuds', 'anc', 'everyday']
  },
  {
    name: 'DeskBeat Hi-Fi Bluetooth Soundbar with Subwoofer',
    category: 'Audio',
    category_id: 'cat-audio',
    price: 6499,
    original_price: 8999,
    rating: 4.5,
    reviews_count: 310,
    stock: 60,
    specs: { output: '120W Peak Power', connectivity: 'Optical, HDMI ARC, Bluetooth 5.3, AUX', bass: 'Dedicated 5.25" Wired Subwoofer' },
    description: 'Upgrade your desk monitor setup with cinema-grade acoustics and punchy bass for coding playlists and movies.',
    image_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
    tags: ['soundbar', 'desk-setup', 'audio']
  },
  {
    name: 'VoicePro USB Podcasting & Streaming Condenser Mic',
    category: 'Audio',
    category_id: 'cat-audio',
    price: 4999,
    original_price: 6499,
    rating: 4.8,
    reviews_count: 480,
    stock: 75,
    specs: { capsule: '14mm Condenser', polar_pattern: 'Cardioid', sample_rate: '192kHz/24-bit', features: 'Tap-to-mute sensor, Gain dial, RGB indicator' },
    description: 'Zero-latency monitoring USB microphone for developers hosting Zoom meetings, webinars, and gaming streams.',
    image_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80',
    tags: ['mic', 'streaming', 'work-from-home']
  },

  // GAMING GEAR & PERIPHERALS (18 products)
  {
    name: 'TactilePro Apex RGB Mechanical Keyboard (Hot-swap)',
    category: 'Gaming Gear',
    category_id: 'cat-gaming',
    price: 4299,
    original_price: 5999,
    rating: 4.8,
    reviews_count: 730,
    stock: 95,
    specs: { layout: '75% Compact', switches: 'Gateron Yellow Linear (Lubed)', connectivity: 'Tri-Mode: 2.4GHz / BT 5.0 / Type-C', keycaps: 'Double-shot PBT OEM' },
    description: 'Incredible deep "thock" acoustic typing sound tailored for high-speed programmers and FPS gaming.',
    image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    tags: ['mechanical-keyboard', 'coding', 'gaming']
  },
  {
    name: 'PhantomStrike Ultralight Wireless Mouse (49g / 26K DPI)',
    category: 'Gaming Gear',
    category_id: 'cat-gaming',
    price: 3499,
    original_price: 4999,
    rating: 4.7,
    reviews_count: 410,
    stock: 80,
    specs: { sensor: 'PAW3395 26,000 DPI', weight: '49 grams', battery: '80 Hours', polling_rate: '4000Hz supported', switches: 'Optical Huano 80M' },
    description: 'Feather-light ergonomic mouse with lag-free 1ms response and 100% pure PTFE glide feet.',
    image_url: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    tags: ['mouse', 'gaming', 'wireless']
  },
  {
    name: 'AeroCool RGB Gaming Laptop Stand with 6 Turbo Fans',
    category: 'Gaming Gear',
    category_id: 'cat-gaming',
    price: 2499,
    original_price: 3499,
    rating: 4.6,
    reviews_count: 590,
    stock: 110,
    specs: { fans: '6x High-Speed 2400 RPM Silent Fans', compatibility: '13" to 17.3" Laptops', ports: '2x USB 2.0 pass-through', angles: '7 Adjustable Ergonomic Heights' },
    description: 'Lowers CPU/GPU temperatures by up to 14°C during marathon programming builds and 4K gaming.',
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
    tags: ['cooling-pad', 'laptop-stand', 'gaming-accessory']
  },
  {
    name: 'ChronoGrip Wireless Gaming Controller (Hall Effect Sticks)',
    category: 'Gaming Gear',
    category_id: 'cat-gaming',
    price: 2999,
    original_price: 3999,
    rating: 4.7,
    reviews_count: 380,
    stock: 65,
    specs: { joysticks: 'Anti-drift Hall Effect Magnetic', compatibility: 'PC, Android, iOS, Nintendo Switch', vibration: 'Asymmetric Dual Haptic Motors' },
    description: 'Drift-proof magnetic Hall joysticks with ultra-tactile D-pad and programmable rear macro paddles.',
    image_url: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&q=80',
    tags: ['controller', 'gaming', 'pc-accessory']
  },

  // FITNESS & WEARABLES (16 products)
  {
    name: 'TitanPulse Pro Smartwatch (AMOLED / GPS / ECG)',
    category: 'Fitness & Wearables',
    category_id: 'cat-fitness',
    price: 7999,
    original_price: 11999,
    rating: 4.7,
    reviews_count: 670,
    stock: 70,
    specs: { display: '1.43" HD AMOLED 1000 nits', tracking: 'Dual-band GPS, SpO2, Continuous Heart Rate, Stress, Sleep Stage', battery: '12 Days', rating: '5ATM Water Resistant' },
    description: 'Sleek aerospace alloy body with standalone dual GPS tracking and 120+ workout modes.',
    image_url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80',
    tags: ['smartwatch', 'fitness', 'amoled']
  },
  {
    name: 'ActiveBand 8 Fitness Tracker with NFC',
    category: 'Fitness & Wearables',
    category_id: 'cat-fitness',
    price: 2999,
    original_price: 3999,
    rating: 4.5,
    reviews_count: 850,
    stock: 130,
    specs: { display: '1.62" Always-on AMOLED', battery: '16 Days', sensors: '6-axis motion, Optical PPG, SpO2', water: '50m Waterproof' },
    description: 'Featherweight 27g biometric wristband for 24/7 recovery tracking and smart notifications.',
    image_url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80',
    tags: ['band', 'fitness', 'battery-life']
  },

  // ACCESSORIES & ESSENTIALS (20 products)
  {
    name: 'ErgoElevate Aluminum Laptop Stand (Foldable)',
    category: 'Accessories',
    category_id: 'cat-accessories',
    price: 1499,
    original_price: 2299,
    rating: 4.9,
    reviews_count: 1450,
    stock: 220,
    specs: { material: 'Sandblasted CNC Aluminum Alloy', adjustability: '6 Viewing Levels (15° to 45°)', compatibility: 'Supports up to 17" laptops', weight: '260g foldable' },
    description: 'The definitive desk ergonomic accessory. Prevents neck strain and enables 360° airflow under your laptop.',
    image_url: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=800&q=80',
    tags: ['laptop-stand', 'accessory', 'ergonomic', 'cross-sell']
  },
  {
    name: 'VoltCharge 100W GaN 4-Port Fast Desktop Charger',
    category: 'Accessories',
    category_id: 'cat-accessories',
    price: 3299,
    original_price: 4499,
    rating: 4.8,
    reviews_count: 640,
    stock: 90,
    specs: { technology: 'Gallium Nitride (GaN III)', ports: '3x USB-C (100W PD 3.0), 1x USB-A (22.5W QC 4+)', protection: 'Multi-layer Thermal Guard' },
    description: 'Power your laptop, smartphone, tablet, and earbuds simultaneously from a single compact wall plug.',
    image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80',
    tags: ['gan-charger', 'fastcharge', 'accessory']
  },
  {
    name: 'OmniHub 9-in-1 USB-C Docking Station (4K@60Hz)',
    category: 'Accessories',
    category_id: 'cat-accessories',
    price: 2899,
    original_price: 3999,
    rating: 4.7,
    reviews_count: 480,
    stock: 85,
    specs: { ports: '4K HDMI 60Hz, 100W PD in, Gigabit Ethernet, 3x USB 3.2, SD/TF Reader, Audio 3.5mm', cable: 'Braided Nylon Reinforced' },
    description: 'One single USB-C cable connects your laptop to monitor, mouse, keyboard, LAN cable, and charging.',
    image_url: 'https://images.unsplash.com/photo-1622774161048-863b1bd1a38f?w=800&q=80',
    tags: ['docking-station', 'usbc', 'workstation']
  },
  {
    name: 'CyberDesk XXL Water-Resistant Extended Desk Mat (90x40cm)',
    category: 'Accessories',
    category_id: 'cat-accessories',
    price: 899,
    original_price: 1499,
    rating: 4.8,
    reviews_count: 1820,
    stock: 300,
    specs: { dimensions: '900 x 400 x 4 mm', surface: 'Micro-weave Cloth with Hydrophobic Coating', base: 'Non-slip Natural Rubber', edge: 'Anti-fray Stitched Frame' },
    description: 'Premium desk cover providing silky smooth mouse movement and protecting your wooden desk from spills.',
    image_url: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=800&q=80',
    tags: ['desk-mat', 'desk-setup', 'budget-bestseller']
  }
];

// Replicate products programmatically to reach 100+ items across varying tiers
function generateFullCatalog() {
  const fullList = [...productsData];
  const brands = ['Apex', 'Hyper', 'Nova', 'Pulse', 'Zenith', 'Vortex', 'Krypton', 'Quantum'];
  const categories = [
    { cat: 'Laptops', catId: 'cat-laptops', basePrice: 48000, priceRange: 45000 },
    { cat: 'Smartphones', catId: 'cat-smartphones', basePrice: 18000, priceRange: 50000 },
    { cat: 'Audio', catId: 'cat-audio', basePrice: 2500, priceRange: 15000 },
    { cat: 'Gaming Gear', catId: 'cat-gaming', basePrice: 1999, priceRange: 8000 },
    { cat: 'Fitness & Wearables', catId: 'cat-fitness', basePrice: 2499, priceRange: 9000 },
    { cat: 'Accessories', catId: 'cat-accessories', basePrice: 799, priceRange: 3500 }
  ];

  let idCounter = fullList.length + 1;
  for (let i = fullList.length; i < 110; i++) {
    const brand = brands[i % brands.length];
    const catObj = categories[i % categories.length];
    const price = catObj.basePrice + Math.floor((Math.random() * catObj.priceRange) / 100) * 100 + 99;
    const originalPrice = Math.round(price * (1 + (0.15 + Math.random() * 0.2) ) / 100) * 100 - 1;
    const rating = +(4.1 + Math.random() * 0.8).toFixed(1);
    const reviews = Math.floor(50 + Math.random() * 800);

    fullList.push({
      name: `${brand} ${catObj.cat.slice(0, -1)} Prime Gen-${(i % 5) + 1}`,
      category: catObj.cat,
      category_id: catObj.catId,
      price: price,
      original_price: originalPrice,
      rating: rating,
      reviews_count: reviews,
      stock: 20 + Math.floor(Math.random() * 80),
      specs: { tier: 'Premium Commercial', warranty: '1 Year Brand Warranty', modelYear: 2025 },
      description: `Engineered for excellence in ${catObj.cat.toLowerCase()}. High durability with certified Indian safety standards.`,
      image_url: fullList[i % 12].image_url,
      tags: [catObj.cat.toLowerCase().replace(/\s+/g, '-'), brand.toLowerCase()]
    });
  }

  return fullList;
}

// Generate 500+ Customers with RFM profiles & behavioral segments
function generateCustomers() {
  const customers = [];
  const segments = [
    { name: 'High-Value', weight: 0.15, minAOV: 45000, maxAOV: 95000, freqMin: 5, freqMax: 18, recencyMin: 1, recencyMax: 20, discSens: 'Low' },
    { name: 'Loyal', weight: 0.25, minAOV: 22000, maxAOV: 50000, freqMin: 4, freqMax: 12, recencyMin: 5, recencyMax: 35, discSens: 'Medium' },
    { name: 'Regular', weight: 0.35, minAOV: 8000, maxAOV: 25000, freqMin: 1, freqMax: 4, recencyMin: 10, recencyMax: 60, discSens: 'Medium' },
    { name: 'Discount-Sensitive', weight: 0.15, minAOV: 3000, maxAOV: 18000, freqMin: 1, freqMax: 5, recencyMin: 15, recencyMax: 70, discSens: 'High' },
    { name: 'At-Risk', weight: 0.10, minAOV: 12000, maxAOV: 40000, freqMin: 1, freqMax: 3, recencyMin: 65, recencyMax: 150, discSens: 'High' }
  ];

  for (let i = 1; i <= 520; i++) {
    const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
    const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${fn} ${ln}`;
    const email = `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.in`;
    const phone = `+91 98${Math.floor(10000000 + Math.random() * 89999999)}`;

    // Select segment based on distribution weights
    const rand = Math.random();
    let cumulative = 0;
    let selectedSegment = segments[2];
    for (const seg of segments) {
      cumulative += seg.weight;
      if (rand <= cumulative) {
        selectedSegment = seg;
        break;
      }
    }

    const frequency = Math.floor(selectedSegment.freqMin + Math.random() * (selectedSegment.freqMax - selectedSegment.freqMin + 1));
    const aov = Math.round(selectedSegment.minAOV + Math.random() * (selectedSegment.maxAOV - selectedSegment.minAOV));
    const monetary = Math.round(aov * frequency);
    const recency = Math.floor(selectedSegment.recencyMin + Math.random() * (selectedSegment.recencyMax - selectedSegment.recencyMin));
    const clv = Math.round(monetary * (1.2 + Math.random() * 0.8));

    const preferredCategories = ['Laptops', 'Smartphones', 'Audio', 'Gaming Gear', 'Accessories'];
    const preferredPaymentMethods = ['UPI', 'Credit Card', 'Debit Card', 'Netbanking'];

    customers.push({
      id: `cust_${String(i).padStart(4, '0')}`,
      name,
      email,
      phone,
      rfm_recency: recency,
      rfm_frequency: frequency,
      rfm_monetary: monetary,
      aov: aov,
      clv: clv,
      segment: selectedSegment.name,
      discount_sensitivity: selectedSegment.discSens,
      preferred_category: preferredCategories[i % preferredCategories.length],
      preferred_payment_method: preferredPaymentMethods[i % preferredPaymentMethods.length]
    });
  }

  return customers;
}

// Generate 2,000+ Orders, Transactions, Payments, Recovery Records, and Events
function generateTransactions(customers, products) {
  const orders = [];
  const orderItems = [];
  const transactions = [];
  const payments = [];
  const recoveries = [];
  const customerEvents = [];

  const paymentMethods = ['UPI', 'Credit Card', 'Debit Card', 'Netbanking'];
  const failureReasons = [
    'Bank server timeout on UPI switch',
    'Card declined: 3D Secure OTP verification failed',
    'Insufficient funds in bank account',
    'Daily UPI transaction limit exceeded'
  ];

  let orderCount = 0;
  const now = Date.now();
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < 2100; i++) {
    orderCount++;
    const cust = customers[Math.floor(Math.random() * customers.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const qty = Math.random() > 0.85 ? 2 : 1;
    const subtotal = Number(product.price) * qty;

    // Apply 5% or 10% discount occasionally
    const hasDiscount = Math.random() < 0.25;
    const discountAmount = hasDiscount ? Math.round(subtotal * 0.08) : 0;
    const totalAmount = subtotal - discountAmount;

    // Generate random timestamp over past 90 days
    const createdMs = now - Math.floor(Math.random() * ninetyDaysMs);
    const createdIso = new Date(createdMs).toISOString();

    const orderId = `ord_${String(orderCount).padStart(5, '0')}`;
    const txnId = `txn_${String(orderCount).padStart(5, '0')}`;
    const payId = `pay_${String(orderCount).padStart(5, '0')}`;
    const razorpayOrderId = `order_rp_${Math.random().toString(36).substring(2, 10)}`;
    const razorpayPaymentId = `pay_rp_${Math.random().toString(36).substring(2, 12)}`;

    // Failure rate ~12%
    const isPaymentFailure = Math.random() < 0.12;
    // Recovery rate for failed payments ~65%
    const isRecovered = isPaymentFailure && Math.random() < 0.65;

    let orderStatus = 'paid';
    let txnStatus = 'captured';
    let paymentStatus = 'success';
    let failReason = null;

    if (isPaymentFailure) {
      if (isRecovered) {
        orderStatus = 'recovered';
        txnStatus = 'captured';
        paymentStatus = 'recovered';
      } else {
        orderStatus = 'failed';
        txnStatus = 'failed';
        paymentStatus = 'failed';
        failReason = failureReasons[Math.floor(Math.random() * failureReasons.length)];
      }
    }

    orders.push({
      id: orderId,
      customer_id: cust.id,
      subtotal_amount: subtotal,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      applied_coupon: hasDiscount ? 'SAVE8' : null,
      status: orderStatus,
      shipping_address: JSON.stringify({
        city: ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Hyderabad', 'Pune', 'Chennai'][orderCount % 6],
        state: 'India',
        postal_code: `5600${(orderCount % 90) + 10}`
      }),
      created_at: createdIso
    });

    orderItems.push({
      id: `item_${orderId}_1`,
      order_id: orderId,
      product_id: product.id,
      quantity: qty,
      unit_price: product.price,
      total_price: subtotal
    });

    transactions.push({
      id: txnId,
      order_id: orderId,
      customer_id: cust.id,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: `sig_${Math.random().toString(36).substring(2, 14)}`,
      amount: totalAmount,
      currency: 'INR',
      status: txnStatus,
      payment_method: cust.preferred_payment_method || 'UPI',
      failure_reason: failReason,
      created_at: createdIso
    });

    payments.push({
      id: payId,
      payment_id: payId,
      order_id: orderId,
      customer_id: cust.id,
      razorpay_payment_id: razorpayPaymentId,
      amount: totalAmount,
      status: paymentStatus,
      payment_method: cust.preferred_payment_method || 'UPI',
      created_at: createdIso
    });

    // If failure happened, record in payment_recovery table
    if (isPaymentFailure) {
      recoveries.push({
        id: `rec_${orderId}`,
        order_id: orderId,
        customer_id: cust.id,
        amount: totalAmount,
        failure_reason: failReason || 'Initial attempt failed',
        recovery_strategy: 'AI Nudge with Alternate Payment Method (UPI Auto-Switch)',
        recovery_status: isRecovered ? 'recovered' : 'pending',
        recovery_action_note: isRecovered 
          ? 'Customer responded to AI WhatsApp/SMS prompt and successfully paid via Netbanking.'
          : 'Pending customer retry prompt.',
        recovered_at: isRecovered ? new Date(createdMs + 15 * 60 * 1000).toISOString() : null,
        created_at: createdIso
      });
    }

    // Customer events for behavioral telemetry
    customerEvents.push({
      id: `evt_${orderCount}_view`,
      customer_id: cust.id,
      session_id: `sess_${cust.id}_${orderCount}`,
      event_type: 'product_view',
      payload: JSON.stringify({ product_id: product.id, price: product.price }),
      created_at: new Date(createdMs - 120000).toISOString()
    });

    customerEvents.push({
      id: `evt_${orderCount}_cart`,
      customer_id: cust.id,
      session_id: `sess_${cust.id}_${orderCount}`,
      event_type: 'cart_added',
      payload: JSON.stringify({ product_id: product.id, quantity: qty }),
      created_at: new Date(createdMs - 60000).toISOString()
    });

    customerEvents.push({
      id: `evt_${orderCount}_pay`,
      customer_id: cust.id,
      session_id: `sess_${cust.id}_${orderCount}`,
      event_type: isPaymentFailure ? 'payment_failed' : 'payment_success',
      payload: JSON.stringify({ order_id: orderId, amount: totalAmount }),
      created_at: createdIso
    });
  }

  return { orders, orderItems, transactions, payments, recoveries, customerEvents };
}

async function seedDatabase() {
  console.log('🚀 Initializing ShopPilot AI Database Seeding...');

  // 1. Create Default Users (Customer, Merchant, Admin)
  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('password123', salt);

  const defaultUsers = [
    { id: 'usr_customer', name: 'Rohan Sharma', email: 'customer@shoppilot.ai', role: 'customer' },
    { id: 'usr_merchant', name: 'Vikram Malhotra', email: 'merchant@shoppilot.ai', role: 'merchant' },
    { id: 'usr_admin', name: 'System Admin', email: 'admin@shoppilot.ai', role: 'admin' }
  ];

  for (const u of defaultUsers) {
    await db.query(
      `INSERT OR REPLACE INTO users (id, name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5)`,
      [u.id, u.name, u.email, defaultPassword, u.role]
    );
  }

  // Merchant Storefront
  await db.query(
    `INSERT OR REPLACE INTO merchants (id, user_id, store_name, store_currency) VALUES ($1, $2, $3, $4)`,
    ['merch_001', 'usr_merchant', 'ShopPilot Electronics & Tech Flagship', 'INR']
  );

  // 2. Categories
  for (const cat of categoriesData) {
    await db.query(
      `INSERT OR REPLACE INTO categories (id, name, slug, description, icon) VALUES ($1, $2, $3, $4, $5)`,
      [cat.id, cat.name, cat.slug, cat.description, cat.icon]
    );
  }
  console.log(`✅ Seeded ${categoriesData.length} categories.`);

  // 3. 100+ Products
  const catalog = generateFullCatalog();
  for (let i = 0; i < catalog.length; i++) {
    const p = catalog[i];
    const pid = `prod_${String(i + 1).padStart(4, '0')}`;
    p.id = pid;
    const slug = `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i + 1}`;

    await db.query(
      `INSERT OR REPLACE INTO products (
        id, category_id, category, name, slug, description, price, original_price, rating, reviews_count, stock, specs, image_url, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        pid,
        p.category_id,
        p.category,
        p.name,
        slug,
        p.description,
        p.price,
        p.original_price,
        p.rating,
        p.reviews_count,
        p.stock,
        JSON.stringify(p.specs),
        p.image_url,
        JSON.stringify(p.tags)
      ]
    );
  }
  console.log(`✅ Seeded ${catalog.length} high-spec tech products.`);

  // 4. 500+ Customers
  const customers = generateCustomers();
  for (const c of customers) {
    await db.query(
      `INSERT OR REPLACE INTO customers (
        id, name, email, phone, rfm_recency, rfm_frequency, rfm_monetary, aov, clv, segment, discount_sensitivity, preferred_category, preferred_payment_method
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        c.id, c.name, c.email, c.phone, c.rfm_recency, c.rfm_frequency, c.rfm_monetary,
        c.aov, c.clv, c.segment, c.discount_sensitivity, c.preferred_category, c.preferred_payment_method
      ]
    );
  }
  console.log(`✅ Seeded ${customers.length} realistic customer intelligence profiles.`);

  // 5. 2,000+ Orders & Transactions
  const { orders, orderItems, transactions, payments, recoveries, customerEvents } = generateTransactions(customers, catalog);

  console.log(`⏳ Inserting ${orders.length} orders and financial ledger rows...`);

  // Batch insert in transactions chunks
  for (const o of orders) {
    await db.query(
      `INSERT OR REPLACE INTO orders (id, customer_id, total_amount, subtotal_amount, discount_amount, applied_coupon, status, shipping_address, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [o.id, o.customer_id, o.total_amount, o.subtotal_amount, o.discount_amount, o.applied_coupon, o.status, o.shipping_address, o.created_at]
    );
  }

  for (const item of orderItems) {
    await db.query(
      `INSERT OR REPLACE INTO order_items (id, order_id, product_id, quantity, unit_price, total_price)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [item.id, item.order_id, item.product_id, item.quantity, item.unit_price, item.total_price]
    );
  }

  for (const t of transactions) {
    await db.query(
      `INSERT OR REPLACE INTO transactions (id, order_id, customer_id, razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, currency, status, payment_method, failure_reason, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [t.id, t.order_id, t.customer_id, t.razorpay_order_id, t.razorpay_payment_id, t.razorpay_signature, t.amount, t.currency, t.status, t.payment_method, t.failure_reason, t.created_at]
    );
  }

  for (const p of payments) {
    await db.query(
      `INSERT OR REPLACE INTO payments (id, payment_id, order_id, customer_id, razorpay_payment_id, amount, status, payment_method, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [p.id, p.payment_id, p.order_id, p.customer_id, p.razorpay_payment_id, p.amount, p.status, p.payment_method, p.created_at]
    );
  }

  for (const r of recoveries) {
    await db.query(
      `INSERT OR REPLACE INTO payment_recovery (id, order_id, customer_id, amount, failure_reason, recovery_strategy, recovery_status, recovery_action_note, recovered_at, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [r.id, r.order_id, r.customer_id, r.amount, r.failure_reason, r.recovery_strategy, r.recovery_status, r.recovery_action_note, r.recovered_at, r.created_at]
    );
  }

  // Insert a sample set of behavioral events
  for (let i = 0; i < Math.min(customerEvents.length, 1500); i++) {
    const e = customerEvents[i];
    await db.query(
      `INSERT OR REPLACE INTO customer_events (id, customer_id, session_id, event_type, payload, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [e.id, e.customer_id, e.session_id, e.event_type, e.payload, e.created_at]
    );
  }
  console.log(`✅ Seeded ${orders.length} orders, ${recoveries.length} payment recoveries, and behavioral event streams.`);

  // 6. Customer Segments Definition
  const segmentsMeta = [
    { name: 'High-Value', desc: 'Top 15% revenue contributors with high AOV and repeat rate', count: 78, aov: 68500, rev: 5343000 },
    { name: 'Loyal', desc: 'Frequent buyers with consistent purchase history and low return rate', count: 130, aov: 36200, rev: 4706000 },
    { name: 'Regular', desc: 'Standard customers purchasing every 1-2 months', count: 182, aov: 16800, rev: 3057600 },
    { name: 'Discount-Sensitive', desc: 'Shoppers who exclusively convert with offers and coupons', count: 78, aov: 9400, rev: 733200 },
    { name: 'At-Risk', desc: 'Previously active customers inactive for >60 days', count: 52, aov: 24500, rev: 1274000 }
  ];

  for (const s of segmentsMeta) {
    await db.query(
      `INSERT OR REPLACE INTO customer_segments (id, segment_name, description, customer_count, avg_aov, total_revenue)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [`seg_${s.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`, s.name, s.desc, s.count, s.aov, s.rev]
    );
  }

  // 7. A/B Experiments
  await db.query(
    `INSERT OR REPLACE INTO experiments (id, name, description, strategy_a_name, strategy_b_name, strategy_c_name, status, winner_variant)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      'exp_001',
      'Q3 Checkout Incentive Optimization',
      'Testing flat discount vs free express delivery vs AI personalized accessory bundle',
      'Strategy A: 10% Flat Discount',
      'Strategy B: Free Express Shipping',
      'Strategy C: AI Personalized Accessory Bundle',
      'active',
      'C'
    ]
  );

  // Experiment Events
  const variants = ['A', 'B', 'C'];
  for (let i = 0; i < 300; i++) {
    const v = variants[i % 3];
    const isConv = v === 'C' ? Math.random() < 0.28 : v === 'A' ? Math.random() < 0.18 : Math.random() < 0.14;
    await db.query(
      `INSERT OR REPLACE INTO experiment_events (id, experiment_id, variant, event_type, revenue)
       VALUES ($1, $2, $3, $4, $5)`,
      [`expevt_${i + 1}`, 'exp_001', v, isConv ? 'conversion' : 'impression', isConv ? (v === 'C' ? 68999 : 54999) : 0]
    );
  }

  // 8. AI Actions for Merchant Approval (Human-in-the-Loop)
  const aiActions = [
    {
      id: 'act_001',
      agent_name: 'Payment Recovery Agent',
      action_type: 'LAUNCH_RECOVERY_CAMPAIGN',
      title: 'Target 24 Failed UPI Transactions with Auto-Switch Link',
      description: 'Send high-intent recovery SMS/WhatsApp to 24 customers whose UPI timed out in last 24 hours.',
      payload: JSON.stringify({ eligible_customers: 24, channel: 'WHATSAPP_SMS', discount_offer_pct: 0 }),
      expected_impact: 'Recover ~₹1,84,000 in lost revenue with 0% discount margin erosion.',
      confidence: 88,
      status: 'PENDING'
    },
    {
      id: 'act_002',
      agent_name: 'Growth Opportunity Agent',
      action_type: 'ACTIVATE_PRODUCT_BUNDLE',
      title: 'Activate Laptop + Stand 8% Co-Buy Incentive',
      description: 'Automatically recommend ErgoElevate Aluminum Stand when customer adds ZenithBook or AeroCode laptop.',
      payload: JSON.stringify({ primary_category: 'Laptops', cross_sell_product_id: 'prod_0017', incentive_pct: 8 }),
      expected_impact: 'Increase Average Order Value (AOV) by +₹1,499 across 40+ projected weekly orders.',
      confidence: 84,
      status: 'PENDING'
    }
  ];

  for (const act of aiActions) {
    await db.query(
      `INSERT OR REPLACE INTO ai_actions (id, agent_name, action_type, title, description, payload, expected_impact, confidence, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [act.id, act.agent_name, act.action_type, act.title, act.description, act.payload, act.expected_impact, act.confidence, act.status]
    );
  }

  // 9. Knowledge Documents for RAG
  const knowledgeDocs = [
    {
      id: 'kb_001',
      title: 'ShopPilot 15-Day Return & Replacement Policy',
      category: 'return_policy',
      content: 'Customers can initiate a full return or replacement within 15 days of delivery for laptops and tech accessories. Items must be in original condition with box and serial number intact. Reverse pickup is free across 19,000+ Indian pincodes.'
    },
    {
      id: 'kb_002',
      title: 'Pan-India Express Shipping & Delivery Timelines',
      category: 'shipping_policy',
      content: 'Standard delivery takes 2-4 business days. Same-day express dispatch is available for metro regions (Bengaluru, Mumbai, Delhi NCR, Hyderabad, Pune). Orders above ₹999 qualify for free shipping.'
    },
    {
      id: 'kb_003',
      title: 'Official Warranty & On-site Service Terms',
      category: 'warranty',
      content: 'All laptops come with 1-Year Comprehensive Brand Warranty including on-site technician visit within 24 hours. Extended 2-Year ShopPilot Care is available at checkout.'
    },
    {
      id: 'kb_004',
      title: 'Payment Failure Protocol & Instant Auto-Refund',
      category: 'payments',
      content: 'If an amount is debited from your bank during a failed transaction, our automated Razorpay webhook triggers an instant reversal. UPI debits are credited back within 2 hours, card debits within 2-3 business days.'
    }
  ];

  for (const kb of knowledgeDocs) {
    await db.query(
      `INSERT OR REPLACE INTO knowledge_documents (id, title, category, content) VALUES ($1, $2, $3, $4)`,
      [kb.id, kb.title, kb.category, kb.content]
    );
  }

  console.log('✨ All seed data successfully inserted into ShopPilot database!');
}

seedDatabase()
  .then(() => {
    console.log('🎉 Database seeding complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Database seeding failed:', err);
    process.exit(1);
  });
