-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- 1. USERS
-- =========================
CREATE TABLE Users (
    UserID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,

    Role VARCHAR(20) NOT NULL DEFAULT 'Attendee',

    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT CK_User_Role CHECK (Role IN ('Attendee', 'Organizer', 'Admin'))
);

-- =========================
-- 2. CATEGORIES
-- =========================
CREATE TABLE Categories (
    CategoryID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description VARCHAR(255)
);

-- =========================
-- 3. VENUES
-- =========================
CREATE TABLE Venues (
    VenueID SERIAL PRIMARY KEY,
    Name VARCHAR(150) NOT NULL,
    Address VARCHAR(255),
    City VARCHAR(100),
    Capacity INT
);

-- =========================
-- 4. EVENTS
-- =========================
CREATE TABLE Events (
    EventID SERIAL PRIMARY KEY,
    Title VARCHAR(150) NOT NULL,
    Description TEXT,
    EventDate TIMESTAMP NOT NULL,
    MaxAttendees INT,
    Status VARCHAR(20) DEFAULT 'Pending',

    OrganizerID UUID NOT NULL,
    CategoryID INT NOT NULL,
    VenueID INT NOT NULL,

    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_Events_Users FOREIGN KEY (OrganizerID)
        REFERENCES Users(UserID) ON DELETE CASCADE,

    CONSTRAINT FK_Events_Categories FOREIGN KEY (CategoryID)
        REFERENCES Categories(CategoryID) ON DELETE CASCADE,

    CONSTRAINT FK_Events_Venues FOREIGN KEY (VenueID)
        REFERENCES Venues(VenueID) ON DELETE CASCADE,

    CONSTRAINT CK_Event_Status CHECK (Status IN ('Pending','Active','Cancelled','Completed'))
);

-- =========================
-- 5. REGISTRATIONS
-- =========================
CREATE TABLE Registrations (
    RegistrationID SERIAL PRIMARY KEY,
    UserID UUID NOT NULL,
    EventID INT NOT NULL,
    RegisteredAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(20) DEFAULT 'Confirmed',

    CONSTRAINT FK_Reg_Users FOREIGN KEY (UserID)
        REFERENCES Users(UserID) ON DELETE CASCADE,

    CONSTRAINT FK_Reg_Events FOREIGN KEY (EventID)
        REFERENCES Events(EventID) ON DELETE CASCADE,

    CONSTRAINT UQ_User_Event UNIQUE (UserID, EventID),

    CONSTRAINT CK_Reg_Status CHECK (Status IN ('Confirmed','Cancelled','Waitlisted'))
);

-- =========================
-- 6. REVIEWS
-- =========================
CREATE TABLE Reviews (
    ReviewID SERIAL PRIMARY KEY,
    UserID UUID NOT NULL,
    EventID INT NOT NULL,
    Rating INT NOT NULL,
    Comment TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_Reviews_Users FOREIGN KEY (UserID)
        REFERENCES Users(UserID) ON DELETE CASCADE,

    CONSTRAINT FK_Reviews_Events FOREIGN KEY (EventID)
        REFERENCES Events(EventID) ON DELETE CASCADE,

    CONSTRAINT CK_Rating CHECK (Rating BETWEEN 1 AND 5)
);

-- =========================
-- 7. NOTIFICATIONS
-- =========================
CREATE TABLE Notifications (
    NotificationID SERIAL PRIMARY KEY,
    UserID UUID NOT NULL,
    Title VARCHAR(150),
    Message TEXT,
    IsRead BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT FK_Notifications_Users FOREIGN KEY (UserID)
        REFERENCES Users(UserID) ON DELETE CASCADE
);

-- =========================
-- INDEXES
-- =========================
CREATE INDEX IDX_Users_Role ON Users(Role);
CREATE INDEX IDX_Events_Category ON Events(CategoryID);
CREATE INDEX IDX_Events_Organizer ON Events(OrganizerID);
CREATE INDEX IDX_Registrations_User ON Registrations(UserID);
CREATE INDEX IDX_Registrations_Event ON Registrations(EventID);
CREATE INDEX IDX_Reviews_Event ON Reviews(EventID);

CREATE TYPE user_role AS ENUM ('Attendee', 'Organizer', 'Admin');

-- =========================
-- SCHEMA UPDATES
-- =========================

-- Users: password reset support
ALTER TABLE Users
    ADD COLUMN IF NOT EXISTS ResetToken VARCHAR(255) NULL,
    ADD COLUMN IF NOT EXISTS ResetTokenExpiry TIMESTAMP NULL;

-- Venues: map coordinates
ALTER TABLE Venues
    ADD COLUMN IF NOT EXISTS Latitude DECIMAL(9,6) NULL,
    ADD COLUMN IF NOT EXISTS Longitude DECIMAL(9,6) NULL;

-- Events: image support
ALTER TABLE Events
    ADD COLUMN IF NOT EXISTS ImageUrl VARCHAR(500) NULL;

