// Example Notification Flow Demonstration

/*
SCENARIO: Student "Ahmad Bin Ali" places order for medicines at 2:30 PM

======================================================================
STEP 1: STUDENT SUBMITS ORDER
======================================================================

Student fills form:
- Name: Ahmad Bin Ali
- Email: ahmad@student.edu.my
- Phone: +60123456789
- Location: Block A, Hostel 1, Room 201
- Medicines: 
  • Paracetamol 500mg x2 (RM 2.50 each)
  • Cough Syrup x1 (RM 4.50)
- Urgency: Normal
- Notes: Please deliver after 3 PM

[Student clicks "Confirm Order"]

======================================================================
STEP 2: ORDER SENT TO SERVER
======================================================================

POST /api/orders/place
{
  "studentId": "STU-1234567890",
  "medicines": [
    { "id": 1, "name": "Paracetamol 500mg", "quantity": 2, "price": 2.50 },
    { "id": 3, "name": "Cough Syrup", "quantity": 1, "price": 4.50 }
  ],
  "deliveryLocation": "Block A, Hostel 1, Room 201",
  "urgency": "normal",
  "notes": "Please deliver after 3 PM"
}

Server Response (201 Created):
{
  "success": true,
  "message": "Order placed. Awaiting approval. Clinic staff have been notified.",
  "order": {
    "orderId": "SKY-A1B2C3D4",
    "studentName": "Ahmad Bin Ali",
    "studentId": "STU-1234567890",
    "totalPrice": 9.50,
    "orderStatus": "new",
    "estimatedTime": "15-20 mins",
    "createdAt": "2026-01-20T14:30:00Z"
  }
}

======================================================================
STEP 3: NOTIFICATION #1 - BROWSER NOTIFICATION (INSTANT)
======================================================================

⏱️ Delivery Time: < 100 milliseconds

Location: Clinic staff dashboard
Method: WebSocket (Socket.IO)
Recipient: All logged-in staff

Visual Alert Appears:
┌─────────────────────────────────────────┐
│ 🛸💊 NEW ORDER ALERT                    │
├─────────────────────────────────────────┤
│ Order ID: SKY-A1B2C3D4                  │
│ Student: Ahmad Bin Ali                  │
│ Student ID: STU-1234567890              │
│                                         │
│ Medicines Ordered (2 items):            │
│ • 2x Paracetamol 500mg (RM 5.00)       │
│ • 1x Cough Syrup (RM 4.50)             │
│                                         │
│ Delivery Location: Block A, Hostel 1   │
│ Urgency: NORMAL                        │
│ Total: RM 9.50                         │
│                                         │
│ [Review Order] [Approve] [Details]     │
└─────────────────────────────────────────┘

Notification Badge:
Pending Orders: 5 ← Increases by 1

======================================================================
STEP 4: NOTIFICATION #2 - EMAIL NOTIFICATION (1-2 SECONDS)
======================================================================

⏱️ Delivery Time: 1-2 seconds

Service: Gmail SMTP (Nodemailer)
Recipients: 
  - Dr. Siti (Pharmacist) - siti@kmpp.edu.my
  - Nurse John - john@kmpp.edu.my
  - Admin Sarah - sarah@kmpp.edu.my

Email Headers:
From: noreply@aerodrop.local
To: siti@kmpp.edu.my, john@kmpp.edu.my, sarah@kmpp.edu.my
Subject: 🔔 NEW ORDER: SKY-A1B2C3D4 - Ahmad Bin Ali

Email Body (HTML formatted):
┌─────────────────────────────────────────────────┐
│ ┌───────────────────────────────────────────┐   │
│ │ 🛸💊 AeroDrop - New Medicine Order Alert  │   │
│ └───────────────────────────────────────────┘   │
│                                                 │
│ ⚠️ NEW ORDER RECEIVED                           │
│                                                 │
│ ┌─────────────────────────────────────────┐   │
│ │ Order ID:          SKY-A1B2C3D4         │   │
│ │ Student Name:      Ahmad Bin Ali        │   │
│ │ Student ID:        STU-1234567890       │   │
│ │ Delivery Location: Block A, Hostel 1    │   │
│ │ Urgency:           NORMAL               │   │
│ │ Order Time:        Jan 20, 2026 2:30 PM │   │
│ └─────────────────────────────────────────┘   │
│                                                 │
│ 📋 MEDICINES ORDERED:                          │
│ • 2x Paracetamol 500mg (RM 5.00)              │
│ • 1x Cough Syrup (RM 4.50)                    │
│                                                 │
│ 💰 Total: RM 9.50                              │
│                                                 │
│ 📝 Notes:                                      │
│ Please deliver after 3 PM                      │
│                                                 │
│ Please login to the dashboard to review       │
│ and approve this order.                       │
└─────────────────────────────────────────────────┘

Server Log:
✅ Email notification sent to: 
   [siti@kmpp.edu.my, john@kmpp.edu.my, sarah@kmpp.edu.my]

======================================================================
STEP 5: NOTIFICATION #3 - SMS NOTIFICATION (2-3 SECONDS)
======================================================================

⏱️ Delivery Time: 2-3 seconds

Service: Twilio SMS Gateway
Recipients:
  - Dr. Siti (Pharmacist) - +60187654321
  - Nurse John - +60187654322
  - Admin Sarah - +60187654323

SMS Message (160 chars):
┌──────────────────────────────────────────────────────┐
│ AeroDrop Alert: New medicine order #SKY-A1B2C3D4    │
│ from Ahmad Bin Ali. Urgency: NORMAL. Login to       │
│ dashboard to approve.                               │
└──────────────────────────────────────────────────────┘

Individual SMS Delivery:
SMS → Dr. Siti: +60187654321
  Status: ✅ Delivered (MessageSID: SM1234567890abcdef)
  
SMS → Nurse John: +60187654322
  Status: ✅ Delivered (MessageSID: SM0987654321fedcba)
  
SMS → Admin Sarah: +60187654323
  Status: ✅ Delivered (MessageSID: SMabcdef1234567890)

Server Log:
✅ SMS sent to +60187654321: SM1234567890abcdef
✅ SMS sent to +60187654322: SM0987654321fedcba
✅ SMS sent to +60187654323: SMabcdef1234567890

======================================================================
STEP 6: STAFF RESPONSE
======================================================================

Timeline:
- 14:30:00 - Student places order
- 14:30:01 - Browser notification appears on dashboard ✅
- 14:30:45 - Dr. Siti receives email and sees alert ✅
- 14:31:20 - Dr. Siti's phone receives SMS ✅
- 14:31:30 - Dr. Siti logs in and reviews order on dashboard
- 14:32:00 - Dr. Siti clicks [APPROVE ORDER]
  
Server Response:
PATCH /api/orders/SKY-A1B2C3D4/approve
{
  "staffId": "STAFF001",
  "success": true,
  "message": "Order approved",
  "order": {
    "orderId": "SKY-A1B2C3D4",
    "orderStatus": "approved",
    "approvedBy": "STAFF001",
    "approvalTime": "2026-01-20T14:32:00Z"
  }
}

======================================================================
STEP 7: NEXT STEPS
======================================================================

Order Status Updates:
- Order moved to "Approved" queue
- Drone assigned automatically
- Student receives delivery time notification
- Drone departs clinic with medicines
- Real-time tracking sent to student
- Order arrives at hostel
- Student marks as delivered
- Order complete ✅

======================================================================
COMPLETE NOTIFICATION TIMELINE
======================================================================

14:30:00.000 - Order submitted by student
14:30:00.050 - Browser notification emitted ✅
14:30:00.100 - Dashboard badge updated
14:30:01.500 - Email sent to all staff ✅
14:30:02.800 - SMS #1 delivered to Dr. Siti ✅
14:30:03.100 - SMS #2 delivered to Nurse John ✅
14:30:03.400 - SMS #3 delivered to Admin Sarah ✅
14:31:30.000 - Dr. Siti sees all 3 notifications
14:32:00.000 - Order approved by Dr. Siti

Total Time from Order to Approval: 2 minutes
Total Notifications Sent: 3 types (1 browser + 1 email to all + SMS to all)

======================================================================
SUCCESS OUTCOME
======================================================================

✅ Student placed order successfully
✅ Browser notification appeared instantly
✅ Email notification received by all staff
✅ SMS notification received by all staff
✅ Staff approved order promptly
✅ System ready for drone assignment
✅ Student will be notified of delivery time

All notifications served their purpose:
- 🔔 BROWSER: Instant visibility on dashboard
- 📧 EMAIL: Detailed information for review
- 📱 SMS: Mobile alert for off-screen staff

*/
