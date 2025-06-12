import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, beforeEach, afterEach } from 'vitest';

// Mock the API client
export const mockApiFetch = vi.fn();

// Mock the API client module
vi.mock('../../apiClient', () => ({
  apiFetch: mockApiFetch
}));

// Custom render function that includes providers
export function renderWithProviders(
  ui: React.ReactElement,
  options: Omit<RenderOptions, 'wrapper'> = {}
) {
  const { ...renderOptions } = options;

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        {children}
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Helper to setup API mock responses
export function setupApiMock(responses: Record<string, unknown>) {
  mockApiFetch.mockImplementation((url: string, options?: Record<string, unknown>) => {
    const method = options?.method || 'GET';
    const key = `${method} ${url}`;
    
    if (responses[key]) {
      if (responses[key] instanceof Error) {
        return Promise.reject(responses[key]);
      }
      return Promise.resolve(responses[key]);
    }
    
    // Default responses
    if (method === 'GET' && url.includes('/ingredients/')) {
      return Promise.resolve(responses.ingredients || []);
    }
    if (method === 'GET' && url.includes('/recipes/')) {
      return Promise.resolve(responses.recipes || []);
    }
    
    return Promise.resolve({});
  });
}

// Helper to reset all mocks
export function resetAllMocks() {
  vi.clearAllMocks();
  mockApiFetch.mockReset();
}

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Custom matchers for better assertions
export const customMatchers = {
  toHaveValidNutritionalData: (ingredient: Record<string, unknown>) => {
    const pass = 
      typeof ingredient.calories_per_100g === 'number' &&
      typeof ingredient.protein_per_100g === 'number' &&
      typeof ingredient.carbs_per_100g === 'number' &&
      typeof ingredient.fat_per_100g === 'number' &&
      ingredient.calories_per_100g >= 0 &&
      ingredient.protein_per_100g >= 0 &&
      ingredient.carbs_per_100g >= 0 &&
      ingredient.fat_per_100g >= 0;

    return {
      pass,
      message: () => pass 
        ? `Expected ingredient not to have valid nutritional data`
        : `Expected ingredient to have valid nutritional data (non-negative numbers)`
    };
  }
};

// Mock console methods to avoid noise in tests
export function mockConsole() {
  const originalConsole = { ...console };
  
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  return originalConsole;
}

// Helper for testing form submissions
export async function submitForm(form: HTMLFormElement) {
  const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
  form.dispatchEvent(submitEvent);
  await waitForAsync();
}

// Helper for testing user interactions
export const userInteractions = {
  fillInput: (input: HTMLInputElement, value: string) => {
    input.focus();
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  },
  
  clickButton: (button: HTMLButtonElement) => {
    button.focus();
    button.click();
  }
};

// Re-export everything from testing library
export * from '@testing-library/react';
export { renderWithProviders as render };
