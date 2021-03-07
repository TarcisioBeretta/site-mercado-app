import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { IProdutoView } from 'src/app/services/produto/produto-view.interface';
import { ProdutoService } from 'src/app/services/produto/produto.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-produtos-form',
  templateUrl: './produtos-form.component.html',
  styleUrls: ['./produtos-form.component.scss']
})
export class ProdutosFormComponent implements OnInit {

  id: number | undefined;
  title: string | undefined;
  imagem: File | undefined;
  imagemUrl: string | undefined;
  loading = false;

  form: FormGroup = this.formBuilder.group({
    nome: ['', Validators.required],
    valor: ['', Validators.required]
  });

  constructor(
    private produtoService: ProdutoService,
    private formBuilder: FormBuilder,
    private matSnackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initId();
    this.initTitle();
    this.loadProduto();
  }

  submit(): void {
    this.loading = true;

    const produto = this.form.value;
    produto.imagem = this.imagem;

    const saveMethod = this.id ?
      this.produtoService.update(this.id, produto) :
      this.produtoService.create(produto);

    saveMethod.subscribe(
      () => this.onSaveSuccess(),
      error => this.onSaveError(error)
    );
  }

  handleFile(event: any): void {
    const file = event.target.files[0];
    this.changeImagem(file);
    this.changeImagemUrl(file);
  }

  private initId(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.id = parseInt(id, 10);
    }
  }

  private initTitle(): void {
    this.title = this.id ? 'Edição de produto' : 'Cadastro de produto';
  }

  private loadProduto(): void {
    if (this.id) {
      this.produtoService
        .getById(this.id)
        .subscribe(
          data => this.onLoadSuccess(data),
          error => this.onLoadError(error)
        );
    }
  }

  private onLoadSuccess(data: IProdutoView): void {
    this.form.patchValue(data);
    this.imagemUrl = `${environment.backendUrl}/${data.imagem}`;
  }

  private onLoadError(error: HttpErrorResponse): void {
    if (error.status !== 404) {
      this.openSnackBar('Ocorreu um erro ao consultar o produto');
    }
  }

  private onSaveSuccess(): void {
    this.loading = false;
    this.router.navigate(['produtos']);
    this.openSnackBar('Produto salvo com sucesso!');
  }

  private onSaveError(error: HttpErrorResponse): void {
    this.loading = false;
    this.openSnackBar('Ocorreu um erro ao salvar o produto.');
  }

  private openSnackBar(text: string): void {
    this.matSnackBar.open(text, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  private changeImagem(file: File): void {
    this.imagem = file;
  }

  private changeImagemUrl(file: File): void {
    const reader = new FileReader();
    reader.onload = (event: any) => this.imagemUrl = event.target.result;
    reader.readAsDataURL(file);
  }
}
