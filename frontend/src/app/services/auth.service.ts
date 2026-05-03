import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, authState, User, updateProfile } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router: Router = inject(Router);
  
  // Observable que emite el estado del usuario en tiempo real
  readonly session$: Observable<User | null> = authState(this.auth);

  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  async login(credentials: any): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, credentials.email, credentials.password);
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  }

  async register(userData: any): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, userData.email, userData.password);
      // Podemos guardar el nombre usando updateProfile
      await updateProfile(userCredential.user, {
        displayName: userData.name || userData.first_name
      });
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
