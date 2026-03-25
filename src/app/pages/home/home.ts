import {Component, inject} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { Router, RouterLink } from "@angular/router";
import { Auth } from '../../services/auth';


@Component({
  selector: 'app-home',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  imgHero = 'assets/imagem-hero.svg'


  private auth = inject(Auth)
  private router = inject(Router) 


  ngOnInit(): void{
    if(this.auth.isLoggedIn()){
      this.router.navigate(['/tasks'])
    }
  }
}
