import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputExternalKeySearchComponent } from './input-external-key-search.component';

describe('InputExternalKeySearchComponent', () => {
  let component: InputExternalKeySearchComponent;
  let fixture: ComponentFixture<InputExternalKeySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputExternalKeySearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputExternalKeySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
