import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TimerPartDetailPage } from './timer-part-detail.page';

describe('TimerPartDetailPage', () => {
  let component: TimerPartDetailPage;
  let fixture: ComponentFixture<TimerPartDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerPartDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TimerPartDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
