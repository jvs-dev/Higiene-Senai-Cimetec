import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor() { }

  private modalSubject = new BehaviorSubject<boolean>(false);
  modal$ = this.modalSubject.asObservable();

  openModal(){
    this.modalSubject.next(true);
    setTimeout(() => this.modalSubject.next(false), 2000); 
  }

  closeModal(){
    this.modalSubject.next(false)
  }
}
