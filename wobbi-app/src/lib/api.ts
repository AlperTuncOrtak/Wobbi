import { useAuth } from '@clerk/expo';

// API URL'sini .env dosyasından alır, yoksa geliştirme ortamı için localhost veya lokal IP kullanır.
// NOT: Cihaz (Fiziksel veya Emülatör) testlerinde localhost yerine bilgisayarınızın yerel IP'sini (örn: 192.168.1.100) kullanın.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:3000';

/**
 * Backend'den gelen '/uploads/...' gibi göreli yolları tam (absolute) URL'ye dönüştürür.
 */
export function getMediaUrl(path?: string | null): string {
  if (!path) return '';
  
  // Eğer zaten tam bir URL ise (http:// veya https:// ile başlıyorsa) aynen döndür
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Başında slash yoksa ekle
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Sonundaki slash'ı kaldır (çift slash oluşmasını engellemek için)
  const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Kimlik doğrulaması gerektiren (Auth) genel API çağrısı fonksiyonu.
 * İçerisinde Clerk'ten Token'ı alıp Authorization başlığına ekler.
 */
export async function fetchWithAuth(
  endpoint: string, 
  options: RequestInit = {}, 
  getToken: () => Promise<string | null>
) {
  const token = await getToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Eğer token varsa Authorization başlığına ekle
  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn(`[API] Token bulunamadı. İstek ${endpoint} adresine yetkisiz (401) gidebilir.`);
  }

  // URL'yi birleştir
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API Hatası: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error(`[API] Fetch hatası (${endpoint}):`, error);
    throw error;
  }
}

/**
 * Clerk Hook'u içermeyen standart Custom Hook.
 * Component'ler içerisinde `const api = useApi();` şeklinde kullanılır.
 */
export function useApi() {
  const { getToken } = useAuth();

  return {
    get: (endpoint: string) => fetchWithAuth(endpoint, { method: 'GET' }, getToken).then(res => res.json()),
    
    post: (endpoint: string, body: any) => fetchWithAuth(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(body) 
    }, getToken).then(res => res.json()),
    
    put: (endpoint: string, body: any) => fetchWithAuth(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(body) 
    }, getToken).then(res => res.json()),
    
    delete: (endpoint: string) => fetchWithAuth(endpoint, { method: 'DELETE' }, getToken).then(res => res.json()),
  };
}
