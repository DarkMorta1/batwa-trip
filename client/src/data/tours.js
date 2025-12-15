const tours = [
  {
    id: '1',
    title: 'Annapurna Base Camp Trek',
    location: 'Nepal',
    price: 1200,
    days: 12,
    img: '/images/1765290625930.JPG',
    desc: 'A stunning trek to Annapurna Base Camp offering panoramic views of the Annapurna range. Great for nature lovers and adventure seekers.',
    details: {
      expenses: 'Includes accommodation, meals, guide, and permits. Flights not included.',
      itinerary: [
        'Day 1: Arrival in Kathmandu and briefing.',
        'Day 2: Drive to Pokhara.',
        'Day 3: Trek to Tikhedhunga.',
        'Day 4: Trek to Ghorepani.',
        'Day 5: Early morning hike to Poon Hill and trek to Tadapani.',
        'Day 6: Trek to Chhomrong.',
        'Day 7: Trek to Annapurna Base Camp.',
        'Day 8: Trek to Bamboo.',
        'Day 9: Trek to Jhinu Danda.',
        'Day 10: Trek to Nayapul and drive to Pokhara.',
        'Day 11: Return to Kathmandu.',
        'Day 12: Departure.'
      ]
    },
    photos: [
      '/images/1765290625930.JPG',
      '/images/1765290625942.JPG',
      '/images/1765290625950.jpg',
      '/images/1765290625960.jpg',
      '/images/1765290625968.jpg',
      '/images/1765290625980.jpg',
      '/images/1765290625991.jpg',
      '/images/1765290626003.jpg',
    ],
    trending: true,
    upcoming: false
  },
  {
    id: '2',
    title: 'Everest Base Camp Trek',
    location: 'Nepal',
    price: 1500,
    days: 14,
    img: '/images/1765290626017.jpg',
    desc: 'The ultimate adventure trek in Nepal. Reach the base camp of Mount Everest while experiencing Sherpa culture and breathtaking views of the Himalayas.',
    details: {
      expenses: 'Includes accommodation, meals, guide, permits, and flights from Kathmandu to Lukla. Does not include personal expenses.',
      itinerary: [
        'Day 1: Arrival in Kathmandu.',
        'Day 2: Fly to Lukla, trek to Phakding.',
        'Day 3-7: Trek to Everest Base Camp, passing through Namche Bazaar, Tengboche, and Dingboche.',
        'Day 8-10: Explore Everest Base Camp and Kalapatthar for the best views.',
        'Day 11-13: Return trek to Lukla.',
        'Day 14: Fly back to Kathmandu and departure.'
      ]
    },
    photos: [
      '/images/1765290626017.jpg',
      '/images/1765290626029.jpg',
      '/images/1765290626035.jpg',
      '/images/1765290626048.jpg',
      '/images/1765290626058.jpg',
      '/images/1765290626072.jpg',
    ],
    trending: true,
    upcoming: true
  },
  {
    id: '3',
    title: 'Langtang Valley Trek',
    location: 'Nepal',
    price: 950,
    days: 10,
    img: '/images/1765290626088.jpg',
    desc: 'A lesser-known but beautiful trek offering stunning views of Langtang Lirung and the surrounding peaks, with opportunities to immerse in Tamang culture.',
    details: {
      expenses: 'Includes accommodation, meals, guide, and permits. Flights to and from Kathmandu are additional.',
      itinerary: [
        'Day 1: Arrival in Kathmandu.',
        'Day 2: Drive to Syabrubesi.',
        'Day 3-7: Trek through the Langtang Valley, passing through Lama Hotel, Langtang Village, and Kyanjin Gompa.',
        'Day 8-9: Return trek to Syabrubesi.',
        'Day 10: Drive back to Kathmandu and departure.'
      ]
    },
    photos: [
      '/images/1765290626088.jpg',
      '/images/1765290626111.jpg',
      '/images/1765290626117.jpg',
      '/images/1765290626137.jpg',
    ],
    trending: false,
    upcoming: true
  }
]

export default tours
