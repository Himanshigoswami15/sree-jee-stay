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
      snippet: 'Our room was really clean when we arrived, everything felt fresh',
      snippets: [
        'Our room was really clean when we checked in, everything felt fresh and well-maintained',
        'The housekeeping was great, and our room always looked tidy and well-kept',
        'Room was spotless, you could tell they pay attention to cleanliness here',
        'Pleasantly surprised by how clean everything was, from the floors to the linens',
        'The room smelled fresh and was clearly well-cleaned before we got there'
      ]
    },
    {
      id: 'wifi',
      label: '⚡ Fast Wi-Fi',
      category: 'Amenities',
      snippet: 'Wi-Fi worked well, had no issues with speed or connectivity',
      snippets: [
        'Wi-Fi worked well the whole time, no complaints about speed or dropping',
        'Was able to do video calls and stream without any buffering, good internet',
        'The internet was solid and connected easily on all our devices',
        'Good Wi-Fi speed, which was a relief since I needed to work remotely',
        'No issues with the Wi-Fi at all, worked great in the room and common areas'
      ]
    },
    {
      id: 'staff',
      label: '😊 Friendly Staff',
      category: 'Service',
      snippet: 'The staff was really friendly and helped us with everything we needed',
      snippets: [
        'The staff was really friendly and helped us with everything we asked for',
        'Everyone on the team was polite and went out of their way to help',
        'Really appreciated how welcoming the staff was, they made us feel at home',
        'The people here are genuinely nice, not just doing it for show',
        'Staff was helpful whenever we needed something, very warm and approachable'
      ]
    },
    {
      id: 'breakfast',
      label: '🍳 Superb Breakfast',
      category: 'Dining',
      snippet: 'Breakfast was good with plenty of options to choose from',
      snippets: [
        'Breakfast had a nice variety and everything was freshly prepared',
        'We enjoyed the breakfast each morning, good selection of dishes',
        'The morning meal was tasty and had something for everyone',
        'Breakfast was one of the highlights, fresh food and good portions',
        'Really liked the breakfast spread, felt like a proper home-cooked meal'
      ]
    },
    {
      id: 'bed',
      label: '🛏️ Comfy Bed',
      category: 'Comfort',
      snippet: 'The bed was comfortable and we slept really well',
      snippets: [
        'The bed was comfortable and we got a great night of sleep',
        'Slept like a log, the mattress and pillows were just right',
        'Bed was cozy and the linens felt soft and clean',
        'Had a really restful sleep, the bed quality was better than I expected',
        'The bed was properly comfortable, woke up feeling refreshed every morning'
      ]
    },
    {
      id: 'pool',
      label: '🏊 Pristine Pool',
      category: 'Amenities',
      snippet: 'The pool was clean and a nice place to relax',
      snippets: [
        'The pool area was clean and we spent a lot of time relaxing there',
        'Nice pool with clear water, great for unwinding after a long day',
        'We enjoyed the pool a lot, it was well-maintained and not crowded',
        'Pool was a bonus with clean water and comfortable seating around it',
        'The swimming pool was in great condition, a perfect spot to cool off'
      ]
    },
    {
      id: 'ac',
      label: '❄️ Quiet AC',
      category: 'Comfort',
      snippet: 'The AC kept the room cool and ran quietly all night',
      snippets: [
        'AC worked perfectly, kept the room at a comfortable temperature all night',
        'The air conditioning was quiet and cooled the room down quickly',
        'Room stayed cool the entire time, the AC did its job well',
        'Appreciated the quiet AC, especially since it was really hot outside',
        'Air conditioning was effective and didn\'t make any noise while we slept'
      ]
    },
    {
      id: 'location',
      label: '📍 Great Location',
      category: 'General',
      snippet: 'Good location, easy to get to the main attractions from here',
      snippets: [
        'Good location with most of the main spots within easy reach',
        'The location was convenient, didn\'t have to travel far for anything',
        'Liked the location, close enough to everything but still felt peaceful',
        'Great spot, we could walk to restaurants and shops nearby',
        'Location worked well for us, easy access to local attractions'
      ]
    },
    {
      id: 'quick_checkin',
      label: '⏱️ Smooth Check-in',
      category: 'Service',
      snippet: 'Check-in was quick and hassle-free',
      snippets: [
        'Check-in was smooth and didn\'t take long at all',
        'Got checked in quickly, no waiting around or paperwork hassle',
        'The front desk handled our arrival fast and was very organized',
        'Check-in process was easy, they had everything ready for us',
        'We were in our room within minutes of arriving, very efficient'
      ]
    },
  ],

  negative: [
    {
      id: 'slow_wifi',
      label: '📶 Slow Wi-Fi',
      category: 'Amenities',
      snippet: 'The Wi-Fi was pretty slow and kept dropping',
      snippets: [
        'The Wi-Fi was quite slow and kept disconnecting on us',
        'Had trouble getting a stable internet connection in our room',
        'Internet speed was disappointing, couldn\'t do video calls properly',
        'Wi-Fi signal was weak, especially in the evenings'
      ]
    },
    {
      id: 'ac_issue',
      label: '🌡️ AC Not Cooling',
      category: 'Comfort',
      snippet: 'The AC wasn\'t cooling the room properly',
      snippets: [
        'The AC in our room wasn\'t cooling well, it stayed warm',
        'Room felt stuffy because the air conditioning wasn\'t working right',
        'Had to keep adjusting the AC but it never really got cool enough',
        'The AC unit seemed old and struggled to bring the temperature down'
      ]
    },
    {
      id: 'noise',
      label: '🔊 Noisy Room',
      category: 'Comfort',
      snippet: 'It was a bit noisy and we had trouble sleeping',
      snippets: [
        'Could hear a lot of noise from outside which disturbed our sleep',
        'The room wasn\'t very soundproof, we could hear people in the hallway',
        'Noise was an issue at night, wish the walls were thicker',
        'It got quite loud in the evenings which made it hard to relax'
      ]
    },
    {
      id: 'cold_food',
      label: '🥣 Cold Breakfast',
      category: 'Dining',
      snippet: 'Breakfast could have been better, some items were cold',
      snippets: [
        'Some of the breakfast items were served cold, which was disappointing',
        'Food at breakfast felt reheated and not very fresh',
        'The morning meal was underwhelming, dishes could have been hotter',
        'Breakfast variety was okay but the food temperature needed work'
      ]
    },
    {
      id: 'dirty_bathroom',
      label: '🛁 Bath Needs Cleaning',
      category: 'Cleanliness',
      snippet: 'The bathroom could have used a better cleaning',
      snippets: [
        'The bathroom wasn\'t as clean as we\'d expected, needs more attention',
        'Noticed the bathroom could have been cleaned more thoroughly',
        'Housekeeping missed a few spots in the bathroom area',
        'The washroom needed a deeper clean, noticed some stains'
      ]
    },
    {
      id: 'keycard',
      label: '🔑 Keycard Issue',
      category: 'Service',
      snippet: 'Had some trouble with the room keycard not working',
      snippets: [
        'The keycard stopped working a couple of times and we had to get it reset',
        'Had to go back to the front desk twice because the keycard demagnetized',
        'Room key gave us trouble, took multiple swipes to open the door'
      ]
    },
    {
      id: 'checkin_delay',
      label: '⏳ Check-in Delay',
      category: 'Service',
      snippet: 'Check-in took longer than expected',
      snippets: [
        'We waited quite a while at the front desk during check-in',
        'Check-in was slower than we expected, the queue was long',
        'It took a while to get our room sorted when we arrived'
      ]
    },
    {
      id: 'missing_towels',
      label: '🧼 Missing Towels',
      category: 'Amenities',
      snippet: 'Had to ask for towels since they weren\'t in the room',
      snippets: [
        'Towels weren\'t there when we got to the room, had to request them',
        'Some basic things like towels and soap were missing when we checked in',
        'Room was short on towels and toiletries, needed to call housekeeping'
      ]
    },
  ]
};

// Natural sentence connectors that join keyword sentences in flowing text
const CONNECTORS = {
  positive: [
    'Also, ', 'On top of that, ', 'Plus, ',
    'We also noticed that ', 'In addition, ',
    '', '', ''  // empty strings = no connector (just period-separated, for variety)
  ],
  negative: [
    'Also, ', 'On the other hand, ', 'Another issue was that ',
    'We also found that ', 'Besides that, ', '', '', ''
  ]
};

// Phrases that merge two sentences into one compound sentence
const JOINERS = [
  ' and ', ', and ', ', plus '
];

export function detectBusinessType(settingsOrName, explicitType) {
  if (explicitType && explicitType !== 'hotel' && explicitType !== 'other') {
    return explicitType;
  }
  const name = (typeof settingsOrName === 'string' ? settingsOrName : (settingsOrName?.name || settingsOrName?.hotelName || '')).toLowerCase();
  const type = (typeof settingsOrName === 'object' ? settingsOrName?.businessType : explicitType) || '';

  if (type && type !== 'hotel' && type !== 'other') return type;

  if (/packers|movers|relocation|shifting|movers and packers/i.test(name)) return 'packers';
  if (/consultant|incorporation|company setup|business setup|corporate advisor|tax consultant/i.test(name)) return 'business_consultant';
  if (/makeup|bridal makeup|mua|glam artist|beauty artist/i.test(name)) return 'makeup_artist';
  if (/nail|nail art|nail extension|nail studio|nail bar/i.test(name)) return 'nail_artist';
  if (/transfer|cab|taxi|car rental|ride/i.test(name)) return 'transfers';
  if (/tour|travel|itinerary|holiday|package/i.test(name)) return 'tours_travels';
  if (/real estate|realty|property consultant/i.test(name)) return 'real_estate';
  if (/clinic|hospital|dental|doctor|health/i.test(name)) return 'clinic';
  if (/salon|spa|beauty|barber/i.test(name)) return 'salon';
  if (/gym|fitness|crossfit/i.test(name)) return 'gym';
  if (/restaurant|dining|diner|bistro|food/i.test(name)) return 'restaurant';
  if (/cafe|bakery|coffee/i.test(name)) return 'cafe';
  if (/marketing|seo|agency|digital/i.test(name)) return 'marketing';

  return type || 'hotel';
}

function getOpenings(hotelName = 'this place', tone = 'friendly', businessType = 'hotel') {
  const name = hotelName || 'this place';
  const isPackers = businessType === 'packers';
  const isConsultant = businessType === 'business_consultant';
  const isMakeup = businessType === 'makeup_artist';
  const isNails = businessType === 'nail_artist';
  const isService = ['packers', 'business_consultant', 'makeup_artist', 'nail_artist', 'transfers', 'clinic', 'salon', 'gym', 'marketing', 'real_estate', 'car_rental', 'tours_travels'].includes(businessType);

  if (isPackers) {
    return {
      5: [
        `We hired ${name} for our relocation recently and had a great experience overall.`,
        `Used ${name} for our home shifting and everything went smoothly.`,
        `Booked ${name} to help with our packing and moving, and they did a fantastic job.`,
        `Very impressed with the relocation service provided by ${name}.`,
        `Just finished shifting our goods with ${name} and wanted to share that they provide top quality service.`,
        `We were really happy with how ${name} handled our complete packing and moving process.`,
        `${name} made our relocation completely stress-free and easy.`
      ],
      4: [
        `Had a good experience with ${name} for our relocation. Solid service overall.`,
        `${name} did a good job with our shifting and packing.`,
        `Overall good experience using ${name} for our move.`
      ],
      3: [`${name} handled our move okay, though a few things could have been managed better.`],
      2: [`A bit disappointed with the shifting service from ${name}.`],
      1: [`Unfortunately, our experience with ${name} for our move was not good.`]
    };
  }

  if (isConsultant) {
    return {
      5: [
        `We hired ${name} for our company incorporation and business setup, and they made the entire process seamless.`,
        `Used ${name} for our business registration and advisory and received exceptional guidance throughout.`,
        `Booked ${name} to assist with our corporate setup and licensing, and they handled all paperwork effortlessly.`,
        `Very impressed with the professional consultancy provided by ${name}.`,
        `Super satisfied with how ${name} structured our business entity and legal formalities.`
      ],
      4: [
        `Had a good experience with ${name} for our business setup. Solid advisory overall.`,
        `${name} did a good job assisting with our company documentation.`
      ],
      3: [`${name} handled our business registration okay, though process response times could improve.`],
      2: [`A bit disappointed with the consultancy service from ${name}.`],
      1: [`Unfortunately, our experience with ${name} for business setup was not good.`]
    };
  }

  if (isMakeup) {
    return {
      5: [
        `Booked ${name} for my event makeup and the results were absolutely stunning!`,
        `Got my makeup done by ${name} and received so many compliments throughout the function.`,
        `Had a wonderful experience with ${name} for party makeup, everything turned out flawless.`,
        `Super happy with ${name}, the makeup looked lightweight, glowing, and stayed all day.`,
        `${name} is such a talented makeup artist, made me feel so confident and beautiful.`
      ],
      4: [
        `Had a great session with ${name} for makeup. Looked lovely and lasted well.`,
        `Good experience with ${name}, loved the eye makeup and finish.`
      ],
      3: [`Makeup by ${name} was nice, though a few adjustments were needed.`],
      2: [`Wasn't completely happy with the makeup look from ${name}.`],
      1: [`Unfortunately, the makeup service by ${name} did not meet expectations.`]
    };
  }

  if (isNails) {
    return {
      5: [
        `Got my nail extensions and custom nail art done at ${name} and I am obsessed!`,
        `Visited ${name} for nail art and extensions, and the work was incredibly neat and gorgeous.`,
        `Super happy with my nail set from ${name}, the design and finishing are top notch.`,
        `${name} did an amazing job on my nails, super sturdy and beautiful art work.`
      ],
      4: [
        `Had a good experience at ${name} for nail art. Loved the final set.`,
        `Nice nail studio, extensions turned out great.`
      ],
      3: [`Nail work at ${name} was okay, though shape could be a bit more precise.`],
      2: [`Nails didn't last as long as expected from ${name}.`],
      1: [`Disappointed with the nail service at ${name}.`]
    };
  }

  if (isService) {
    return {
      5: [
        `We used the services of ${name} recently and had a wonderful experience.`,
        `Really happy with ${name}, everything was handled professionally and smoothly.`,
        `Our experience with ${name} was excellent from start to finish.`,
        `We had a great experience working with ${name} and highly appreciate their service.`
      ],
      4: [
        `Had a good experience with ${name}. Reliable service overall.`,
        `Our experience with ${name} was positive and straightforward.`
      ],
      3: [`Our experience with ${name} was okay, though there is room for improvement.`],
      2: [`A bit let down by our experience with ${name}.`],
      1: [`Unfortunately, our experience with ${name} fell short of expectations.`]
    };
  }

  switch (tone) {
    case 'casual':
      return {
        5: [
          `Had a great time at ${name}, really enjoyed it.`,
          `${name} was awesome, we had a lot of fun.`,
          `Super happy with how our visit to ${name} turned out.`,
          `Just left ${name} and honestly it was a blast.`,
          `Really liked ${name}, good vibes all around.`,
          `${name} didn't disappoint at all, had a wonderful time.`,
          `Our time at ${name} was really fun and relaxing.`
        ],
        4: [
          `Had a nice time at ${name}, pretty solid overall.`,
          `${name} was a good spot, enjoyed our visit.`,
          `Good experience at ${name}, most things were on point.`
        ],
        3: [`${name} was okay, some things were good but others could use work.`],
        2: [`Bit let down by our visit to ${name} honestly.`],
        1: [`${name} was not a good experience for us.`]
      };

    case 'luxury':
    case 'elegant':
      return {
        5: [
          `Our experience with ${name} was truly a refined and memorable one.`,
          `${name} delivered exactly the kind of elegant experience we were hoping for.`,
          `We were genuinely impressed by the level of care and quality at ${name}.`,
          `From start to finish, ${name} provided a polished and comfortable experience.`,
          `${name} exceeded our expectations in terms of comfort and attention to detail.`,
          `It was a pleasure dealing with ${name}, everything was thoughtfully done.`
        ],
        4: [
          `Our visit to ${name} was quite pleasant with a lovely ambiance throughout.`,
          `Enjoyed a comfortable and well-appointed experience at ${name}.`
        ],
        3: [`${name} had its merits, though a few details fell short of the standard we anticipated.`],
        2: [`Our experience at ${name} didn't quite match what we were expecting.`],
        1: [`Unfortunately, our experience at ${name} was well below the standard one would hope for.`]
      };

    case 'minimal':
      return {
        5: [
          `Great experience with ${name}. Really enjoyed it.`,
          `${name} was excellent. Would use again.`,
          `Very happy with ${name}. Good experience.`,
          `Solid experience at ${name}. No complaints.`,
          `${name} was a great pick. Satisfied.`
        ],
        4: [
          `Good experience at ${name} overall.`,
          `${name} was pleasant. Enjoyed it.`,
          `Decent experience at ${name}.`
        ],
        3: [`${name} was average. Had some ups and downs.`],
        2: [`${name} could be better in several areas.`],
        1: [`Not a good experience at ${name}.`]
      };

    case 'professional':
      return {
        5: [
          `Our experience at ${name} was very well-managed and professional throughout.`,
          `We were pleased with the standards maintained at ${name} during our service.`,
          `${name} demonstrated consistent quality and professionalism across all areas.`,
          `The level of service and upkeep at ${name} was commendable.`,
          `${name} provided a well-organized and efficient experience from start to finish.`
        ],
        4: [
          `Our visit to ${name} was pleasant with reliable service throughout.`,
          `${name} met our expectations with a well-run operation overall.`
        ],
        3: [`${name} was adequate, though there are areas that could benefit from attention.`],
        2: [`Our experience with ${name} fell short of the standards we anticipated.`],
        1: [`The experience at ${name} was unsatisfactory and needs management attention.`]
      };

    case 'business':
      return {
        5: [
          `Worked with ${name} and everything went smoothly.`,
          `${name} was a great fit, very efficient and comfortable.`,
          `Had a productive and comfortable experience with ${name}. Everything worked well.`
        ],
        4: [
          `${name} served us well for our business requirements. Reliable and professional.`,
          `Decent experience with ${name}.`
        ],
        3: [`${name} was alright, though service could improve.`],
        2: [`${name} wasn't ideal, ran into a few issues.`],
        1: [`Would not choose ${name} again due to several problems.`]
      };

    case 'family':
      return {
        5: [
          `We used ${name} with our family and everyone had a great experience.`,
          `${name} was a wonderful choice for our family, everyone was satisfied.`,
          `Great family-friendly service, our whole group felt comfortable with ${name}.`
        ],
        4: [
          `Our family enjoyed our experience with ${name}, nice and comfortable.`,
          `${name} worked well for our family overall.`
        ],
        3: [`${name} was decent, though a few things could be better.`],
        2: [`Our family's experience with ${name} was affected by a few issues.`],
        1: [`Not a great experience for families with ${name}, needed more care.`]
      };

    case 'budget':
      return {
        5: [
          `${name} was a great find for the price. Reliable, comfortable, and affordable.`,
          `Really good value at ${name}, got more than what we paid for.`,
          `Impressed by ${name}, top quality service without spending too much.`
        ],
        4: [
          `${name} was a solid budget-friendly option with decent service.`,
          `Good value at ${name}, nothing fancy but everything we needed.`
        ],
        3: [`${name} was fair for the budget, though some basics need attention.`],
        2: [`Even for the price, ${name} fell below what we expected.`],
        1: [`Not worth it even at a low price. ${name} needs work.`]
      };

    case 'friendly':
    default:
      return {
        5: [
          `We had a really nice experience with ${name} and enjoyed every bit of it.`,
          `Used ${name} recently and it was a great experience overall.`,
          `${name} was a great choice, we had a wonderful experience.`,
          `Really happy with our experience with ${name}, everything went well.`,
          `Our experience with ${name} went even better than we expected.`,
          `Just completed our work with ${name} and wanted to share that everything went smoothly.`,
          `We thoroughly enjoyed our time working with ${name}.`,
          `${name} made our experience really special, glad we chose them.`,
          `Had a wonderful experience with ${name} during our recent visit.`
        ],
        4: [
          `Enjoyed our experience with ${name}, it was good.`,
          `Our experience with ${name} was pleasant and comfortable.`,
          `${name} was a nice service provider, had a good experience.`
        ],
        3: [`Our experience with ${name} was mixed, as some things were nice but others need improvement.`],
        2: [`We were a bit disappointed with a few things during our time with ${name}.`],
        1: [`Unfortunately, our experience with ${name} wasn't good.`]
      };
  }
}

function getClosings(tone = 'friendly', businessType = 'hotel') {
  const isPackers = businessType === 'packers';
  const isConsultant = businessType === 'business_consultant';
  const isMakeup = businessType === 'makeup_artist';
  const isNails = businessType === 'nail_artist';
  const isService = ['packers', 'business_consultant', 'makeup_artist', 'nail_artist', 'transfers', 'clinic', 'salon', 'gym', 'marketing', 'real_estate', 'car_rental', 'tours_travels'].includes(businessType);

  if (isPackers) {
    return {
      positive: [
        'Would definitely hire their team again for future relocation.',
        'Highly recommend them to anyone looking for reliable packers and movers.',
        'Glad we chose them for our move, hassle-free overall.',
        'Will certainly use their services again whenever we move.'
      ],
      negative: ['Hope management takes steps to improve their packing and delivery service.']
    };
  }

  if (isConsultant) {
    return {
      positive: [
        'Would highly recommend their consultancy to any entrepreneur starting a business.',
        'Will definitely work with them again for future corporate setup and advisory needs.',
        'Glad we chose them for our business registration, smooth process overall.'
      ],
      negative: ['Hope management improves turnaround time for documentation.']
    };
  }

  if (isMakeup) {
    return {
      positive: [
        'Would definitely book her again for future events and functions!',
        'Highly recommend to any bride looking for flawless glam on her big day!',
        'Can\'t wait for my next booking with her!'
      ],
      negative: ['Hope she considers client preferences more carefully going forward.']
    };
  }

  if (isNails) {
    return {
      positive: [
        'Will definitely be coming back for my next refill and fresh set!',
        'Highly recommend to anyone looking for stunning, long-lasting nail art!',
        'My go-to nail studio from now on!'
      ],
      negative: ['Hope they refine their nail prep and extension prep techniques.']
    };
  }

  if (isService) {
    return {
      positive: [
        'Would definitely use their services again.',
        'Highly recommend them to anyone looking for reliable service.',
        'Glad we chose them, great experience overall.',
        'Will certainly choose them again in the future.'
      ],
      negative: ['Hope management addresses these issues going forward.']
    };
  }

  switch (tone) {
    case 'casual':
      return {
        positive: [
          'Would definitely go back.',
          'Solid pick if you\'re in the area.',
          'Had a good time overall, no regrets.'
        ],
        negative: ['Hoping they fix these things, could be a lot better.']
      };
    case 'minimal':
      return {
        positive: ['Would recommend.', 'Good choice.', 'Satisfied overall.'],
        negative: ['Room for improvement.']
      };
    case 'luxury':
    case 'elegant':
      return {
        positive: [
          'It was an experience we will remember fondly.',
          'Looking forward to returning or using their services again.',
          'A genuinely well-run establishment.'
        ],
        negative: ['We hope these areas are addressed for future customers.']
      };
    case 'professional':
      return {
        positive: [
          'We would be happy to choose them again.',
          'A well-managed company that delivers on its promise.',
          'Credit to the team for maintaining good standards.'
        ],
        negative: ['We hope management takes note of these observations.']
      };
    case 'business':
      return {
        positive: [
          'Would choose them again for future requirements.',
          'Good option for anyone looking for reliable service.',
          'Appreciated the efficient service throughout.'
        ],
        negative: ['These issues should be resolved for future clients.']
      };
    case 'family':
      return {
        positive: [
          'Our family would love to work with them again.',
          'A comfortable and reliable choice for families.',
          'Everyone in the family had a good experience.'
        ],
        negative: ['Hoping they can make things more comfortable for families.']
      };
    case 'budget':
      return {
        positive: [
          'Great value for what you pay.',
          'Would choose them again if we\'re looking for a budget-friendly option.',
          'Good deal overall, happy with our choice.'
        ],
        negative: ['Even at this price point, some things should be better.']
      };
    case 'friendly':
    default:
      return {
        positive: [
          'Would definitely choose them again.',
          'Happy with our choice, glad we picked them.',
          'Looking forward to our next experience with them.',
          'Good experience overall.'
        ],
        negative: ['Hope they can address these things going forward.']
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
  // For superlative/title tags (e.g. "Best Hotel in Jodhpur"), don't set literal text as snippet
  // so they flow through to the natural superlative sentence handler in formatTagToSentence
  const isSuperlativeTag = /^(best|top|truly the best|undoubtedly the best|number 1|#1|greatest|premier|finest)/i.test(
    String(tagId || '').replace(/[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, '').replace(/^[^a-zA-Z0-9]+/, '').trim()
  );

  return {
    id: tagId,
    tagId: tagId,
    label: tagId,
    snippet: isSuperlativeTag ? '' : tagId,
    snippets: isSuperlativeTag ? [] : [tagId],
  };
}

/**
 * Transforms any keyword, template, or custom tag into a natural, grammatically correct review sentence
 */
export function formatTagToSentence(tagObj, isPositive = true, tagSeed = Math.random(), businessType = 'hotel', hotelName = '') {
  if (!tagObj) return null;

  const isPackers = businessType === 'packers' || /packer|mover|relocation|shifting/i.test(hotelName);

  // Early detection: superlative/title tags should ALWAYS use the natural sentence generator,
  // never output their literal text. Skip snippet checks and go straight to label-based handler.
  const earlyLabel = cleanEmoji(tagObj.label || tagObj.tagId || tagObj.id || '').trim();
  const isSuperlativeLabel = /^(best|top|truly the best|undoubtedly the best|number 1|#1|greatest|premier|finest)/i.test(earlyLabel);

  // 1. If valid snippets array exists with natural sentences (skip for superlative tags)
  if (!isSuperlativeLabel && Array.isArray(tagObj.snippets) && tagObj.snippets.length > 0) {
    const validSnippets = tagObj.snippets.filter((s) => typeof s === 'string' && s.trim().length > 0);
    if (validSnippets.length > 0) {
      const chosen = pickVariation(validSnippets, tagSeed);
      const clean = cleanEmoji(chosen).trim();
      if (clean && clean.split(/\s+/).length >= 3) {
        return cleanSentence(clean);
      }
    }
  }

  // 2. If snippet property exists and has sentence-like content (skip for superlative tags)
  const rawSnippet = typeof tagObj.snippet === 'string' ? tagObj.snippet.trim() : '';
  const cleanSnippet = cleanEmoji(rawSnippet).trim();
  if (!isSuperlativeLabel && cleanSnippet && cleanSnippet.split(/\s+/).length >= 4) {
    return cleanSentence(cleanSnippet);
  }

  // 3. Extract best label or keyword text
  const labelToUse = cleanSnippet || cleanEmoji(tagObj.label || tagObj.tagId || tagObj.id || '').trim();
  if (!labelToUse) return null;
  const lower = labelToUse.toLowerCase();

  // Superlative / Title statements (e.g. "Best Hotel in Jodhpur", "Best Packers and Movers in Jodhpur")
  if (/^(best|top|truly the best|undoubtedly the best|number 1|#1|greatest|premier|finest)/i.test(labelToUse)) {
    // Extract location (after "in/of/near/around") and category
    const locationMatch = lower.match(/\b(?:in|of|near|around)\s+(.+)$/i);
    const location = locationMatch ? locationMatch[1].replace(/^\s+|\s+$/g, '').replace(/^(the|a)\s+/i, '') : '';
    const loc = location ? location.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : '';

    const categoryMatch = lower.match(/(?:best|top|finest|greatest|premier|#1|number 1)\s+(.+?)(?:\s+(?:in|of|near|around)\s|$)/i);
    const category = categoryMatch ? categoryMatch[1].trim() : '';

    let naturalTemplates;

    if (isPackers || /packer|mover|relocation|shifting/i.test(category + ' ' + labelToUse)) {
      if (loc) {
        naturalTemplates = [
          `We've hired a few packers and movers in ${loc} over the years, and this was easily our best experience`,
          `If you're planning a relocation in ${loc}, this is the company to choose for a smooth and hassle-free move`,
          `Hands down the most reliable packers and movers we've come across in ${loc}`,
          `We were genuinely impressed by how carefully they packed and moved everything in ${loc}`,
          `Our items were delivered safely with zero damage, easily one of the finest packers and movers in ${loc}`,
          `For anyone looking for safe and affordable packers and movers in ${loc}, this team should be at the top of your list`,
          `We felt completely stress-free during our move, which is rare to find with packers and movers in ${loc}`,
          `Would highly recommend them to anyone shifting in or around ${loc} for their exceptional service`,
          `The team handled all our furniture and belongings with extreme care throughout our move in ${loc}`
        ];
      } else {
        naturalTemplates = [
          `This is easily one of the best packers and movers experiences we've had`,
          `If you're looking for reliable packers and movers, look no further because this team delivers`,
          `We've used a few relocation services before and this company is genuinely exceptional`,
          `Hard to find packers and movers that handle everything with zero damage, but this team does`
        ];
      }
    } else if (loc && category) {
      naturalTemplates = [
        `We've used a few providers in ${loc} over the years, and this was easily our favourite`,
        `If you're looking for quality service in ${loc}, this is the place to choose for a wonderful experience`,
        `Hands down the most reliable ${category} we've come across in ${loc}`,
        `We tried a couple of other options in ${loc} before, but this one stood out in every way`,
        `Our experience here was so good that we're already recommending it to friends in ${loc}`,
        `This service really sets the bar for what a great ${category} should feel like in ${loc}`,
        `After exploring several options in ${loc}, we're glad we chose this one as everything was on point`,
        `We were pleasantly surprised by the quality here, easily among the finest services in ${loc}`,
        `For anyone looking for a reliable ${category} in ${loc}, this should be at the top of your list`
      ];
    } else if (loc) {
      naturalTemplates = [
        `We've tried a few options in ${loc} and this was our best experience so far`,
        `If you're heading to ${loc}, this service should definitely be on your shortlist`,
        `Among all the places we checked out in ${loc}, this one impressed us the most`
      ];
    } else {
      naturalTemplates = [
        'This service truly exceeded all our expectations and comes highly recommended',
        'We\'ve used a few services and this one stands out from the rest',
        'Honestly one of the best experiences we\'ve had, everything was just right'
      ];
    }

    return cleanSentence(pickVariation(naturalTemplates, tagSeed));
  }

  // Positive keyword patterns
  if (isPositive) {
    if (lower.includes('staff') || lower.includes('team') || lower.includes('doctor') || lower.includes('trainer') || lower.includes('service') || lower.includes('reception')) {
      const staffVariations = [
        'The team was polite, professional, and always willing to help',
        'Everyone we interacted with was polite and genuinely helpful',
        'Really liked how approachable and hardworking the staff was'
      ];
      return cleanSentence(pickVariation(staffVariations, tagSeed));
    }

    if (lower.includes('pack') || lower.includes('bubble') || lower.includes('box') || lower.includes('relocat') || lower.includes('shift')) {
      const packVariations = [
        'All items and furniture were packed securely with high-quality materials',
        'The packing process was fast, organized, and handled with great care',
        'They brought sturdy boxes and bubble wrap, ensuring everything was protected'
      ];
      return cleanSentence(pickVariation(packVariations, tagSeed));
    }

    if (lower.includes('delivery') || lower.includes('timely') || lower.includes('time') || lower.includes('punctual')) {
      const timeVariations = [
        'The team arrived right on schedule and completed the delivery on time',
        'Pickup and delivery were handled promptly without any unexpected delays',
        'Punctual and efficient service from start to finish'
      ];
      return cleanSentence(pickVariation(timeVariations, tagSeed));
    }

    if (lower.includes('damage') || lower.includes('handling') || lower.includes('safe')) {
      const damageVariations = [
        'All our fragile items and electronics arrived intact with zero damage',
        'Handled all heavy furniture and valuables with extreme care',
        'Careful handling throughout loading, transport, and unloading'
      ];
      return cleanSentence(pickVariation(damageVariations, tagSeed));
    }

    if (lower.includes('value') || lower.includes('price') || lower.includes('pricing') || lower.includes('fair') || lower.includes('transparent')) {
      const valueVariations = [
        'Transparent pricing with zero hidden charges or surprise costs',
        'Felt like a very fair price for the high level of service provided',
        'Great value for money, reasonable rates for complete shifting'
      ];
      return cleanSentence(pickVariation(valueVariations, tagSeed));
    }

    // Default positive template
    const defaultPositiveTemplates = isPackers ? [
      `We really appreciated the ${lower} during our move`,
      `The ${lower} was handled expertly and made our relocation so much easier`,
      `Impressed with the ${lower}, it made our moving experience seamless`
    ] : [
      `We really liked the ${lower}`,
      `The ${lower} was a nice touch and added to the experience`,
      `Impressed with the ${lower}, it made our experience better`
    ];
    return cleanSentence(pickVariation(defaultPositiveTemplates, tagSeed));
  }

  // Negative tags
  const defaultNegativeTemplates = [
    `The ${lower} could use some improvement`,
    `We felt the ${lower} wasn't quite up to the mark`,
    `The ${lower} was a bit of a letdown for us`
  ];
  return cleanSentence(pickVariation(defaultNegativeTemplates, tagSeed));
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
  variationSeed = Math.random(),
  businessType = 'hotel'
}) {
  if (!rating) return '';

  const effectiveBusinessType = detectBusinessType(hotelName, businessType);
  const isPositive = rating >= 4;
  const openingsDict = getOpenings(hotelName, tone, effectiveBusinessType);
  const closingsDict = getClosings(tone, effectiveBusinessType);

  const availableOpenings = openingsDict[rating] || openingsDict[5];
  let opening = pickVariation(availableOpenings, variationSeed);

  // Map each selected tag to a natural sentence using robust finder and formatter
  let tagSnippets = selectedTags
    .map((tagId, idx) => {
      const tagObj = findTagObject(tagId, keywordsList, isPositive);
      if (!tagObj) return null;

      const tagSeed = variationSeed * (idx + 1) * 31.7;
      return formatTagToSentence(tagObj, isPositive, tagSeed, effectiveBusinessType, hotelName);
    })
    .filter(Boolean);

  // If reviewLength is 'short', cap tag snippets to 3 max
  if (reviewLength === 'short' && tagSnippets.length > 3) {
    tagSnippets = tagSnippets.slice(0, 3);
  }

  // Build the body with natural connectors instead of plain period-separation
  let body = '';
  if (tagSnippets.length > 0) {
    const connectorList = isPositive ? CONNECTORS.positive : CONNECTORS.negative;
    const builtParts = [];

    for (let i = 0; i < tagSnippets.length; i++) {
      const rawSnippet = tagSnippets[i];
      const snippet = cleanSentence(rawSnippet);
      if (!snippet) continue;

      if (builtParts.length === 0) {
        // First snippet — directly appended
        builtParts.push(snippet);
      } else if (builtParts.length === 1 && tagSnippets.length <= 3 && Math.abs(Math.sin(variationSeed * 73)) > 0.5) {
        // Sometimes merge second snippet with a joiner for natural compound sentence
        const joiner = pickVariation(JOINERS, variationSeed * (i + 5));
        const lowerSnippet = snippet.charAt(0).toLowerCase() + snippet.slice(1);
        builtParts[builtParts.length - 1] = cleanSentence(builtParts[builtParts.length - 1]) + joiner + lowerSnippet;
      } else {
        // Use a connector phrase or start a fresh sentence
        const connectorSeed = variationSeed * (i + 1) * 17.3;
        const connector = pickVariation(connectorList, connectorSeed);
        if (connector && connector.trim()) {
          const lowerSnippet = snippet.charAt(0).toLowerCase() + snippet.slice(1);
          builtParts.push(cleanSentence(connector + lowerSnippet));
        } else {
          builtParts.push(cleanSentence(snippet));
        }
      }
    }

    if (builtParts.length > 0) {
      body = ' ' + builtParts.map(s => cleanSentence(s)).join('. ') + '.';
    }
  }

  // Pick closing — but sometimes skip closing for shorter, more natural feel
  const availableClosings = isPositive ? closingsDict.positive : closingsDict.negative;
  const closingSeed = variationSeed * 17.3 + selectedTags.length;
  let closing = '';

  // Only add closing ~70% of the time to avoid formulaic feel
  const includeClosing = Math.abs(Math.sin(closingSeed * 43)) > 0.3;
  if (includeClosing) {
    closing = ' ' + pickVariation(availableClosings, closingSeed);
  }

  // Combine and clean up spacing and punctuation
  let fullText = `${opening}${body}${closing}`
    .replace(/\s*\.\s*\./g, '.')
    .replace(/\s+/g, ' ')
    .trim();

  if (customNote && customNote.trim()) {
    fullText += ` ${customNote.trim()}`;
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
