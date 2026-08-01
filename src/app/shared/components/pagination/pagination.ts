import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css'
})
export class Pagination {

  @Input() pageNumber = 1;

  @Input() totalPages = 1;

  @Input() totalRecords = 0;

  @Output() previous = new EventEmitter<void>();

  @Output() next = new EventEmitter<void>();

}