import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { FirebaseService } from '../../core/services/firebase.service';

@Component({
  selector: 'app-public-form',
  imports: [BannerComponent, RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './public-form.component.html',
  styleUrl: './public-form.component.css',
})
export class PublicFormComponent {
  modalOpen: boolean = false;
  publicForm: FormGroup;
  isLoading: boolean = false;
  submitSuccess: boolean = false;
  submitError: string = '';

  constructor(
    private fb: FormBuilder,
    private modalService: ModalService,
    private firebaseService: FirebaseService
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

  async onSubmit() {
    if (this.publicForm.invalid) {
      this.publicForm.markAllAsTouched();
      console.log('o campo esta invalido');
      return;
    }

    // Set loading state
    this.isLoading = true;
    this.submitError = '';

    try {
      // Send data to Firebase
      const docRef = await this.firebaseService.addTask(this.publicForm.value);
      console.log("Dados enviados com sucesso para o Firebase", docRef);
      
      // Removed push notification call as it's no longer needed
      
      // Open modal only after successful submission
      this.modalService.openModal();
      
      // Clear the form after successful submission
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
    } catch (error) {
      console.error("Erro ao enviar dados para o Firebase:", error);
      this.submitError = 'Ocorreu um erro ao enviar sua solicitação. Por favor, tente novamente.';
    } finally {
      // Reset loading state
      this.isLoading = false;
    }
  }
}