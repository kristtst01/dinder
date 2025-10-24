import { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { IngredientInput, type IngredientData } from './ingredient-input';
import { StepInput, type StepData } from './step-input';
import { useRecipeUpload, type RecipeUploadData } from '../hooks/use-recipe-upload';
import { useImageUpload } from '../hooks/use-image-upload';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/common/hooks/use-auth';
import { compressMainImage, compressStepImage, validateImageFile } from '../utils/image-utils';
import {
  MAX_RECIPE_NAME_LENGTH,
  MAX_CATEGORY_LENGTH,
  MAX_CUISINE_LENGTH,
} from '../utils/recipe-constants';

interface RecipeUploadFormProps {
  initialData?: Partial<RecipeUploadData> & { id?: string };
  isEdit?: boolean;
}

export function RecipeUploadForm({ initialData, isEdit = false }: RecipeUploadFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    uploadRecipe,
    updateRecipe,
    loading: uploadLoading,
    error: uploadError,
  } = useRecipeUpload();
  const { uploadImage, uploading: imageUploading, error: imageError } = useImageUpload();

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    area: initialData?.area || '',
    difficulty: (initialData?.difficulty || 'easy') as 'easy' | 'medium' | 'hard',
    time: initialData?.time || 0,
    servings: initialData?.servings || 1,
    image: initialData?.image || '',
  });

  const [ingredients, setIngredients] = useState<IngredientData[]>(initialData?.ingredients || []);
  const [steps, setSteps] = useState<StepData[]>(initialData?.steps || []);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>(formData.image);

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      // Compress image
      const compressedFile = await compressMainImage(file);
      setMainImageFile(compressedFile);
      setMainImagePreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      alert('Failed to process image. Please try another file.');
      console.error(error);
    }
  };

  const handleStepImageUpload = async (index: number, file: File) => {
    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      // Compress image
      const compressedFile = await compressStepImage(file);
      const imageUrl = await uploadImage(compressedFile);
      if (imageUrl) {
        const updatedSteps = steps.map((step, i) =>
          i === index ? { ...step, image: imageUrl } : step
        );
        setSteps(updatedSteps);
      }
    } catch (error) {
      alert('Failed to process step image. Please try another file.');
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to create a recipe');
      return;
    }

    if (ingredients.length === 0) {
      alert('Please add at least one ingredient');
      return;
    }

    if (steps.length === 0) {
      alert('Please add at least one step');
      return;
    }

    let imageUrl = formData.image;

    // Upload main image if a new one was selected
    if (mainImageFile) {
      const uploadedUrl = await uploadImage(mainImageFile);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      } else {
        alert('Failed to upload image. Please try again.');
        return;
      }
    }

    const recipeData: RecipeUploadData = {
      name: formData.name,
      category: formData.category,
      area: formData.area,
      difficulty: formData.difficulty,
      time: formData.time,
      servings: formData.servings,
      image: imageUrl,
      ingredients,
      steps,
    };

    let success = false;
    let recipeId: string | undefined = initialData?.id;

    if (isEdit && recipeId) {
      success = await updateRecipe(recipeId, recipeData);
    } else {
      const uploadedRecipeId = await uploadRecipe(recipeData);
      if (uploadedRecipeId) {
        recipeId = uploadedRecipeId;
        success = true;
      }
    }

    if (success && recipeId) {
      navigate(`/recipe/${recipeId}`);
    } else {
      alert(uploadError?.message || 'Failed to save recipe. Please try again.');
    }
  };

  const isLoading = uploadLoading || imageUploading;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEdit ? 'Edit Recipe' : 'Create New Recipe'}
        </h2>

        {/* Main Image Upload */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Recipe Image
          </label>
          <div className="flex flex-col sm:flex-row gap-4">
            {mainImagePreview && (
              <div className="w-full sm:w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <img
                  src={mainImagePreview}
                  alt="Recipe preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 cursor-pointer hover:border-orange-500 dark:hover:border-orange-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Click to upload image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recipe Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              maxLength={MAX_RECIPE_NAME_LENGTH}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
              required
              placeholder="e.g., Spaghetti Carbonara"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              maxLength={MAX_CATEGORY_LENGTH}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
              required
              placeholder="e.g., Pasta"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cuisine
            </label>
            <input
              type="text"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              maxLength={MAX_CUISINE_LENGTH}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
              required
              placeholder="e.g., Italian"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Difficulty
            </label>
            <select
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  difficulty: e.target.value as 'easy' | 'medium' | 'hard',
                })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Cooking Time (minutes)
            </label>
            <input
              type="number"
              value={formData.time || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                setFormData({ ...formData, time: Math.min(Math.max(value, 0), 2147483647) });
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
              required
              min="1"
              max="2147483647"
              placeholder="e.g., 30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Servings
            </label>
            <input
              type="number"
              value={formData.servings || ''}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                setFormData({ ...formData, servings: Math.min(Math.max(value, 1), 2147483647) });
              }}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
              required
              min="1"
              max="2147483647"
              placeholder="e.g., 4"
            />
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <IngredientInput ingredients={ingredients} onChange={setIngredients} />
      </div>

      {/* Steps */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <StepInput steps={steps} onChange={setSteps} onImageUpload={handleStepImageUpload} />
      </div>

      {/* Error Display */}
      {(uploadError || imageError) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400 text-sm">
            {uploadError?.message || imageError?.message}
          </p>
        </div>
      )}

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
          {isLoading ? 'Saving...' : isEdit ? 'Update Recipe' : 'Create Recipe'}
        </button>
      </div>
    </form>
  );
}
