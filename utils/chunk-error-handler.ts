// Global chunk loading error handler
export function setupChunkErrorHandler() {
  if (typeof window === 'undefined') return;

  // Handle chunk loading errors
  window.addEventListener('error', (event) => {
    const error = event.error;
    
    // Check if it's a chunk loading error
    if (
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('Failed to fetch')
    ) {
      console.warn('Chunk loading error detected:', error);
      
      // Prevent the error from being logged to console
      event.preventDefault();
      
      // Show a user-friendly message
      const message = document.createElement('div');
      message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #dc2626;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 9999;
        max-width: 300px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      `;
      message.innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px;">
          <span>⚠️</span>
          <span>Application update detected. Please refresh the page.</span>
        </div>
        <button onclick="window.location.reload()" style="
          margin-top: 8px;
          background: #dc2626;
          color: white;
          border: none;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        ">Refresh</button>
      `;
      
      document.body.appendChild(message);
      
      // Auto-remove after 10 seconds
      setTimeout(() => {
        if (message.parentNode) {
          message.parentNode.removeChild(message);
        }
      }, 10000);
    }
  });

  // Handle unhandled promise rejections (which might include chunk loading errors)
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    
    if (
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('Failed to fetch')
    ) {
      console.warn('Unhandled chunk loading rejection:', error);
      event.preventDefault();
      
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  });
}

// Auto-setup when this module is imported
if (typeof window !== 'undefined') {
  setupChunkErrorHandler();
} 