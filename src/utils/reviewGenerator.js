/**
 * Smart Review Generator Engine
 * Auto-assembles natural, unique human-sounding review sentences based on selected rating
 * and selected keyword tags. Every tag click or variation trigger generates a fresh statement!
 */

export const RATING_KEYWORDS = {
  // Positive tags for 4-5 stars
  positive: [
    {
      id: 'clean',
      label: '✨ Spotless Room',
      category: 'Cleanliness',
      snippet: 'The room was impeccably clean and spotless',
      snippets: [
        'The room was impeccably clean, fresh, and spotless',
        'Housekeeping did a phenomenal job; the room was sparkling clean',
        'Cleanliness was top-notch with immaculate rooms and fresh linens',
        'Everything was pristine, well-maintained, and wonderfully clean',
        'The hygiene and cleanliness standards were truly impressive'
      ]
    },
    {
      id: 'wifi',
      label: '⚡ Fast Wi-Fi',
      category: 'Amenities',
      snippet: 'The Wi-Fi was fast and reliable for work and streaming',
      snippets: [
        'The Wi-Fi was super fast and reliable for work and video streaming',
        'High-speed Wi-Fi made working remotely smooth and hassle-free',
        'Internet connectivity was strong and ultra-fast throughout',
        'Impressed by the seamless and high-speed Wi-Fi performance',
        'Great Wi-Fi speeds in both the room and common areas'
      ]
    },
    {
      id: 'staff',
      label: '😊 Friendly Staff',
      category: 'Service',
      snippet: 'The staff were incredibly warm, welcoming, and helpful',
      snippets: [
        'The staff were incredibly warm, welcoming, and attentive',
        'Hospitality was outstanding; everyone was extremely polite and helpful',
        'Special thanks to the team for their gracious and prompt service',
        'The hospitality staff went above and beyond to ensure a great stay',
        'Every team member was friendly, respectful, and eager to assist'
      ]
    },
    {
      id: 'breakfast',
      label: '🍳 Superb Breakfast',
      category: 'Dining',
      snippet: 'Breakfast was fresh, delicious, and offered great variety',
      snippets: [
        'Breakfast was fresh, hot, and offered a fantastic variety of dishes',
        'Loved the morning breakfast spread; delicious flavor and great choices',
        'The breakfast was freshly prepared and served with high quality',
        'Enjoyed a delightful and wholesome breakfast spread each morning',
        'The culinary team did a wonderful job with the delicious breakfast'
      ]
    },
    {
      id: 'bed',
      label: '🛏️ Comfy Bed',
      category: 'Comfort',
      snippet: 'The bed was super comfortable for a restful sleep',
      snippets: [
        'The bed was super comfortable with premium linens for a great night sleep',
        'Cozy mattress and plush pillows ensured a deeply restful stay',
        'Slept amazingly well thanks to the comfortable bed and peaceful ambience',
        'The bed and bedding quality were top tier and extremely cozy',
        'Restful sleep was guaranteed by the very comfortable bed'
      ]
    },
    {
      id: 'pool',
      label: '🏊 Pristine Pool',
      category: 'Amenities',
      snippet: 'The pool area was well-maintained and relaxing',
      snippets: [
        'The pool area was well-maintained, clean, and very relaxing',
        'Thoroughly enjoyed spending time at the refreshing pool',
        'Pristine pool facilities with clean water and comfortable lounge seating',
        'The pool was spotless and provided a perfect spot to unwind',
        'Great outdoor pool atmosphere with crystal clear water'
      ]
    },
    {
      id: 'ac',
      label: '❄️ Quiet AC',
      category: 'Comfort',
      snippet: 'The room AC worked perfectly and ran quietly',
      snippets: [
        'The room AC worked perfectly, keeping the room cool and quiet',
        'Climate control was quick, powerful, and comfortably silent',
        'Air conditioning kept the room ideal and refreshed at all times',
        'Quiet and effective air conditioning kept the space very pleasant',
        'Excellent air cooling that ran whisper-quiet throughout the night'
      ]
    },
    {
      id: 'location',
      label: '📍 Great Location',
      category: 'General',
      snippet: 'Location was ideal and very convenient',
      snippets: [
        'The location was ideal, peaceful, and super convenient for sightseeing',
        'Situated in a prime spot with easy access to major local attractions',
        'Fantastic central location while still offering a calm environment',
        'Great location with seamless connectivity and beautiful surroundings',
        'Perfect base for exploring the area with key places close by'
      ]
    },
    {
      id: 'quick_checkin',
      label: '⏱️ Smooth Check-in', category: 'Service', snippet: 'Check-in was quick and seamless',
      snippets: [
        'Check-in was quick, organized, and completely seamless',
        'Front desk handled our arrival swiftly with zero waiting time',
        'Warm and efficient check-in experience right from arrival',
        'Check-in process was smooth, hassle-free, and very welcoming',
        'Speedy reception service with all details communicated clearly'
      ]
    },
  ],

  // Issue tags for 1-3 stars
  negative: [
    {
      id: 'slow_wifi',
      label: '📶 Slow Wi-Fi',
      category: 'Amenities',
      snippet: 'The Wi-Fi connection was unstable and very slow',
      snippets: [
        'The Wi-Fi connection was unstable and very slow at times',
        'Internet speeds were sluggish and kept disconnecting unexpectedly',
        'Had difficulty completing online tasks due to poor Wi-Fi connectivity',
        'Wi-Fi signal strength was weak in our room'
      ]
    },
    {
      id: 'ac_issue',
      label: '🌡️ AC Not Cooling',
      category: 'Comfort',
      snippet: 'The air conditioning in the room was not cooling properly',
      snippets: [
        'The air conditioning in the room was not cooling properly',
        'Room AC was struggling to maintain a comfortable temperature',
        'Climate control in the room felt warm and required maintenance',
        'The AC unit was noisy and did not cool the room sufficiently'
      ]
    },
    {
      id: 'noise',
      label: '🔊 Noisy Room',
      category: 'Comfort',
      snippet: 'There was considerable noise disrupting our rest',
      snippets: [
        'There was considerable ambient noise disrupting our sleep',
        'Sound insulation could be improved as external noise was noticeable',
        'Loud sounds from nearby areas disturbed our rest during the night',
        'Disturbing noise levels impacted our overall relaxation'
      ]
    },
    {
      id: 'cold_food',
      label: '🥣 Cold Breakfast',
      category: 'Dining',
      snippet: 'The food served was cold and delayed',
      snippets: [
        'The food served was lukewarm and delayed',
        'Breakfast quality fell short with cold items and slow refill',
        'Meals took longer than expected and lacked hot freshness',
        'Dining service could be speedier and serve hotter dishes'
      ]
    },
    {
      id: 'dirty_bathroom',
      label: '🛁 Bath Needs Cleaning',
      category: 'Cleanliness',
      snippet: 'The bathroom cleanliness fell below expected standards',
      snippets: [
        'The bathroom cleanliness fell below expected standards',
        'Bathroom area required a more thorough cleaning attention',
        'Housekeeping missed some details in the bath section',
        'Sanitation in the bathroom needed better inspection'
      ]
    },
    {
      id: 'keycard',
      label: '🔑 Keycard Issue',
      category: 'Service',
      snippet: 'Had trouble with the room keycard access multiple times',
      snippets: [
        'Had trouble with the room keycard access multiple times',
        'Keycard kept demagnetizing and needed front desk resetting',
        'Door lock sensor took multiple attempts to recognize keycard'
      ]
    },
    {
      id: 'checkin_delay',
      label: '⏳ Check-in Delay',
      category: 'Service',
      snippet: 'We experienced a long wait time during check-in',
      snippets: [
        'We experienced a long wait time during arrival check-in',
        'Front desk queue was slow and check-in felt delayed',
        'Room allocation took longer than normal upon our arrival'
      ]
    },
    {
      id: 'missing_towels',
      label: '🧼 Missing Towels',
      category: 'Amenities',
      snippet: 'Towels and toiletries were missing upon arrival',
      snippets: [
        'Towels and essential toiletries were missing upon arrival',
        'Had to request fresh bath towels and soap after entering the room',
        'Room amenities like towels were incomplete when we checked in'
      ]
    },
  ]
};

// Openings dictionary for 1-5 stars
const OPENINGS = {
  5: [
    'Had a fantastic experience during our stay at Sree Jee Stay!',
    'Highly recommend Sree Jee Stay! Outstanding hospitality and great memories.',
    'Wonderful stay overall! Everything exceeded our expectations.',
    'Truly memorable experience staying here. Excellent service throughout.',
    'We had an amazing time at Sree Jee Stay during our recent trip.',
    'Exceptional stay! Everything was top notch from start to finish.'
  ],
  4: [
    'Really enjoyed our stay at Sree Jee Stay.',
    'Great experience overall during our visit.',
    'Good stay with comfortable rooms and polite hospitality.',
    'Very pleasant experience staying here with family.',
    'Solid 4-star experience with great overall service.'
  ],
  3: [
    'Mixed experience during our stay. A few things were fine, but some items could be improved.',
    'Decent stay overall, though there were minor hiccups during our visit.',
    'Average experience. Some aspects were good, while others need attention.'
  ],
  2: [
    'Disappointed with our stay. Several issues impacted our comfort.',
    'Had a below-average experience during our visit that needs management review.',
    'Unfortunately, our stay fell short of expectations due to a few issues.'
  ],
  1: [
    'Extremely disappointed with our stay.',
    'Very unsatisfactory experience that required immediate manager intervention.',
    'Regrettably, our visit was poor and fell well below standards.'
  ]
};

// Closings dictionary
const CLOSINGS = {
  positive: [
    'Will definitely come back and recommend to friends!',
    'Looking forward to staying here again on our next visit.',
    'Would highly recommend this property to anyone visiting the area!',
    'Huge thanks to the team for making our stay so enjoyable.',
    'Definitely one of the best homestays in Varanasi!'
  ],
  negative: [
    'Hope management can look into these issues promptly.',
    'Hope these points are addressed to improve future guest experiences.',
    'Sharing this so the team can fix these areas quickly.'
  ]
};

/**
 * Pick a item randomly or deterministically using seed
 */
function pickVariation(items = [], seed = Math.random()) {
  if (!items || items.length === 0) return '';
  const index = Math.floor(Math.abs(Math.sin(seed * 9999)) * items.length) % items.length;
  return items[index];
}

/**
 * Generate a unique review text for the given rating, selected tags, and optional variation seed
 */
export function generateReviewText({
  rating,
  selectedTags = [],
  customNote = '',
  keywordsList = RATING_KEYWORDS,
  variationSeed = Math.random()
}) {
  if (!rating) return '';

  const isPositive = rating >= 4;
  const availableOpenings = OPENINGS[rating] || OPENINGS[5];
  const opening = pickVariation(availableOpenings, variationSeed);

  const selectedList = isPositive
    ? (keywordsList.positive || RATING_KEYWORDS.positive)
    : (keywordsList.negative || RATING_KEYWORDS.negative);

  // For each selected tag, pick a unique variation snippet
  const tagSnippets = selectedTags
    .map((tagId, idx) => {
      const tagObj = selectedList.find(t => t.id === tagId);
      if (!tagObj) return null;

      // Use snippets array if available, otherwise snippet property or label
      const variations = (tagObj.snippets && tagObj.snippets.length > 0)
        ? tagObj.snippets
        : [tagObj.snippet || tagObj.label];

      // Combine global variationSeed with tag index so each tag in the list selects uniquely
      const tagSeed = variationSeed * (idx + 1) * 31.7;
      return pickVariation(variations, tagSeed);
    })
    .filter(Boolean);

  let body = '';
  if (tagSnippets.length > 0) {
    if (isPositive) {
      body = ' ' + tagSnippets.join('. ') + '.';
    } else {
      body = ' Specifically, ' + tagSnippets.join(', and ') + '.';
    }
  }

  const availableClosings = isPositive ? CLOSINGS.positive : CLOSINGS.negative;
  const closingSeed = variationSeed * 17.3 + selectedTags.length;
  const closing = pickVariation(availableClosings, closingSeed);

  let fullText = `${opening}${body} ${closing}`.replace(/\s+/g, ' ').trim();

  if (customNote && customNote.trim()) {
    fullText += ` Note: ${customNote.trim()}`;
  }

  return fullText;
}
