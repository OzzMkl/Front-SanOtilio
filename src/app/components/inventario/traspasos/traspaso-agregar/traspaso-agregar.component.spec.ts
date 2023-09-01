import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraspasoAgregarComponent } from './traspaso-agregar.component';

describe('TraspasoAgregarComponent', () => {
  let component: TraspasoAgregarComponent;
  let fixture: ComponentFixture<TraspasoAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraspasoAgregarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraspasoAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
