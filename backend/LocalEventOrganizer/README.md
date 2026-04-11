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
```

Every endpoint was tested using swagger and thunderClient extension