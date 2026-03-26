import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink, RouterModule } from "@angular/router";
import { MatDividerModule } from '@angular/material/divider';
import { Subscription } from 'rxjs';
import { RouterState } from '../../../../core/router/router-state';
import {MatMenuModule} from '@angular/material/menu';
import { Auth } from '../../../../services/auth';
import { User } from '../../../../services/user';

@Component({
  selector: 'app-top-menu',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, RouterLink, RouterModule, MatDividerModule, MatMenuModule],
  templateUrl: './top-menu.html',
  styleUrl: './top-menu.scss',
})
export class TopMenu implements OnInit, OnDestroy {
  appLogo = "assets/logo-agendador-javanauta.png";
  rotaAtual: string = '';
  inscricaoRota!: Subscription;

  private routerService = inject(RouterState);
  private auth = inject(Auth);
  private route = inject(Router);
  private user = inject(User);


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

  estaNaRotaLogin(): boolean {
    return this.rotaAtual === '/login'
  }

  get estaLogado(): boolean{
    return this.auth.isLoggedIn();
  }

  pegarInicialUsuario(): string {
    const user = this.user.getUser();

    if(user && user.nome){
      return user.nome.charAt(0).toUpperCase();
    }
    return '?'
  }

  logout(): void{
    this.auth.logout();
    this.route.navigate(['/login'])
  }


}
