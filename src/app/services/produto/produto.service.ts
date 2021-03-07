import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IProdutoInput } from './produto-input.interface';
import { IProdutoView } from './produto-view.interface';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private readonly RESOURCE = 'produtos';

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<IProdutoView[]> {
    const url = this.getUrl();
    return this.httpClient.get<IProdutoView[]>(url);
  }

  getById(id: number): Observable<IProdutoView> {
    const url = `${this.getUrl()}/${id}`;
    return this.httpClient.get<IProdutoView>(url);
  }

  create(produto: IProdutoInput): Observable<IProdutoView> {
    const url = this.getUrl();
    const data = this.produtoInputToFormData(produto);
    return this.httpClient.post<IProdutoView>(url, data);
  }

  update(id: number, produto: IProdutoInput): Observable<IProdutoView> {
    const url = `${this.getUrl()}/${id}`;
    const data = this.produtoInputToFormData(produto);
    return this.httpClient.put<IProdutoView>(url, data);
  }

  delete(id: number): Observable<void> {
    const url = `${this.getUrl()}/${id}`;
    return this.httpClient.delete<void>(url);
  }

  private getUrl(): string {
    return `${environment.backendApiUrl}/${this.RESOURCE}`;
  }

  private produtoInputToFormData(produto: IProdutoInput): FormData {
    const formData = new FormData();
    formData.append('nome', produto.nome);
    formData.append('valor', produto.valor.toString());
    formData.append('imagem', produto.imagem);
    return formData;
  }
}
