import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Contactservice {
  http = inject(HttpClient);


  private endpoint = 'https://formspree.io/f/meopwkvo';

 

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  send(formData: any): Observable<any> {
    const headers = new HttpHeaders({ 'Accept': 'application/json' });
    return this.http.post(this.endpoint, formData, { headers });
  }
}
