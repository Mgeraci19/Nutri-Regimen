#!/usr/bin/env python3
"""
Test script to verify Supabase authentication setup
"""
import os
from dotenv import load_dotenv
from supabase import create_client

# Load environment variables
load_dotenv()

def test_supabase_connection():
    """Test Supabase connection and authentication setup"""
    
    # Get environment variables
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_anon_key = os.getenv("SUPABASE_ANON_KEY")
    supabase_service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    
    print("🔍 Testing Supabase Configuration...")
    print(f"SUPABASE_URL: {supabase_url}")
    print(f"SUPABASE_ANON_KEY: {supabase_anon_key[:20]}..." if supabase_anon_key else "SUPABASE_ANON_KEY: Not set")
    print(f"SUPABASE_SERVICE_ROLE_KEY: {supabase_service_role_key[:20]}..." if supabase_service_role_key else "SUPABASE_SERVICE_ROLE_KEY: Not set")
    
    if not all([supabase_url, supabase_anon_key, supabase_service_role_key]):
        print("❌ Missing required Supabase environment variables")
        return False
    
    try:
        # Test anon client
        print("\n🧪 Testing anon client...")
        supabase_anon = create_client(supabase_url, supabase_anon_key)
        print("✅ Anon client created successfully")
        
        # Test service role client
        print("\n🧪 Testing service role client...")
        supabase_admin = create_client(supabase_url, supabase_service_role_key)
        print("✅ Service role client created successfully")
        
        # Test basic API call
        print("\n🧪 Testing basic API call...")
        response = supabase_anon.table('users').select('*').limit(1).execute()
        print("✅ Basic API call successful")
        print(f"Response: {response}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing Supabase connection: {e}")
        return False

def test_database_connection():
    """Test database connection"""
    database_url = os.getenv("DATABASE_URL")
    print(f"\n🔍 Testing Database Connection...")
    print(f"DATABASE_URL: {database_url}")
    
    if not database_url or "YOUR_DB_PASSWORD" in database_url:
        print("❌ Database URL not properly configured")
        print("📝 You need to:")
        print("   1. Go to your Supabase dashboard")
        print("   2. Go to Settings → Database")
        print("   3. Copy your database password")
        print("   4. Replace 'YOUR_DB_PASSWORD' in your .env file")
        return False
    
    try:
        from sqlalchemy import create_engine
        engine = create_engine(database_url)
        connection = engine.connect()
        connection.close()
        print("✅ Database connection successful")
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Starting Supabase Authentication Test\n")
    
    auth_ok = test_supabase_connection()
    db_ok = test_database_connection()
    
    print(f"\n📊 Test Results:")
    print(f"   Authentication: {'✅ PASS' if auth_ok else '❌ FAIL'}")
    print(f"   Database: {'✅ PASS' if db_ok else '❌ FAIL'}")
    
    if auth_ok and not db_ok:
        print("\n💡 Your authentication is working! You just need to set up the database password.")
        print("   The OAuth login should work, but you won't see data until the database is connected.")
    elif not auth_ok:
        print("\n❌ Authentication setup needs to be fixed first.")
    else:
        print("\n🎉 Everything looks good!")
