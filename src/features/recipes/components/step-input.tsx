import { X, Image as ImageIcon } from 'lucide-react';
import { MAX_STEP_DESCRIPTION_LENGTH } from '../utils/recipe-constants';

export interface StepData {
  description: string;
  image?: string;
}

interface StepInputProps {
  steps: StepData[];
  onChange: (steps: StepData[]) => void;
  onImageUpload?: (index: number, file: File) => Promise<void>;
}

export function StepInput({ steps, onChange, onImageUpload }: StepInputProps) {
  const addStep = () => {
    onChange([...steps, { description: '' }]);
  };

  const removeStep = (index: number) => {
    onChange(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: keyof StepData, value: string) => {
    const updated = steps.map((step, i) => (i === index ? { ...step, [field]: value } : step));
    onChange(updated);
  };

  const handleImageChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      await onImageUpload(index, file);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Instructions
        </label>
        <button
          type="button"
          onClick={addStep}
          className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
        >
          + Add Step
        </button>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex gap-2 items-start p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full font-semibold text-sm">
              {index + 1}
            </div>
            <div className="flex-1 space-y-2">
              <textarea
                placeholder="Describe this step..."
                value={step.description}
                onChange={(e) => updateStep(index, 'description', e.target.value)}
                maxLength={MAX_STEP_DESCRIPTION_LENGTH}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white resize-none"
                rows={2}
                required
              />
              {step.image && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden">
                  <img
                    src={step.image}
                    alt={`Step ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => updateStep(index, 'image', '')}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              {!step.image && onImageUpload && (
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-orange-600 dark:hover:text-orange-400">
                  <ImageIcon size={16} />
                  <span>Add image (optional)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(index, e)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeStep(index)}
              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        ))}

        {steps.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No steps added yet. Click "Add Step" to start.
          </p>
        )}
      </div>
    </div>
  );
}
