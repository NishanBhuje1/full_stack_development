## 🔹 USER STORIES

---

### 👨‍💼 Admin User Stories

**AS an Admin, I want to:**

1. **Log in securely**

   - So that I can manage the referral system.

2. **Approve new user registrations**

   - So only verified users can participate in the referral program.

3. **Receive email notifications when a new referral is submitted**

   - So I can take timely action.

4. **Update the status of a referral (Pending, Converted, Rejected)**

   - To reflect the current state of the referral process.

5. **Update the bonus amount for a converted referral**

   - So that user bonuses are accurate.

6. **View a list of all registered users**

   - To manage participants in the system.

7. **View all referrals and filter by date range, service, and user**

   - To monitor and analyze referral data.

8. **Set goals and assign extra bonuses**

   - To motivate users and manage incentives.

9. **Add new businesses to the directory**

   - So users can access more offers.

10. **View all registered businesses**

    - To manage the business directory efficiently.

---

### 👤 User Stories

**AS a User, I want to:**

1. **Register using my email and password**

   - So I can participate in the referral program.

2. **Log in once verified**

   - To access my referral dashboard.

3. **See a message and support contact if I'm not verified**

   - So I understand why I can't access the platform.

4. **Refer someone using their name, email, and/or mobile**

   - So I can earn bonuses.

5. **Check if my referral has been converted**

   - To know my progress.

6. **View my referral bonus status (outstanding and total)**

   - To track my earnings.

7. **Claim a referral bonus once a threshold is met**

   - So I can redeem my earnings.

8. **View my referral ID**

   - To use it while referring or at business locations.

9. **View the business directory and see available offers**

   - So I know where I can use my referral benefits.

10. **Get discounts at businesses when I show my app ID**

    - To benefit from my referrals.

---

## 🔧 TASKS (Organized by Role & Feature)

---

### 🔐 Admin Features & Tasks

#### ✅ 1. Admin Login

- [✅] Create Admin login API
- [ ] Build Admin login frontend
- [ ] Implement role-based access control
- [ ] Add session management

#### ✅ 2. Approve User Registration

- [ ] List all unverified users
- [ ] Add Approve/Reject buttons
- [ ] Trigger email notification to users upon approval/rejection

#### ✅ 3. Email Notification on New Referral

- [ ] Setup SMTP/email service
- [ ] Trigger email on new referral event
- [ ] Include referral details in email

#### ✅ 4. Update Referral Status

- [ ] Display list of all referrals
- [ ] Add dropdown for status change
- [ ] Update referral record in database

#### ✅ 5. Update Bonus Amount

- [ ] Create UI to update bonus per referral
- [ ] Store bonus history and reason
- [ ] Reflect bonus updates in user dashboard

#### ✅ 6. View All Users

- [ ] List all users with status (verified/unverified)
- [ ] Add search and filters (by email, registration date)

#### ✅ 7. View & Filter Referrals

- [ ] Build referral dashboard for admin
- [ ] Implement filters: date range, service, user
- [ ] Export functionality (CSV/PDF)

#### ✅ 8. Set Goals and Extra Bonus

- [ ] UI to define referral goals (monthly/quarterly)
- [ ] Set bonus values and criteria
- [ ] Trigger notification when goals are hit

#### ✅ 9. Add Businesses

- [ ] Business registration form for Admin
- [ ] Add fields: Name, Contact, Offer, Category, Logo
- [ ] Validate and store in directory

#### ✅ 10. View Registered Businesses

- [ ] List all businesses
- [ ] Add search and filter (location, category)
- [ ] Edit/Delete business entries

---

### 🙋‍♂️ User Features & Tasks

#### ✅ 1. Register with Email & Password
- [✅] Create user registration API
- [ ] Create user registration form
- [ ] Email verification link
- [✅] Store credentials securely

#### ✅ 2. Login if Verified

- [✅] Login form
- [ ] Block login if not verified
- [ ] Redirect with appropriate message

#### ✅ 3. Show "Not Verified" Message

- [ ] Display a clear message if login attempted pre-verification
- [ ] Provide support contact/email

#### ✅ 4. Refer with Name, Email, Mobile

- [ ] Referral form
- [ ] Validate entries
- [ ] Store in database and notify admin

#### ✅ 5. Check Referral Conversion Status

- [ ] List of submitted referrals
- [ ] Show current status (Pending/Converted/Rejected)

#### ✅ 6. View Bonus (Outstanding & Total)

- [ ] Dashboard showing bonus summary
- [ ] Breakdown of each referral and bonus earned

#### ✅ 7. Claim Bonus after Threshold

- [ ] Set claim threshold (e.g., \$50)
- [ ] Enable "Claim Now" button once threshold is met
- [ ] Send request to Admin for payout

#### ✅ 8. View Referral ID

- [ ] Show referral ID in profile/dashboard
- [ ] Option to copy or share

#### ✅ 9. View Business Directory & Offers

- [ ] Show list of active businesses with offers
- [ ] Search by category/location

#### ✅ 10. Get Discounts by Showing App ID

- [ ] Display app ID clearly for business usage
- [ ] Add info: "Show this ID at checkout to redeem discount"

---

Would you like this exported in **Excel**, **Notion**, or **Trello** format for easier tracking?
