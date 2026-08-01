import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './search-box.html',
  styleUrl: './search-box.css'
})
export class SearchBox {

  @Input() placeholder = 'Search...';

  @Input() searchText = '';

  @Output() searchTextChange = new EventEmitter<string>();

}