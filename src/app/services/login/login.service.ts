import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ILoginResponse } from './login-response.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly RESOURCE = 'login';

  constructor(private httpClient: HttpClient) { }

  login(username: string, password: string): Observable<ILoginResponse> {
    const url = this.getUrl();
    const headers = this.getHeaders(username, password);
    return this.httpClient.post<ILoginResponse>(url, null, { headers });
  }

  private getUrl(): string {
    return `${environment.siteMercadoApiUrl}/${this.RESOURCE}`;
  }

  private getHeaders(username: string, password: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${username}:${password}`)
    });
  }
}
