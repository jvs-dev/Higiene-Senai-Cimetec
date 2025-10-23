import { Component, Input, OnInit } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { RouterOutlet } from '@angular/router';
import { ModalSucessComponent } from "../../shared/components/modal-sucess/modal-sucess.component";
import { ModalService } from '../services/modal/modal.service';

@Component({
  selector: 'app-loyout',
  imports: [HeaderComponent, RouterOutlet, ModalSucessComponent],
  templateUrl: './loyout.component.html',
  styleUrl: './loyout.component.css'
})
export class LoyoutComponent implements OnInit {
  modalOpen = false;

  constructor(private modalService: ModalService){}

  ngOnInit(): void {
    this.modalService.modal$.subscribe((open) => {
      this.modalOpen = open;
    })
  }
}
