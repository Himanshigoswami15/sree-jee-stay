/**
 * Pre-configured Industry Review Keyword Templates
 * Allows any business type (Hotel, Restaurant, Clinic, Salon, Gym, Cafe) to set up
 * industry-tailored keywords with 1-click.
 */

export const INDUSTRY_TEMPLATES = {
  hotel: {
    name: 'Hotel & Lodging',
    icon: '🏨',
    keywords: [
      { id: 'clean', label: '✨ Spotless Rooms', category: 'Cleanliness', snippet: 'The room was impeccably clean, fresh, and spotless' },
      { id: 'staff', label: '😊 Friendly Staff', category: 'Service', snippet: 'The staff were warm, polite, and exceptionally accommodating' },
      { id: 'wifi', label: '⚡ Fast Wi-Fi', category: 'Amenities', snippet: 'The Wi-Fi connection was ultra-fast and reliable throughout' },
      { id: 'location', label: '📍 Great Location', category: 'General', snippet: 'The location was ideal, peaceful, and super convenient' },
      { id: 'bed', label: '🛏️ Comfortable Beds', category: 'Comfort', snippet: 'The beds were super comfortable with fresh, cozy linens' },
      { id: 'breakfast', label: '🍳 Superb Breakfast', category: 'Dining', snippet: 'Breakfast was fresh, delicious, and offered great variety' },
      { id: 'peaceful', label: '🌿 Peaceful Stay', category: 'Comfort', snippet: 'Enjoyed a quiet, serene, and deeply restful environment' },
      { id: 'value', label: '💰 Value for Money', category: 'General', snippet: 'Great service and excellent value for money' },
    ]
  },

  restaurant: {
    name: 'Restaurant & Dining',
    icon: '🍽️',
    keywords: [
      { id: 'food', label: '🍕 Delicious Food', category: 'Dining', snippet: 'The food was mouth-watering, full of flavor, and served fresh' },
      { id: 'staff', label: '😊 Friendly Staff', category: 'Service', snippet: 'The waitstaff were friendly, attentive, and welcoming' },
      { id: 'ambience', label: '🕯️ Cozy Ambience', category: 'General', snippet: 'The restaurant had a warm, cozy, and charming atmosphere' },
      { id: 'clean', label: '✨ Sparkling Clean', category: 'Cleanliness', snippet: 'Dining area and tables were spotless and very well maintained' },
      { id: 'speed', label: '⚡ Fast Service', category: 'Service', snippet: 'Orders were served promptly with excellent efficiency' },
      { id: 'drinks', label: '🍸 Craft Drinks', category: 'Dining', snippet: 'The beverage selection and drinks were fantastic' },
      { id: 'desserts', label: '🍰 Great Desserts', category: 'Dining', snippet: 'Desserts were freshly made, delicious, and beautifully presented' },
      { id: 'value', label: '💰 Great Value', category: 'General', snippet: 'Generous portion sizes and great value for money' },
    ]
  },

  clinic: {
    name: 'Clinic & Healthcare',
    icon: '🩺',
    keywords: [
      { id: 'doctor', label: '🩺 Expert Doctor', category: 'Service', snippet: 'The doctor was highly knowledgeable, patient, and compassionate' },
      { id: 'staff', label: '😊 Friendly Staff', category: 'Service', snippet: 'The clinic reception and staff were extremely polite and helpful' },
      { id: 'clean', label: '✨ Clean & Hygienic', category: 'Cleanliness', snippet: 'The clinic maintained immaculate cleanliness and high hygiene standards' },
      { id: 'wait', label: '⏱️ Short Wait Time', category: 'Service', snippet: 'The appointment was right on time with minimal waiting' },
      { id: 'comfort', label: '💆 Pain-Free Care', category: 'Comfort', snippet: 'The treatment procedure was smooth, gentle, and pain-free' },
      { id: 'guidance', label: '📋 Clear Guidance', category: 'Service', snippet: 'All medical guidance and instructions were explained clearly' },
      { id: 'facility', label: '🏥 Modern Facility', category: 'Amenities', snippet: 'Equipped with modern, state-of-the-art medical technology' },
      { id: 'care', label: '❤️ Caring Service', category: 'Service', snippet: 'Felt genuinely cared for and supported throughout the visit' },
    ]
  },

  salon: {
    name: 'Salon & Spa',
    icon: '✂️',
    keywords: [
      { id: 'styling', label: '✂️ Expert Styling', category: 'Service', snippet: 'The haircut and styling were executed with precision and flair' },
      { id: 'staff', label: '😊 Friendly Staff', category: 'Service', snippet: 'The stylists and staff were welcoming, courteous, and skilled' },
      { id: 'clean', label: '✨ Spotless Salon', category: 'Cleanliness', snippet: 'The salon environment was spotless, elegant, and hygienic' },
      { id: 'pricing', label: '💰 Fair Pricing', category: 'General', snippet: 'Top-quality styling services at very reasonable rates' },
      { id: 'vibe', label: '🌿 Relaxing Vibe', category: 'Comfort', snippet: 'The ambiance was relaxing, soothing, and pampering' },
      { id: 'products', label: '✨ Premium Products', category: 'Amenities', snippet: 'Used high-quality, gentle beauty and hair products' },
      { id: 'detail', label: '💅 Neat Work', category: 'Service', snippet: 'Attention to detail was impressive from start to finish' },
      { id: 'timely', label: '⏱️ Timely Service', category: 'Service', snippet: 'Started right on appointment time with zero hassle' },
    ]
  },

  gym: {
    name: 'Gym & Fitness',
    icon: '🏋️',
    keywords: [
      { id: 'equipment', label: '🏋️ Modern Equipment', category: 'Amenities', snippet: 'The gym is equipped with top-of-the-line, clean machines' },
      { id: 'trainers', label: '💪 Expert Trainers', category: 'Service', snippet: 'The personal trainers are encouraging, knowledgeable, and supportive' },
      { id: 'clean', label: '✨ Clean Gym Area', category: 'Cleanliness', snippet: 'Locker rooms and workout areas are kept spotlessly clean' },
      { id: 'pricing', label: '💰 Fair Membership', category: 'General', snippet: 'Great membership plans offering solid value for fitness lovers' },
      { id: 'community', label: '🤝 Great Community', category: 'General', snippet: 'Welcoming atmosphere with a friendly and motivating community' },
      { id: 'space', label: '🏃 Spacious Layout', category: 'Comfort', snippet: 'Plenty of space and equipment availability even during peak hours' },
      { id: 'energy', label: '⚡ High Energy', category: 'General', snippet: 'Great music and motivating workout environment' },
      { id: 'showers', label: '🚿 Fresh Showers', category: 'Amenities', snippet: 'Clean, fresh shower and changing facilities' },
    ]
  },

  cafe: {
    name: 'Café & Bakery',
    icon: '☕',
    keywords: [
      { id: 'coffee', label: '☕ Great Coffee', category: 'Dining', snippet: 'The coffee was rich, aromatic, and expertly handcrafted' },
      { id: 'pastries', label: '🥐 Fresh Pastries', category: 'Dining', snippet: 'Pastries and bakery treats were baked fresh and delicious' },
      { id: 'ambience', label: '🌿 Cozy Atmosphere', category: 'General', snippet: 'A wonderfully cozy, aesthetic spot to relax or chat' },
      { id: 'baristas', label: '😊 Friendly Baristas', category: 'Service', snippet: 'The baristas were warm, smiling, and quick with orders' },
      { id: 'wifi', label: '⚡ Fast Wi-Fi', category: 'Amenities', snippet: 'Reliable, high-speed Wi-Fi perfect for remote laptop work' },
      { id: 'music', label: '🎵 Nice Music', category: 'General', snippet: 'Pleasant background music creating a great relaxing vibe' },
      { id: 'work', label: '💼 Good Work Spot', category: 'Comfort', snippet: 'Comfortable seating with power outlets for working' },
      { id: 'treats', label: '🍰 Delicious Treats', category: 'Dining', snippet: 'Scrumptious snacks and beverages served with care' },
    ]
  },

  marketing: {
    name: 'Marketing Agency',
    icon: '🚀',
    keywords: [
      { id: 'leads', label: '🎯 High-Quality Leads', category: 'Lead Generation', snippet: 'Delivered steady, high-converting leads that grew our business' },
      { id: 'seo', label: '🚀 Top SEO Rankings', category: 'SEO', snippet: 'Boosted our Google search rankings and organic traffic significantly' },
      { id: 'google_ads', label: '📈 Profitable Google Ads', category: 'Google Ads', snippet: 'Managed Google Ads campaigns with outstanding ROI and lower cost per click' },
      { id: 'meta_ads', label: '📱 High ROAS Meta Ads', category: 'Meta Ads', snippet: 'Created high-converting Meta and Instagram ad campaigns with great ROAS' },
      { id: 'strategy', label: '💡 Smart Growth Strategy', category: 'Strategy', snippet: 'Formulated a customized, data-driven marketing strategy tailored to our goals' },
      { id: 'results', label: '📊 Proven ROI & Results', category: 'Results', snippet: 'Delivered measurable results, clear monthly reports, and exceptional ROI' },
      { id: 'communication', label: '💬 Clear Communication', category: 'Communication', snippet: 'Maintained transparent, prompt, and proactive communication at every step' },
      { id: 'account_mgmt', label: '🤝 Dedicated Account Mgr', category: 'Account Management', snippet: 'Our dedicated account manager was incredibly supportive, knowledgeable, and responsive' },
      { id: 'gbp', label: '📍 Local GBP Optimization', category: 'Google Business Profile (GBP)', snippet: 'Optimized our Google Business Profile and local search visibility effortlessly' },
      { id: 'branding', label: '🎨 Creative Content & Design', category: 'Branding', snippet: 'Produced stunning graphic designs, engaging content, and strong brand positioning' },
    ]
  },

  packers: {
    name: 'Packers & Movers',
    icon: '🚚',
    keywords: [
      { id: 'safe_packing', label: '📦 Safe & Secure Packing', category: 'Service', snippet: 'All items and fragile goods were packed safely with high-quality bubble wrap and care' },
      { id: 'timely_delivery', label: '⏱️ On-Time Delivery', category: 'Timeline', snippet: 'The moving team arrived promptly and delivered all goods on time without delays' },
      { id: 'careful_handling', label: '🛡️ Zero Damage Handling', category: 'Service', snippet: 'Handled our furniture, electronics, and valuables with extreme care and zero damage' },
      { id: 'prof_team', label: '💪 Professional & Polite Team', category: 'Customer Support', snippet: 'The packing and loading staff were professional, polite, hardworking, and efficient' },
      { id: 'fair_pricing', label: '💰 Transparent & Fair Pricing', category: 'Pricing', snippet: 'Offered clear, transparent pricing with no hidden charges or unexpected fees' },
      { id: 'smooth_relocation', label: '🚚 Hassle-Free Relocation', category: 'Performance', snippet: 'Made our home/office relocation completely smooth, seamless, and stress-free' },
      { id: 'loading_unloading', label: '🏗️ Quick Loading & Unloading', category: 'Service', snippet: 'Loading, transport, and unloading were carried out swiftly and systematically' },
      { id: 'vehicle_transport', label: '🚗 Safe Vehicle Transport', category: 'Service', snippet: 'Our car/bike was transported safely and delivered in perfect condition' },
    ]
  },

  packages: {
    name: 'Tour & Travel Packages',
    icon: '✈️',
    keywords: [
      { id: 'itinerary', label: '🗺️ Well-Planned Itinerary', category: 'Planning', snippet: 'The tour itinerary was exceptionally well-planned, flexible, and executed without a glitch' },
      { id: 'guide', label: '👨‍🌾 Knowledgeable Tour Guide', category: 'Service', snippet: 'Our tour guide was warm, knowledgeable, and made every sightseeing stop super engaging' },
      { id: 'sightseeing', label: '🏔️ Great Sightseeing', category: 'Experience', snippet: 'We covered all the top attractions and hidden gems comfortably without feeling rushed' },
      { id: 'transfers', label: '🚗 Smooth Package Transfers', category: 'Transport', snippet: 'All pickup, drop, and intercity transfers were prompt, comfortable, and well-coordinated' },
      { id: 'hotels', label: '🏨 Excellent Hotel Stays', category: 'Accommodation', snippet: 'The hotel accommodations included in the package were clean, comfortable, and top-tier' },
      { id: 'customization', label: '🛠️ Tailored & Flexible', category: 'Service', snippet: 'They customized the package itinerary according to our preferences effortlessly' },
      { id: 'support', label: '📞 24/7 Travel Support', category: 'Customer Support', snippet: 'The travel support team kept in touch throughout the trip and resolved questions instantly' },
      { id: 'value', label: '💰 Value for Money Package', category: 'General', snippet: 'Offered an amazing holiday package with premium arrangements at a very fair price' },
    ]
  },

  transfers: {
    name: 'Airport Transfers & Cab Services',
    icon: '🚗',
    keywords: [
      { id: 'punctual', label: '⏱️ Always Punctual', category: 'Punctuality', snippet: 'The driver arrived right on time for pickup, ensuring we never missed a moment' },
      { id: 'driver', label: '👨‍✈️ Professional & Safe Driver', category: 'Service', snippet: 'Our driver was courteous, professional, and drove safely and comfortably throughout' },
      { id: 'clean_cab', label: '✨ Clean & Sanitized Cab', category: 'Vehicle', snippet: 'The cab was sparkling clean, smelling fresh, and equipped with cold AC' },
      { id: 'smooth_ride', label: '🛣️ Smooth & Stress-Free Ride', category: 'Comfort', snippet: 'The ride was smooth, quiet, and completely stress-free from pickup to destination' },
      { id: 'luggage', label: '🧳 Helpful Luggage Care', category: 'Service', snippet: 'The driver happily assisted with loading and unloading all our heavy luggage' },
      { id: 'airport_pickup', label: '✈️ Seamless Airport Drop/Pickup', category: 'Transfer', snippet: 'Made our airport transfer smooth with seamless door-to-door drop service' },
      { id: 'fair_fare', label: '💰 Transparent & Fair Fare', category: 'Pricing', snippet: 'Clear transparent pricing with zero surprise charges or hidden fees' },
      { id: 'navigation', label: '📍 Smart Route Navigation', category: 'Service', snippet: 'Knew the best routes to bypass heavy traffic and get us there efficiently' },
    ]
  },

  unique_stay: {
    name: 'Villas, Homestays & Unique Properties',
    icon: '🏡',
    keywords: [
      { id: 'vibe', label: '🏡 Stunning Property Vibe', category: 'Ambiance', snippet: 'The property had a gorgeous aesthetic, unique architecture, and charming vibe' },
      { id: 'views', label: '🌄 Breathtaking Views', category: 'Location', snippet: 'Enjoyed scenic panoramic views from the property terrace and balcony' },
      { id: 'host', label: '🤝 Warm & Hospitable Host', category: 'Service', snippet: 'The host was extremely welcoming, responsive, and attentive to every detail' },
      { id: 'privacy', label: '🔒 Peaceful Peace & Privacy', category: 'Comfort', snippet: 'Offered complete quietness, deep peace, and total privacy for our group' },
      { id: 'private_pool', label: '🏊 Private Pool & Lawn', category: 'Amenities', snippet: 'The private pool area and lush green lawn were impeccably maintained' },
      { id: 'cleanliness', label: '✨ Spotless Cleanliness', category: 'Cleanliness', snippet: 'The entire property was spotless, fresh, and disinfected before our arrival' },
      { id: 'spacious', label: '🛋️ Luxurious Living Spaces', category: 'Comfort', snippet: 'Rooms and common lounge areas were spacious, cozy, and beautifully decorated' },
      { id: 'kitchen_food', label: '🍳 Great Kitchen & Home Food', category: 'Dining', snippet: 'The fully equipped kitchen and fresh home-cooked meals were fantastic' },
    ]
  },

  tours_travels: {
    name: 'Tours & Travel Agency',
    icon: '🧳',
    keywords: [
      { id: 'booking', label: '🎫 Easy Booking Process', category: 'Service', snippet: 'Ticket and tour booking was seamless and handled professionally' },
      { id: 'guidance', label: '📋 Expert Travel Advice', category: 'Service', snippet: 'Provided expert travel guidance and insider tips for our destination' },
      { id: 'packages', label: '✈️ Custom Tour Packages', category: 'Planning', snippet: 'Curated a tailored holiday package matching our budget and dates' },
      { id: 'transfers', label: '🚘 Reliable Transport', category: 'Transport', snippet: 'Arranged reliable cab transport and transfers everywhere' },
      { id: 'hotels', label: '🏨 Quality Hotel Selection', category: 'Accommodation', snippet: 'Booked top-rated hotels with great locations for our trip' },
      { id: 'support', label: '📞 Prompt Assistance', category: 'Support', snippet: 'Team was available around the clock to help during our journey' },
      { id: 'pricing', label: '💰 Honest Pricing', category: 'Pricing', snippet: 'Offered competitive rates with complete clarity on inclusions' },
      { id: 'experience', label: '🌟 Unforgettable Experience', category: 'General', snippet: 'Made our vacation memorable and hassle-free from start to end' },
    ]
  },

  real_estate: {
    name: 'Real Estate & Property Consultant',
    icon: '🏢',
    keywords: [
      { id: 'agent', label: '🤝 Professional Agent', category: 'Service', snippet: 'The property consultant was honest, professional, and knowledgeable' },
      { id: 'options', label: '🏡 Top Property Listings', category: 'Properties', snippet: 'Showed us premium verified properties matching our exact budget' },
      { id: 'paperwork', label: '📄 Smooth Documentation', category: 'Legal', snippet: 'Handled all legal paperwork and registry agreements smoothly' },
      { id: 'transparency', label: '🔍 Clear Transparency', category: 'Trust', snippet: 'Completely transparent about property pricing, specs, and title' },
      { id: 'location_advice', label: '📍 Location Guidance', category: 'Advice', snippet: 'Gave insightful advice about location growth, ROI, and connectivity' },
      { id: 'negotiation', label: '💰 Best Deal Negotiated', category: 'Value', snippet: 'Helped negotiate a great deal and saved us money' },
      { id: 'timely', label: '⏱️ Prompt Support', category: 'Service', snippet: 'Organized site visits promptly and answered every query' },
      { id: 'trust', label: '🛡️ Highly Trustworthy', category: 'Trust', snippet: 'A reliable real estate consultant you can trust completely' },
    ]
  },

  car_rental: {
    name: 'Car & Bike Rentals',
    icon: '🔑',
    keywords: [
      { id: 'vehicle_cond', label: '🚗 Well-Maintained Vehicle', category: 'Vehicle', snippet: 'The rental car was in pristine mechanical condition and clean' },
      { id: 'easy_pickup', label: '⚡ Fast Pickup & Drop', category: 'Service', snippet: 'Key handover and vehicle pickup process took less than 5 minutes' },
      { id: 'clean_interior', label: '✨ Spotless Interior', category: 'Cleanliness', snippet: 'Interior was clean, fresh, and smelled great' },
      { id: 'deposit', label: '💰 Quick Deposit Refund', category: 'Pricing', snippet: 'Security deposit was refunded instantly without any hassle' },
      { id: 'mileage', label: '⛽ Smooth Drive & Fuel Efficient', category: 'Performance', snippet: 'Vehicle gave great mileage and smooth performance on the highway' },
      { id: 'pricing', label: '🏷️ Reasonable Daily Rates', category: 'Pricing', snippet: 'Affordable rental charges with zero hidden fees' },
      { id: 'support', label: '📞 24/7 Road Assistance', category: 'Support', snippet: 'Great customer service and emergency roadside support' },
      { id: 'documents', label: '📄 Clear Documents', category: 'Service', snippet: 'All RC, insurance, and permit documents were up-to-date in the vehicle' },
    ]
  },

  business_consultant: {
    name: 'Business Setup & Corporate Consultant',
    icon: '💼',
    keywords: [
      { id: 'license_registration', label: '📄 Fast Company Registration & Licensing', category: 'Legal & Compliance', snippet: 'Handled our complete company registration and trade license seamlessly without any delay' },
      { id: 'expert_guidance', label: '🧠 Expert Strategic Advisory', category: 'Consulting', snippet: 'Provided invaluable corporate setup advice and structured our business entity perfectly' },
      { id: 'paperwork_hasslefree', label: '📋 Stress-Free Documentation', category: 'Documentation', snippet: 'Took care of all legal paperwork, PRO services, and bank account setup effortlessly' },
      { id: 'tax_compliance', label: '⚖️ Tax & Compliance Advisory', category: 'Finance', snippet: 'Guided us clearly on GST, tax compliance, and legal regulatory frameworks' },
      { id: 'transparent_pricing', label: '💰 Transparent & Clear Charges', category: 'Pricing', snippet: 'Clear upfront pricing with no hidden consultancy fees or unexpected costs' },
      { id: 'responsive_support', label: '📞 Highly Responsive Consultant', category: 'Service', snippet: 'Always available to answer our queries promptly and resolve setup bottlenecks' },
      { id: 'visa_pro', label: '🛂 Smooth PRO & Visa Processing', category: 'Services', snippet: 'Handled investor visa and PRO document clearance swift and hassle-free' },
      { id: 'trustworthy', label: '🛡️ Highly Reliable Partner', category: 'Trust', snippet: 'A trustworthy business setup advisor you can rely on for starting a business' },
    ]
  },

  makeup_artist: {
    name: 'Bridal & Professional Makeup Artist',
    icon: '💄',
    keywords: [
      { id: 'flawless_makeup', label: '✨ Flawless & Long-Lasting Look', category: 'Makeup', snippet: 'The makeup was flawless, felt lightweight, and lasted perfectly throughout the entire event' },
      { id: 'bridal_look', label: '👑 Stunning Bridal Transformation', category: 'Bridal', snippet: 'Created a breathtaking bridal look that perfectly complemented my outfit and aesthetic' },
      { id: 'premium_products', label: '💄 High-End Beauty Products', category: 'Products', snippet: 'Used top-tier luxury cosmetics that suit skin sensitively without causing breakouts' },
      { id: 'punctual_artist', label: '⏱️ On-Time & Punctual', category: 'Punctuality', snippet: 'Arrived right on schedule for the venue makeup session with zero stress' },
      { id: 'skilful_eye', label: '🎨 Skilful Eye & Detail', category: 'Technique', snippet: 'Incredible attention to eye detail, skin blending, and subtle contouring' },
      { id: 'sweet_behavior', label: '🌸 Warm & Patient Artist', category: 'Service', snippet: 'Extremely sweet, patient, and made me feel completely relaxed and confident' },
      { id: 'hair_draping', label: '🎀 Perfect Hair Styling & Draping', category: 'Styling', snippet: 'Hair styling and saree/lehenga dupatta draping were immaculate and secure' },
      { id: 'value_glam', label: '💰 Worth Every Penny', category: 'Value', snippet: 'Top glam makeup service offering incredible value for special occasions' },
    ]
  },

  nail_artist: {
    name: 'Nail Art & Extension Studio',
    icon: '💅',
    keywords: [
      { id: 'stunning_nail_art', label: '💅 Gorgeous Custom Nail Art', category: 'Nail Art', snippet: 'The custom nail art design turned out stunning and exceeded my expectations' },
      { id: 'durable_extensions', label: '💎 Long-Lasting Extensions', category: 'Extensions', snippet: 'Acrylic/gel extensions are super sturdy, durable, and haven\'t chipped or lifted at all' },
      { id: 'clean_hygiene', label: '✨ Spotless & Sanitized Tools', category: 'Hygiene', snippet: 'Cuticle care and tool sterilization were handled with pristine hygiene' },
      { id: 'creative_designs', label: '🎨 Creative & Trendy Designs', category: 'Design', snippet: 'Extremely creative artist who brought my Pinterest nail reference to life' },
      { id: 'gentle_care', label: '🌸 Gentle Cuticle Care', category: 'Care', snippet: 'Prepped my natural nails gently without thinning or damaging the nail bed' },
      { id: 'gel_polish', label: '✨ High-Shine Gel Polish', category: 'Finish', snippet: 'The gel polish color selection is huge and gave a high-shine glossy finish' },
      { id: 'polite_tech', label: '😊 Friendly Nail Technician', category: 'Service', snippet: 'The nail tech was polite, attentive, and took time to perfect every single nail' },
      { id: 'fair_prices', label: '💰 Affordable Luxury Nails', category: 'Value', snippet: 'Reasonable rates for high-quality nail extensions and intricate art' },
    ]
  },

  clothing: {
    name: 'Clothing & Fashion Store',
    icon: '👗',
    keywords: [
      { id: 'quality', label: '✨ High-Quality Fabric', category: 'Quality', snippet: 'The fabric and material quality of the clothing was outstanding' },
      { id: 'collection', label: '👗 Trendy Collection', category: 'Variety', snippet: 'Fantastic variety of stylish, trendy, and elegant outfits' },
      { id: 'staff', label: '😊 Helpful Staff', category: 'Service', snippet: 'The store staff were super friendly, patient, and helpful' },
      { id: 'fitting', label: '✂️ Perfect Fitting', category: 'Comfort', snippet: 'The sizing and fitting of the garments were spot-on' },
      { id: 'pricing', label: '💰 Reasonable Prices', category: 'Pricing', snippet: 'Great fashion collection at very fair and affordable prices' },
      { id: 'trial', label: '👗 Clean Fitting Rooms', category: 'Amenities', snippet: 'Trial rooms were clean, well-lit, and comfortable' },
      { id: 'latest_stock', label: '🏷️ Latest Seasonal Stock', category: 'Variety', snippet: 'Had all the latest fashion arrivals and fresh designs' },
      { id: 'ambience', label: '🛍️ Organized Store Vibe', category: 'General', snippet: 'The store ambiance was pleasant and everything was neatly organized' },
    ]
  },

  financial_services: {
    name: 'Financial Services & Investment',
    icon: '📊',
    keywords: [
      { id: 'advisor', label: '📊 Expert Advisor', category: 'Advisory', snippet: 'The financial advisors were highly knowledgeable, patient, and strategic' },
      { id: 'planning', label: '📈 Sound Investment Plan', category: 'Strategy', snippet: 'Created a customized, well-structured financial and investment portfolio' },
      { id: 'transparency', label: '🔍 Complete Transparency', category: 'Trust', snippet: 'Explained all terms, returns, and risks with complete honesty and transparency' },
      { id: 'returns', label: '💰 Great Portfolio Growth', category: 'Results', snippet: 'Delivered consistent growth and strong financial returns on our investments' },
      { id: 'support', label: '📞 Responsive Support', category: 'Customer Support', snippet: 'The advisory team is always accessible, responsive, and ready to guide' },
      { id: 'paperwork', label: '📄 Hassle-Free Documentation', category: 'Service', snippet: 'Handled all account onboarding, tax, and compliance documentation smoothly' },
      { id: 'trust', label: '🛡️ Reliable & Trustworthy', category: 'Trust', snippet: 'A dependable financial consulting firm you can rely on for long-term wealth' },
      { id: 'tax_saving', label: '⚖️ Smart Tax Planning', category: 'Advisory', snippet: 'Helped optimize tax savings and wealth management strategies efficiently' },
    ]
  }
};
