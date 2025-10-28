import { CommonModule } from '@angular/common';
import { Component, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BannerComponent } from '../../shared/components/banner/banner.component';
import { ModalService } from '../../core/services/modal/modal.service';

@Component({
  selector: 'app-public-form',
  imports: [BannerComponent, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './public-form.component.html',
  styleUrl: './public-form.component.css',
})
export class PublicFormComponent {
  modalOpen: boolean = false;
  publicForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,

  ) {
    this.publicForm = this.fb.group({
      userRa: this.fb.control('', {
        validators: [Validators.required, Validators.pattern(/^\d{3}\.\d{6}$/)],
      }),
      andarPredio: this.fb.control('', { validators: [Validators.required] }),
      banheiro: this.fb.control('', { validators: [Validators.required] }),
      problems: this.fb.group(
        {
          papelHigienico: false,
          papelToalha: false,
          sabonete: false,
          banheiroSujo: false,
          lixeira: false,
          outros: false,
        },
        { validators: this.checboxOneChekdad }
      ),
    });
  }

  ngOnInit(): void {
    this.modalService.modal$.subscribe((open) => {
      this.modalOpen = open;
    })
    
  }

  get userRa(): FormControl | null {
    return this.publicForm.get('userRa') as FormControl | null;
  }

  get andarPredio(): FormControl | null {
    return this.publicForm.get('andarPredio') as FormControl | null;
  }
  get banheiro():FormControl | null {
    return this.publicForm.get('banheiro') as FormControl | null;
  }

  get problems(): FormGroup | null {
    return this.publicForm.get('problems') as FormGroup | null;
  }

  checboxOneChekdad(group: FormGroup) {
    const temMarcado = Object.values(group.value).some((v) => v === true);
    return temMarcado ? null : { nenhumMarcado: true };
  }

  onSubmit() {
    if (this.publicForm.invalid) {
      this.publicForm.markAllAsTouched();
      console.log('o campo esta invalido');
      return;
    }
    
    this.modalOpen = false
    this.modalService.openModal();
    console.log("enviado com successo")
    
    // Clear the form after submission
    this.publicForm.reset({
      userRa: '',
      andarPredio: '',
      banheiro: '',
      problems: {
        papelHigienico: false,
        papelToalha: false,
        sabonete: false,
        banheiroSujo: false,
        lixeira: false,
        outros: false
      }
    });
  }
}
