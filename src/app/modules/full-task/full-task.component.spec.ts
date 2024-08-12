import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullTaskComponent } from './full-task.component';

describe('FullTaskComponent', () => {
  let component: FullTaskComponent;
  let fixture: ComponentFixture<FullTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
