import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';

export interface DialogField {
  name: string;
  label: string;
  value?: string | number;
  button?: {icon: string, callback: (value: string, dialogRef: MatDialogRef<ModalDialog>) => void}
  type?: string;
  validators?: any[];
}

interface DialogData {
  title: string;
  formConfig: DialogField[];
}

@Component({
  selector: 'app-modal-dialog',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatDialogContent, MatDialogActions, MatDialogTitle, ReactiveFormsModule, MatIconModule],
  templateUrl: './modal-dialog.html',
  styleUrl: './modal-dialog.scss',
})

export class ModalDialog {
  readonly formBuild = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<ModalDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  fields: DialogField[] = this.data.formConfig;

  private buildControls(): Record<string, any> {
    const controls: Record<string, any> = {}

    this.fields.forEach(field => {
      controls[field.name] = [field.value ?? '', field.validators || []];
    })

    return controls;
  }

  form: FormGroup = this.formBuild.group(this.buildControls())

  onSave(){
    this.dialogRef.close(this.form.value)
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
