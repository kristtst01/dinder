const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAIN_IMAGE_MAX_SIZE = 1200;
const STEP_IMAGE_MAX_SIZE = 1200;
const JPEG_QUALITY = 0.85;

export function validateImageFile(file: File): string | null {
  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Invalid file type. Please upload a JPEG, PNG, or WebP image.';
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return `File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`;
  }

  // Check for suspiciously small files
  if (file.size < 100) {
    return 'File appears to be invalid or corrupted.';
  }

  return null;
}

export async function compressImage(
  file: File,
  maxSize: number,
  cropToSquare = false
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let width = img.width;
      let height = img.height;
      let sx = 0;
      let sy = 0;
      let sWidth = width;
      let sHeight = height;

      if (cropToSquare) {
        // Crop to center square
        const minDim = Math.min(width, height);
        sx = (width - minDim) / 2;
        sy = (height - minDim) / 2;
        sWidth = minDim;
        sHeight = minDim;
        width = minDim;
        height = minDim;
      }

      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxSize || height > maxSize) {
        if (width > height) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // Draw the image (cropped if needed)
      ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        JPEG_QUALITY
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

export async function compressMainImage(file: File): Promise<File> {
  return compressImage(file, MAIN_IMAGE_MAX_SIZE, true);
}

export async function compressStepImage(file: File): Promise<File> {
  return compressImage(file, STEP_IMAGE_MAX_SIZE, false);
}
