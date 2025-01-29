export const handleApiRequest = async (
  apiCall,
  onSuccess,
  onError,
  setIsLoading
) => {
  try {
    setIsLoading && setIsLoading(true);
    const response = await apiCall();
    if (response?.ok) {
      const data = await response.json().catch(() => null);
      onSuccess && onSuccess(data);
    } else {
      throw new Error("API request failed");
    }
  } catch (error) {
    console.error("API Error:", error);
    onError && onError(error);
  } finally {
    setIsLoading && setIsLoading(false);
  }
};
