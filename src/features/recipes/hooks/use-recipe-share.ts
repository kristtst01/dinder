export function useRecipeShare() {
  const handleShare = async (title: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this recipe: ${title}`,
          url: url,
        });
      } catch {
        // Share cancelled or failed - silently handle
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return { handleShare };
}
