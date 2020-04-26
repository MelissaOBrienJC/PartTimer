import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabListPage } from './tab-timer-list.page';

describe('TabListPage', () => {
  let component: TabListPage;
  let fixture: ComponentFixture<TabListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TabListPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
