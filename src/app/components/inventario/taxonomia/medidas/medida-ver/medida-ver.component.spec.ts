import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedidaVerComponent } from './medida-ver.component';

describe('MedidaVerComponent', () => {
  let component: MedidaVerComponent;
  let fixture: ComponentFixture<MedidaVerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MedidaVerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MedidaVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
