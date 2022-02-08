import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriaVerComponent } from './categoria-ver.component';

describe('CategoriaVerComponent', () => {
  let component: CategoriaVerComponent;
  let fixture: ComponentFixture<CategoriaVerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriaVerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriaVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
