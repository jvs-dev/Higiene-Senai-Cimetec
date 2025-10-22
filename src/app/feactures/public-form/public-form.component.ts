import { Component } from '@angular/core';
import { BannerComponent } from "../../shared/banner/banner.component";
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public-form',
  imports: [BannerComponent, RouterModule, CommonModule],
  templateUrl: './public-form.component.html',
  styleUrl: './public-form.component.css'
})
export class PublicFormComponent {
  publicForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ){
    this.publicForm = this.fb.group({
      userRa: this.fb.control('', {validators: [Validators.required, Validators.pattern(/^\d{3}\.\d{6}$/)]}),
      andarPredio: this.fb.control('', {validators: [Validators.required]}),
      banheiro: this.fb.control('', {validators: [Validators.required]}),
      itens: this.fb.control('',),
    })
  }
}
