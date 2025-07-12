import { useState, useCallback } from 'react';
import { LogBox } from 'react-native';

const useErrorHandler = () => {
  const [error, setError] = useState(null);
  
  if (!__DEV__) {
    LogBox.ignoreLogs(['Warning: ...']);
    console.error = () => {}; 
  }

  const handleError = useCallback((err, context = '') => {
    if (__DEV__) {
      console.warn(`[${context}] Error:`, err);
    }
    
    setError({
      message: err.message || 'Something went wrong',
      context,
      stack: err.stack || ''
    });
    
    if (!__DEV__) {
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};

export default useErrorHandler;