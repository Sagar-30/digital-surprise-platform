// Simulated video streaming with chunks
export const createVideoStream = (videoUrl, onChunk) => {
  const chunkSize = 1024 * 1024; // 1MB chunks
  let loaded = 0;
  
  const fetchChunk = async () => {
    try {
      const response = await fetch(videoUrl, {
        headers: {
          Range: `bytes=${loaded}-${loaded + chunkSize}`,
        },
      });
      
      const data = await response.blob();
      loaded += data.size;
      onChunk(data);
      
      if (data.size === chunkSize) {
        await fetchChunk();
      }
    } catch (error) {
      console.error('Streaming error:', error);
    }
  };
  
  fetchChunk();
};