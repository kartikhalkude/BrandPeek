import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL ;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Expanded fallback data
const FALLBACK_BRANDS = [
  {
    id: '1',
    name: 'Nike',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/2560px-Logo_NIKE.svg.png',
    description: 'Just Do It - Sports leader',
    fullDescription: 'Nike is a leading sports company founded in 1964. Based in Oregon, USA, they continue to innovate and shape the future of their industry through cutting-edge technology and customer-focused solutions.',
    founded: '1964',
    headquarters: 'Oregon, USA',
    category: 'Sports'
  },
  {
    id: '2',
    name: 'Apple',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Apple_logo_grey.svg/1724px-Apple_logo_grey.svg.png',
    description: 'Think Different - Technology leader',
    fullDescription: 'Apple is a leading technology company founded in 1976. Based in California, USA, they continue to innovate and shape the future of their industry through cutting-edge technology and customer-focused solutions.',
    founded: '1976',
    headquarters: 'California, USA',
    category: 'Technology'
  },
  {
    id: '3',
    name: 'Tesla',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Tesla_T_symbol.svg/1200px-Tesla_T_symbol.svg.png',
    description: 'Accelerating sustainable transport',
    fullDescription: 'Tesla is a leading electric vehicle company founded in 2003. Based in Austin, Texas, they continue to innovate and shape the future of their industry through cutting-edge technology and customer-focused solutions.',
    founded: '2003',
    headquarters: 'Austin, Texas',
    category: 'Automotive'
  },
  {
    id: '4',
    name: 'Coca-Cola',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/2560px-Coca-Cola_logo.svg.png',
    description: 'Open Happiness - Beverage leader',
    fullDescription: 'Coca-Cola is a leading beverage company founded in 1886. Based in Atlanta, Georgia, they continue to innovate and shape the future of their industry through cutting-edge technology and customer-focused solutions.',
    founded: '1886',
    headquarters: 'Atlanta, Georgia',
    category: 'Beverages'
  }
];

// Cache management
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (operation, params = {}) => {
  return `${operation}-${JSON.stringify(params)}`;
};

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const apiService = {
  // Get all brands with optional filtering and caching
  getBrands: async (filters = {}) => {
    const cacheKey = getCacheKey('brands', filters);
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      console.log('Using cached brand data');
      return cachedData;
    }

    try {
      console.log('Fetching brands from Supabase...', filters);

      let query = supabase
        .from('brands')
        .select('*');

      // Apply filters if provided
      if (filters.category) {
        query = query.ilike('category', `%${filters.category}%`);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      query = query.order('name', { ascending: true });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid data format from Supabase');
      }

      console.log('Successfully fetched brands:', data.length);
      setCachedData(cacheKey, data);
      return data;

    } catch (error) {
      console.error('Supabase fetch failed, using fallback data:', error.message);
      
      // Apply filters to fallback data
      let filteredFallback = [...FALLBACK_BRANDS];
      
      if (filters.category) {
        filteredFallback = filteredFallback.filter(brand => 
          brand.category.toLowerCase().includes(filters.category.toLowerCase())
        );
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredFallback = filteredFallback.filter(brand =>
          brand.name.toLowerCase().includes(searchTerm) ||
          brand.description.toLowerCase().includes(searchTerm)
        );
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return filteredFallback;
    }
  },

  // Get single brand by ID with caching
  getBrandById: async (id) => {
    const cacheKey = getCacheKey('brand', { id });
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      console.log(`Using cached brand data for ID: ${id}`);
      return cachedData;
    }

    try {
      console.log(`Fetching brand with ID ${id} from Supabase...`);

      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error(`Brand with ID ${id} not found in database`);
      }

      console.log(`Successfully fetched brand: ${data.name}`);
      setCachedData(cacheKey, data);
      return data;

    } catch (error) {
      console.error(`Error in getBrandById for ID ${id}:`, error.message);
      
      const fallbackBrand = FALLBACK_BRANDS.find(b => b.id.toString() === id.toString());
      
      if (!fallbackBrand) {
        throw new Error(`Brand with ID ${id} not found`);
      }
      
      console.log(`Using fallback data for brand: ${fallbackBrand.name}`);
      return fallbackBrand;
    }
  },

  // Get unique categories
  getCategories: async () => {
    const cacheKey = getCacheKey('categories');
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      console.log('Using cached categories data');
      return cachedData;
    }

    try {
      console.log('Fetching categories from Supabase...');

      const { data, error } = await supabase
        .from('brands')
        .select('category')
        .not('category', 'is', null);

      if (error) {
        throw error;
      }

      const categories = [...new Set(data.map(item => item.category))].sort();
      setCachedData(cacheKey, categories);
      return categories;

    } catch (error) {
      console.error('Failed to fetch categories, using fallback:', error.message);
      const fallbackCategories = [...new Set(FALLBACK_BRANDS.map(brand => brand.category))].sort();
      return fallbackCategories;
    }
  },

  // Clear cache (useful for refreshing data)
  clearCache: () => {
    cache.clear();
    console.log('Cache cleared');
  },

  // Health check for Supabase connection
  healthCheck: async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('count', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      return { 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        totalRecords: data?.length || 0
      };

    } catch (error) {
      return { 
        status: 'error', 
        timestamp: new Date().toISOString(),
        error: error.message 
      };
    }
  }
};