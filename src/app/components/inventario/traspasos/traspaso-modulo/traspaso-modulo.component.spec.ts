import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraspasoModuloComponent } from './traspaso-modulo.component';

describe('TraspasoModuloComponent', () => {
  let component: TraspasoModuloComponent;
  let fixture: ComponentFixture<TraspasoModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraspasoModuloComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraspasoModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
