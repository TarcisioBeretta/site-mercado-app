import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IProdutoView } from 'src/app/services/produto/produto-view.interface';
import { ProdutoService } from 'src/app/services/produto/produto.service';

@Component({
  selector: 'app-produtos-list',
  templateUrl: './produtos-list.component.html',
  styleUrls: ['./produtos-list.component.scss']
})
export class ProdutosListComponent implements OnInit {

  dataSource: IProdutoView[] = [];
  displayedColumns: string[] = ['nome', 'valor', 'acoes'];

  constructor(
    private produtoService: ProdutoService,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadItems();
  }

  delete(id: number): void {
    this.produtoService
      .delete(id)
      .subscribe(
        () => this.onDeleteSuccess(),
        () => this.onDeleteError()
      );
  }

  private loadItems(): void {
    this.produtoService
      .getAll()
      .subscribe(
        data => this.onLoadSuccess(data),
        error => this.onLoadError(error)
      );
  }

  private onLoadSuccess(data: IProdutoView[]): void {
    this.dataSource = data;
  }

  private onLoadError(error: HttpErrorResponse): void {
    this.dataSource = [];

    if (error.status !== 404) {
      this.openSnackBar('Ocorreu um erro ao consultar os produtos');
    }
  }

  private onDeleteSuccess(): void {
    this.loadItems();
    this.openSnackBar('Produto excluído com sucesso!');
  }

  private onDeleteError(): void {
    this.openSnackBar('Erro ao excluir produto!');
  }

  private openSnackBar(text: string): void {
    this.matSnackBar.open(text, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
