import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css'
})
export class ModalComponent {

  @Input()
  title = '';

  @Input()
  visible = false;

  @Output()
  visibleChange = new EventEmitter<boolean>();

  close() {

    this.visible = false;

    this.visibleChange.emit(false);

  }

}