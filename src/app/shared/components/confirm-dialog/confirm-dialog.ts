import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css'
})
export class ConfirmDialogComponent {

  @Input()
  title = 'Confirmation';

  @Input()
  message = 'Are you sure?';

  @Input()
  visible = false;

  @Input()
  loading = false;

  @Output()
  visibleChange = new EventEmitter<boolean>();

  @Output()
  confirmed = new EventEmitter<void>();

  confirm() {

    this.confirmed.emit();

    this.close();

  }

  close() {

    this.visible = false;

    this.visibleChange.emit(false);

  }

}