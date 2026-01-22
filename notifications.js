const nodemailer = require('nodemailer');
const twilio = require('twilio');

// ==================== EMAIL CONFIGURATION ====================
// Using Gmail for demo - Replace with your email service
const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
});

// ==================== SMS CONFIGURATION ====================
// Using Twilio for SMS - Replace with your Twilio credentials
let twilioClient = null;
try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID || 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
    const authToken = process.env.TWILIO_AUTH_TOKEN || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
    
    // Only initialize if valid credentials are provided
    if (accountSid.startsWith('AC') && accountSid.length > 10) {
        twilioClient = twilio(accountSid, authToken);
    }
} catch (error) {
    console.warn('⚠️ Twilio not configured. SMS notifications disabled.');
}

const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER || '+1234567890';

// ==================== NOTIFICATION FUNCTIONS ====================

/**
 * Send Email Notification to Clinic Staff
 */
async function sendEmailNotification(staffEmails, orderData) {
    try {
        const emailList = Array.isArray(staffEmails) ? staffEmails : [staffEmails];

        const htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
                <div style="background: linear-gradient(135deg, #00a86b 0%, #00d686 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
                    <h2 style="margin: 0;">🛸💊 New Medicine Order - AeroDrop</h2>
                </div>
                
                <div style="background: white; padding: 20px; border-radius: 0 0 10px 10px;">
                    <p style="color: #c33; font-size: 18px; font-weight: bold;">⚠️ NEW ORDER RECEIVED</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <tr style="background: #f5f5f5;">
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Order ID:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${orderData.orderId}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Student Name:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${orderData.studentName}</td>
                        </tr>
                        <tr style="background: #f5f5f5;">
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Student ID:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${orderData.studentId}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Delivery Location:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${orderData.deliveryLocation}</td>
                        </tr>
                        <tr style="background: #f5f5f5;">
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Urgency:</td>
                            <td style="padding: 10px; border: 1px solid #ddd; color: ${orderData.urgency === 'emergency' ? '#c33' : '#00a86b'}; font-weight: bold;">
                                ${orderData.urgency.toUpperCase()}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Order Time:</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${new Date(orderData.createdAt).toLocaleString('en-MY')}</td>
                        </tr>
                    </table>

                    <div style="background: #e8f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 0; font-weight: bold; color: #00a86b;">📋 MEDICINES ORDERED:</p>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            ${orderData.medicines.map(m => `<li>${m.quantity}x ${m.name} (RM ${(m.price * m.quantity).toFixed(2)})</li>`).join('')}
                        </ul>
                        <p style="margin: 10px 0; font-weight: bold; font-size: 16px;">Total: RM ${orderData.totalPrice.toFixed(2)}</p>
                    </div>

                    ${orderData.notes ? `<p style="background: #fff3cd; padding: 10px; border-radius: 5px; border-left: 4px solid #ffc107;"><strong>📝 Notes:</strong> ${orderData.notes}</p>` : ''}

                    <p style="color: #666; font-size: 12px; margin-top: 20px; text-align: center;">
                        Please login to the dashboard to review and approve this order.
                    </p>
                </div>
            </div>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@aerodrop.local',
            to: emailList.join(', '),
            subject: `🔔 NEW ORDER: ${orderData.orderId} - ${orderData.studentName}`,
            html: htmlContent
        };

        await emailTransporter.sendMail(mailOptions);
        console.log('✅ Email notification sent to:', emailList);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('❌ Email notification error:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Send SMS Notification to Clinic Staff
 */
async function sendSmsNotification(phoneNumbers, orderData) {
    try {
        // Check if Twilio is configured
        if (!twilioClient) {
            console.warn('⚠️ SMS not configured. Skipping SMS notification.');
            return { success: false, error: 'Twilio not configured' };
        }

        const phoneList = Array.isArray(phoneNumbers) ? phoneNumbers : [phoneNumbers];
        const smsResults = [];

        for (const phone of phoneList) {
            const message = `AeroDrop Alert: New medicine order #${orderData.orderId} from ${orderData.studentName}. Urgency: ${orderData.urgency.toUpperCase()}. Login to dashboard to approve.`;

            try {
                const sms = await twilioClient.messages.create({
                    body: message,
                    from: TWILIO_PHONE,
                    to: phone
                });
                smsResults.push({ phone, success: true, messageId: sms.sid });
                console.log(`✅ SMS sent to ${phone}:`, sms.sid);
            } catch (err) {
                smsResults.push({ phone, success: false, error: err.message });
                console.error(`❌ SMS failed for ${phone}:`, err.message);
            }
        }

        return { success: true, results: smsResults };
    } catch (error) {
        console.error('❌ SMS notification error:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Send Browser/Desktop Notification via Socket.IO
 */
function sendBrowserNotification(io, orderData) {
    try {
        const notification = {
            type: 'new-order',
            orderId: orderData.orderId,
            studentName: orderData.studentName,
            studentId: orderData.studentId,
            urgency: orderData.urgency,
            timestamp: new Date(),
            title: `New Order: ${orderData.orderId}`,
            body: `${orderData.studentName} ordered ${orderData.medicines.length} item(s). Urgency: ${orderData.urgency.toUpperCase()}`,
            icon: '🛸💊'
        };

        // Send to all connected dashboard users
        io.emit('new-order-notification', notification);
        console.log('✅ Browser notification emitted to staff');
        
        return { success: true, notification };
    } catch (error) {
        console.error('❌ Browser notification error:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Send ALL notification types
 */
async function sendAllNotifications(io, staffData, orderData) {
    console.log('\n📢 Sending notifications for order:', orderData.orderId);
    
    const results = {
        browser: sendBrowserNotification(io, orderData),
        email: null,
        sms: null
    };

    // Send email if staff email exists
    if (staffData.emails && staffData.emails.length > 0) {
        results.email = await sendEmailNotification(staffData.emails, orderData);
    }

    // Send SMS if staff phone exists
    if (staffData.phones && staffData.phones.length > 0) {
        results.sms = await sendSmsNotification(staffData.phones, orderData);
    }

    return results;
}

module.exports = {
    sendEmailNotification,
    sendSmsNotification,
    sendBrowserNotification,
    sendAllNotifications
};
