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
 * Generate unique, Review Assistant-guided review text
 */
export function generateReviewText({
  rating,
  selectedTags = [],
  customNote = '',
  hotelName = 'Sree Jee Stay',
  tone = 'friendly',
  reviewLength = 'short',
  includeEmojis = true,
  mentionStaff = true,
  mentionCleanliness = true,
  mentionFood = true,
  mentionLocation = true,
  keywordsList = RATING_KEYWORDS,
  variationSeed = Math.random()
}) {
  if (!rating) return '';

  const isPositive = rating >= 4;
  const openingsDict = getOpenings(hotelName, tone);
  const closingsDict = getClosings(tone);

  const availableOpenings = openingsDict[rating] || openingsDict[5];
  let opening = pickVariation(availableOpenings, variationSeed);

  const selectedList = isPositive
    ? (keywordsList.positive || RATING_KEYWORDS.positive)
    : (keywordsList.negative || RATING_KEYWORDS.negative);

  let tagSnippets = selectedTags
    .map((tagId, idx) => {
      const tagObj = selectedList.find(t => t.id === tagId || t.tagId === tagId);
      if (!tagObj) return null;

      // Honor style toggles
      if (!mentionStaff && tagObj.category === 'Service') return null;
      if (!mentionCleanliness && tagObj.category === 'Cleanliness') return null;
      if (!mentionFood && tagObj.category === 'Dining') return null;
      if (!mentionLocation && tagObj.category === 'General') return null;

      const tagSeed = variationSeed * (idx + 1) * 31.7;

      if (tagObj.snippets && tagObj.snippets.length > 0) {
        return pickVariation(tagObj.snippets, tagSeed);
      }
      if (tagObj.snippet && tagObj.snippet.trim().length > 3) {
        return tagObj.snippet.trim();
      }

      // Format custom raw label into natural sentence
      const rawLabel = (tagObj.label || '').replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}]/gu, '').trim();
      if (!rawLabel) return null;
      const lower = rawLabel.toLowerCase();

      if (lower.includes('staff') || lower.includes('doctor') || lower.includes('barista') || lower.includes('trainer') || lower.includes('stylist')) {
        return `the ${lower} were exceptionally friendly, attentive, and helpful`;
      }
      if (lower.includes('room') || lower.includes('clean') || lower.includes('salon') || lower.includes('clinic')) {
        return `the ${lower} was spotlessly clean and pristine`;
      }
      if (lower.includes('food') || lower.includes('coffee') || lower.includes('breakfast') || lower.includes('pastry') || lower.includes('dessert') || lower.includes('drink')) {
        return `the ${lower} was fresh, delicious, and full of flavor`;
      }
      if (lower.includes('location')) {
        return `the location was ideal and very convenient`;
      }
      if (lower.includes('bed') || lower.includes('seat') || lower.includes('vibe') || lower.includes('ambience') || lower.includes('atmosphere')) {
        return `the ${lower} was cozy, comfortable, and pleasant`;
      }
      if (lower.includes('wi-fi') || lower.includes('wifi') || lower.includes('equipment')) {
        return `the ${lower} was ultra-fast and top quality`;
      }
      if (lower.includes('price') || lower.includes('value') || lower.includes('pricing') || lower.includes('cost')) {
        return `the ${lower} offered great value for money`;
      }

      return `the ${lower} was wonderful`;
    })
    .filter(Boolean);

  // If reviewLength is 'short', cap tag snippets to 2 max
  if (reviewLength === 'short' && tagSnippets.length > 2) {
    tagSnippets = tagSnippets.slice(0, 2);
  }

  let body = '';
  if (tagSnippets.length > 0) {
    if (isPositive) {
      body = ' ' + tagSnippets.join('. ') + '.';
    } else {
      body = ' Specifically, ' + tagSnippets.join(', and ') + '.';
    }
  }

  const availableClosings = isPositive ? closingsDict.positive : closingsDict.negative;
  const closingSeed = variationSeed * 17.3 + selectedTags.length;
  let closing = pickVariation(availableClosings, closingSeed);

  let fullText = `${opening}${body} ${closing}`.replace(/\s+/g, ' ').trim();

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
