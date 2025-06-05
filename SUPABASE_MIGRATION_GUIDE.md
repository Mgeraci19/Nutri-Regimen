# Supabase Migration Guide

This guide documents the complete migration from SQLite + custom JWT authentication to Supabase for both database and authentication.

## What Was Changed

### Backend Changes

#### 1. Dependencies Updated
- Added `supabase==2.9.1`
- Added `psycopg2-binary==2.9.9` 
- Added `python-dotenv==1.0.0`
- Removed `passlib`, `bcrypt`, `python-jose` (no longer needed)

#### 2. Database Migration (`backend/database.py`)
- Switched from SQLite to PostgreSQL
- Updated connection string to use Supabase PostgreSQL
- Added environment variable loading

#### 3. Models Updated (`backend/models.py`)
- **User model changes:**
  - Removed `hashed_password` field
  - Added `supabase_user_id` field (links to Supabase auth.users)
  - Added `full_name` and `avatar_url` fields
  - Made `username` optional
  - Updated datetime fields to use `func.now()`

#### 4. Authentication System (`backend/auth.py`)
- **New Supabase authentication module:**
  - Validates Supabase JWT tokens
  - Auto-creates users in local database on first login
  - Provides `get_current_user` dependency for protected routes

#### 5. API Endpoints (`backend/main.py`)
- **Removed custom JWT endpoints:**
  - Removed `/token` login endpoint
  - Removed password-based user creation
- **Updated authentication:**
  - All protected routes now use Supabase auth
  - Added `/auth/me` endpoint
  - Enhanced authorization checks
- **Improved user management:**
  - Users are auto-created from Supabase auth data
  - Profile updates through `/users/me`

#### 6. CRUD Operations (`backend/crud.py`)
- Removed password hashing functions
- Updated user creation to work with Supabase user IDs
- Added `get_user_by_supabase_id` function

#### 7. Schemas (`backend/schemas.py`)
- Updated User schemas to match new model structure
- Removed password fields
- Added Supabase-specific fields

### Frontend Changes

#### 1. Dependencies Updated
- Added `@supabase/supabase-js==2.39.0`
- Fixed `daisyui` version to `5.0.0`

#### 2. Supabase Configuration
- **New files:**
  - `frontend/src/lib/supabase.ts` - Supabase client setup
  - `frontend/src/contexts/AuthContext.tsx` - Authentication state management
  - `frontend/src/components/AuthButton.tsx` - Social login UI component

#### 3. Authentication Integration
- **Updated `apiClient.ts`:**
  - Automatically includes Supabase session tokens in API requests
  - No more manual token management
- **Updated `App.tsx`:**
  - Wrapped with `AuthProvider` for global auth state
- **Updated `Layout.tsx`:**
  - Added `AuthButton` component to navbar
  - Converted from JSX to TSX

## Environment Setup Required

### Backend Environment Variables (`.env`)
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres

# Environment
ENVIRONMENT=development
```

### Frontend Environment Variables (`.env`)
```env
VITE_API_BASE_URL=http://localhost:8000

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Project Setup Required

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and API keys

### 2. Configure Authentication Providers
In your Supabase dashboard:
1. Go to Authentication > Providers
2. Enable desired providers (Google, GitHub, Discord)
3. Configure OAuth settings for each provider

### 3. Database Schema
The database tables will be automatically created by SQLAlchemy when the backend starts.

## Key Benefits of This Migration

### ✅ **Scalable Database**
- PostgreSQL instead of SQLite
- Hosted and managed by Supabase
- Automatic backups and scaling

### ✅ **Modern Authentication**
- Social logins (Google, GitHub, Discord)
- Built-in email verification
- Password reset functionality
- Session management handled automatically

### ✅ **Enhanced Security**
- Row Level Security (RLS) capabilities
- Professional-grade authentication
- No more custom JWT implementation

### ✅ **Developer Experience**
- No manual token management in frontend
- Automatic session refresh
- Real-time capabilities available for future features

## Migration Steps

### 1. Install Dependencies
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend  
cd frontend
npm install
```

### 2. Configure Environment Variables
- Update both backend and frontend `.env` files with your Supabase credentials

### 3. Set Up Supabase Project
- Create project and configure authentication providers
- Update environment variables with actual values

### 4. Start Services
```bash
# Backend
cd backend
uvicorn main:app --reload

# Frontend
cd frontend
npm run dev
```

### 5. Test Authentication
- Visit the frontend application
- Try logging in with social providers
- Verify user creation in both Supabase auth and your local database

## Important Notes

- **Data Migration**: Existing SQLite data is not automatically migrated. The new system starts fresh.
- **User Accounts**: Users will need to create new accounts using social login or email/password.
- **API Compatibility**: All existing API endpoints remain the same, just with different authentication.
- **Development Focus**: This setup is optimized for development. Production deployment may require additional configuration.

## Troubleshooting

### Common Issues
1. **Environment Variables**: Ensure all Supabase credentials are correctly set
2. **CORS Issues**: Verify frontend URL is in Supabase allowed origins
3. **Database Connection**: Check PostgreSQL connection string format
4. **OAuth Setup**: Ensure redirect URLs are configured in OAuth providers

### Debugging
- Check browser console for authentication errors
- Monitor backend logs for database connection issues
- Verify Supabase dashboard for authentication events
