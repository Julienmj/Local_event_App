# Local Event Organizer APP

## Project Overview

This is a simple event organizer app that allows users to create, view, and manage events.


## Installing

clone the repo, then in terminal from the same project structure/location run `dotnet restore` to retrieve folders like `bin` and `obj`.

then continue you work as usual

## Structure

<b>`BASE API = https://localhost/5055/api/v1/`</b>

## apis: 

```csharp
Auth : 
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/users
GET    /api/v1/users/{id}
PUT    /api/v1/users/{id}
DELETE /api/v1/users/{id}

Roles:
GET    /api/v1/roles
POST   /api/v1/roles

Events: 
GET    /api/v1/events
GET    /api/v1/events/{id}
POST   /api/v1/events
PUT    /api/v1/events/{id}
DELETE /api/v1/events/{id}
GET    /api/v1/events/category/{categoryId}
GET    /api/v1/events/organizer/{userId}

Categoty:
GET    /api/v1/events
GET    /api/v1/events/{id}
POST   /api/v1/events
PUT    /api/v1/events/{id}
DELETE /api/v1/events/{id}
GET    /api/v1/events/category/{categoryId}
GET    /api/v1/events/organizer/{userId}

Venues:
GET    /api/v1/venues
POST   /api/v1/venues
PUT    /api/v1/venues/{id}
DELETE /api/v1/venues/{id}

Registration:
POST   /api/v1/registrations
GET    /api/v1/registrations/user/{userId}
GET    /api/v1/registrations/event/{eventId}
DELETE /api/v1/registrations/{id}

Reviews:
POST   /api/v1/reviews
GET    /api/v1/reviews/event/{eventId}
DELETE /api/v1/reviews/{id}

Notifications:
GET    /api/v1/notifications/user/{userId}
PUT    /api/v1/notifications/{id}/read
```

Every endpoint was tested using swagger and thunderClient extension
