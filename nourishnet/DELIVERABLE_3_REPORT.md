# NourishNet - Deliverable 3 Report

## 1. Introduction
This report accompanies the partial implementation of **NourishNet**, a community-driven food redistribution platform. The goal of this deliverable is to demonstrate a working MERN-based (Next.js adapted) application with core functionalities including Authentication, Food Listing Management, and Request Workflow, satisfying the "50% implementation" requirement.

## 2. Technology Stack
The application is built using the following modern stack:
- **Framework**: [Next.js](https://nextjs.org/) (React Framework with App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit (for Client-side Auth State)
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: Custom JWT Implementation

## 3. Implemented Features (≈50% Scope)
As per the requirements, the following modules are fully functional:

### ✅ User Authentication
- **Registration**: Users can sign up as Individuals, Business, or NGO. Passwords are securely hashed using `bcryptjs`.
- **Login**: Secure login returning a JSON Web Token (JWT).
- **Session Management**: Redux manages the user session on the client side.

### ✅ Food Listing Management
- **Create Listing**: Authenticated users can post food items with details (Quantity, Expiry, Description).
- **View Listings**: A public feed of available food donations.
- **Database Integration**: Listings are stored in MongoDB with references to the donor.

### ✅ Request Workflow
- **Make Request**: Recipients can request available food items.
- **Dashboard**: 
    - **Donors** see incoming requests and can "Accept" or "Reject" them.
    - **Recipients** track the status of their requests.
- **Status Updates**: Accepting a request updates the listing status to "RESERVED" or similar.

## 4. Instructions to Run

### Prerequisities
- Node.js installed.
- MongoDB installed and running locally on port 27017 (or update connection string).

### Steps
1. **Install Dependencies**:
   ```bash
   cd nourishnet
   npm install
   ```

2. **Environment Setup**:
   The application defaults to `mongodb://localhost:27017/nourishnet`. 
   To customize, create a `.env.local` file:
   ```env
   MONGODB_URI=your_mongo_uri
   JWT_SECRET=your_secret
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## 5. System Limitations (Deliverable 3)
- **Notifications**: Real-time push notifications are not yet implemented.
- **Maps**: Geolocation is currently mocked (stubbed as [0,0]).
- **Chat**: In-app messaging is not included in this phase.
- **Image Upload**: Uses placeholder URLs or simple string inputs for this phase.

## 6. Remaining 50% Implementation (For Future Delivery)
To achieve the full vision of NourishNet, the following modules are scheduled for the next phase:

### 1. 🔔 Real-time Notifications
- **Requirement**: Push notifications when a request is accepted/rejected or new food is posted nearby.
- **Tech**: Socket.IO or Firebase Cloud Messaging (FCM).

### 2. 🗺️ Geolocation & Maps
- **Requirement**: Interactive map to view listing locations and pick-up points.
- **Implementation**: Integration with Google Maps API or Leaflet/Mapbox to replace current stubbed [0,0] coordinates.

### 3. 💬 In-App Messaging
- **Requirement**: Private chat between Donor and Recipient to coordinate pickup details without sharing phone numbers.
- **Support**: Real-time chat stored in MongoDB.

### 4. ⭐ Rating & Trust System
- **Requirement**: Post-pickup reviews to build community trust.
- **Features**: Star ratings (1-5) and written comments for both Donors and Recipients.

### 5. 🛠️ Admin Dashboard
- **Requirement**: System oversight.
- **Features**: User verification (checking ID/NGO docs), content moderation, and platform analytics.

### 6. 🖼️ Cloud Image Upload
- **Requirement**: Real photo uploads for food listings.
- **Tech**: Integration with Cloudinary or AWS S3 to replace placeholder image strings.

### 7. 👤 Profile Management
- **Requirement**: Users should be able to update their profile, change passwords, and manage saved addresses.

## 7. Conclusion
The current build successfully establishes the architectural foundation of NourishNet. The core "Happy Path" (Register -> Post Food -> Request Food -> Accept Request) is fully operational + beautifully designed, meeting the criteria for Capstone Part 2 eligibility.
