import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraBuscarComponent } from './compra-buscar.component';

describe('CompraBuscarComponent', () => {
  let component: CompraBuscarComponent;
  let fixture: ComponentFixture<CompraBuscarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompraBuscarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
