import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraspasoBuscarComponent } from './traspaso-buscar.component';

describe('TraspasoBuscarComponent', () => {
  let component: TraspasoBuscarComponent;
  let fixture: ComponentFixture<TraspasoBuscarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraspasoBuscarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraspasoBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
