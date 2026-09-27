import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

interface DownloadedItem {
  id: string;
  localImageUri?: string;
  localAudioUri?: string;
  downloadDate: string;
}

interface DownloadState {
  downloads: Record<string, DownloadedItem>; // BookID -> Local Files
  isDownloading: Record<string, boolean>; // Hangi kitap şu an iniyor?
  downloadBook: (bookId: string, imageUrl: string, audioUrl?: string) => Promise<void>;
  deleteDownload: (bookId: string) => Promise<void>;
  isDownloaded: (bookId: string) => boolean;
}

export const useDownloadStore = create<DownloadState>()(
  persist(
    (set, get) => ({
      downloads: {},
      isDownloading: {},

      isDownloaded: (bookId: string) => {
        return !!get().downloads[bookId];
      },

      downloadBook: async (bookId, imageUrl, audioUrl) => {
        set((state) => ({ isDownloading: { ...state.isDownloading, [bookId]: true } }));
        
        try {
          const downloadObj: DownloadedItem = {
            id: bookId,
            downloadDate: new Date().toISOString(),
          };

          // 1. Resmi İndir
          if (imageUrl) {
            const imageExt = imageUrl.split('.').pop() || 'jpg';
            const imageFileUri = `${FileSystem.documentDirectory}${bookId}_cover.${imageExt}`;
            const imageRes = await FileSystem.downloadAsync(imageUrl, imageFileUri);
            downloadObj.localImageUri = imageRes.uri;
          }

          // 2. Sesi İndir (İleride API'den gerçek MP3 geldiğinde)
          if (audioUrl) {
            const audioExt = audioUrl.split('.').pop() || 'mp3';
            const audioFileUri = `${FileSystem.documentDirectory}${bookId}_audio.${audioExt}`;
            const audioRes = await FileSystem.downloadAsync(audioUrl, audioFileUri);
            downloadObj.localAudioUri = audioRes.uri;
          }

          // İndirme başarılı, State'e kaydet
          set((state) => ({
            downloads: { ...state.downloads, [bookId]: downloadObj },
            isDownloading: { ...state.isDownloading, [bookId]: false }
          }));

          console.log(`[Offline Mode] Kitap ${bookId} başarıyla cihaza indirildi!`);

        } catch (error) {
          console.error(`[Offline Mode] İndirme hatası (${bookId}):`, error);
          set((state) => ({ isDownloading: { ...state.isDownloading, [bookId]: false } }));
        }
      },

      deleteDownload: async (bookId) => {
        const item = get().downloads[bookId];
        if (!item) return;

        try {
          // Cihazdan dosyaları sil
          if (item.localImageUri) await FileSystem.deleteAsync(item.localImageUri, { idempotent: true });
          if (item.localAudioUri) await FileSystem.deleteAsync(item.localAudioUri, { idempotent: true });

          // State'ten sil
          set((state) => {
            const newDownloads = { ...state.downloads };
            delete newDownloads[bookId];
            return { downloads: newDownloads };
          });

          console.log(`[Offline Mode] Kitap ${bookId} cihazdan silindi.`);
        } catch (error) {
          console.error(`[Offline Mode] Silme hatası (${bookId}):`, error);
        }
      }
    }),
    {
      name: 'wobbi-offline-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
