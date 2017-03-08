import { TestBed } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TransactionsComponent } from './transactions.component';

describe('Component: TransactionsComponent', () => {
    let component: TransactionsComponent;

    beforeEach(()=>{
        TestBed.configureTestingModule({
            declarations: [TransactionsComponent],
            imports: [ReactiveFormsModule]
        });

        const fixture = TestBed.createComponent(TransactionsComponent);
        component = fixture.componentInstance;
    });

    it('should have a defined component', ()=>{
        expect(component).toBeDefined();
    });
});