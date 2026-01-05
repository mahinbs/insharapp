# QR Code Scanning Feature - Implementation Guide

## Overview
This feature enables businesses to generate unique QR codes that collaborators can scan upon arrival at the business location. The system automatically records arrival time, verifies on-time presence, and updates collaboration status.

## User Flow

### Business Side Flow:
1. **Generate QR Code**
   - Business navigates to Profile page
   - Scrolls to "QR Code" tab
   - QR code is automatically generated with business ID
   - Business can download the QR code to print/display at location

2. **View Visit Records**
   - Business navigates to Agenda page
   - Views upcoming collaborations
   - Sees visit status for each collaborator:
     - ✅ "On Time" - Arrived within acceptable window
     - ⏰ "Late Arrival" - Arrived outside acceptable window
     - ⏳ "Awaiting check-in" - Not yet checked in

### Collaborator/Influencer Side Flow:
1. **Access QR Scanner**
   - Collaborator navigates to Collaborations page
   - Finds approved collaboration
   - Clicks "Scan QR" button (only visible for approved collaborations)

2. **Scan QR Code**
   - Camera opens with QR scanner
   - Collaborator points camera at business QR code
   - System validates:
     - QR code matches the business
     - Collaboration is approved
     - Time is within acceptable window (15 min before to 1 hour after scheduled time)

3. **Check-in Confirmation**
   - System records arrival time
   - Updates collaboration status with visit info
   - Shows check-in confirmation with on-time status

## Technical Implementation

### Components Created:

1. **QRCodeGenerator.tsx** (`/components/QRCodeGenerator.tsx`)
   - Generates QR code with business ID
   - Allows download of QR code image
   - Displays instructions for business

2. **QRScanner.tsx** (`/components/QRScanner.tsx`)
   - Camera-based QR code scanner
   - Validates QR code data
   - Checks business ID match
   - Calculates on-time status
   - Handles camera permissions

### Data Structure:

**Collaboration Interface:**
```typescript
interface Collaboration {
  id: number;
  businessName: string;
  businessLogo: string;
  title: string;
  date: string;
  time?: string;
  status: "pending" | "approved" | "expired";
  businessId?: string;
  visitInfo?: {
    arrivalTime: string;      // ISO timestamp
    isOnTime: boolean;        // Within 15 min before to 1 hour after
    checkedIn: boolean;       // Has checked in
  };
}
```

**QR Code Data Format:**
```json
{
  "businessId": "business-17th-beauty-001",
  "type": "collaboration-checkin",
  "timestamp": 1234567890
}
```

### Integration Points:

1. **Business Profile Page** (`/app/business/profile/page.tsx`)
   - Added "QR Code" tab
   - Integrated QRCodeGenerator component
   - Business can generate and download QR code

2. **Collaborations Page** (`/app/collaborations/page.tsx`)
   - Added "Scan QR" button for approved collaborations
   - Integrated QRScanner component
   - Displays visit status after check-in

3. **Business Agenda Page** (`/app/business/agenda/page.tsx`)
   - Shows visit tracking information
   - Displays arrival time and on-time status
   - Shows "Awaiting check-in" for confirmed collaborations

## On-Time Validation Logic

A collaborator is considered "on-time" if they check in:
- **15 minutes before** the scheduled time
- **Up to 1 hour after** the scheduled time

Example:
- Scheduled: 7:00 PM
- On-time window: 6:45 PM - 8:00 PM
- Check-in at 7:05 PM → ✅ On Time
- Check-in at 8:15 PM → ⏰ Late Arrival

## Features

### ✅ Implemented:
- QR code generation for businesses
- QR code scanning for collaborators
- Automatic arrival time recording
- On-time verification
- Visit status display (both sides)
- Camera permission handling
- QR code validation

### 🔄 Future Enhancements:
- Multiple QR codes per business (for different locations)
- QR code expiration/rotation
- Visit history analytics
- Push notifications for check-ins
- Manual check-in option (for business staff)
- GPS location verification

## Dependencies

- `qrcode` - QR code generation
- `@types/qrcode` - TypeScript types
- `html5-qrcode` - Camera-based QR scanning

## Usage Instructions

### For Businesses:
1. Go to Profile → QR Code tab
2. Download your QR code
3. Print and display at your business entrance
4. View visit records in Agenda page

### For Collaborators:
1. Go to Collaborations page
2. Find your approved collaboration
3. Click "Scan QR" button
4. Point camera at business QR code
5. Wait for confirmation

## Troubleshooting

**Camera not working:**
- Check browser permissions
- Ensure HTTPS (required for camera access)
- Try refreshing the page

**QR code not scanning:**
- Ensure good lighting
- Hold camera steady
- Check QR code is not damaged
- Verify you're scanning the correct business QR code

**Check-in not registering:**
- Verify collaboration is approved
- Check scheduled time is within window
- Ensure business ID matches

