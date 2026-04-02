import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskUI } from './task-ui';

describe('TaskUI', () => {
  let component: TaskUI;
  let fixture: ComponentFixture<TaskUI>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskUI]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskUI);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
