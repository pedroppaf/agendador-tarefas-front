import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PasswordField } from '../../shared/components/password-field/password-field';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { User, UserLoginPayload } from '../../services/user';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    PasswordField,
    ReactiveFormsModule,
    MatProgressSpinnerModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  encapsulation: ViewEncapsulation.None
})
export class Login {

  form: FormGroup<{email: FormControl<string>, senha: FormControl<string>}>;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private user: User,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      email: this.formBuilder.control('', {validators: [Validators.required, Validators.email], nonNullable: true}),
      senha: this.formBuilder.control('', {validators: [Validators.required, Validators.minLength(6)], nonNullable: true})
    });
  }

  get passwordControl(): FormControl {
    return this.form.get('senha') as FormControl;
  }

  get emailErros(): string | null {
    const emailControl = this.form.get('email');
    if (emailControl?.hasError('required')) return 'A informação do email é obrigatorio';
    if (emailControl?.hasError('email')) return 'Este email é invalido';
    return null;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return
    }

    const formData = this.form.value as UserLoginPayload;
    this.isLoading = true;

    this.user.login(formData)
    .pipe(finalize(() => this.isLoading = false))
    .subscribe({
      next: (response) => {
        this.router.navigate(['/'])
      },
      error: (error) => {
        console.log(`Erro ao entrar`, error)
      }
    })
  }
}
