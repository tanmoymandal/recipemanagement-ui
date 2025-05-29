// src/components/RecipeList.tsx
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { GET_ALL_RECIPES } from '../graphql/queries';
import { 
  Container, Typography, Card, CardContent, CardActions, Box,
  Button, Chip, CircularProgress, TextField, MenuItem, Select, FormControl, InputLabel 
} from '@mui/material';

interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  prepTime: number;
  cookTime: number;
  difficulty: string;
}

interface RecipesData {
  allRecipes: Recipe[];
}

const RecipeList: React.FC = () => {
  const { loading, error, data } = useQuery<RecipesData>(GET_ALL_RECIPES);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Box>
  );
  
  if (error) return (
    <Box sx={{ mt: 4, p: 2 }}>
      <Typography variant="h6" color="error" gutterBottom>
        Error Loading Recipes
      </Typography>
      <Typography color="error">
        {error.message}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Please make sure the GraphQL server is running at http://localhost:8080/graphql
      </Typography>
    </Box>
  );
  
  if (!data || !data.allRecipes) return (
    <Box sx={{ mt: 4, p: 2 }}>
      <Typography color="error">
        No recipes available. Please check your connection to the server.
      </Typography>
    </Box>
  );

  // Get unique categories for the filter
  const categories = Array.from(new Set(data.allRecipes.map((recipe: Recipe) => recipe.category)));

  // Filter recipes based on category and search term
  const filteredRecipes = data.allRecipes.filter((recipe: Recipe) => {
    const matchesCategory = categoryFilter ? recipe.category === categoryFilter : true;
    const matchesSearch = searchTerm ? 
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Recipe Collection
      </Typography>
      
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: '45%' } }}>
          <TextField
            label="Search recipes"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', md: '45%' } }}>
          <FormControl fullWidth>
            <InputLabel id="category-filter-label">Filter by Category</InputLabel>
            <Select
              labelId="category-filter-label"
              value={categoryFilter}
              label="Filter by Category"
              onChange={(e) => setCategoryFilter(e.target.value as string)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category: string) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gap: 3,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        }
      }}>
        {filteredRecipes.map((recipe: Recipe) => (
          <Card key={recipe.id}>
            <CardContent>
              <Typography variant="h6" component="h2">
                {recipe.title}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {recipe.prepTime + recipe.cookTime} mins | {recipe.difficulty}
              </Typography>
              <Chip label={recipe.category} color="primary" size="small" />
              <Typography variant="body2" component="p" sx={{ mt: 2 }}>
                {recipe.description?.substring(0, 100)}
                {recipe.description?.length > 100 ? '...' : ''}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to={`/recipe/${recipe.id}`}>
                View Details
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
      
      <Button 
        variant="contained" 
        color="primary" 
        component={Link} 
        to="/add-recipe"
        sx={{ mt: 4 }}
      >
        Add New Recipe
      </Button>
    </Container>
  );
};

export default RecipeList;