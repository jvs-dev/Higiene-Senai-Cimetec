import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ModalSucessComponent } from '../../shared/components/modal-sucess/modal-sucess.component';

@Component({
  selector: 'app-loyout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ModalSucessComponent],
  templateUrl: './loyout.component.html',
  styleUrl: './loyout.component.css'
})
export class LoyoutComponent {
  modalOpen = false;
}