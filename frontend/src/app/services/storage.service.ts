import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private storage: Storage = inject(Storage);

  async uploadFileAndGetUrl(file: File, folder: string): Promise<string> {
    const filePath = `${folder}/${new Date().getTime()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);
    
    const uploadTask = uploadBytesResumable(storageRef, file);
    await uploadTask;
    
    return await getDownloadURL(storageRef);
  }
}
