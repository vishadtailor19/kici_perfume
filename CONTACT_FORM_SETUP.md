# Contact Form Setup Guide

## 📧 **Contact Form Data Reception**

Your contact form is now fully functional! Here's where and how you'll receive the contact form submissions:

### 🗄️ **Database Storage**
All contact form submissions are automatically stored in the `contacts` table in your SQLite database (`kici_perfume.db`):

- **Name**: Customer's full name
- **Email**: Customer's email address  
- **Subject**: Message subject
- **Message**: Full message content
- **Status**: new, in_progress, resolved, closed
- **Timestamp**: When the message was submitted (IST)
- **IP Address**: Customer's IP (for security)

### 📧 **Email Notifications**

#### **Admin Notifications**
You'll receive an email notification for each new contact form submission at:
- **Admin Email**: `admin@kiciperfume.com` (configurable)
- **Format**: Professional HTML email with all contact details
- **Includes**: Customer info, message content, timestamp, contact ID

#### **Customer Auto-Reply**
Customers automatically receive a confirmation email:
- **Professional branded email** with Kici Perfume styling
- **Confirmation** that their message was received
- **Response time**: "We'll respond within 24 hours"
- **Contact info** for urgent matters

### 🔧 **Email Configuration**

To enable email notifications, create a `.env` file in the `backend` folder:

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` with your email settings:

```env
# For Gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@kiciperfume.com

# For other email providers
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
```

#### **Gmail Setup:**
1. Enable 2-Factor Authentication
2. Generate an "App Password" in Google Account settings
3. Use the App Password (not your regular password)

#### **Other Email Providers:**
Update the transporter configuration in `backend/routes/contact.js`

### 🖥️ **Admin Panel Access**

View and manage all contact messages in the Admin Panel:

1. **Login as Admin**: Use your admin account
2. **Navigate**: Admin Panel → Contact Messages tab
3. **Features**:
   - View all messages with status indicators
   - See customer details and timestamps
   - Read full message content
   - Reply directly via email (click "Reply via Email")
   - Track message status (New, In Progress, Resolved, Closed)

### 📊 **Contact Message Statuses**

- 🔴 **NEW**: Just received, needs attention
- 🟡 **IN PROGRESS**: Being handled
- 🟢 **RESOLVED**: Issue resolved
- ⚫ **CLOSED**: Conversation ended

### 🔗 **API Endpoints**

- **Submit Form**: `POST /api/contact`
- **View Messages**: `GET /api/contact` (Admin only)
- **Update Status**: `PUT /api/contact/:id/status` (Admin only)

### 📱 **Testing**

Test the contact form:
1. Visit: `http://localhost:5173` → Contact Us
2. Fill out and submit the form
3. Check Admin Panel → Contact Messages
4. Verify email notifications (if configured)

### 🛡️ **Security Features**

- **Input validation** on all fields
- **Email sanitization** and normalization
- **IP address logging** for security
- **Rate limiting** (can be added)
- **Admin-only access** to view messages

### 📈 **Analytics**

Track contact form performance:
- **Total messages** displayed in admin panel
- **Status distribution** (new, resolved, etc.)
- **Response times** (can be calculated)
- **Customer engagement** metrics

---

## 🎯 **Quick Start**

1. **Database**: Contact messages are automatically saved
2. **Admin Panel**: Login → Contact Messages tab
3. **Email**: Configure `.env` file for notifications
4. **Reply**: Click "Reply via Email" for direct responses

**Your contact form is ready to receive customer inquiries! 🚀**

