# Lorry Transport Management System

A full-stack web application for managing a lorry transport business. Track trips, crusher credit, commercial client payments, and private member payments.

## Tech Stack

- **Next.js 14** (App Router) with TypeScript
- **Tailwind CSS** for styling
- **PostgreSQL** with **Prisma ORM**
- **NextAuth.js** for authentication
- **Google Drive API** for file storage (slip photos, payment screenshots)
- **Recharts** for dashboard charts

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL

Make sure you have PostgreSQL running. Create a database:

```sql
CREATE DATABASE transport_db;
```

### 3. Configure Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL="postgresql://username:password@localhost:5432/transport_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-string-here"
```

### 4. Set Up Database

Push the schema to your database and seed it:

```bash
npm run db:push
npm run db:seed
```

This creates the default owner account:
- **Email:** owner@transport.com
- **Password:** owner123

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Google Drive API Setup (Optional)

Google Drive is used to store slip photos and payment screenshots. If you skip this, the app will still work but image uploads will fail.

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (e.g., "TransportApp")
3. Enable the **Google Drive API** from the API Library

### Step 2: Create a Service Account

1. Go to **IAM & Admin > Service Accounts**
2. Click **Create Service Account**
3. Give it a name (e.g., "transport-drive-uploader")
4. Click **Create and Continue** (skip optional steps)
5. Click **Done**

### Step 3: Create Service Account Key

1. Click on the service account you just created
2. Go to the **Keys** tab
3. Click **Add Key > Create new key**
4. Choose **JSON** and click **Create**
5. Save the downloaded JSON file securely

### Step 4: Create a Google Drive Folder

1. Go to [Google Drive](https://drive.google.com/)
2. Create a folder called **TransportApp**
3. Right-click the folder > **Share**
4. Share it with the service account email (from the JSON key file, the `client_email` field)
5. Give it **Editor** access
6. Copy the folder ID from the URL (the long string after `/folders/`)

### Step 5: Add Credentials to .env

From the downloaded JSON key file, copy these values:

```
GOOGLE_DRIVE_CLIENT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID="your-folder-id-from-url"
```

**Note:** The private key should be on one line with `\n` for line breaks.

The app will automatically create subfolders:
- `CommercialSlips` - for commercial trip slip photos
- `PrivateSlips` - for private member trip slip photos
- `PaymentScreenshots` - for payment screenshots

---

## Modules

### Dashboard (`/dashboard`)
Owner's home page with summary cards, charts, daily/monthly reports.

### Fleet Management (`/fleet`)
Add, edit, and deactivate lorries.

### Crushers (`/crushers`)
Track material credit from crushers and payments made to them.

### Commercial Clients (`/commercial`)
Track trips, billing, and payments from commercial clients.

### Private Members (`/private`)
Track trips and payments from private members. Members can log in and submit payments with screenshots.

### Settings (`/settings`)
Change password.

## User Roles

| Feature | Owner | Private Member |
|---------|-------|----------------|
| Dashboard | Yes | No |
| Fleet Management | Yes | No |
| Crushers | Yes | No |
| Commercial Clients | Yes | No |
| Private Members (all) | Yes | No |
| Own Account Page | - | Yes |
| Submit Payments | - | Yes |
| View Own Trips | - | Yes |
| Change Password | Yes | Yes |
