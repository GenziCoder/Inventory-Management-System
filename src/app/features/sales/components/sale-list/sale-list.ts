import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

import { Sale } from '../../models/sale';

@Component({
  selector: 'app-sale-list',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './sale-list.html',
  styleUrl: './sale-list.css'
})
export class SaleList {

  @Input({ required: true })
  sales: Sale[] = [];

  @Output()
  edit = new EventEmitter<Sale>();

  @Output()
  delete = new EventEmitter<number>();

  onEdit(sale: Sale): void {

    this.edit.emit(sale);

  }

  onDelete(id: number): void {

    this.delete.emit(id);

  }

}