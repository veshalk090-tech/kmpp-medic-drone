// In-memory Database for AeroDrop KMPP Student Medicine Delivery System
// Tailored for Kolej Matrikulasi Pulau Pinang (KMPP Penang, Malaysia)
// This can be replaced with a real database (MongoDB, PostgreSQL, etc.)

const database = {
    students: [
        {
            id: 'STU001',
            fullName: 'Ahmad Azman bin Ibrahim',
            matricNumber: 'KMP001234',
            phone: '+60187654321',
            phoneVerified: true,
            otpVerificationCode: '123456',
            email: 'ahmad.azman@kmpp.edu.my',
            hostelBlock: 'Blok Kawan 1',
            roomNumber: '305',
            gpsLocation: { lat: 5.3117, lng: 100.3062, campus: 'KMPP Pulau Pinang' },
            emergencyContact: { name: 'Aminah Ibrahim', phone: '+60187654322', relation: 'Mother' },
            orderHistory: [],
            feedback: [],
            averageRating: 0,
            medicalHistory: 'No known allergies',
            loginHistory: [
                { timestamp: new Date('2026-01-20T08:00:00Z'), deviceType: 'Mobile (iOS)', ipAddress: '192.168.1.100' }
            ],
            lastLogin: new Date('2026-01-20T08:00:00Z'),
            createdAt: new Date()
        }
    ],

    staff: [
        {
            id: 'STAFF001',
            fullName: 'Nurse Siti Nurhaliza',
            staffId: 'HW001',
            role: 'nurse',
            username: 'nurse.siti',
            password: 'password123', // In production: use bcrypt
            email: 'siti@kmpp.edu.my',
            shift: 'Morning (8AM-2PM)',
            approvalLogs: [],
            createdAt: new Date()
        },
        {
            id: 'STAFF002',
            fullName: 'Pharmacist Ahmad Karim',
            staffId: 'PH001',
            role: 'pharmacist',
            username: 'pharmacist.ahmad',
            password: 'password123',
            email: 'ahmad.karim@kmpp.edu.my',
            shift: 'Afternoon (2PM-8PM)',
            approvalLogs: [],
            createdAt: new Date()
        },
        {
            id: 'STAFF003',
            fullName: 'Drone Operator Ravi Kumar',
            staffId: 'OP001',
            role: 'drone-operator',
            username: 'operator.ravi',
            password: 'password123',
            email: 'ravi.kumar@kmpp.edu.my',
            shift: 'Full-time',
            approvalLogs: [],
            createdAt: new Date()
        },
        {
            id: 'STAFF004',
            fullName: 'System Admin Lee Wei Jun',
            staffId: 'AD001',
            role: 'admin',
            username: 'admin.lee',
            password: 'password123',
            email: 'lee.weijun@kmpp.edu.my',
            phone: '+60187654323',
            shift: 'Full-time',
            approvalLogs: [],
            createdAt: new Date()
        },
        {
            id: 'STAFF005',
            fullName: 'Nurse Siti Nurhaliza (Duplicate)',
            staffId: 'HW001-D',
            role: 'nurse',
            username: 'nurse.siti.2',
            password: 'password123',
            email: 'siti@kmpp.edu.my',
            phone: '+60187654321',
            shift: 'Night (8PM-2AM)',
            approvalLogs: [],
            createdAt: new Date()
        },
        {
            id: 'STAFF006',
            fullName: 'Pharmacist Ahmad Karim (Duplicate)',
            staffId: 'PH001-D',
            role: 'pharmacist',
            username: 'pharmacist.ahmad.2',
            password: 'password123',
            email: 'ahmad.karim@kmpp.edu.my',
            phone: '+60187654324',
            shift: 'Night (8PM-2AM)',
            approvalLogs: [],
            createdAt: new Date()
        },
        {
            id: 'STAFF007',
            fullName: 'Drone Operator Ravi Kumar (Duplicate)',
            staffId: 'OP001-D',
            role: 'drone-operator',
            username: 'operator.ravi.2',
            password: 'password123',
            email: 'ravi.kumar@kmpp.edu.my',
            phone: '+60187654325',
            shift: 'Evening (4PM-10PM)',
            approvalLogs: [],
            createdAt: new Date()
        },
        {
            id: 'STAFF007',
            fullName: 'Veshal A/L Kumar',
            staffId: 'STAFF007',
            role: 'staff',
            username: 'veshal.kumar',
            password: 'password123',
            email: 'veshal24goh@gmail.com',
            phone: '+60187654326',
            department: 'Order Coordination',
            notes: 'Receives all student order notifications',
            approvalLogs: [],
            createdAt: new Date()
        }
    ],

    clinic: {
        id: 'CLINIC001',
        name: 'KMPP Health Centre - Kolej Matrikulasi Penang',
        location: { lat: 5.2767, lng: 100.3175, address: 'Kolej Matrikulasi Penang, Jln Pongsu Seribu, Kampung Permatang Haji Hasan, 13200 Kepala Batas, Penang' },
        operatingHours: { open: '08:00', close: '20:00' },
        staffInCharge: 'Nurse Siti Nurhaliza',
        medicines: [
            { id: 'MED001', emoji: '💊', name: 'Paracetamol 500mg', dosage: '500mg per tablet', stock: 50, maxDosage: '1000mg (2 tablets) every 4-6 hours, max 4000mg/24hrs', category: 'pain', expiryDate: '2026-06-30', specialInstructions: '⚠️ Take with water or food. Not suitable for pregnancy. Do not use if allergic to paracetamol. Not recommended for liver disease patients. Keep out of reach of children.', explanation: 'Paracetamol (Acetaminophen) is a commonly used pain reliever and fever reducer. It works by blocking pain signals in the brain and lowering body temperature. Effective for treating headaches, muscle aches, backaches, minor arthritis pain, toothaches, menstrual cramps, and fever. Generally safe for most people when taken as directed. Works within 30-60 minutes. Can be taken with or without food, though taking with food may reduce stomach upset. Do not exceed recommended dose to avoid liver damage.' },
            { id: 'MED002', emoji: '🔵', name: 'Ibuprofen 200mg', dosage: '200mg per tablet', stock: 40, maxDosage: '400mg (2 tablets) every 4-6 hours, max 1200mg/24hrs', category: 'pain', expiryDate: '2026-08-15', specialInstructions: '⚠️ Always take with food or milk to prevent stomach upset. May cause drowsiness or dizziness. Do not use if pregnant or breastfeeding. Not suitable for patients with ulcers or kidney disease. Can interact with blood thinners.', explanation: 'Ibuprofen is a non-steroidal anti-inflammatory drug (NSAID) that reduces pain, fever, and inflammation. More effective than paracetamol for inflammation-related conditions like sports injuries and arthritis. Works by blocking prostaglandin production. Takes effect within 30 minutes. Must be taken with food or milk to prevent gastrointestinal issues. Not recommended for extended use without medical supervision. Can affect kidney function with prolonged use. Contraindicated in patients with cardiovascular disease or on anticoagulants.' },
            { id: 'MED003', emoji: '🍯', name: 'Cough Syrup', dosage: '10ml per dose', stock: 30, maxDosage: '10-20ml every 4-6 hours, max 80ml/24hrs', category: 'cold', expiryDate: '2026-05-20', specialInstructions: '⚠️ Shake well before each use. Keep refrigerated after opening (2-8°C). Do not mix with other cough medicines or alcohol. May cause drowsiness. Do not use if pregnant. Use spoon measure provided, not household spoon. Keep away from children under 2 years.', explanation: 'Cough syrup is a liquid medication formulated to suppress dry cough and soothe throat irritation caused by colds, flu, or upper respiratory infections. Contains dextromethorphan (cough suppressant) and soothing agents like honey and glycerin. Especially effective for nighttime cough relief allowing better sleep. Coats throat to reduce irritation and inflammation. Works within 15-30 minutes. Most effective for dry, non-productive coughs. Not suitable for wet coughs with phlegm. Must be stored in cool place and discarded after expiration date.' },
            { id: 'MED004', emoji: '🟠', name: 'Vitamin C Tablets', dosage: '500mg per tablet', stock: 60, maxDosage: '500-1000mg daily', category: 'vitamin', expiryDate: '2026-12-31', specialInstructions: '⚠️ Take after meals to improve absorption. Store in cool, dry place away from direct sunlight. Can cause gastrointestinal upset if taken on empty stomach. May interfere with certain blood tests. Excessive intake can cause kidney stones in susceptible individuals.', explanation: 'Vitamin C (Ascorbic Acid) is a water-soluble vitamin essential for immune system function and overall health. Acts as a powerful antioxidant protecting cells from free radical damage. Supports collagen synthesis for healthy skin, bones, and connective tissue. May reduce the duration and severity of cold symptoms by 10-20%. Helps with iron absorption from food sources. Maintains blood vessel integrity and supports wound healing. Daily intake supports general wellness and immune defense. Excess amounts are excreted in urine. Safe to take regularly for immune support, especially during cold and flu season.' },
            { id: 'MED005', emoji: '🟢', name: 'Allergy Relief Tablets', dosage: '10mg per tablet', stock: 25, maxDosage: '10mg every 4-6 hours, max 40mg/24hrs', category: 'cold', expiryDate: '2026-07-10', specialInstructions: '⚠️ Do not use if allergic to antihistamines or any ingredients. Non-drowsy formula suitable for daytime use. Do not use during pregnancy or breastfeeding without medical approval. May interact with sedatives and alcohol. Not suitable for patients with glaucoma or urinary retention.', explanation: 'Allergy Relief tablets contain antihistamine that blocks histamine release to prevent and treat allergic reactions. Effectively relieves itchy, watery eyes, sneezing, itchy nose/throat, and nasal congestion caused by allergies. Works well for seasonal allergies, hay fever, pet allergies, and dust allergies. Non-drowsy formula allows daytime use without affecting alertness. Takes effect within 30-45 minutes. Can be used prophylactically before exposure to allergens for prevention. Provides relief for 4-6 hours. Safe for regular use during allergy season. Avoid in pregnancy and breastfeeding.' },
            { id: 'MED006', emoji: '⚪', name: 'Aspirin 100mg', dosage: '100mg per tablet', stock: 75, maxDosage: '300-600mg (3-6 tablets) every 4-6 hours, max 2400mg/24hrs', category: 'pain', expiryDate: '2026-09-05', specialInstructions: '⚠️ Always take with water and food to prevent stomach irritation. Keep away from children - toxic in overdose. Do not use if allergic to salicylates. Not suitable for patients with asthma, bleeding disorders, or on anticoagulants. May thin blood and cause bleeding in susceptible individuals.', explanation: 'Aspirin is a salicylate compound that acts as a pain reliever, fever reducer, and blood thinner. Used for mild to moderate pain including headaches, muscle aches, and toothaches. Reduces fever by affecting temperature regulation in hypothalamus. Low-dose aspirin (75-100mg daily) used for cardiovascular protection and stroke prevention in high-risk patients. Works by inhibiting prostaglandin and thromboxane production. Can irritate stomach lining, so must always be taken with food or milk. Regular use may cause gastrointestinal bleeding in some individuals. Not recommended for children under 12 years due to Reye syndrome risk.' },
            { id: 'MED007', emoji: '💉', name: 'Amoxicillin 500mg', dosage: '500mg per capsule', stock: 35, maxDosage: '500mg every 8 hours (1 capsule x 3 daily)', category: 'antibiotic', expiryDate: '2026-04-15', specialInstructions: '⚠️ CRITICAL: Complete the full course even if feeling better - incomplete treatment causes antibiotic resistance. Report rash immediately - may indicate serious allergic reaction. Take at regular intervals throughout the day. Can be taken with or without food. Store in cool, dry place. Report diarrhea, vomiting, or severe nausea to healthcare provider. Do not use if allergic to penicillin or cephalosporins.', explanation: 'Amoxicillin is a penicillin-based antibiotic that kills bacteria by breaking down cell walls. Effective against wide range of gram-positive and gram-negative bacteria. Treats bacterial infections including ear infections (otitis media), throat infections (strep), urinary tract infections, skin infections, and respiratory infections. MUST take complete course as prescribed to avoid antibiotic resistance and treatment failure. Takes 48-72 hours to show improvement. Most effective when taken at consistent intervals. Can cause mild side effects like nausea, diarrhea, or rash. Serious allergic reactions (anaphylaxis) can occur in penicillin-sensitive patients. Do not share with others. Keep all follow-up appointments to ensure infection is fully treated.' },
            { id: 'MED008', emoji: '🩺', name: 'Metformin 500mg', dosage: '500mg per tablet', stock: 45, maxDosage: '500-1000mg twice to three times daily', category: 'diabetes', expiryDate: '2026-11-20', specialInstructions: '⚠️ Regular blood glucose monitoring is ESSENTIAL. Take with meals to minimize gastrointestinal side effects. Stay well hydrated. Contact doctor immediately if experiencing severe nausea, vomiting, difficulty breathing, or unusual fatigue. Not suitable for patients with kidney disease or liver disease. Do not use before surgery or with contrast dye procedures.', explanation: 'Metformin is a biguanide antidiabetic medication that helps control blood sugar levels in Type 2 diabetes. Works by decreasing glucose production in liver (gluconeogenesis) and improving insulin sensitivity in muscle and fat cells. First-line treatment for Type 2 diabetes due to excellent safety profile and cardiovascular benefits. Does NOT cause hypoglycemia when used alone. Helps with weight management. Takes 2-3 weeks to reach full effect. Common side effects include gastrointestinal symptoms (diarrhea, nausea, flatulence) which usually improve over time. Requires regular monitoring of kidney function and blood glucose levels. May rarely cause lactic acidosis in patients with kidney disease. Long-term use associated with vitamin B12 deficiency.' },
            { id: 'MED009', emoji: '❤️', name: 'Lisinopril 10mg', dosage: '10mg per tablet', stock: 40, maxDosage: '10mg once daily, may increase to 20-40mg daily', category: 'blood-pressure', expiryDate: '2026-08-30', specialInstructions: '⚠️ Regular blood pressure monitoring is MANDATORY. Check for signs of hyperkalemia (high potassium): weakness, irregular heartbeat. Avoid potassium supplements and salt substitutes. Report persistent dry cough to doctor. Do not use in pregnancy - causes birth defects. May cause dizziness on first dose or with position changes.', explanation: 'Lisinopril is an ACE (Angiotensin Converting Enzyme) inhibitor that lowers blood pressure and reduces strain on the heart. Works by relaxing blood vessel walls and decreasing production of vasoconstrictor angiotensin II. Used to treat high blood pressure (hypertension), heart failure, and to improve survival after heart attack. Helps prevent future heart attacks and strokes in high-risk patients. Takes 2-4 weeks to achieve maximum blood pressure reduction. Most effective when combined with lifestyle modifications (diet, exercise, stress reduction). Common side effect is persistent dry cough affecting 10-20% of users. Requires regular blood pressure monitoring and periodic kidney/potassium level tests. Contraindicated in pregnancy, hyperkalemia, and renal artery stenosis.' },
            { id: 'MED010', emoji: '🫀', name: 'Atorvastatin 20mg', dosage: '20mg per tablet', stock: 30, maxDosage: '10-80mg once daily in evening', category: 'cholesterol', expiryDate: '2026-10-12', specialInstructions: '⚠️ Take at same time daily, preferably in evening when cholesterol synthesis is highest. Regular cholesterol and liver function tests required. Avoid grapefruit/grapefruit juice - increases drug levels. Report muscle pain or weakness immediately (potential statin myopathy). Not suitable in pregnancy. May cause muscle aches or liver inflammation.', explanation: 'Atorvastatin is a statin (HMG-CoA reductase inhibitor) that lowers cholesterol and triglycerides in blood. Works by blocking enzyme responsible for cholesterol synthesis in liver. Reduces LDL cholesterol (bad) by 30-50%, increases HDL (good), and lowers triglycerides. Significantly reduces risk of heart disease, stroke, and cardiac events in high-risk patients. Takes 2-4 weeks to show full effect. Most effective when combined with healthy diet and exercise. Requires regular lipid panel monitoring. Common side effects include muscle aches, headache, and hepatic elevation. Rare but serious side effect is statin myopathy (muscle breakdown). Must be taken at same time daily for consistency. Evening dosing most effective due to cholesterol synthesis timing.' },
            { id: 'MED011', emoji: '💤', name: 'Diphenhydramine 25mg', dosage: '25mg per tablet', stock: 55, maxDosage: '25mg every 4-6 hours, max 150mg/24hrs OR 25-50mg at bedtime', category: 'cold', expiryDate: '2026-06-25', specialInstructions: '⚠️ STRONG DROWSINESS: Do NOT drive or operate machinery for 6-8 hours after use. Do not use with alcohol or other sedating drugs - increases risk of overdose. Not suitable for patients with glaucoma, urinary retention, or enlarged prostate. Use lowest effective dose. Taking at bedtime for sleep is most appropriate use.', explanation: 'Diphenhydramine is a first-generation antihistamine that blocks histamine receptors to relieve allergy and cold symptoms. Primary uses: treats itching, sneezing, runny nose, and watery eyes caused by allergies or colds. Secondary use as OTC sleep aid due to strong sedating properties. Works within 15-30 minutes. Strongly causes drowsiness, dizziness, and impaired coordination - makes it suitable for nighttime use but dangerous during daytime. Effects last 4-6 hours. Not recommended for regular daytime use due to sedation. Maximum effectiveness when combined with avoiding alcohol and other CNS depressants. Common in cold and allergy medicines combined with decongestants. Should NOT be used for more than 2 weeks without medical consultation.' },
            { id: 'MED012', emoji: '🔴', name: 'Omeprazole 20mg', dosage: '20mg per capsule', stock: 50, maxDosage: '20mg once daily, may increase to 40mg daily if needed', category: 'stomach', expiryDate: '2026-09-18', specialInstructions: '⚠️ Take 30-60 minutes BEFORE meals on empty stomach for maximum effect. Swallow capsule whole - do NOT chew or crush. Use lowest effective dose for shortest duration possible. May affect absorption of certain vitamins and minerals (B12, calcium, magnesium). Long-term use (>1 year) requires periodic monitoring. Do not use if allergic to benzimidazoles.', explanation: 'Omeprazole is a proton pump inhibitor (PPI) that dramatically reduces stomach acid production. Works by blocking hydrogen-potassium pump in parietal cells of stomach. Used for treating acid reflux (GERD), peptic ulcers, erosive esophagitis, and reducing acid-related complications with NSAID use. Provides lasting relief up to 24 hours with once-daily dosing. Takes 2-3 days to achieve full effect; maximum benefit at 1-4 weeks. Allows healing of damaged stomach lining. Safe and effective when used as directed. Long-term use (>1 year) may increase risk of fractures, B12 deficiency, and hypomagnesemia. Should use lowest effective dose for shortest duration. Generally should not be used long-term without medical supervision. Requires periodic monitoring of magnesium and B12 levels with extended use.' }
        ],
        contactEmail: 'support@aerodrop.delivery',
        ordersEmail: 'orders@aerodrop.delivery',
        phone: '+603-2123-4567',
        operatingHours: 'Monday-Friday: 7PM-12AM, Saturday-Sunday: 10AM-12AM'
    },

    drones: [
        {
            id: 'DRONE001',
            droneId: 'DJI-M300-KMP-001',
            model: 'DJI Matrice 300 RTK',
            batteryLevel: 95,
            maxBattery: 100,
            payloadCapacity: 2.5, // kg
            range: 15, // km (within campus)
            currentStatus: 'available', // available, delivering, charging, maintenance
            location: { lat: 5.3117, lng: 100.3062, campus: 'KMPP Penang' },
            chargingStationLocation: 'Health Centre Drone Hub',
            maintenanceStatus: 'Good',
            lastMaintenance: new Date('2026-01-15'),
            totalDeliveries: 45,
            createdAt: new Date()
        },
        {
            id: 'DRONE002',
            droneId: 'DJI-M300-KMP-002',
            model: 'DJI Matrice 300 RTK',
            batteryLevel: 78,
            maxBattery: 100,
            payloadCapacity: 2.5,
            range: 15,
            currentStatus: 'available',
            location: { lat: 5.3117, lng: 100.3062, campus: 'KMPP Penang' },
            chargingStationLocation: 'Health Centre Drone Hub',
            maintenanceStatus: 'Good',
            lastMaintenance: new Date('2026-01-10'),
            totalDeliveries: 32,
            createdAt: new Date()
        },
        {
            id: 'DRONE003',
            droneId: 'DJI-M300-KMP-003',
            model: 'DJI Matrice 300 RTK',
            batteryLevel: 45,
            maxBattery: 100,
            payloadCapacity: 2.5,
            range: 15,
            currentStatus: 'charging',
            location: { lat: 5.3117, lng: 100.3062, campus: 'KMPP Penang' },
            chargingStationLocation: 'Health Centre Drone Hub',
            maintenanceStatus: 'Good',
            lastMaintenance: new Date('2026-01-12'),
            totalDeliveries: 28,
            createdAt: new Date()
        }
    ],

    orders: [
        {
            id: 'ORDER001',
            orderId: 'SKY-KMP-20260120-001',
            studentId: 'STU001',
            matricNumber: 'KMP001234',
            studentName: 'Ahmad Azman bin Ibrahim',
            deliveryLocation: { block: 'Blok Kawan 1', room: '305', gpsLat: 5.3125, gpsLng: 100.3055 },
            medicines: [
                { medicineId: 'MED001', name: 'Paracetamol 500mg', quantity: 2, price: 2.50, weight: 0.05 }
            ],
            totalPrice: 5.00,
            totalWeight: 0.05, // kg
            urgency: 'normal', // normal, urgent, emergency
            orderStatus: 'new', // new -> approved -> sent -> in-transit -> delivered
            prescription: { uploaded: true, verified: false, fileName: 'prescription_001.pdf' },
            prescriptionConsent: true,
            approvedBy: null,
            approvalTime: null,
            staffInCharge: null,
            droneAssigned: null,
            launchPoint: { name: 'KMPP Health Centre', gpsLat: 5.3117, gpsLng: 100.3062 },
            estimatedTime: '15-20 mins',
            eta: null,
            actualDeliveryTime: null,
            deliveredAt: null,
            deliveryConfirmation: null, // OTP or signature
            incidentReports: [],
            notes: 'For headache relief. Student in Blok Kawan 1.',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ],

    deliveries: [
        {
            id: 'DEL001',
            orderId: 'SKY-KMP-20260120-001',
            droneId: 'DRONE001',
            launchPoint: { name: 'KMPP Health Centre Drone Hub', lat: 5.3117, lng: 100.3062 },
            deliveryPoint: { name: 'Blok Kawan 1, Room 305', lat: 5.3125, lng: 100.3055 },
            estimatedTime: 1200, // seconds (20 mins)
            actualTime: null,
            deliveryStatus: 'pending', // pending, launched, in-transit, delivered, failed
            currentLocation: { lat: 5.3117, lng: 100.3062, campus: 'KMPP Penang' },
            weatherCondition: 'clear',
            noFlyZones: ['Library', 'Lecture Hall A', 'Gathering Areas'],
            approvedFlightRoute: 'Health Centre → Blok Kawan 1 (Direct)',
            incidentReports: [],
            deliveryConfirmation: null, // OTP verification
            notes: 'Delivery to hostel student',
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ],

    campusSafetyRules: {
        approvedFlightHours: '08:00 - 20:00',
        noFlyZones: ['Library', 'Lecture Hall A', 'Lecture Hall B', 'Cafeteria Peak Hours', 'Sports Field During Events'],
        maxAltitude: 100, // meters
        maxSpeed: 20, // km/h in campus
        weatherLimitations: 'No flights in rain or wind > 30km/h',
        incidentReportingRequired: true
    },

    systemInfo: {
        appVersion: 'AeroDrop v2.0.0-KMPP-Medical',
        institution: 'Kolej Matrikulasi Pulau Pinang',
        deploymentDate: new Date('2026-01-20'),
        environment: 'production',
        lastBackup: new Date(),
        deviceTypes: ['Mobile (iOS)', 'Mobile (Android)', 'Web Browser', 'Tablet'],
        supportedLanguages: ['Malay', 'English'],
        errorLogs: [],
        systemLogs: [],
        loginAttempts: []
    },

    incidentReportTemplate: {
        incidentId: 'INC-SKY-KMP-YYYYMMDD-###',
        orderId: 'SKY-KMP-YYYYMMDD-###',
        reportedBy: 'Staff Name & Role',
        incidentType: 'weather|technical|delivery-failed|student-absent|drone-malfunction',
        description: 'Detailed incident description',
        timestamp: new Date(),
        location: { lat: 5.3117, lng: 100.3062 },
        severity: 'low|medium|high|critical',
        resolution: 'Action taken',
        resolvedAt: null,
        status: 'open|in-progress|closed'
    },

    emergencyContacts: {
        header: {
            institution: 'Kolej Matrikulasi Pulau Pinang',
            emergency: '🚨 CALL IMMEDIATELY IN CASE OF EMERGENCY',
            location: 'Penang, Malaysia'
        },
        jppContacts: [
            {
                id: 'JPP001',
                name: 'Mohamad Hafiz bin Rosli',
                title: 'JPP President (Presiden JPP)',
                phone: '+60145678901',
                email: 'hafiz.jpp@kmpp.edu.my',
                hostelBlock: 'Blok Cemara 1',
                availability: '24/7 Emergency Support'
            },
            {
                id: 'JPP002',
                name: 'Nur Anis binti Ahmad',
                title: 'JPP Vice President',
                phone: '+60146789012',
                email: 'anis.vp@kmpp.edu.my',
                hostelBlock: 'Blok Indah 2',
                availability: '24/7 Support'
            },
            {
                id: 'JPP003',
                name: 'Chai Wei Ming',
                title: 'JPP Health & Wellness Coordinator',
                phone: '+60147890123',
                email: 'health.jpp@kmpp.edu.my',
                hostelBlock: 'Blok Kawan 1',
                availability: '24/7 Medical Coordination'
            },
            {
                id: 'JPP004',
                name: 'Siti Nurhaliza binti Noor',
                title: 'JPP Hostel Block A Coordinator',
                phone: '+60148901234',
                email: 'blockA.jpp@kmpp.edu.my',
                hostelBlock: 'Blok Kawan 1 & 2',
                availability: '24/7 Hostel Support'
            },
            {
                id: 'JPP005',
                name: 'Ravi Kumar Subramaniam',
                title: 'JPP Hostel Block B Coordinator',
                phone: '+60149012345',
                email: 'blockB.jpp@kmpp.edu.my',
                hostelBlock: 'Blok Cemara 1 & 2',
                availability: '24/7 Hostel Support'
            },
            {
                id: 'JPP006',
                name: 'Lee Chen Hao',
                title: 'JPP Hostel Block C Coordinator',
                phone: '+60150123456',
                email: 'blockC.jpp@kmpp.edu.my',
                hostelBlock: 'Blok Indah 1 & 2',
                availability: '24/7 Hostel Support'
            }
        ],
        clinicContacts: [
            {
                id: 'CLINIC001',
                name: 'KMPP Health Centre',
                title: 'Main Clinic',
                phone: '+60432555123',
                email: 'health@kmpp.edu.my',
                location: 'Health Centre Building, KMPP Campus',
                operatingHours: '08:00 - 20:00 (Mon-Sun)',
                emergencyLine: '+60432555130'
            },
            {
                id: 'CLINIC002',
                name: 'Dr. Fatimah Zahra Mohamed',
                title: 'Medical Officer (Clinic In-Charge)',
                phone: '+60143210987',
                email: 'dr.fatimah@kmpp.edu.my',
                specialization: 'General Medicine',
                availability: '24/7 On-Call'
            }
        ],
        campusSecurityContacts: [
            {
                id: 'SEC001',
                name: 'Campus Security Command Center',
                title: 'Main Security Office',
                phone: '+60432555150',
                email: 'security@kmpp.edu.my',
                location: 'Main Gate, KMPP Campus',
                availability: '24/7 Patrol & Response'
            },
            {
                id: 'SEC002',
                name: 'Mohd Zain bin Abdullah',
                title: 'Head of Campus Security',
                phone: '+60145332211',
                email: 'security.head@kmpp.edu.my',
                availability: '24/7'
            }
        ],
        otherEmergencyServices: [
            {
                id: 'FIRE001',
                name: 'Penang Fire & Rescue Department',
                title: 'Fire & Emergency',
                phone: '994',
                email: 'emergency@jbpm.penang.gov.my',
                availability: '24/7'
            },
            {
                id: 'POLICE001',
                name: 'Penang Police (Kepala Batas Police Station)',
                title: 'Police Response',
                phone: '999 (Emergency) / +60432555555 (Kepala Batas Station)',
                email: 'info@pdrm.gov.my',
                availability: '24/7'
            },
            {
                id: 'AMBULANCE001',
                name: 'Emergency Medical Services (Ambulans Kecemasan)',
                title: 'Medical Emergency',
                phone: '999 or +60432888888',
                email: 'kemenkes@moh.gov.my',
                availability: '24/7'
            },
            {
                id: 'HOSP001',
                name: 'Seberang Jaya Hospital (Nearest Major Hospital)',
                title: 'Hospital - Penang',
                phone: '+6043 8887313 / +6043 8887314',
                email: 'info@hsj.moh.gov.my',
                location: '5.3000°N, 100.3500°E',
                availability: '24/7 Emergency Department'
            }
        ],
        administrativeContacts: [
            {
                id: 'ADMIN001',
                name: 'Puan Nor Azlina binti Ismail',
                title: 'Principal of KMPP',
                phone: '+60432551000',
                email: 'principal@kmpp.edu.my',
                office: 'Principal\'s Office, KMPP Admin Building',
                availability: 'Office Hours: 8:00 - 17:00'
            },
            {
                id: 'ADMIN002',
                name: 'Encik Ahmad Fairuz bin Mohammed',
                title: 'Deputy Principal (Student Affairs)',
                phone: '+60432551010',
                email: 'deputy.student@kmpp.edu.my',
                office: 'Student Affairs Office',
                availability: 'Office Hours: 8:00 - 17:00'
            }
        ]
    },

    sessions: []
};

module.exports = database;
