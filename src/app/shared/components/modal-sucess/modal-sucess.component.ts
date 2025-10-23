import { Component, EventEmitter, Output } from '@angular/core';
import { ModalService } from '../../../core/services/modal/modal.service';

@Component({
  selector: 'app-modal-sucess',
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
