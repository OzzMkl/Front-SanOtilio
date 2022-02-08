import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoriaVerComponent } from './subcategoria-ver.component';

describe('SubcategoriaVerComponent', () => {
  let component: SubcategoriaVerComponent;
  let fixture: ComponentFixture<SubcategoriaVerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcategoriaVerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcategoriaVerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
