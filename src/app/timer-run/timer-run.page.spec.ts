import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TimerRunPage } from './timer-run.page';

describe('TimerRunPage', () => {
  let component: TimerRunPage;
  let fixture: ComponentFixture<TimerRunPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerRunPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TimerRunPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
