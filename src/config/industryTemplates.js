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
      { id: 'value', label: '💰 Value for Money', category: 'General', snippet: 'Exceptional hospitality and value for money' },
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
  }
};
