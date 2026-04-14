import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { DialogField, ModalDialog } from '../../shared/components/modal-dialog/modal-dialog';
import { TasksPayload, TasksService } from '../../services/tasks.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmModalDialog } from '../../shared/components/confirm-modal-dialog/confirm-modal-dialog';



@Component({
  selector: 'app-tasks',
  imports: [MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class Tasks {

  private tasksService = inject(TasksService)
  readonly dialog = inject(MatDialog);
  readonly panelOpenState = signal(false);

  tasks = this.tasksService.tasks;
  hasTasks = () => (this.tasks() ?? []).length > 0;

  normalizarDataEvento(dataEvento: string) {
    const [data, tempo] = dataEvento.split(' ');
    const [dia, mes, ano] = data.split('-').map(Number);
    const [hora, minuto] = tempo.split(':').map(Number);

    const dataFormatada = new Date(ano, mes - 1, dia, hora, minuto);
    const tempoFormatado = new Date(ano, mes - 1, dia, hora, minuto);

    return { dataFormatada, tempoFormatado };
  }

  normalizarDataEventoExibicao(dataEvento: string) {
    const [data, tempo] = dataEvento.split(' ');
    const [dia, mes, ano] = data.split('-')
    const [hora, minuto] = tempo.split(':')

    const dataString = `${dia}/${mes}/${ano}`;
    const tempoString = `${hora}:${minuto}`;

    return { dataString, tempoString };
  }

  cadastrarTarefa() {
    const formConfig: DialogField[] = [
      { name: 'nomeTarefa', label: 'Nome da Tarefa' },
      { name: 'data', label: 'Data da Tarefa', type: 'date' },
      { name: 'tempo', label: 'Hora da Tarefa', type: 'time' },
      { name: 'descricao', label: 'Descreva a Tarefa' },
    ]


    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar Tarefa', formConfig },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { data, tempo, ...resto } = result;

        const formatterDateTime = (n: number) => n.toString().padStart(2, "0");

        const ano = data.getFullYear();
        const mes = formatterDateTime(data.getMonth() + 1);
        const dia = formatterDateTime(data.getDate());

        const hora = formatterDateTime(tempo.getHours());
        const minuto = formatterDateTime(tempo.getMinutes());
        const segundo = formatterDateTime(tempo.getSeconds());

        const dataEvento = `${dia}-${mes}-${ano} ${hora}:${minuto}:${segundo}`

        const payload = {
          ...resto,
          dataEvento
        }
        this.tasksService.createTask(payload).subscribe({
          next: () => console.log('Tarefa cadastrada com sucesso', payload),
          error: () => console.log('Erro ao cadastrar tarefa', payload),
        })
      }
    });
  }

  editarTarefa(tarefa: TasksPayload) {

    const { dataFormatada, tempoFormatado } = this.normalizarDataEvento(tarefa.dataEvento);

    const formConfig: DialogField[] = [
      { name: 'nomeTarefa', label: 'Nome da Tarefa', value: tarefa.nomeTarefa },
      { name: 'data', label: 'Data da Tarefa', type: 'date', value: dataFormatada },
      { name: 'tempo', label: 'Hora da Tarefa', type: 'time', value: tempoFormatado },
      { name: 'descricao', label: 'Descreva a Tarefa', value: tarefa.descricao },
    ]


    const dialogRef = this.dialog.open(ModalDialog, {
      data: { title: 'Adicionar Tarefa', formConfig },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { data, tempo, ...resto } = result;

        const formatterDateTime = (n: number) => n.toString().padStart(2, "0");

        const ano = data.getFullYear();
        const mes = formatterDateTime(data.getMonth() + 1);
        const dia = formatterDateTime(data.getDate());

        const hora = formatterDateTime(tempo.getHours());
        const minuto = formatterDateTime(tempo.getMinutes());
        const segundo = formatterDateTime(tempo.getSeconds());

        const dataEvento = `${dia}-${mes}-${ano} ${hora}:${minuto}:${segundo}`

        const payload = {
          ...resto,
          dataEvento
        }
        this.tasksService.editTask(tarefa.id, payload).subscribe({
          next: () => console.log('Tarefa atualizada com sucesso', payload),
          error: () => console.log('Erro ao atualizar tarefa', payload),
        })
      }
    });
  }

  deletarTarefa(tarefa: string) {

    const dialogRef = this.dialog.open(ConfirmModalDialog, {
      data: {
        title: 'Confirmar Exclusão?',
        message: 'Tem certeza que deseja deletar esta tarefa?',
        confirmButton: 'Deletar',
        cancelButton: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.tasksService.deletarTask(tarefa).subscribe({
          next: () => console.log('Tarefa deletada com sucesso'),
          error: () => console.log('Erro ao deletar tarefa'),
        })
      }
    });
  }
}
