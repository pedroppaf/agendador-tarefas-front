import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Auth } from './auth';
import { Observable, tap } from 'rxjs';

interface TasksResponse {
  id: string,
  nomeTarefa: string,
  descricao: string,
  dataCriacao: string,
  dataEvento: string,
  emailUsuario: string,
  dataAlteracao: string,
  statusNotificacaoEnum: 'PENDENTE' | 'NOTIFICADO' | 'CANCELADO'
}

export interface TasksPayload {
  id?: string,
  nomeTarefa: string,
  descricao: string,
  dataEvento: string,
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {

  private apiUrl = 'http://localhost:8083';

  private _tasks = signal<TasksResponse[] | null>(null);
  readonly tasks = this._tasks.asReadonly();

  constructor(
    private http: HttpClient,
    private auth: Auth
  ) {
    this.loadTasks()
  }

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({ Authorization: `${token}` })
  }

  loadTasks(): void {
    this.http.get<TasksResponse[]>(`${this.apiUrl}/tarefas`, { headers: this.getHeaders() })
      .subscribe({
        next: tasks => this._tasks.set(tasks),
        error: () => this._tasks.set([])
      })
  }

  createTask(body: TasksPayload): Observable<TasksResponse> {
    return this.http.post<TasksResponse>(`${this.apiUrl}/tarefas`, body, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.loadTasks())
      )
  }

  editTask(id: string | undefined, body: TasksPayload): Observable<TasksResponse> {
    return this.http.put<TasksResponse>(`${this.apiUrl}/tarefas?id=${id}`, body, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.loadTasks())
      )
  }

  deletarTask(id: string): Observable<TasksResponse> {
    return this.http.delete<TasksResponse>(`${this.apiUrl}/tarefas?id=${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(() => this.loadTasks())
      )
  }
}
