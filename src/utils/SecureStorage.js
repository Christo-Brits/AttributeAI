// Secure storage utility for AttributeAI
// YC-ready implementation with encryption

class SecureStorage {
  constructor() {
    this.keyPrefix = 'attributeai_';
    this.encryptionEnabled = true;
  }

  // Simple XOR encryption for non-critical data
  encrypt(data) {
    if (!this.encryptionEnabled) return data;
    
    const key = 'AttributeAI2025'; // In production, use proper key management
    const jsonStr = JSON.stringify(data);
    let encrypted = '';
    
    for (let i = 0; i < jsonStr.length; i++) {
      encrypted += String.fromCharCode(
        jsonStr.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    
    return btoa(encrypted);
  }

  decrypt(encryptedData) {
    if (!this.encryptionEnabled) return encryptedData;
    
    try {
      const key = 'AttributeAI2025';
      const encrypted = atob(encryptedData);
      let decrypted = '';
      
      for (let i = 0; i < encrypted.length; i++) {
        decrypted += String.fromCharCode(
          encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length)
        );
      }
      
      return JSON.parse(decrypted);
    } catch (error) {
      console.warn('Failed to decrypt data:', error);
      return null;
    }
  }

  // Secure setItem with encryption
  setItem(key, value, options = {}) {
    try {
      const fullKey = this.keyPrefix + key;
      const dataToStore = {
        value: value,
        timestamp: Date.now(),
        encrypted: this.encryptionEnabled,
        ...options
      };

      const encryptedData = this.encrypt(dataToStore);
      localStorage.setItem(fullKey, encryptedData);
      return true;
    } catch (error) {
      console.error('SecureStorage setItem failed:', error);
      return false;
    }
  }

  // Secure getItem with decryption
  getItem(key, defaultValue = null) {
    try {
      const fullKey = this.keyPrefix + key;
      const storedData = localStorage.getItem(fullKey);
      
      if (!storedData) return defaultValue;
      
      const decryptedData = this.decrypt(storedData);
      if (!decryptedData) return defaultValue;
      
      // Check if data has expired
      if (decryptedData.expiresAt && Date.now() > decryptedData.expiresAt) {
        this.removeItem(key);
        return defaultValue;
      }
      
      return decryptedData.value;
    } catch (error) {
      console.error('SecureStorage getItem failed:', error);
      return defaultValue;
    }
  }

  // Remove item
  removeItem(key) {
    try {
      const fullKey = this.keyPrefix + key;
      localStorage.removeItem(fullKey);
      return true;
    } catch (error) {
      console.error('SecureStorage removeItem failed:', error);
      return false;
    }
  }

  // Clear all AttributeAI data
  clear() {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.keyPrefix)
      );
      
      keys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('SecureStorage clear failed:', error);
      return false;
    }
  }

  // Set with expiration
  setWithExpiry(key, value, ttlMs) {
    const expiresAt = Date.now() + ttlMs;
    return this.setItem(key, value, { expiresAt });
  }

  // Get all keys with prefix
  getKeys() {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(this.keyPrefix))
      .map(key => key.replace(this.keyPrefix, ''));
  }

  // Validate data integrity
  validateData(key) {
    const data = this.getItem(key);
    return data !== null;
  }

  // Backup data (for export)
  exportData() {
    const data = {};
    this.getKeys().forEach(key => {
      data[key] = this.getItem(key);
    });
    return data;
  }

  // Import data (for restore)
  importData(data, options = {}) {
    const { overwrite = false } = options;
    let imported = 0;
    
    for (const [key, value] of Object.entries(data)) {
      if (!overwrite && this.getItem(key) !== null) {
        continue; // Skip if exists and not overwriting
      }
      
      if (this.setItem(key, value)) {
        imported++;
      }
    }
    
    return imported;
  }
}

// Create singleton instance
const secureStorage = new SecureStorage();

// Backward compatibility with localStorage API
export const secureLocalStorage = {
  setItem: (key, value) => secureStorage.setItem(key, value),
  getItem: (key, defaultValue) => secureStorage.getItem(key, defaultValue),
  removeItem: (key) => secureStorage.removeItem(key),
  clear: () => secureStorage.clear(),
  
  // Enhanced methods
  setWithExpiry: (key, value, ttlMs) => secureStorage.setWithExpiry(key, value, ttlMs),
  exportData: () => secureStorage.exportData(),
  importData: (data, options) => secureStorage.importData(data, options)
};

export default secureStorage;
