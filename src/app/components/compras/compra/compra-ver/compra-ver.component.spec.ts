import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraVerComponent } from './compra-ver.component';

describe('CompraVerComponent', () => {
  let component: CompraVerComponent;
  let fixture: ComponentFixture<CompraVerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompraVerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
