import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdencompraBuscarComponent } from './ordencompra-buscar.component';

describe('OrdencompraBuscarComponent', () => {
  let component: OrdencompraBuscarComponent;
  let fixture: ComponentFixture<OrdencompraBuscarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdencompraBuscarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdencompraBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
