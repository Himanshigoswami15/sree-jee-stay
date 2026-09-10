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
    ],
    negativeKeywords: [
      { id: 'slow_wifi', label: '📶 Slow Wi-Fi', category: 'Amenities', snippet: 'The Wi-Fi was quite slow and kept disconnecting' },
      { id: 'ac_issue', label: '🌡️ AC Not Cooling', category: 'Comfort', snippet: 'The AC in our room wasn\'t cooling well and it stayed warm' },
      { id: 'noise', label: '🔊 Noisy Room', category: 'Comfort', snippet: 'Could hear noise from outside which disturbed our sleep' },
      { id: 'breakfast_cold', label: '🥐 Cold Breakfast', category: 'Dining', snippet: 'Breakfast items were lukewarm and replenishment was slow' },
      { id: 'bathroom_dirty', label: '🚿 Bath Needs Cleaning', category: 'Cleanliness', snippet: 'The bathroom was not as thoroughly cleaned as expected' },
      { id: 'keycard', label: '🔑 Keycard Issue', category: 'Service', snippet: 'Had issues with the room keycard repeatedly demagnetizing' },
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
    ],
    negativeKeywords: [
      { id: 'slow_service', label: '⏱️ Slow Service', category: 'Service', snippet: 'Orders took a long time to arrive and service was slow' },
      { id: 'food_cold', label: '🍲 Food Served Cold', category: 'Dining', snippet: 'Dishes arrived lukewarm or cold at our table' },
      { id: 'taste_average', label: '🍽️ Taste Needs Improvement', category: 'Dining', snippet: 'Flavor and preparation did not meet our expectations' },
      { id: 'order_mixup', label: '📋 Order Mix-up', category: 'Service', snippet: 'There were delays or mix-ups with the items we ordered' },
      { id: 'noisy_dining', label: '🔊 Loud Ambience', category: 'Ambiance', snippet: 'The dining area was overly loud and crowded' },
      { id: 'high_price', label: '💰 Overpriced', category: 'Pricing', snippet: 'Portion sizes and quality did not justify the pricing' },
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
    ],
    negativeKeywords: [
      { id: 'long_wait', label: '⏱️ Long Wait Time', category: 'Service', snippet: 'Waited considerably past the scheduled appointment time' },
      { id: 'rushed_consult', label: '🩺 Rushed Consultation', category: 'Service', snippet: 'Felt the consultation was hurried without detailed discussion' },
      { id: 'reception_issue', label: '👥 Front Desk Coordination', category: 'Staff', snippet: 'Reception desk was unorganized with registration' },
      { id: 'billing_clarity', label: '💰 Fee Transparency', category: 'Pricing', snippet: 'Consultation and testing charges lacked clarity upfront' },
      { id: 'crowded_waiting', label: '🏥 Crowded Waiting Area', category: 'Facility', snippet: 'Waiting area was crowded with insufficient seating' },
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
    ],
    negativeKeywords: [
      { id: 'long_wait_salon', label: '⏱️ Long Wait Time', category: 'Service', snippet: 'Waited past appointment time despite booking in advance' },
      { id: 'styling_issue', label: '✂️ Not As Requested', category: 'Service', snippet: 'The styling or cut did not match what was requested' },
      { id: 'rushed_service', label: '⏱️ Rushed Session', category: 'Service', snippet: 'The stylist seemed in a hurry during the service' },
      { id: 'price_dispute', label: '💰 High Charges', category: 'Pricing', snippet: 'Final charges were higher than initially quoted' },
      { id: 'cleanliness_salon', label: '✨ Station Cleanliness', category: 'Hygiene', snippet: 'Workstation and styling tools needed better cleaning' },
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
    ],
    negativeKeywords: [
      { id: 'crowded_gym', label: '🏋️ Overcrowded Floor', category: 'Facility', snippet: 'Floor was excessively crowded with long waits for machines' },
      { id: 'machine_repair', label: '⚙️ Equipment Maintenance', category: 'Equipment', snippet: 'Several workout machines were out of order or poorly maintained' },
      { id: 'ac_ventilation', label: '🌡️ Poor Ventilation', category: 'Comfort', snippet: 'Ventilation and air conditioning in workout zones were inadequate' },
      { id: 'trainer_support', label: '💪 Trainer Availability', category: 'Service', snippet: 'Floor trainers offered little assistance or form correction' },
      { id: 'locker_hygiene', label: '🚿 Washroom Hygiene', category: 'Cleanliness', snippet: 'Washrooms and locker area required better hygiene and upkeep' },
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
    ],
    negativeKeywords: [
      { id: 'slow_coffee', label: '⏱️ Slow Order Serving', category: 'Service', snippet: 'Wait time for drinks and snacks was longer than expected' },
      { id: 'cold_food', label: '🥐 Food Not Fresh', category: 'Food', snippet: 'Baked items were not fresh and arrived lukewarm' },
      { id: 'seating_crowded', label: '🪑 Limited Seating', category: 'Ambiance', snippet: 'Seating space was cramped and tables were too close' },
      { id: 'loud_music', label: '🔊 Loud Background Music', category: 'Ambiance', snippet: 'Music was too loud for conversation or working' },
      { id: 'high_rate', label: '💰 High Menu Prices', category: 'Pricing', snippet: 'Menu pricing felt steep for the portion sizes offered' },
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
    ],
    negativeKeywords: [
      { id: 'campaign_delay', label: '⏱️ Delivery Delay', category: 'Timeline', snippet: 'Campaign milestones and deliverables were delivered behind schedule' },
      { id: 'subpar_roi', label: '📈 Below Target ROI', category: 'Performance', snippet: 'Lead generation and marketing returns fell below expected benchmarks' },
      { id: 'comm_lag', label: '📞 Communication Lag', category: 'Support', snippet: 'Response times and weekly status reporting were inconsistent' },
      { id: 'creative_revisions', label: '🎨 Multiple Revisions Needed', category: 'Creative', snippet: 'Ad creatives and content required multiple rounds of corrections' },
      { id: 'scope_confusion', label: '📋 Scope Misalignment', category: 'Service', snippet: 'Deliverables did not fully align with the initial proposal scope' },
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
    ],
    negativeKeywords: [
      { id: 'delay_delivery', label: '⏱️ Delivery Delay', category: 'Timeline', snippet: 'Delivery of goods took longer than the committed timeline' },
      { id: 'item_damage', label: '📦 Item Damage', category: 'Handling', snippet: 'A few household items or furniture suffered minor damage during transit' },
      { id: 'careless_packing', label: '🛡️ Packing Needs Care', category: 'Packing', snippet: 'Packing quality could have been more protective, especially for fragile items' },
      { id: 'hidden_cost', label: '💰 Unexpected Charges', category: 'Pricing', snippet: 'Encountered unexpected extra charges that were not clearly quoted initially' },
      { id: 'staff_behavior', label: '👥 Staff Coordination', category: 'Service', snippet: 'The loading and moving crew lacked proper coordination and politeness' },
      { id: 'late_pickup', label: '🚚 Late Pickup', category: 'Punctuality', snippet: 'The moving team arrived late for pickup on the scheduled shifting day' },
      { id: 'tracking_issue', label: '📞 Tracking Updates', category: 'Support', snippet: 'Communication and shipment tracking updates were insufficient during transit' },
      { id: 'unloading_issue', label: '🏗️ Rushed Unloading', category: 'Service', snippet: 'Unloading and placing items in our new premises was rushed and disorganized' },
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
    ],
    negativeKeywords: [
      { id: 'tour_delay', label: '⏱️ Itinerary Delay', category: 'Timeline', snippet: 'Sightseeing schedule was delayed and felt disorganized' },
      { id: 'hotel_subpar', label: '🏨 Hotel Accommodation', category: 'Stay', snippet: 'Hotel accommodations in the package fell below expectations' },
      { id: 'rushed_stops', label: '🏔️ Rushed Sightseeing', category: 'Experience', snippet: 'Sightseeing stops were rushed without enough time to explore' },
      { id: 'transport_issues', label: '🚗 Transport Coordination', category: 'Transport', snippet: 'Vehicle transfers were delayed between tour destinations' },
      { id: 'support_slow', label: '📞 Tour Support Slow', category: 'Support', snippet: 'Assistance from the travel agency was slow during the trip' },
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
    ],
    negativeKeywords: [
      { id: 'cab_delay', label: '⏱️ Pickup Delay', category: 'Punctuality', snippet: 'The cab arrived late for the scheduled pickup' },
      { id: 'vehicle_clean', label: '✨ Cab Cleanliness', category: 'Vehicle', snippet: 'The vehicle interior was not properly cleaned or smelled unpleasant' },
      { id: 'driver_behavior', label: '👨‍✈️ Driver Behavior', category: 'Service', snippet: 'The driver was unprofessional or drove rashly' },
      { id: 'fare_dispute', label: '💰 Extra Toll Dispute', category: 'Pricing', snippet: 'Driver demanded extra charges beyond the confirmed booking fare' },
      { id: 'cab_ac_issue', label: '🌡️ Cab AC Not Working', category: 'Comfort', snippet: 'The air conditioning in the cab was not working properly' },
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
    ],
    negativeKeywords: [
      { id: 'power_ac_issue', label: '🌡️ Cooling / Power Issues', category: 'Comfort', snippet: 'Experienced power fluctuations or AC cooling issues during stay' },
      { id: 'villa_clean', label: '✨ Cleanliness Needs Care', category: 'Cleanliness', snippet: 'Certain villa areas and pool needed more thorough cleaning' },
      { id: 'host_delay', label: '🤝 Host Response Delay', category: 'Service', snippet: 'Host or caretaker was slow to respond to requests' },
      { id: 'access_road', label: '🚗 Tough Road Access', category: 'Location', snippet: 'Approaching road to the property was narrow or difficult to navigate' },
      { id: 'amenities_missing', label: '🛋️ Missing Amenities', category: 'Amenities', snippet: 'A few listed kitchen or room amenities were not operational' },
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
    ],
    negativeKeywords: [
      { id: 'booking_lag', label: '⏱️ Booking Delay', category: 'Service', snippet: 'Booking confirmation and ticket issuance took longer than expected' },
      { id: 'hotel_subpar_agency', label: '🏨 Subpar Hotel Quality', category: 'Stay', snippet: 'The hotel properties arranged were below the promised standard' },
      { id: 'guide_service', label: '👥 Guide Coordination', category: 'Service', snippet: 'The local guide was inattentive and rushed through attractions' },
      { id: 'price_discrepancy', label: '💰 Hidden Tour Charges', category: 'Pricing', snippet: 'Faced extra costs at destinations that were not stated in the package' },
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
    ],
    negativeKeywords: [
      { id: 'site_visit_delay', label: '⏱️ Visit Scheduling Delay', category: 'Service', snippet: 'Site visits were postponed or scheduled with delays' },
      { id: 'doc_delays', label: '📄 Paperwork Delay', category: 'Documentation', snippet: 'Legal paperwork and registry documentation took longer than planned' },
      { id: 'price_variance', label: '💰 Pricing Discrepancy', category: 'Pricing', snippet: 'Final quoted price differed from initial discussions' },
      { id: 'followup_lag', label: '📞 Poor Follow-Up', category: 'Service', snippet: 'Agent follow-up and updates after initial visit were slow' },
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
    ],
    negativeKeywords: [
      { id: 'pickup_delay', label: '⏱️ Key Handover Delay', category: 'Service', snippet: 'Handover and vehicle pickup process took much longer than expected' },
      { id: 'car_hygiene', label: '✨ Interior Cleanliness', category: 'Vehicle', snippet: 'Interior upholstery and car cabin were not cleaned prior to delivery' },
      { id: 'ac_mech_issue', label: '🌡️ AC / Mechanical Issue', category: 'Vehicle', snippet: 'Experienced AC or engine pickup issues during driving' },
      { id: 'deposit_delay', label: '💰 Refund Processing Delay', category: 'Pricing', snippet: 'Security deposit refund took longer than the committed timeline' },
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
    ],
    negativeKeywords: [
      { id: 'reg_delay', label: '⏱️ Setup Delay', category: 'Timeline', snippet: 'Company registration and approvals took longer than committed' },
      { id: 'fee_surprise', label: '💰 Unexpected Fees', category: 'Pricing', snippet: 'Encountered unexpected government or consultancy fee additions' },
      { id: 'slow_support', label: '📞 Unresponsive Support', category: 'Service', snippet: 'Consultants were difficult to reach for urgent status updates' },
      { id: 'doc_confusion', label: '📄 Documentation Confusion', category: 'Documentation', snippet: 'Requirements for legal documents were communicated vaguely' },
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
    ],
    negativeKeywords: [
      { id: 'late_artist', label: '⏱️ Arrived Late', category: 'Punctuality', snippet: 'The artist arrived late which delayed event preparation' },
      { id: 'heavy_makeup', label: '💄 Makeup Felt Cakey', category: 'Makeup', snippet: 'The makeup felt heavier and more cakey than desired' },
      { id: 'rushed_session', label: '⏱️ Rushed Service', category: 'Service', snippet: 'The session felt hurried towards the end' },
      { id: 'look_different', label: '🎨 Not As Reference', category: 'Technique', snippet: 'The final look differed noticeably from the reference image' },
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
    ],
    negativeKeywords: [
      { id: 'nail_lifted', label: '💎 Extension Lifted Early', category: 'Extensions', snippet: 'Nail extensions started lifting or chipping within a few days' },
      { id: 'cuticle_pain', label: '🌸 Cuticle Irritation', category: 'Care', snippet: 'Felt slight pain or burning sensation during cuticle prep' },
      { id: 'design_mismatch', label: '🎨 Design Differed', category: 'Design', snippet: 'The nail art design was not accurate to the reference photo' },
      { id: 'slow_slot', label: '⏱️ Long Appointment', category: 'Timeline', snippet: 'The appointment took far longer than initially scheduled' },
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
    ],
    negativeKeywords: [
      { id: 'size_unavailable', label: '🏷️ Limited Sizing', category: 'Variety', snippet: 'Many popular sizes and color options were out of stock' },
      { id: 'fabric_quality', label: '✨ Fabric Below Expectations', category: 'Quality', snippet: 'Material quality did not match the premium price point' },
      { id: 'high_prices', label: '💰 Expensive Collection', category: 'Pricing', snippet: 'Clothing items felt overpriced compared to market quality' },
      { id: 'trial_wait', label: '⏱️ Long Trial Room Wait', category: 'Service', snippet: 'Had to wait a long time to access fitting and changing rooms' },
      { id: 'staff_help', label: '😊 Inattentive Staff', category: 'Service', snippet: 'Store staff was busy and offered little help finding styles' },
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
    ],
    negativeKeywords: [
      { id: 'slow_response_fin', label: '⏱️ Slow Response Time', category: 'Service', snippet: 'Inquiries and portfolio queries took too long to get answered' },
      { id: 'hidden_fees', label: '💰 High Management Fees', category: 'Pricing', snippet: 'Advisory and transaction fees were higher than expected' },
      { id: 'subpar_returns', label: '📈 Underperforming Growth', category: 'Performance', snippet: 'Portfolio returns underperformed agreed market targets' },
      { id: 'complex_docs', label: '📄 Complex Paperwork', category: 'Documentation', snippet: 'Documentation and onboarding process was cumbersome and tedious' },
      { id: 'advisory_clarity', label: '🔍 Advisory Clarity', category: 'Trust', snippet: 'Investment risks and options were not explained clearly upfront' },
    ]
  }
};
