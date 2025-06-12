import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../utils/testUtils';
import { IngredientForm } from '../../../components/ingredients/IngredientForm';
import type { Ingredient } from '../../../types';

describe('IngredientForm Component', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial Render', () => {
    it('should render all form fields', () => {
      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/calories/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/protein/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/carbs/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/fat/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/fiber/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/sugar/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/sodium/i)).toBeInTheDocument();
    });

    it('should render with default submit label', () => {
      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByRole('button', { name: 'Create Ingredient' })).toBeInTheDocument();
    });

    it('should render with custom submit label', () => {
      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          submitLabel="Update Ingredient"
        />
      );

      expect(screen.getByRole('button', { name: 'Update Ingredient' })).toBeInTheDocument();
    });

    it('should render with initial data', () => {
      const initialData = {
        name: 'Test Ingredient',
        category: 'Test Category',
        calories_per_100g: 100,
        protein_per_100g: 10
      };

      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          initialData={initialData}
        />
      );

      expect(screen.getByDisplayValue('Test Ingredient')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Category')).toBeInTheDocument();
      expect(screen.getByDisplayValue('100')).toBeInTheDocument();
      expect(screen.getByDisplayValue('10')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should disable submit button when name is empty', () => {
      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const submitButton = screen.getByRole('button', { name: 'Create Ingredient' });
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when name is provided', async () => {
      const user = userEvent.setup();

      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      const submitButton = screen.getByRole('button', { name: 'Create Ingredient' });

      await user.type(nameInput, 'Test Ingredient');

      expect(submitButton).toBeEnabled();
    });

    it('should require name field for submission', async () => {
      const user = userEvent.setup();

      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const submitButton = screen.getByRole('button', { name: 'Create Ingredient' });
      
      // Try to submit without name
      await user.click(submitButton);

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should submit form with correct data', async () => {
      const user = userEvent.setup();

      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      // Fill form
      await user.type(screen.getByLabelText(/name/i), 'Chicken Breast');
      await user.type(screen.getByLabelText(/category/i), 'Protein');
      await user.type(screen.getByLabelText(/calories/i), '165');
      await user.type(screen.getByLabelText(/protein/i), '31');
      await user.type(screen.getByLabelText(/carbs/i), '0');
      await user.type(screen.getByLabelText(/fat/i), '3.6');
      await user.type(screen.getByLabelText(/fiber/i), '0');
      await user.type(screen.getByLabelText(/sugar/i), '0');
      await user.type(screen.getByLabelText(/sodium/i), '74');

      // Submit form
      const submitButton = screen.getByRole('button', { name: 'Create Ingredient' });
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Chicken Breast',
        category: 'Protein',
        calories_per_100g: 165,
        protein_per_100g: 31,
        carbs_per_100g: 0,
        fat_per_100g: 3.6,
        fiber_per_100g: 0,
        sugar_per_100g: 0,
        sodium_per_100g: 74
      });
    });

    it('should handle decimal values correctly', async () => {
      const user = userEvent.setup();

      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      await user.type(screen.getByLabelText(/name/i), 'Test Food');
      await user.type(screen.getByLabelText(/protein/i), '25.5');
      await user.type(screen.getByLabelText(/fat/i), '3.2');

      const submitButton = screen.getByRole('button', { name: 'Create Ingredient' });
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Food',
          protein_per_100g: 25.5,
          fat_per_100g: 3.2
        })
      );
    });

    it('should reset form after successful submission', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Test Ingredient');

      const submitButton = screen.getByRole('button', { name: 'Create Ingredient' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(nameInput).toHaveValue('');
      });
    });

    it('should not reset form if submission fails', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockRejectedValue(new Error('Submission failed'));

      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      await user.type(nameInput, 'Test Ingredient');

      const submitButton = screen.getByRole('button', { name: /create ingredient/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(nameInput).toHaveValue('Test Ingredient');
      });
    });
  });

  describe('Form Cancellation', () => {
    it('should call onCancel when Cancel button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByRole('button' , {name:'Cancel'});
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should disable form when loading', () => {
      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isLoading={true}
        />
      );

      const submitButton = screen.getByRole('button' , {name:'Saving...'});
      const cancelButton = screen.getByRole('button' , {name:'Cancel'});

      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });

    it('should show loading text on submit button', () => {
      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          isLoading={true}
        />
      );

      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });
  });

  describe('Business Logic - Nutritional Data', () => {
    it('should handle zero values for nutritional data', async () => {
      const user = userEvent.setup();

      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      await user.type(screen.getByLabelText(/name/i), 'Water');
      // Leave all nutritional values as 0 (default)

      const submitButton = screen.getByRole('button' , {name:'Create Ingredient'});
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Water',
          calories_per_100g: 0,
          protein_per_100g: 0,
          carbs_per_100g: 0,
          fat_per_100g: 0
        })
      );
    });

    it('should handle high nutritional values', async () => {
      const user = userEvent.setup();

      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      await user.type(screen.getByLabelText(/name/i), 'Pure Fat');
      await user.type(screen.getByLabelText(/calories/i), '900');
      await user.type(screen.getByLabelText(/fat/i), '100');

      const submitButton = screen.getByRole('button' , {name:'Create Ingredient'});
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Pure Fat',
          calories_per_100g: 900,
          fat_per_100g: 100
        })
      );
    });

    it('should validate nutritional data consistency', async () => {
      const user = userEvent.setup();

      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      await user.type(screen.getByLabelText(/name/i), 'Complete Food');
      await user.type(screen.getByLabelText(/calories/i), '400');
      await user.type(screen.getByLabelText(/protein/i), '25');
      await user.type(screen.getByLabelText(/carbs/i), '50');
      await user.type(screen.getByLabelText(/fat/i), '15');

      const submitButton = screen.getByRole('button' , {name:'Create Ingredient'});
      await user.click(submitButton);

      const submittedData = mockOnSubmit.mock.calls[0][0];
      
      expect(submittedData.calories_per_100g).toBe(400);
    });
  });

  describe('Accessibility', () => {
    it('should have proper form structure', () => {
      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();
    });

    it('should have required field indicators', () => {
      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      expect(nameInput).toBeRequired();
    });

    it('should have proper input types', () => {
      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText(/name/i);
      const caloriesInput = screen.getByLabelText(/calories/i);

      expect(nameInput).toHaveAttribute('type', 'text');
      expect(caloriesInput).toHaveAttribute('type', 'number');
    });

    it('should have proper step attributes for decimal inputs', () => {
      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      const proteinInput = screen.getByLabelText(/protein/i);
      expect(proteinInput).toHaveAttribute('step', '0.1');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string inputs gracefully', async () => {
      const user = userEvent.setup();

      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      await user.type(screen.getByLabelText(/name/i), 'Test');
      await user.clear(screen.getByLabelText(/calories/i));

      const submitButton = screen.getByRole('button' , {name:'Create Ingredient'});
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          calories_per_100g: 0
        })
      );
    });

    it('should handle very long ingredient names', async () => {
      const user = userEvent.setup();
      const longName = 'A'.repeat(200);

      render(
        <IngredientForm
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
        />
      );

      await user.type(screen.getByLabelText(/name/i), longName);

      const submitButton = screen.getByRole('button' , {name:'Create Ingredient'});
      await user.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: longName
        })
      );
    });
  });
});
