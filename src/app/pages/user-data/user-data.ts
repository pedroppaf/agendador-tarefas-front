import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../services/user';
import { DialogField, ModalDialog } from '../../shared/components/modal-dialog/modal-dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Auth } from '../../services/auth';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';



@Component({
  selector: 'app-user-data',
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatListModule, MatIconModule, MatTooltipModule],
  templateUrl: './user-data.html',
  styleUrl: './user-data.scss',
})
export class UserData {

  private formBuilder = inject(FormBuilder);
  private userService = inject(User);
  private auth = inject(Auth);
  readonly dialog = inject(MatDialog);

  user = this.userService.user;

  form = this.formBuilder.group({
    nome: [{ value: this.user()?.nome || '', disabled: true }],
    email: [{ value: this.user()?.email || '', disabled: true }],
  });

  cadastrarEndereco() {

    const token = this.auth.getToken();
    if (!token) return

    const formConfig: DialogField[] = [
      {
        name: 'cep',
        label: 'CEP',
        button: {
          icon: 'search',
          callback: (cep: string) => this.bucarEnderecoPeloCep(cep, dialogRef)
        },
        validators: [Validators.required]
      },
      { name: 'rua', label: 'Rua' },
      { name: 'numero', label: 'Numero', type: 'number' },
      { name: 'complemento', label: 'Complemento' },
      { name: 'cidade', label: 'Cidade' },
      { name: 'estado', label: 'Estado' },
    ]


    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar Endereço', formConfig },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.saveEndereco(result, token).subscribe({
          next: () => console.log('Endereço cadastrado com sucesso', result),
          error: () => console.log('Erro ao cadastrar endereco', result),
        })
      }
    });
  }

  editarEndereco(endereco: {
    id: number,
    rua: string,
    numero: number,
    complemento: string,
    cidade: string,
    estado: string,
    cep: string
  }) {

    const token = this.auth.getToken();
    if (!token) return

    const formConfig: DialogField[] = [
      {
        name: 'cep',
        label: 'CEP',
        value: endereco.cep,
        button: {
          icon: 'search',
          callback: (cep: string) => this.bucarEnderecoPeloCep(cep, dialogRef)
        },
        validators: [Validators.required]
      },
      { name: 'rua', label: 'Rua', value: endereco.rua },
      { name: 'numero', label: 'Numero', type: 'number', value: endereco.numero },
      { name: 'complemento', label: 'Complemento', value: endereco.complemento },
      { name: 'cidade', label: 'Cidade', value: endereco.cidade },
      { name: 'estado', label: 'Estado', value: endereco.estado },
    ]


    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar Endereço', formConfig },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateEndereco(endereco.id, result, token).subscribe({
          next: () => console.log('Endereço cadastrado com sucesso', result),
          error: () => console.log('Erro ao cadastrar endereco', result),
        })
      }
    });
  }

  bucarEnderecoPeloCep(cep: string, dialogRef: MatDialogRef<ModalDialog, any>) {
    this.userService.getEnderecoByCep(cep).subscribe({
      next: (response) => {
        dialogRef.componentInstance.form.patchValue({
          rua: response.logradouro,
          complemento: response.complemento,
          cidade: response.localidade,
          estado: response.uf
        });
      },
      error: () => console.warn('CEP não encontrado')
    })

  }

  cadastrarTelefone() {

    const token = this.auth.getToken();
    if (!token) return


    const formConfig: DialogField[] = [
      { name: 'ddd', label: 'DDD', validators: [Validators.required] },
      { name: 'numero', label: 'Numero', validators: [Validators.required] },
    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar Telefone', formConfig },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.saveTelefone(result, token).subscribe({
          next: () => console.log('Telefone cadastrado com sucesso', result),
          error: () => console.log('Erro ao cadastrar telefone', result),
        })
      }
    });
  }

  editarTelefone(telefone: { id: number, ddd: string, numero: string }) {

    const token = this.auth.getToken();
    if (!token) return


    const formConfig: DialogField[] = [
      { name: 'ddd', label: 'DDD', value: telefone.ddd, validators: [Validators.required] },
      { name: 'numero', label: 'Numero', value: telefone.numero, validators: [Validators.required] },
    ]

    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Editar Telefone', formConfig },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateTelefone(telefone.id, result, token).subscribe({
          next: () => console.log('Telefone editado com sucesso', result),
          error: () => console.log('Erro ao editar telefone', result),
        })
      }
    });

  }

  //TODO: criar deleta telefone e endereço
  
}
