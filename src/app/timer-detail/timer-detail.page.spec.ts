import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TimerDetailPage } from './timer-detail.page';

describe('TimerDetailPage', () => {
  let component: TimerDetailPage;
  let fixture: ComponentFixture<TimerDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TimerDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
