// src/app/service/auth-service.ts
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { supabase } from '../supabase.config';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private userSubject = new BehaviorSubject<any | null>(null);
  user$ = this.userSubject.asObservable();
  private router = inject(Router);

  constructor() {
    this.initAuth();
  }

  private parseParams(str: string) {
    if (!str) return {} as Record<string,string>;
    const s = str.startsWith('#') || str.startsWith('?') ? str.slice(1) : str;
    return s.split('&').reduce<Record<string,string>>((acc, part) => {
      const [k, v] = part.split('=');
      if (k) acc[k] = decodeURIComponent(v ?? '');
      return acc;
    }, {});
  }

  private async initAuth() {
    try {
      const hashParams = this.parseParams(window.location.hash || '');
      const queryParams = this.parseParams(window.location.search || '');

      console.debug('auth:init hashParams:', hashParams, 'queryParams:', queryParams);

      // If tokens present in hash -> setSession and redirect to dashboard
      if (hashParams['access_token'] && hashParams['refresh_token']) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data, error } = await (supabase.auth as any).setSession({
            access_token: hashParams['access_token'],
            refresh_token: hashParams['refresh_token']
          });

          if (error) {
            console.warn('setSession error', error);
          } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const user = (data as any)?.user ?? (data as any)?.session?.user ?? null;
            if (user) {
              this.userSubject.next(user);
              // cleanup URL
              try {
                const clean = window.location.pathname + (window.location.search || '');
                history.replaceState({}, document.title, clean);
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (e) { /* empty */ }

              // redirect
              try { this.router.navigate(['/dashboard/default']); } catch (e) { console.warn('navigate error', e); }
            }
            return;
          }
        } catch (e) {
          console.warn('setSession threw', e);
        }
      }

      // If code present (oauth) -> exchange and redirect
      if (queryParams['code']) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (typeof (supabase.auth as any).exchangeCodeForSession === 'function') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data, error } = await (supabase.auth as any).exchangeCodeForSession(queryParams['code']);
            if (error) {
              console.warn('exchangeCodeForSession error', error);
            } else {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const user = (data as any)?.session?.user ?? null;
              if (user) {
                this.userSubject.next(user);
                try {
                  const clean = window.location.pathname + (window.location.hash || '');
                  history.replaceState({}, document.title, clean);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (e) { /* empty */ }
                try { this.router.navigate(['/dashboard/default']); } catch (e) { console.warn('navigate error', e); }
              }
              return;
            }
          } else {
            console.debug('exchangeCodeForSession not available in this SDK version');
          }
        } catch (e) {
          console.warn('exchangeCodeForSession threw', e);
        }
      }

      // fallback: restore existing session from storage
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resp: any = await supabase.auth.getSession();
        const session = resp?.data?.session ?? resp?.session ?? null;
        const user = session?.user ?? null;
        this.userSubject.next(user);
      } catch (e) {
        console.warn('getSession fallback failed', e);
        this.userSubject.next(null);
      }
    } catch (err) {
      console.warn('initAuth top-level error', err);
      this.userSubject.next(null);
    }

    // subscribe to auth state changes
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      supabase.auth.onAuthStateChange((_event:any, payload:any) => {
        const user =
          payload?.user ??
          payload?.data?.session?.user ??
          payload?.session?.user ??
          null;
        this.userSubject.next(user);
      });
    } catch (e) {
      console.warn('onAuthStateChange subscription failed', e);
    }
  }


  async signInWithMagicLink(email: string, redirectTo?: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo }
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    this.userSubject.next(null);
  }

  async getUser() {
    const { data } = await supabase.auth.getUser();
    return data?.user ?? null;
  }

  async getSession() {
    const { data } = await supabase.auth.getSession();
    return data?.session ?? null;
  }

  get currentUser() {
    return this.userSubject.value;
  }
}
