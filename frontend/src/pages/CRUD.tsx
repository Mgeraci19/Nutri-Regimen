import React, { useState, useEffect } from 'react';

// Define interfaces for our data types
interface Food {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

// Define the component
function CRUD() {
  // State for storing foods
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  
  // Sample food data for create/update operations
  const sampleFood = {
    name: "Test Food",
    calories: 100,
    protein: 5,
    carbs: 10,
    fat: 2
  };
  
  // CREATE operation
  const createFood = () => {
    setLoading(true);
    setError(null);
    
    fetch('http://localhost:8000/foods/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleFood),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create food');
        }
        return response.json();
      })
      .then(newFood => {
        setFoods([...foods, newFood]);
        alert('Food created successfully!');
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  // READ operation (all foods)
  const fetchFoods = () => {
    setLoading(true);
    setError(null);
    
    fetch('http://localhost:8000/foods/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch foods');
        }
        return response.json();
      })
      .then(data => {
        setFoods(data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  // READ operation (single food)
  const fetchFood = (id: number) => {
    setLoading(true);
    setError(null);
    
    fetch(`http://localhost:8000/foods/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch food with ID ${id}`);
        }
        return response.json();
      })
      .then(data => {
        setSelectedFood(data);
        alert(`Fetched food: ${data.name}`);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  // UPDATE operation
  const updateFood = (id: number) => {
    setLoading(true);
    setError(null);
    
    const updatedFood = {
      ...sampleFood,
      name: `${sampleFood.name} (Updated)`,
    };
    
    fetch(`http://localhost:8000/foods/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedFood),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to update food with ID ${id}`);
        }
        return response.json();
      })
      .then(data => {
        setFoods(foods.map(food => food.id === id ? data : food));
        alert('Food updated successfully!');
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  // DELETE operation
  const deleteFood = (id: number) => {
    setLoading(true);
    setError(null);
    
    fetch(`http://localhost:8000/foods/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to delete food with ID ${id}`);
        }
        return response.json();
      })
      .then(() => {
        setFoods(foods.filter(food => food.id !== id));
        alert('Food deleted successfully!');
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  // Load foods when component mounts
  useEffect(() => {
    fetchFoods();
  }, []);
  
  return (
    <div className="crud-container">
      <h1>Food CRUD Operations</h1>
      
      {/* Error display */}
      {error && <div className="error-message">{error}</div>}
      
      {/* Loading indicator */}
      {loading && <div className="loading">Loading...</div>}
      
      {/* CRUD Buttons */}
      <div className="crud-buttons">
        <button className="btn btn-ghost btn-circle" onClick={createFood} disabled={loading}>
          Create Food
        </button>
        <button onClick={fetchFoods} disabled={loading}>
          Fetch All Foods
        </button>
      </div>
      
      {/* Foods List */}
      <div className="foods-list">
        <h2>Foods List</h2>
        {foods.length === 0 ? (
          <p>No foods found. Create some foods or fetch the list.</p>
        ) : (
          <ul>
            {foods.map(food => (
              <li key={food.id}>
                <strong>{food.name}</strong> - {food.calories} calories
                <div className="food-actions">
                  <button onClick={() => fetchFood(food.id)} disabled={loading}>
                    View
                  </button>
                  <button onClick={() => updateFood(food.id)} disabled={loading}>
                    Update
                  </button>
                  <button onClick={() => deleteFood(food.id)} disabled={loading}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Selected Food Details */}
      {selectedFood && (
        <div className="food-details">
          <h2>Food Details</h2>
          <p><strong>Name:</strong> {selectedFood.name}</p>
          <p><strong>Calories:</strong> {selectedFood.calories}</p>
          <p><strong>Protein:</strong> {selectedFood.protein}g</p>
          <p><strong>Carbs:</strong> {selectedFood.carbs}g</p>
          <p><strong>Fat:</strong> {selectedFood.fat}g</p>
        </div>
      )}
    </div>
  );
};

export default CRUD;
