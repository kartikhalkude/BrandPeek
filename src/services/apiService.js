import { createClient } from '@supabase/supabase-js';

// Get environment variables with fallback
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 
                    process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
                         process.env.REACT_APP_SUPABASE_ANON_KEY;

// Initialize Supabase (with error handling)
let supabase = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase initialized');
  } catch (error) {
    console.error('❌ Supabase init failed:', error);
  }
} else {
  console.warn('⚠️ Using fallback data (no Supabase credentials)');
}

// Expanded fallback data (works without internet)
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
  },
  {
    id: '5',
    name: 'Google',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png',
    description: 'Don\'t be evil - Tech giant',
    fullDescription: 'Google is a leading technology company founded in 1998. Based in California, USA, they continue to innovate and shape the future of their industry through cutting-edge technology and customer-focused solutions.',
    founded: '1998',
    headquarters: 'California, USA',
    category: 'Technology'
  }
];

export const apiService = {
  getBrands: async (filters = {}) => {
    // Try Supabase first, fallback to offline data
    if (supabase) {
      try {
        let query = supabase.from('brands').select('*');
        
        if (filters.category) {
          query = query.ilike('category', `%${filters.category}%`);
        }
        if (filters.search) {
          query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }
        
        const { data, error } = await query.order('name', { ascending: true });
        
        if (error) throw error;
        console.log('✅ Fetched from Supabase:', data.length, 'brands');
        return data;
      } catch (error) {
        console.warn('⚠️ Supabase failed, using fallback:', error.message);
      }
    }
    
    // Use fallback data
    console.log('📱 Using fallback data');
    return applyFiltersToFallback(FALLBACK_BRANDS, filters);
  },

  getBrandById: async (id) => {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        return data;
      } catch (error) {
        console.warn('⚠️ Supabase failed for brand detail, using fallback');
      }
    }
    
    const brand = FALLBACK_BRANDS.find(b => b.id.toString() === id.toString());
    if (!brand) throw new Error(`Brand with ID ${id} not found`);
    return brand;
  }
};

function applyFiltersToFallback(brands, filters) {
  let filtered = [...brands];
  
  if (filters.category) {
    filtered = filtered.filter(brand => 
      brand.category.toLowerCase().includes(filters.category.toLowerCase())
    );
  }
  
  if (filters.search) {
    const term = filters.search.toLowerCase();
    filtered = filtered.filter(brand =>
      brand.name.toLowerCase().includes(term) ||
      brand.description.toLowerCase().includes(term)
    );
  }
  
  return filtered;
}