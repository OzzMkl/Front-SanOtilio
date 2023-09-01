import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraspasoEditarComponent } from './traspaso-editar.component';

describe('TraspasoEditarComponent', () => {
  let component: TraspasoEditarComponent;
  let fixture: ComponentFixture<TraspasoEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TraspasoEditarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraspasoEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
