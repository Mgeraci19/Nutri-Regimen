import { supabase } from './lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const fullUrl = `${API_BASE_URL}${url}`;
  
  try {
    console.log(`🚀 Making API request to: ${fullUrl}`);
    console.log(`📝 Request options:`, options);
    
    // Get Supabase session token
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    
    // Add timeout and better error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const requestOptions: RequestInit = {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        ...options?.headers,
      },
      // Ensure credentials are included for CORS
      credentials: 'include',
    };
    
    const response = await fetch(fullUrl, requestOptions);
    
    clearTimeout(timeoutId);
    
    console.log(`✅ Response status: ${response.status} ${response.statusText}`);
    console.log(`📊 Response headers:`, Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorText = await response.text();
        console.error(`❌ API Error Response:`, errorText);
        errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log(`📦 API Response data:`, data);
    return data as T;
    
  } catch (error) {
    console.error('💥 API Fetch Error:', error);
    
    // More specific error messages
    if (error instanceof TypeError) {
      if (error.message.includes('Failed to fetch')) {
        throw new Error(`❌ Network Error: Cannot connect to ${fullUrl}. Please check:\n1. Backend server is running on http://localhost:8000\n2. No firewall blocking the connection\n3. CORS is properly configured`);
      }
      if (error.message.includes('NetworkError')) {
        throw new Error(`❌ Network Error: Connection failed to ${fullUrl}`);
      }
    }
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`⏰ Request Timeout: The request to ${fullUrl} took too long`);
    }
    
    // Re-throw the error if it's already a custom error
    throw error;
  }
}

// Add a health check function
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      credentials: 'include',
    });
    return response.ok;
  } catch {
    return false;
  }
}
