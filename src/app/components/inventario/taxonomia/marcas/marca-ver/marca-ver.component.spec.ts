import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcaVerComponent } from './marca-ver.component';

describe('MarcaVerComponent', () => {
  let component: MarcaVerComponent;
  let fixture: ComponentFixture<MarcaVerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarcaVerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarcaVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
