export const debugLog = (tag: string, message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${tag}] ${message}`, data || '');
  }
};

export const debugError = (tag: string, message: string, error?: any) => {
  console.error(`[${tag}] ${message}`, error || '');
};

