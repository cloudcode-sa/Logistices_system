import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { supabase } from '../supabase.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private userSubject = new BehaviorSubject<any | null>(null);
  user$ = this.userSubject.asObservable();
  private router = inject(Router);

  constructor() {
    this.restoreSession();
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;

    const user = data?.user ?? data?.session?.user ?? null;
    if (user) this.userSubject.next(user);

    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    this.userSubject.next(null);
    await this.router.navigate(['/login']);
  }

  async getUser() {
    const { data } = await supabase.auth.getUser();
    return data?.user ?? null;
  }

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data?.session ?? null;
  }

  private async restoreSession() {
    try {
      const session = await this.getSession();
      const user = session?.user ?? null;
      this.userSubject.next(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      this.userSubject.next(null);
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      this.userSubject.next(user);
    });
  }

  get currentUser() {
    return this.userSubject.value;
  }
}
