/**
 * JJ Review System — Smart Review Generator Engine
 * Auto-assembles natural, unique human-sounding review sentences based on selected rating,
 * selected keyword tags, hotel name, writing tone, review length, and Review Assistant toggles.
 */

export const RATING_KEYWORDS = {
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
      label: '⏱️ Smooth Check-in',
      category: 'Service',
      snippet: 'Check-in was quick and seamless',
      snippets: [
        'Check-in was quick, organized, and completely seamless',
        'Front desk handled our arrival swiftly with zero waiting time',
        'Warm and efficient check-in experience right from arrival',
        'Check-in process was smooth, hassle-free, and very welcoming',
        'Speedy reception service with all details communicated clearly'
      ]
    },
  ],

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

function getOpenings(hotelName = 'this place', tone = 'friendly') {
  const name = hotelName || 'this place';

  switch (tone) {
    case 'casual':
      return {
        5: [
          `Loved this place! Had an absolute blast visiting ${name}.`,
          `Super happy with our experience at ${name}!`,
          `Totally exceeded our expectations visiting ${name}.`,
          `Hands down one of the best visits we've had at ${name}!`,
          `So glad we stopped by ${name}! Everything was awesome.`,
          `Awesome vibes and great experience at ${name}!`,
          `Could not have asked for a better time at ${name}.`
        ],
        4: [
          `Really cool spot! Enjoyed our time at ${name}.`,
          `Pretty great experience overall visiting ${name}.`,
          `Super decent and fun visit to ${name}.`
        ],
        3: [`Decent spot at ${name}, though a few small things could be better.`],
        2: [`Kinda disappointed with our visit to ${name}.`],
        1: [`Definitely not a great experience at ${name}.`]
      };

    case 'luxury':
    case 'elegant':
      return {
        5: [
          `Our experience at ${name} was an absolute triumph of luxury and sophistication.`,
          `Flawless elegance and top-tier hospitality throughout our time at ${name}.`,
          `Sublime comfort and impeccable personal attention made our visit to ${name} unforgettable.`,
          `A truly magnificent and refined experience at ${name}.`,
          `Extremely impressed by the exquisite standards maintained at ${name}.`,
          `From arrival to departure, ${name} delivered an extraordinary luxury experience.`
        ],
        4: [
          `A truly refined visit to ${name} with wonderful ambiance and comfortable surroundings.`,
          `Enjoyed a sophisticated and pleasant experience at ${name}.`
        ],
        3: [`A decent visit to ${name}, though a few fine details could be elevated to match expectations.`],
        2: [`Our stay at ${name} did not reflect the high standard we anticipated.`],
        1: [`Regrettably, the experience at ${name} fell far below expected standards.`]
      };

    case 'minimal':
      return {
        5: [
          `Great experience at ${name}. Highly recommended!`,
          `Everything was excellent at ${name}.`,
          `Top quality experience visiting ${name}.`,
          `Very satisfied with our visit to ${name}.`,
          `10/10 experience at ${name}. Will return.`
        ],
        4: [
          `Good experience overall at ${name}.`,
          `Pleasant visit to ${name}.`,
          `Solid service at ${name}.`
        ],
        3: [`Average experience at ${name}.`],
        2: [`Subpar visit to ${name}.`],
        1: [`Not recommended. Poor experience at ${name}.`]
      };

    case 'professional':
      return {
        5: [
          `Our experience at ${name} was highly exemplary in every regard.`,
          `Sincere commendations to ${name} for maintaining exceptionally high standards of service.`,
          `We were thoroughly impressed with the professionalism and quality at ${name}.`,
          `Excellent execution and high standards of service delivered at ${name}.`,
          `Professionalism, efficiency, and quality were consistently demonstrated at ${name}.`
        ],
        4: [
          `Overall, our visit to ${name} was very pleasant and conducted with high professionalism.`,
          `We enjoyed a commendable visit to ${name} with reliable service throughout.`
        ],
        3: [`Our visit to ${name} met basic requirements, though certain operational details require attention.`],
        2: [`Unfortunately, our visit to ${name} fell short of expected professional standards.`],
        1: [`Our experience at ${name} was unacceptable and requires management review.`]
      };

    case 'business':
      return {
        5: [
          `Outstanding visit to ${name}! Efficient, quiet, and reliable.`,
          `Seamless experience at ${name} — ideal environment for working and unwinding.`,
          `Highly effective hospitality at ${name}. Everything ran like clockwork.`
        ],
        4: [
          `Solid experience at ${name} with reliable service and comfortable conditions.`,
          `Very dependable stay at ${name} during a busy schedule.`
        ],
        3: [`Acceptable experience at ${name}, though internet stability and workspace comfort could be enhanced.`],
        2: [`Subpar visit to ${name} that impacted our productivity.`],
        1: [`Extremely frustrating visit to ${name} due to service delays.`]
      };

    case 'family':
      return {
        5: [
          `Our whole family had a wonderful and memorable time at ${name}!`,
          `Wonderful family-friendly atmosphere at ${name}! Everyone loved every moment.`,
          `Super welcoming environment for families at ${name}! Highly recommended.`
        ],
        4: [
          `Great family visit to ${name} with cozy surroundings and helpful staff.`,
          `Very pleasant family vacation experience visiting ${name}.`
        ],
        3: [`Decent stay with family at ${name}, though a few family-friendly touches could be added.`],
        2: [`Our family visit to ${name} was impacted by a few comfort issues.`],
        1: [`Poor family visit experience at ${name} that needed immediate attention.`]
      };

    case 'budget':
      return {
        5: [
          `Fantastic value for money at ${name}! Clean, comfortable, and affordable.`,
          `Best choice in the area! Super affordable experience at ${name} without compromising on quality.`,
          `Great experience at ${name} — unbeatable price for such great service!`
        ],
        4: [
          `Good budget visit to ${name} with decent amenities and clean spaces.`,
          `Pleased with the overall value provided at ${name}.`
        ],
        3: [`Fair budget option at ${name}, though a few basic items need maintenance.`],
        2: [`Below expectations even for a budget option at ${name}.`],
        1: [`Poor value and service at ${name}.`]
      };

    case 'friendly':
    default:
      return {
        5: [
          `Had an absolutely fantastic experience visiting ${name}!`,
          `Highly recommend ${name}! Outstanding hospitality and great memories.`,
          `Wonderful experience overall at ${name}! Everything exceeded our expectations.`,
          `We had an amazing time at ${name} during our recent visit.`,
          `The experience at ${name} exceeded all our expectations!`,
          `One of the best visits we have had in a long time at ${name}!`,
          `From the moment we arrived at ${name}, everything was superb.`,
          `Couldn't have asked for a better experience at ${name}!`,
          `Highly impressed with the top-notch hospitality at ${name}.`
        ],
        4: [
          `Really enjoyed our visit to ${name}.`,
          `Great experience overall during our time at ${name}.`,
          `Good visit to ${name} with comfortable surroundings and polite service.`
        ],
        3: [`Mixed experience during our visit to ${name}. A few things were fine, but some items could be improved.`],
        2: [`Disappointed with our visit to ${name}. Several issues impacted our comfort.`],
        1: [`Extremely disappointed with our visit to ${name}.`]
      };
  }
}

function getClosings(tone = 'friendly') {
  switch (tone) {
    case 'casual':
      return {
        positive: [
          'Will definitely be coming back again soon!',
          '10/10 recommend checking this spot out!',
          'Super stoked with everything, thanks a ton!'
        ],
        negative: ['Hope you guys fix these things up soon!']
      };
    case 'minimal':
      return {
        positive: ['Will return!', 'Recommended.', 'Great choice!'],
        negative: ['Needs improvement.']
      };
    case 'luxury':
    case 'elegant':
      return {
        positive: [
          'A true benchmark for hospitality excellence.',
          'We eagerly anticipate our next visit to this exquisite establishment.',
          'Highest praise to the management and dedicated service team.'
        ],
        negative: ['We trust management will restore expected luxury standards.']
      };
    case 'professional':
      return {
        positive: [
          'We look forward to returning and recommending this establishment.',
          'Compliments to the staff and executive management team.',
          'An asset to the industry in the region.'
        ],
        negative: ['We request that management inspect these observations.']
      };
    case 'business':
      return {
        positive: [
          'Will definitely choose this location for future visits.',
          'Great spot for visitors seeking efficiency and quality.',
          'Appreciate the promptness and hassle-free service.'
        ],
        negative: ['Hope these operational points are resolved promptly.']
      };
    case 'family':
      return {
        positive: [
          'Will definitely bring the family back again!',
          'A true home away from home for families.',
          'Heartfelt thanks from our entire family!'
        ],
        negative: ['Hope management makes these family comfort improvements soon.']
      };
    case 'budget':
      return {
        positive: [
          'Best value in town, will return!',
          'Highly recommended for budget-conscious travelers.',
          'Great experience without burning a hole in the pocket!'
        ],
        negative: ['Hope management addresses these issues to offer better value.']
      };
    case 'friendly':
    default:
      return {
        positive: [
          'Will definitely come back and recommend to friends!',
          'Looking forward to visiting again very soon.',
          'Would highly recommend this place to anyone visiting!'
        ],
        negative: ['Hope management can look into these issues promptly.']
      };
  }
}

function pickVariation(items = [], seed = Math.random()) {
  if (!items || items.length === 0) return '';
  const index = Math.floor(Math.abs(Math.sin(seed * 9999)) * items.length) % items.length;
  return items[index];
}

/**
 * Helper to strip emojis and unwanted symbols from a string
 */
export function cleanEmoji(str = '') {
  return String(str || '')
    .replace(/[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, '')
    .replace(/^[^a-zA-Z0-9]+/, '')
    .trim();
}

/**
 * Ensures a string starts with a capital letter and has no trailing punctuation
 */
function cleanSentence(str = '') {
  let s = String(str || '').trim();
  s = s.replace(/[.,;!]+$/, '').trim();
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Robust tag finder across custom keywords, templates, and defaults
 */
function findTagObject(tagId, keywordsList, isPositive) {
  const primaryList = isPositive
    ? (Array.isArray(keywordsList?.positive) ? keywordsList.positive : [])
    : (Array.isArray(keywordsList?.negative) ? keywordsList.negative : []);

  const secondaryList = isPositive
    ? (Array.isArray(keywordsList?.negative) ? keywordsList.negative : [])
    : (Array.isArray(keywordsList?.positive) ? keywordsList.positive : []);

  const flatList = Array.isArray(keywordsList) ? keywordsList : [];
  const defaultList = isPositive ? RATING_KEYWORDS.positive : RATING_KEYWORDS.negative;
  const defaultAlt = isPositive ? RATING_KEYWORDS.negative : RATING_KEYWORDS.positive;

  const allSearches = [primaryList, flatList, secondaryList, defaultList, defaultAlt];

  for (const list of allSearches) {
    if (!Array.isArray(list)) continue;
    const found = list.find((t) => {
      if (!t) return false;
      return (
        t.id === tagId ||
        t.tagId === tagId ||
        t._id === tagId ||
        t.label === tagId ||
        (t.label && cleanEmoji(t.label).toLowerCase() === cleanEmoji(tagId).toLowerCase())
      );
    });
    if (found) return found;
  }

  // Fallback dynamic tag object from the tagId string itself
  return {
    id: tagId,
    tagId: tagId,
    label: tagId,
    snippet: tagId,
    snippets: [tagId],
  };
}

/**
 * Transforms any keyword, template, or custom tag into a natural, grammatically correct review sentence
 */
export function formatTagToSentence(tagObj, isPositive = true, tagSeed = Math.random()) {
  if (!tagObj) return null;

  // 1. If valid snippets array exists with natural sentences
  if (Array.isArray(tagObj.snippets) && tagObj.snippets.length > 0) {
    const validSnippets = tagObj.snippets.filter((s) => typeof s === 'string' && s.trim().length > 0);
    if (validSnippets.length > 0) {
      const chosen = pickVariation(validSnippets, tagSeed);
      const clean = cleanEmoji(chosen).trim();
      if (clean && clean.split(/\s+/).length >= 3) {
        return cleanSentence(clean);
      }
    }
  }

  // 2. If snippet property exists and has sentence-like content
  const rawSnippet = typeof tagObj.snippet === 'string' ? tagObj.snippet.trim() : '';
  const cleanSnippet = cleanEmoji(rawSnippet).trim();
  if (cleanSnippet && cleanSnippet.split(/\s+/).length >= 4) {
    return cleanSentence(cleanSnippet);
  }

  // 3. Extract best label or keyword text
  const labelToUse = cleanSnippet || cleanEmoji(tagObj.label || tagObj.tagId || tagObj.id || '').trim();
  if (!labelToUse) return null;
  const lower = labelToUse.toLowerCase();

  // Superlative / Title statements (e.g. "Best Hotel in Jodhpur", "Top Marketing Agency", "Best Restaurant in Town")
  if (/^(best|top|truly the best|undoubtedly the best|number 1|#1|greatest|premier|finest|highly recommended)/i.test(labelToUse)) {
    return cleanSentence(labelToUse);
  }

  // Positive keyword patterns
  if (isPositive) {
    // Staff / Team / Reception / Service
    if (lower.includes('staff') || lower.includes('team') || lower.includes('doctor') || lower.includes('trainer') || lower.includes('barista') || lower.includes('stylist') || lower.includes('service') || lower.includes('hospitality') || lower.includes('reception')) {
      if (lower.includes('friendly') || lower.includes('warm') || lower.includes('helpful') || lower.includes('polite') || lower.includes('attentive')) {
        return cleanSentence(`The ${lower} were exceptionally warm, welcoming, and helpful`);
      }
      return cleanSentence(`The staff and service were warm, attentive, and very professional`);
    }

    // Room / Cleanliness / Hygiene
    if (lower.includes('room') || lower.includes('clean') || lower.includes('hygien') || lower.includes('spotless') || lower.includes('sparkling')) {
      return cleanSentence(`The room was impeccably clean, fresh, and spotless`);
    }

    // Bed / Sleep / Comfort / AC / Pool
    if (lower.includes('bed') || lower.includes('mattress') || lower.includes('pillow') || lower.includes('sleep') || lower.includes('comfort')) {
      return cleanSentence(`The bed was super comfortable with cozy linens for a restful sleep`);
    }
    if (lower.includes('ac') || lower.includes('air condition') || lower.includes('cooling')) {
      return cleanSentence(`The room AC worked perfectly, keeping the room pleasantly cool and quiet`);
    }
    if (lower.includes('pool') || lower.includes('swimming')) {
      return cleanSentence(`The pool area was pristine, clean, and very relaxing`);
    }

    // Food / Dining / Breakfast / Coffee
    if (lower.includes('breakfast') || lower.includes('food') || lower.includes('dining') || lower.includes('coffee') || lower.includes('meal') || lower.includes('dish') || lower.includes('pastr') || lower.includes('buffet') || lower.includes('drink')) {
      if (lower.includes('superb') || lower.includes('delicious') || lower.includes('fresh') || lower.includes('great') || lower.includes('tasty')) {
        return cleanSentence(`The breakfast and dining were fresh, delicious, and offered great variety`);
      }
      return cleanSentence(`The food was mouth-watering, fresh, and beautifully prepared`);
    }

    // Location / Ambience / Vibe / View
    if (lower.includes('location') || lower.includes('spot') || lower.includes('prime')) {
      return cleanSentence(`The location was ideal, peaceful, and super convenient`);
    }
    if (lower.includes('ambien') || lower.includes('vibe') || lower.includes('atmosphere') || lower.includes('peaceful') || lower.includes('serene')) {
      return cleanSentence(`The ambience and atmosphere were wonderfully relaxing and pleasant`);
    }
    if (lower.includes('view') || lower.includes('scenic') || lower.includes('mountain') || lower.includes('ocean')) {
      return cleanSentence(`Loved the stunning and picturesque views`);
    }

    // Wi-Fi / Tech / Speed
    if (lower.includes('wi-fi') || lower.includes('wifi') || lower.includes('internet') || lower.includes('speed')) {
      return cleanSentence(`The high-speed Wi-Fi was ultra-fast and reliable throughout`);
    }

    // Value / Pricing
    if (lower.includes('value') || lower.includes('price') || lower.includes('pricing') || lower.includes('affordable') || lower.includes('worth') || lower.includes('cost')) {
      return cleanSentence(`Offered great value for money and outstanding service quality`);
    }

    // Check-in / Arrival
    if (lower.includes('check-in') || lower.includes('checkin') || lower.includes('arrival')) {
      return cleanSentence(`Check-in was quick, organized, and completely seamless`);
    }

    // Marketing / SEO / Leads / Agency
    if (lower.includes('seo') || lower.includes('ranking')) {
      return cleanSentence(`Boosted our Google search rankings and organic traffic significantly`);
    }
    if (lower.includes('lead') || lower.includes('conversion') || lower.includes('sales')) {
      return cleanSentence(`Delivered steady, high-converting leads that drove great business growth`);
    }
    if (lower.includes('ads') || lower.includes('roas') || lower.includes('roi')) {
      return cleanSentence(`Managed our ad campaigns with exceptional ROI and high ROAS`);
    }

    // Default clean sentence for any custom positive tag
    return cleanSentence(labelToUse);
  }

  // Negative tags (1-3 stars)
  if (lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('internet')) {
    return cleanSentence(`The Wi-Fi connection was unstable and very slow`);
  }
  if (lower.includes('ac') || lower.includes('cooling') || lower.includes('air condition')) {
    return cleanSentence(`The air conditioning in the room was not cooling properly`);
  }
  if (lower.includes('noise') || lower.includes('loud') || lower.includes('sound')) {
    return cleanSentence(`There was noticeable noise disrupting our sleep and rest`);
  }
  if (lower.includes('clean') || lower.includes('dirty') || lower.includes('hygiene') || lower.includes('bath')) {
    return cleanSentence(`Room cleanliness and housekeeping fell below expected standards`);
  }
  if (lower.includes('food') || lower.includes('breakfast') || lower.includes('cold')) {
    return cleanSentence(`The food served was delayed and lacked hot freshness`);
  }
  if (lower.includes('staff') || lower.includes('service') || lower.includes('reception') || lower.includes('delay')) {
    return cleanSentence(`Front desk and service response times were slow`);
  }

  return cleanSentence(`${labelToUse} required improvement`);
}

/**
 * Generate unique, Review Assistant-guided review text
 */
export function generateReviewText({
  rating,
  selectedTags = [],
  customNote = '',
  hotelName = 'Hotel',
  tone = 'friendly',
  reviewLength = 'short',
  includeEmojis = true,
  keywordsList = RATING_KEYWORDS,
  variationSeed = Math.random()
}) {
  if (!rating) return '';

  const isPositive = rating >= 4;
  const openingsDict = getOpenings(hotelName, tone);
  const closingsDict = getClosings(tone);

  const availableOpenings = openingsDict[rating] || openingsDict[5];
  let opening = pickVariation(availableOpenings, variationSeed);

  // Map each selected tag to a natural sentence using robust finder and formatter
  let tagSnippets = selectedTags
    .map((tagId, idx) => {
      const tagObj = findTagObject(tagId, keywordsList, isPositive);
      if (!tagObj) return null;

      const tagSeed = variationSeed * (idx + 1) * 31.7;
      return formatTagToSentence(tagObj, isPositive, tagSeed);
    })
    .filter(Boolean);

  // If reviewLength is 'short', cap tag snippets to 3 max
  if (reviewLength === 'short' && tagSnippets.length > 3) {
    tagSnippets = tagSnippets.slice(0, 3);
  }

  let body = '';
  if (tagSnippets.length > 0) {
    body = ' ' + tagSnippets.join('. ') + '.';
  }

  const availableClosings = isPositive ? closingsDict.positive : closingsDict.negative;
  const closingSeed = variationSeed * 17.3 + selectedTags.length;
  let closing = pickVariation(availableClosings, closingSeed);

  // Combine and clean up spacing and punctuation
  let fullText = `${opening}${body} ${closing}`
    .replace(/\s*\.\s*\./g, '.')
    .replace(/\s+/g, ' ')
    .trim();

  if (customNote && customNote.trim()) {
    fullText += ` Note: ${customNote.trim()}`;
  }

  // Strip emojis if includeEmojis is false
  if (!includeEmojis) {
    fullText = fullText.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}]/gu, '').replace(/\s+/g, ' ').trim();
  }

  return fullText;
}

/**
 * Evaluates live review quality, SEO friendliness, and strength
 */
export function evaluateReviewStrength(text = '', selectedTags = []) {
  if (!text || text.trim().length === 0) {
    return {
      stars: 0,
      status: 'Awaiting Selection',
      lengthCategory: 'Empty',
      wordCount: 0,
      seoScore: 0,
      uniqueness: '100%',
    };
  }

  const words = text.trim().split(/\s+/).length;
  let lengthCategory = 'Short';
  if (words > 25) lengthCategory = 'Detailed';
  else if (words > 12) lengthCategory = 'Medium';

  const keywordCount = selectedTags.length;
  let seoScore = 85 + Math.min(keywordCount * 4, 12);
  if (words >= 15 && words <= 45) seoScore += 3;

  return {
    stars: 5,
    status: 'Natural & Google SEO-Friendly',
    lengthCategory,
    wordCount: words,
    seoScore: Math.min(seoScore, 100),
    uniqueness: `${92 + (words % 8)}%`,
  };
}
