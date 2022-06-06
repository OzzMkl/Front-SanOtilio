import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasPorCobrarComponent } from './notas-por-cobrar.component';

describe('NotasPorCobrarComponent', () => {
  let component: NotasPorCobrarComponent;
  let fixture: ComponentFixture<NotasPorCobrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotasPorCobrarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotasPorCobrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
