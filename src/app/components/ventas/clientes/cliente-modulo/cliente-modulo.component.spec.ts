import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteModuloComponent } from './cliente-modulo.component';

describe('ClienteModuloComponent', () => {
  let component: ClienteModuloComponent;
  let fixture: ComponentFixture<ClienteModuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClienteModuloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteModuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
