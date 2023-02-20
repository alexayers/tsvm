import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleProgramsComponent } from './sample-programs.component';

describe('SampleProgramsComponent', () => {
  let component: SampleProgramsComponent;
  let fixture: ComponentFixture<SampleProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleProgramsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
