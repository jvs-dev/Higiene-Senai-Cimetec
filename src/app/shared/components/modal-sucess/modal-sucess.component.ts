import { Component } from '@angular/core';
import { ModalService } from '../../../core/services/modal/modal.service';

@Component({
  selector: 'app-modal-sucess',
  standalone: true,
  imports: [],
  templateUrl: './modal-sucess.component.html',
  styleUrl: './modal-sucess.component.css'
})
export class ModalSucessComponent {
  constructor(private modalService: ModalService){}

  modalClose(){
    this.modalService.closeModal();
  }
}