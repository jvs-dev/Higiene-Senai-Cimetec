import { Component } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-loyout',
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './loyout.component.html',
  styleUrl: './loyout.component.css'
})
export class LoyoutComponent {

}
