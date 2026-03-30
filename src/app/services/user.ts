import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Auth } from './auth';

interface UserRegisterPayload {
  nome: string,
  email: string,
  senha: string,
  enderecos?: [{
    rua: string,
    numero: number,
    complemento: string,
    cidade: string,
    estado: string,
    cep: string
  }],
  telefones?: [{
    numero: string,
    ddd: string
  }]
}

export interface UserResponse {
  nome: string,
  email: string,
  enderecos: {
    id: number,
    rua: string,
    numero: number,
    complemento: string,
    cidade: string,
    estado: string,
    cep: string
  }[] | null,
  telefones: {
    id: number,
    numero: string,
    ddd: string
  }[] | null
}

export interface UserLoginPayload {
  email: string,
  senha: string,
}

@Injectable({
  providedIn: 'root',
})
export class User {

  private apiUrl = 'http://localhost:8083';

  private jwtHelper = new JwtHelperService;

  private _user = signal<UserResponse | null>(null);
  readonly user = this._user.asReadonly();

  constructor(private http: HttpClient, private auth: Auth) {
    const usuarioSalvo = this.auth.getUser();
    if (usuarioSalvo) {
      this.setUser(usuarioSalvo)
    }
  }

  register(body: UserRegisterPayload): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.apiUrl}/usuario`, body)
  }

  login(body: UserLoginPayload): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/usuario/login`, body, { responseType: 'text' as 'json' })
  }

  getUserByEmail(token: string): Observable<UserResponse> {
    const email = this.getEmailToken(token);
    if (!email) throw new Error('Token Inválido!');
    const headers = new HttpHeaders({ Authorization: `${token}` });
    return this.http.get<UserResponse>(`${this.apiUrl}/usuario?email=${email}`, { headers });
  }

  getEmailToken(token: string): string | null {
    try {
      const decoded = this.jwtHelper.decodeToken(token)
      return decoded?.sub || null
    } catch (error) {
      return null;
    }
  }

  saveTelefone(body: { numero: string, ddd: string }, token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `${token}` });

    return this.http.post<UserResponse>(`${this.apiUrl}/usuario/telefone`, body, { headers }).pipe(
      switchMap(() => this.getUserByEmail(token)),
      tap(user => {
        this.setUser(user)
        this.auth.saveUser(user)
      })
    );
  }

  updateTelefone(id: number, body: {
    numero: string,
    ddd: string
  }, token: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `${token}` });

    return this.http.put<UserResponse>(`${this.apiUrl}/usuario/telefone?id=${id}`, body, { headers }).pipe(
      switchMap(() => this.getUserByEmail(token)),
      tap(user => {
        this.setUser(user)
        this.auth.saveUser(user)
      })
    );
  }

  getUser(): UserResponse | null {
    return this.user();
  }

  setUser(data: UserResponse | null): void {
    this._user.set(data);
  }
}
