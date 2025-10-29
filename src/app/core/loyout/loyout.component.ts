import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ModalSucessComponent } from '../../shared/components/modal-sucess/modal-sucess.component';
import { ModalService } from '../services/modal/modal.service';

@Component({
  selector: 'app-loyout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ModalSucessComponent],
  templateUrl: './loyout.component.html',
  styleUrl: './loyout.component.css'
})
export class LoyoutComponent implements OnInit {
  modalOpen = false;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.modalService.modal$.subscribe((open) => {
      this.modalOpen = open;
    });
  }
}