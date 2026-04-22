# API Migration Documentation

This document summarizes the integration of 35 new API endpoints into the EventLocal application.

## Endpoints Summary

### Authentication & User Management
| Method | Endpoint | Implementation |
| :--- | :--- | :--- |
| POST | `/api/v1/auth/register` | `authStore.register(fullName, email, password, role)` |
| POST | `/api/v1/auth/login` | `authStore.login(email, password)` |
| POST | `/api/v1/auth/forgot-password` | `authStore.forgotPassword(email)` |
| POST | `/api/v1/auth/reset-password` | `authStore.resetPassword(email, token, newPassword)` |
| GET | `/api/v1/users` | `authStore.getUsers()` |
| GET | `/api/v1/users/{id}` | `authStore.getUserById(id)` |
| PUT | `/api/v1/users/{id}` | `authStore.updateUser(id, payload)` |
| DELETE | `/api/v1/users/{id}` | `authStore.deleteUser(id)` |

### Event Management
| Method | Endpoint | Implementation |
| :--- | :--- | :--- |
| GET | `/api/v1/events` | `eventsStore.loadAll()` |
| POST | `/api/v1/events` | `eventsStore.createEvent(payload)` |
| GET | `/api/v1/events/{id}` | `eventsStore.getEventById(id)` |
| PUT | `/api/v1/events/{id}` | `eventsStore.updateEvent(id, payload)` |
| DELETE | `/api/v1/events/{id}` | `eventsStore.deleteEvent(id)` |
| GET | `/api/v1/events/category/{categoryId}` | `eventsStore.getEventsByCategory(catId)` |
| GET | `/api/v1/events/organizer/{userId}` | `eventsStore.getEventsByOrganizer(userId)` |

### Venues & Categories
| Method | Endpoint | Implementation |
| :--- | :--- | :--- |
| GET | `/api/v1/venues` | `eventsStore.loadAll()` |
| POST | `/api/v1/venues` | `eventsStore.createVenue(payload)` |
| PUT | `/api/v1/venues/{id}` | `eventsStore.updateVenue(id, payload)` |
| DELETE | `/api/v1/venues/{id}` | `eventsStore.deleteVenue(id)` |
| GET | `/api/v1/categories` | `eventsStore.loadAll()` |
| POST | `/api/v1/categories` | `eventsStore.createCategory(payload)` |
| PUT | `/api/v1/categories/{id}` | `eventsStore.updateCategory(id, payload)` |
| DELETE | `/api/v1/categories/{id}` | `eventsStore.deleteCategory(id)` |

### Registrations & Reviews
| Method | Endpoint | Implementation |
| :--- | :--- | :--- |
| POST | `/api/v1/registrations` | `eventsStore.registerForEvent(userId, eventId)` |
| GET | `/api/v1/registrations/user/{userId}` | `eventsStore.loadUserData(userId)` |
| GET | `/api/v1/registrations/event/{eventId}` | `eventsStore.getRegistrationsByEvent(eventId)` |
| DELETE | `/api/v1/registrations/{id}` | `eventsStore.cancelRegistration(id)` |
| POST | `/api/v1/reviews` | `eventsStore.submitReview(payload)` |
| GET | `/api/v1/reviews/event/{eventId}` | `eventsStore.getReviewsByEvent(eventId)` |
| DELETE | `/api/v1/reviews/{id}` | `eventsStore.deleteReview(id)` |

### Analytics & Roles
| Method | Endpoint | Implementation |
| :--- | :--- | :--- |
| GET | `/api/v1/analytics/organizer/{userId}` | `eventsStore.loadUserData(userId)` / `eventsStore.stats` |
| GET | `/api/v1/roles` | `eventsStore.getRoles()` |
| POST | `/api/v1/roles` | `eventsStore.createRole(roleName)` |

### Notifications
| Method | Endpoint | Implementation |
| :--- | :--- | :--- |
| GET | `/api/v1/notifications/user/{userId}` | `eventsStore.loadUserData(userId)` |
| PUT | `/api/v1/notifications/{id}/read` | `eventsStore.markRead(id)` |

---

## New Features

### Image Handling
- **Image URL Toggle**: Users can now choose between "Paste URL" and "Upload Image" in event creation.
- **Preview Support**: Uploaded images are previewed instantly.

### Venue Geocoding
- **Best-Way Coordinate Picker**: Integrated OpenStreetMap (OSM) Nominatim for searching addresses.
- **One-Click Location**: Users can click "Use My Current Location" to automatically populate latitude and longitude.

### Management Views
- **Venues Management**: Dedicated view for organizers to manage locations.
- **Categories Management**: Dedicated view for organizers/admins to manage categorization.
- **Role Management**: Underlying API support added to stores.

---

## Maintenance Notes
- All stores now use `id` as the primary identifier while maintaining backward compatibility with `eventID` etc. for transition.
- Analytics are fetched automatically upon login for organizers.
