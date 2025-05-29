// src/graphql/queries.js
import { gql } from '@apollo/client';

export const GET_ALL_RECIPES = gql`
  query GetAllRecipes {
    allRecipes {
      id
      title
      description
      prepTime
      cookTime
      servings
      category
      difficulty
      createdAt
    }
  }
`;

export const GET_RECIPE_BY_ID = gql`
  query GetRecipeById($id: ID!) {
    recipeById(id: $id) {
      id
      title
      description
      prepTime
      cookTime
      servings
      category
      difficulty
      ingredients {
        id
        name
        amount
        unit
      }
      instructions {
        id
        stepNumber
        description
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_RECIPES_BY_CATEGORY = gql`
  query GetRecipesByCategory($category: String!) {
    recipesByCategory(category: $category) {
      id
      title
      description
      prepTime
      cookTime
      difficulty
    }
  }
`;

export const CREATE_RECIPE = gql`
  mutation CreateRecipe($input: RecipeInput!) {
    createRecipe(input: $input) {
      id
      title
      description
      category
      difficulty
    }
  }
`;

export const UPDATE_RECIPE = gql`
  mutation UpdateRecipe($id: ID!, $input: RecipeInput!) {
    updateRecipe(id: $id, input: $input) {
      id
      title
      description
      prepTime
      cookTime
      servings
      category
      difficulty
      ingredients {
        id
        name
        amount
        unit
      }
      instructions {
        id
        stepNumber
        description
      }
    }
  }
`;

export const DELETE_RECIPE = gql`
  mutation DeleteRecipe($id: ID!) {
    deleteRecipe(id: $id)
  }
`;

export const ADD_INGREDIENT = gql`
  mutation AddIngredient($recipeId: ID!, $ingredientInput: IngredientInput!) {
    addIngredientToRecipe(recipeId: $recipeId, ingredientInput: $ingredientInput) {
      id
      ingredients {
        id
        name
        amount
        unit
      }
    }
  }
`;

export const ADD_INSTRUCTION = gql`
  mutation AddInstruction($recipeId: ID!, $instructionInput: InstructionInput!) {
    addInstructionToRecipe(recipeId: $recipeId, instructionInput: $instructionInput) {
      id
      instructions {
        id
        stepNumber
        description
      }
    }
  }
`;