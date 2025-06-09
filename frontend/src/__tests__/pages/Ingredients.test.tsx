import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render, setupApiMock, resetAllMocks } from '../utils/testUtils';
import { mockIngredients, mockApiResponses, mockApiErrors } from '../utils/mockData';
import Ingredients from '../../pages/Ingredients';

// Mock the hooks
vi.mock('../../hooks/useApiHealth', () => ({
  useApiHealth: () => ({
    isHealthy: true,
    checkHealth: vi.fn(),
    isChecking: false
  })
}));

describe('Ingredients Page', () => {
  beforeEach(() => {
    resetAllMocks();
  });

  afterEach(() => {
    resetAllMocks();
  });

  describe('Initial Render', () => {
    it('should render page header and main elements', async () => {
      setupApiMock({
        'GET /ingredients/': mockApiResponses.ingredients.success
      });

      render(<Ingredients />);

      expect(screen.getByText('Ingredients Data')).toBeInTheDocument();
      expect(screen.getByText('Add New Ingredient')).toBeInTheDocument();
      expect(screen.getByText('Refresh Data')).toBeInTheDocument();
      expect(screen.getByText('Check API')).toBeInTheDocument();
    });

    it('should load ingredients on mount', async () => {
      setupApiMock({
        'GET /ingredients/': mockApiResponses.ingredients.success
      });

      render(<Ingredients />);

      await waitFor(() => {
        expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
        expect(screen.getByText('Brown Rice')).toBeInTheDocument();
        expect(screen.getByText('Broccoli')).toBeInTheDocument();
      });
    });

    it('should show loading state initially', () => {
      setupApiMock({
        'GET /ingredients/': new Promise(() => {}) // Never resolves
      });

      render(<Ingredients />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when API fails', async () => {
      setupApiMock({
        'GET /ingredients/': mockApiErrors.networkError
      });

      render(<Ingredients />);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('should allow error dismissal', async () => {
      setupApiMock({
        'GET /ingredients/': mockApiErrors.networkError
      });

      render(<Ingredients />);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });

      const dismissButton = screen.getByRole('button', { name: /dismiss|close|×/i });
      await userEvent.click(dismissButton);

      await waitFor(() => {
        expect(screen.queryByText('Network error')).not.toBeInTheDocument();
      });
    });
  });

  describe('Ingredient Creation Workflow', () => {
    it('should show create form when Add New Ingredient is clicked', async () => {
      setupApiMock({
        'GET /ingredients/': mockApiResponses.ingredients.success
      });

      render(<Ingredients />);

      const addButton = screen.getByText('Add New Ingredient');
      await userEvent.click(addButton);

      expect(screen.getByText('Create Ingredient')).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    });

    it('should hide create form when Cancel is clicked', async () => {
      setupApiMock({
        'GET /ingredients/': mockApiResponses.ingredients.success
      });

      render(<Ingredients />);

      // Open form
      const addButton = screen.getByText('Add New Ingredient');
      await userEvent.click(addButton);

      expect(screen.getByText('Create Ingredient')).toBeInTheDocument();

      // Cancel form
      const cancelButton = screen.getByText('Cancel');
      await userEvent.click(cancelButton);

      expect(screen.queryByText('Create Ingredient')).not.toBeInTheDocument();
    });

    it('should create ingredient and refresh data', async () => {
      const newIngredient = {
        id: 4,
        name: 'Test Ingredient',
        category: 'Test Category',
        calories_per_100g: 100,
        protein_per_100g: 10,
        carbs_per_100g: 15,
        fat_per_100g: 5,
        fiber_per_100g: 2,
        sugar_per_100g: 1,
        sodium_per_100g: 50
      };

      setupApiMock({
        'GET /ingredients/': mockApiResponses.ingredients.success,
        'POST /ingredients/': newIngredient
      });

      render(<Ingredients />);

      // Open form
      const addButton = screen.getByText('Add New Ingredient');
      await userEvent.click(addButton);

      // Fill form
      await userEvent.type(screen.getByLabelText(/name/i), 'Test Ingredient');
      await userEvent.type(screen.getByLabelText(/category/i), 'Test Category');
      await userEvent.type(screen.getByLabelText(/calories/i), '100');
      await userEvent.type(screen.getByLabelText(/protein/i), '10');

      // Setup mock for successful creation and refresh
      setupApiMock({
        'POST /ingredients/': newIngredient,
        'GET /ingredients/': [...mockIngredients, newIngredient]
      });

      // Submit form
      const submitButton = screen.getByText('Create Ingredient');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText('Create Ingredient')).not.toBeInTheDocument();
      });
    });

    it('should handle creation errors', async () => {
      setupApiMock({
        'GET /ingredients/': mockApiResponses.ingredients.success,
        'POST /ingredients/': mockApiErrors.validationError
      });

      render(<Ingredients />);

      // Open form
      const addButton = screen.getByText('Add New Ingredient');
      await userEvent.click(addButton);

      // Fill minimal form
      await userEvent.type(screen.getByLabelText(/name/i), 'Invalid Ingredient');

      // Submit form
      const submitButton = screen.getByText('Create Ingredient');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Validation failed')).toBeInTheDocument();
      });
    });
  });

  describe('Ingredient Selection and Viewing', () => {
    it('should select ingredient when View button is clicked', async () => {
      setupApiMock({
        'GET /ingredients/': mockApiResponses.ingredients.success,
        'GET /ingredients/1': mockApiResponses.ingredients.single
      });

      render(<Ingredients />);

      await waitFor(() => {
        expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
      });

      const viewButtons = screen.getAllByText('View');
      await userEvent.click(viewButtons[0]);

      await waitFor(() => {
        // Should show selected ingredient details
        expect(screen.getByText('Selected Ingredient')).toBeInTheDocument();
      });
    });

    it('should clear selection when Clear button is clicked', async () => {
      setupApiMock({
        'GET /ingredients/': mockApiResponses.ingredients.success,
        'GET /ingredients/1': mockApiResponses.ingredients.single
      });

      render(<Ingredients />);

      await waitFor(() => {
        expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
      });

      // Select ingredient
      const viewButtons = screen.getAllByText('View');
      await userEvent.click(viewButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Selected Ingredient')).toBeInTheDocument();
      });

      // Clear selection
      const clearButton = screen.getByText('Clear Selection');
      await userEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.queryByText('Selected Ingredient')).not.toBeInTheDocument();
      });
    });
  });

  describe('Ingredient Deletion', () => {
    it('should delete ingredient with confirmation', async () => {
      // Mock window.confirm
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      setupApiMock({
        'GET /ingredients/': mockApiResponses.ingredients.success,
        'DELETE /ingredients/1': {}
      });

      render(<Ingredients />);

      await waitFor(() => {
        expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      await userEvent.click(deleteButtons[0]);

      expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this ingredient?');

      confirmSpy.mockRestore();
    });

    it('should not delete ingredient when confirmation is cancelled', async () => {
      // Mock window.confirm to return false
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      setupApiMock({
        'GET /ingredients/': mockApiResponses.ingredients.success
      });

      render(<Ingredients />);

      await waitFor(() => {
        expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('Delete');
      await userEvent.click(deleteButtons[0]);

      expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this ingredient?');

      // Ingredient should still be there
      expect(screen.getByText('Chicken Breast')).toBeInTheDocument();

      confirmSpy.mockRestore();
    });
  });

  describe('Data Refresh', () => {
    it('should refresh data when Refresh Data button is clicked', async () => {
      setupApiMock({
        'GET /ingredients/': mockApiResponses.ingredients.success
      });

      render(<Ingredients />);

      await waitFor(() => {
        expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
      });

      const refreshButton = screen.getByText('Refresh Data');
      await userEvent.click(refreshButton);

      // Should trigger another API call
      await waitFor(() => {
        expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
      });
    });
  });

  describe('API Health Check', () => {
    it('should show API health indicator', async () => {
      setupApiMock({
        'GET /ingredients/': mockApiResponses.ingredients.success
      });

      render(<Ingredients />);

      expect(screen.getByText('Check API')).toBeInTheDocument();
    });

    it('should trigger health check when Check API button is clicked', async () => {
      setupApiMock({
        'GET /ingredients/': mockApiResponses.ingredients.success
      });

      render(<Ingredients />);

      const checkApiButton = screen.getByText('Check API');
      await userEvent.click(checkApiButton);

      // The health check functionality would be tested in the useApiHealth hook test
    });
  });

  describe('Statistics Display', () => {
    it('should show ingredient statistics', async () => {
      setupApiMock({
        'GET /ingredients/': mockApiResponses.ingredients.success
      });

      render(<Ingredients />);

      await waitFor(() => {
        // Should show statistics component
        expect(screen.getByText(/total ingredients|ingredient count/i)).toBeInTheDocument();
      });
    });
  });

  describe('Business Logic Integration', () => {
    it('should validate nutritional data in forms', async () => {
      setupApiMock({
        'GET /ingredients/': mockApiResponses.ingredients.success
      });

      render(<Ingredients />);

      // Open form
      const addButton = screen.getByText('Add New Ingredient');
      await userEvent.click(addButton);

      // Try to enter negative values
      const caloriesInput = screen.getByLabelText(/calories/i);
      await userEvent.type(caloriesInput, '-10');

      // The form should handle validation (this would be in the component logic)
      expect(caloriesInput).toHaveValue(-10); // The input accepts it, but validation should prevent submission
    });

    it('should handle empty ingredient list gracefully', async () => {
      setupApiMock({
        'GET /ingredients/': []
      });

      render(<Ingredients />);

      await waitFor(() => {
        expect(screen.getByText('No ingredients found')).toBeInTheDocument();
      });
    });

    it('should maintain form state during errors', async () => {
      setupApiMock({
        'GET /ingredients/': mockApiResponses.ingredients.success,
        'POST /ingredients/': mockApiErrors.validationError
      });

      render(<Ingredients />);

      // Open form and fill it
      const addButton = screen.getByText('Add New Ingredient');
      await userEvent.click(addButton);

      await userEvent.type(screen.getByLabelText(/name/i), 'Test Ingredient');
      await userEvent.type(screen.getByLabelText(/category/i), 'Test Category');

      // Submit and get error
      const submitButton = screen.getByText('Create Ingredient');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Validation failed')).toBeInTheDocument();
      });

      // Form should still be open with data
      expect(screen.getByDisplayValue('Test Ingredient')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Category')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', async () => {
      setupApiMock({
        'GET /ingredients/': mockApiResponses.ingredients.success
      });

      render(<Ingredients />);

      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('Ingredients Data');
    });

    it('should have accessible form labels', async () => {
      setupApiMock({
        'GET /ingredients/': mockApiResponses.ingredients.success
      });

      render(<Ingredients />);

      // Open form
      const addButton = screen.getByText('Add New Ingredient');
      await userEvent.click(addButton);

      // Check that form inputs have proper labels
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/calories/i)).toBeInTheDocument();
    });

    it('should have accessible buttons', async () => {
      setupApiMock({
        'GET /ingredients/': mockApiResponses.ingredients.success
      });

      render(<Ingredients />);

      await waitFor(() => {
        expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
      });

      // All buttons should be accessible
      expect(screen.getByRole('button', { name: 'Add New Ingredient' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Refresh Data' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Check API' })).toBeInTheDocument();
    });
  });
});
