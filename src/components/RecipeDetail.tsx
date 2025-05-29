// src/components/RecipeDetail.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_RECIPE_BY_ID, DELETE_RECIPE, GET_ALL_RECIPES } from '../graphql/queries';
import { 
  Container, Typography, Paper, List, ListItem, ListItemText, 
  Divider, Chip, Box, Button, CircularProgress 
} from '@mui/material';

interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit?: string;
}

interface Instruction {
  id: string;
  stepNumber: number;
  description: string;
}

interface Recipe {
  id: string;
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

interface RecipeData {
  recipeById: Recipe;
}

function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery<RecipeData>(GET_RECIPE_BY_ID, {
    variables: { id },
  });

  const [deleteRecipe] = useMutation(DELETE_RECIPE, {
    variables: { id },
    refetchQueries: [{ query: GET_ALL_RECIPES }],
    onCompleted: () => {
      navigate('/');
    }
  });

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;
  if (!data || !data.recipeById) return <Typography color="error">Recipe not found</Typography>;

  const recipe = data.recipeById;
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipe();
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        {recipe.title}
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Chip label={recipe.category} color="primary" />
        <Chip label={recipe.difficulty} color="secondary" sx={{ ml: 1 }} />
      </Box>
      
      <Box sx={{ 
        display: 'grid',
        gap: 3,
        gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }
      }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Details</Typography>
          <List dense>
            <ListItem>
              <ListItemText primary="Prep Time" secondary={`${recipe.prepTime} minutes`} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Cook Time" secondary={`${recipe.cookTime} minutes`} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Servings" secondary={recipe.servings} />
            </ListItem>
          </List>
        </Paper>
        
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Description</Typography>
          <Typography paragraph>
            {recipe.description}
          </Typography>
        </Paper>
      </Box>

      <Box sx={{ 
        display: 'grid',
        gap: 3,
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        mt: 3
      }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Ingredients</Typography>
          <List>
            {recipe.ingredients.map(ingredient => (
              <ListItem key={ingredient.id}>
                <ListItemText 
                  primary={`${ingredient.name}`} 
                  secondary={`${ingredient.amount} ${ingredient.unit || ''}`} 
                />
              </ListItem>
            ))}
          </List>
        </Paper>
        
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Instructions</Typography>
          <List>
            {recipe.instructions
              .sort((a, b) => a.stepNumber - b.stepNumber)
              .map(instruction => (
                <React.Fragment key={instruction.id}>
                  <ListItem>
                    <ListItemText 
                      primary={`Step ${instruction.stepNumber}`} 
                      secondary={instruction.description} 
                    />
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
          </List>
        </Paper>
      </Box>
      
      <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate(`/edit-recipe/${recipe.id}`)}
        >
          Edit Recipe
        </Button>
        <Button 
          variant="outlined" 
          color="error" 
          onClick={handleDelete}
        >
          Delete Recipe
        </Button>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/')}
        >
          Back to List
        </Button>
      </Box>
    </Container>
  );
}

export default RecipeDetail;