import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CmsManagerComponent } from './cms-manager.component';

describe('CmsManagerComponent', () => {
  let component: CmsManagerComponent;
  let fixture: ComponentFixture<CmsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CmsManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CmsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
