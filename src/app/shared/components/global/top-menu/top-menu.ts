import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterModule } from "@angular/router";
import { MatDividerModule } from '@angular/material/divider';
import { Subscription } from 'rxjs';
import { RouterState } from '../../../../core/router/router-state';

@Component({
  selector: 'app-top-menu',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, RouterModule, MatDividerModule],
  templateUrl: './top-menu.html',
  styleUrl: './top-menu.scss',
})
export class TopMenu implements OnInit, OnDestroy {
  appLogo = "assets/logo-agendador-javanauta.png";
  rotaAtual: string = '';
  inscricaoRota!: Subscription;

  private routerService = inject(RouterState);


  ngOnInit(): void {
    this.inscricaoRota = this.routerService.rotaAtual$.subscribe(url => {
      this.rotaAtual = url;

    })
  }

  ngOnDestroy(): void {
    this.inscricaoRota.unsubscribe();
  }

  estaNaRotaRegister(): boolean {
    return this.rotaAtual === '/register'
  }


}
