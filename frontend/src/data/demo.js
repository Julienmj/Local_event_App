export const DEMO_EVENTS = [
  { EventID: '1', Title: 'Kigali Jazz & Wine Evening', CategoryID: 1, CategoryName: 'Music & Art', VenueID: 1, VenueName: 'Inzora Rooftop', EventDate: '2026-04-22', EventTime: '19:00', Price: 15000, Capacity: 200, AttendeesCount: 142, Status: 'upcoming', Description: 'An elegant evening of live jazz with local artists paired with Rwandan wines.', emoji: '🎷', color: '#3d1500' },
  { EventID: '2', Title: 'Tech Founders Meetup', CategoryID: 4, CategoryName: 'Tech', VenueID: 2, VenueName: 'Norrsken House', EventDate: '2026-04-24', EventTime: '17:30', Price: 0, Capacity: 120, AttendeesCount: 89, Status: 'live', Description: 'Monthly Kigali tech startup meetup. Pitches, panels, networking.', emoji: '💻', color: '#0a1520' },
  { EventID: '3', Title: 'Nyamirambo Food Trail', CategoryID: 3, CategoryName: 'Food & Drink', VenueID: 3, VenueName: 'Nyamirambo', EventDate: '2026-04-26', EventTime: '10:00', Price: 8000, Capacity: 80, AttendeesCount: 67, Status: 'upcoming', Description: 'Walk through Nyamirambo sampling local street food and artisan drinks.', emoji: '🍲', color: '#2a0a00' },
  { EventID: '4', Title: 'Gorilla Conservation Run', CategoryID: 2, CategoryName: 'Sports', VenueID: 4, VenueName: 'Volcanoes NP', EventDate: '2026-04-27', EventTime: '06:30', Price: 20000, Capacity: 400, AttendeesCount: 310, Status: 'upcoming', Description: '5K and 10K charity run supporting mountain gorilla conservation.', emoji: '🦍', color: '#0a1a0a' },
  { EventID: '5', Title: 'Community Clean-Up Drive', CategoryID: 5, CategoryName: 'Community', VenueID: 5, VenueName: 'Kimihurura', EventDate: '2026-04-19', EventTime: '08:00', Price: 0, Capacity: 300, AttendeesCount: 203, Status: 'live', Description: 'Monthly neighborhood clean-up and tree-planting initiative.', emoji: '🌿', color: '#041a0a' },
  { EventID: '6', Title: 'Photography Masterclass', CategoryID: 6, CategoryName: 'Education', VenueID: 6, VenueName: 'Ivuka Arts Center', EventDate: '2026-05-02', EventTime: '09:00', Price: 25000, Capacity: 30, AttendeesCount: 28, Status: 'upcoming', Description: 'Professional photography workshop with Kigali photographers.', emoji: '📸', color: '#1a0a00' },
  { EventID: '7', Title: 'Umuganda Art Fair', CategoryID: 1, CategoryName: 'Music & Art', VenueID: 7, VenueName: 'Village Urugwiro', EventDate: '2026-05-05', EventTime: '11:00', Price: 0, Capacity: 600, AttendeesCount: 450, Status: 'upcoming', Description: 'Annual celebration of Rwandan visual arts showcasing 80+ local artists.', emoji: '🎨', color: '#100a1a' },
  { EventID: '8', Title: 'Startup Pitch Night', CategoryID: 4, CategoryName: 'Tech', VenueID: 2, VenueName: 'kLab Hub', EventDate: '2026-05-08', EventTime: '18:00', Price: 5000, Capacity: 150, AttendeesCount: 112, Status: 'upcoming', Description: 'Six handpicked Rwandan startups pitch to investors and mentors.', emoji: '🚀', color: '#0a0a20' },
]

export const DEMO_VENUES = [
  { VenueID: 1, VenueName: 'Inzora Rooftop', Address: 'KN 3 Ave, Kigali', Latitude: -1.9441, Longitude: 30.0619 },
  { VenueID: 2, VenueName: 'Norrsken House', Address: 'KN 4 Rd, Kigali', Latitude: -1.9558, Longitude: 30.0861 },
  { VenueID: 3, VenueName: 'Nyamirambo', Address: 'Nyamirambo, Kigali', Latitude: -1.9821, Longitude: 30.0441 },
  { VenueID: 4, VenueName: 'Volcanoes NP', Address: 'Kinigi, Musanze', Latitude: -1.4733, Longitude: 29.5447 },
  { VenueID: 5, VenueName: 'Kimihurura', Address: 'Kimihurura, Kigali', Latitude: -1.9531, Longitude: 30.0838 },
  { VenueID: 6, VenueName: 'Ivuka Arts Center', Address: 'Kacyiru, Kigali', Latitude: -1.9395, Longitude: 30.0622 },
  { VenueID: 7, VenueName: 'Village Urugwiro', Address: 'Nyarugenge, Kigali', Latitude: -1.9456, Longitude: 30.0588 },
]

export const DEMO_CATS = [
  { CategoryID: 1, CategoryName: 'Music & Art', icon: '🎷' },
  { CategoryID: 2, CategoryName: 'Sports', icon: '⚽' },
  { CategoryID: 3, CategoryName: 'Food & Drink', icon: '🍽️' },
  { CategoryID: 4, CategoryName: 'Tech', icon: '💻' },
  { CategoryID: 5, CategoryName: 'Community', icon: '🤝' },
  { CategoryID: 6, CategoryName: 'Education', icon: '📚' },
]

export const DEMO_NOTIFICATIONS = [
  { NotificationID: '1', Message: 'Your registration for Kigali Jazz & Wine Evening is confirmed.', IsRead: false, CreatedAt: '2026-04-18T10:00:00' },
  { NotificationID: '2', Message: "Tech Founders Meetup starts in 2 days. Don't forget to attend!", IsRead: false, CreatedAt: '2026-04-17T08:00:00' },
  { NotificationID: '3', Message: 'New events in Tech category matching your interests.', IsRead: false, CreatedAt: '2026-04-16T14:00:00' },
  { NotificationID: '4', Message: 'Gorilla Conservation Run: New route map available.', IsRead: true, CreatedAt: '2026-04-15T09:00:00' },
]
