// src/components/AddRecipe.tsx
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  SelectChangeEvent
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { CREATE_RECIPE, ADD_INGREDIENT, ADD_INSTRUCTION } from '../graphql/queries';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface Instruction {
  stepNumber: number;
  description: string;
}

interface RecipeInput {
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  category: string;
  difficulty: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
}

const AddRecipe: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RecipeInput>({
    title: '',
    description: '',
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    category: '',
    difficulty: 'MEDIUM',
    ingredients: [{ name: '', amount: 0, unit: '' }],
    instructions: [{ stepNumber: 1, description: '' }]
  });

  const [createRecipe] = useMutation(CREATE_RECIPE);
  const [addIngredientMutation] = useMutation(ADD_INGREDIENT);
  const [addInstructionMutation] = useMutation(ADD_INSTRUCTION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = {
      stepNumber: index + 1,
      description: value
    };
    setFormData(prev => ({
      ...prev,
      instructions: newInstructions
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: 0, unit: '' }]
    }));
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      setFormData(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index)
      }));
    }
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        { stepNumber: prev.instructions.length + 1, description: '' }
      ]
    }));
  };

  const removeInstruction = (index: number) => {
    if (formData.instructions.length > 1) {
      setFormData(prev => ({
        ...prev,
        instructions: prev.instructions.filter((_, i) => i !== index)
          .map((instruction, i) => ({ ...instruction, stepNumber: i + 1 }))
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract only the fields that are in RecipeInput type
    const { title, description, prepTime, cookTime, servings, category, difficulty } = formData;
    
    // First create the recipe with the basic info
    createRecipe({
      variables: {
        input: {
          title,
          description,
          prepTime: Number(prepTime),
          cookTime: Number(cookTime),
          servings: Number(servings),
          category,
          difficulty
        }
      },
      onCompleted: (data) => {
        // After recipe is created, add ingredients and instructions
        const recipeId = data.createRecipe.id;
        
        // Add ingredients one by one
        Promise.all(formData.ingredients.map(ingredient => {
          if (ingredient.name && ingredient.amount) {
            return addIngredientMutation({
              variables: {
                recipeId,
                ingredientInput: {
                  name: ingredient.name,
                  amount: Number(ingredient.amount),
                  unit: ingredient.unit
                }
              }
            });
          }
          return Promise.resolve();
        }))
        .then(() => {
          // After ingredients are added, add instructions
          return Promise.all(formData.instructions.map(instruction => {
            if (instruction.description) {
              return addInstructionMutation({
                variables: {
                  recipeId,
                  instructionInput: {
                    stepNumber: instruction.stepNumber,
                    description: instruction.description
                  }
                }
              });
            }
            return Promise.resolve();
          }));
        })
        .then(() => {
          navigate('/');
        })
        .catch(error => {
          console.error("Error adding recipe details:", error);
          navigate('/');
        });
      }
    });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h4" gutterBottom>
          Add New Recipe
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              required
              fullWidth
            />

            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' } }}>
              <TextField
                label="Prep Time (minutes)"
                name="prepTime"
                type="number"
                value={formData.prepTime}
                onChange={handleChange}
                required
              />
              <TextField
                label="Cook Time (minutes)"
                name="cookTime"
                type="number"
                value={formData.cookTime}
                onChange={handleChange}
                required
              />
              <TextField
                label="Servings"
                name="servings"
                type="number"
                value={formData.servings}
                onChange={handleChange}
                required
              />
            </Box>

            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' } }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  label="Category"
                  onChange={handleSelectChange}
                  required
                >
                  <MenuItem value="BREAKFAST">Breakfast</MenuItem>
                  <MenuItem value="LUNCH">Lunch</MenuItem>
                  <MenuItem value="DINNER">Dinner</MenuItem>
                  <MenuItem value="DESSERT">Dessert</MenuItem>
                  <MenuItem value="SNACK">Snack</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  name="difficulty"
                  value={formData.difficulty}
                  label="Difficulty"
                  onChange={handleSelectChange}
                  required
                >
                  <MenuItem value="EASY">Easy</MenuItem>
                  <MenuItem value="MEDIUM">Medium</MenuItem>
                  <MenuItem value="HARD">Hard</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>
              {formData.ingredients.map((ingredient, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                  <TextField
                    label="Ingredient"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    required
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField
                    label="Amount"
                    type="number"
                    value={ingredient.amount}
                    onChange={(e) => handleIngredientChange(index, 'amount', Number(e.target.value))}
                    required
                    sx={{ width: '100px' }}
                  />
                  <TextField
                    label="Unit"
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    required
                    sx={{ width: '100px' }}
                  />
                  <IconButton 
                    onClick={() => removeIngredient(index)}
                    disabled={formData.ingredients.length === 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button 
                startIcon={<AddIcon />}
                onClick={addIngredient}
                variant="outlined"
                size="small"
              >
                Add Ingredient
              </Button>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Instructions
              </Typography>
              {formData.instructions.map((instruction, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                  <Typography sx={{ minWidth: '80px' }}>
                    Step {instruction.stepNumber}
                  </Typography>
                  <TextField
                    value={instruction.description}
                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                    required
                    fullWidth
                    multiline
                  />
                  <IconButton 
                    onClick={() => removeInstruction(index)}
                    disabled={formData.instructions.length === 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                </Box>
              ))}
              <Button 
                startIcon={<AddIcon />}
                onClick={addInstruction}
                variant="outlined"
                size="small"
              >
                Add Step
              </Button>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Add Recipe
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddRecipe;