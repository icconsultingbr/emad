import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeorreferenciamentoComponent } from './georreferenciamento.component';

describe('GeorreferenciamentoComponent', () => {
  let component: GeorreferenciamentoComponent;
  let fixture: ComponentFixture<GeorreferenciamentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeorreferenciamentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeorreferenciamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
