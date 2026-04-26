# LocalEventOrganizer API Testing Guide

## Setup

- Base URL: `http://localhost:5055`
- Start the app: `dotnet run`
- All protected endpoints require a `Bearer` token in the `Authorization` header

---

## Authentication

### Register
```
POST http://localhost:5055/api/v1/auth/register
Content-Type: application/json
```
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Admin"
}
```
> Allowed roles: `Attendee`, `Organizer`, `Admin`

Expected: `200 OK`
```json
{
  "userID": "<guid>",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "Admin"
}
```

---

### Login
```
POST http://localhost:5055/api/v1/auth/login
Content-Type: application/json
```
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Expected: `200 OK`
```json
{
  "token": "eyJhbGci..."
}
```
> **Save this token** — you'll need it for all protected endpoints.

---

## Users

### Get all users (Admin only)
```
GET http://localhost:5055/api/v1/users
Authorization: Bearer <token>
```

---

### Get user by ID
```
GET http://localhost:5055/api/v1/users/<userID>
Authorization: Bearer <token>
```

---

### Update a user
```
PUT http://localhost:5055/api/v1/users/<userID>
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "fullName": "John Updated",
  "email": "john@example.com",
  "role": "Organizer"
}
```

---

### Delete a user (Admin only)
```
DELETE http://localhost:5055/api/v1/users/<userID>
Authorization: Bearer <token>
```
Expected: `204 No Content`

---

## Roles (Admin only)

### Get all roles
```
GET http://localhost:5055/api/v1/roles
Authorization: Bearer <token>
```
Expected: `["Attendee", "Organizer", "Admin"]`

---

### Validate a role
```
POST http://localhost:5055/api/v1/roles
Authorization: Bearer <token>
Content-Type: application/json
```
```json
"Organizer"
```

---

## Categories

### Get all categories (public)
```
GET http://localhost:5055/api/v1/categories
```

---

### Create a category (Admin/Organizer)
```
POST http://localhost:5055/api/v1/categories
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "name": "Music",
  "description": "Music events and concerts"
}
```
Expected: `201 Created` — save the `categoryID` for creating events.

---

### Update a category (Admin/Organizer)
```
PUT http://localhost:5055/api/v1/categories/1
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "name": "Music & Arts",
  "description": "Updated description"
}
```

---

### Delete a category (Admin only)
```
DELETE http://localhost:5055/api/v1/categories/1
Authorization: Bearer <token>
```
Expected: `204 No Content`

---

## Events

### Before testing events — insert a venue

No venues endpoint exists yet, so insert one directly in the database:
```sql
INSERT INTO Venues (Name, Address, City, Capacity)
VALUES ('Main Hall', '123 Main St', 'New York', 500);
```
> Note the `VenueID` returned (should be `1`).

---

### Get all events (public)
```
GET http://localhost:5055/api/v1/events
```

---

### Get event by ID (public)
```
GET http://localhost:5055/api/v1/events/1
```

---

### Get events by category (public)
```
GET http://localhost:5055/api/v1/events/category/1
```

---

### Get events by organizer (public)
```
GET http://localhost:5055/api/v1/events/organizer/<userID>
```

---

### Create an event (Admin/Organizer)
```
POST http://localhost:5055/api/v1/events
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "title": "Summer Music Festival",
  "description": "A great outdoor festival",
  "eventDate": "2025-07-15T18:00:00",
  "maxAttendees": 200,
  "status": "Pending",
  "organizerID": "<your-user-guid>",
  "categoryID": 1,
  "venueID": 1
}
```
> Allowed statuses: `Pending`, `Active`, `Cancelled`, `Completed`

Expected: `201 Created` — save the `eventID`.

---

### Update an event (Admin/Organizer)
```
PUT http://localhost:5055/api/v1/events/1
Authorization: Bearer <token>
Content-Type: application/json
```
```json
{
  "title": "Summer Music Festival 2025",
  "status": "Active"
}
```
> Only send fields you want to update — the rest stay unchanged.

---

### Delete an event (Admin only)
```
DELETE http://localhost:5055/api/v1/events/1
Authorization: Bearer <token>
```
Expected: `204 No Content`

---

## Role Access Summary

| Endpoint | Auth Required | Role |
|---|---|---|
| `POST /api/v1/auth/register` | No | Public |
| `POST /api/v1/auth/login` | No | Public |
| `GET /api/v1/users` | Yes | Admin |
| `GET /api/v1/users/{id}` | Yes | Any |
| `PUT /api/v1/users/{id}` | Yes | Any |
| `DELETE /api/v1/users/{id}` | Yes | Admin |
| `GET /api/v1/roles` | Yes | Admin |
| `POST /api/v1/roles` | Yes | Admin |
| `GET /api/v1/categories` | No | Public |
| `POST /api/v1/categories` | Yes | Admin, Organizer |
| `PUT /api/v1/categories/{id}` | Yes | Admin, Organizer |
| `DELETE /api/v1/categories/{id}` | Yes | Admin |
| `GET /api/v1/events` | No | Public |
| `GET /api/v1/events/{id}` | No | Public |
| `GET /api/v1/events/category/{id}` | No | Public |
| `GET /api/v1/events/organizer/{id}` | No | Public |
| `POST /api/v1/events` | Yes | Admin, Organizer |
| `PUT /api/v1/events/{id}` | Yes | Admin, Organizer |
| `DELETE /api/v1/events/{id}` | Yes | Admin |

---

## Common Error Responses

| Status | Meaning |
|---|---|
| `400 Bad Request` | Invalid role/status value, duplicate email, or missing foreign key |
| `401 Unauthorized` | Missing or expired JWT token |
| `403 Forbidden` | Valid token but insufficient role |
| `404 Not Found` | Resource ID doesn't exist |

---

## Postman Tip

To avoid pasting the token on every request:
1. Create a **Collection** in Postman
2. Go to the collection's **Authorization** tab
3. Set type to `Bearer Token` and paste your token
4. All requests inside the collection will inherit it automatically
