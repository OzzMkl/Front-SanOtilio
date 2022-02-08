import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmacenVerComponent } from './almacen-ver.component';

describe('AlmacenVerComponent', () => {
  let component: AlmacenVerComponent;
  let fixture: ComponentFixture<AlmacenVerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlmacenVerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlmacenVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
