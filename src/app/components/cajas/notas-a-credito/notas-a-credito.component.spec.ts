import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotasACreditoComponent } from './notas-a-credito.component';

describe('NotasACreditoComponent', () => {
  let component: NotasACreditoComponent;
  let fixture: ComponentFixture<NotasACreditoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotasACreditoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotasACreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
