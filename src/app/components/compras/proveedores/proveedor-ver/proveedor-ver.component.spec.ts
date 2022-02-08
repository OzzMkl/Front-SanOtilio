import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorVerComponent } from './proveedor-ver.component';


describe('ProveedorVerComponent', () => {
  let component: ProveedorVerComponent;
  let fixture: ComponentFixture<ProveedorVerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProveedorVerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveedorVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
