import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseItems } from './purchase-items';

describe('PurchaseItems', () => {
  let component: PurchaseItems;
  let fixture: ComponentFixture<PurchaseItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
