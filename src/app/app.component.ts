import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { filter, from, toArray } from 'rxjs';
import { ApirequestService } from './apirequest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'appbanco';

  loans: any = [];
  accounts: any = [];
  activeAccounts: any = [];
  loanSelected: any = [];
  paymentParams: any;
  paymentLoan = {};
  modalControl : boolean = false;
  plazo: number = 0;
  interes = 0;
  iva = 0;
  paymentWithInteres = 0;
  toPayLoan : any;
  accountSelected: any= [];
  saldoDisponible = 0;
  disableBtn = false;

  constructor(
    private apiRequest : ApirequestService,
    private fromBuilder : FormBuilder

    ){}

  ngOnInit(){
    this.apiRequest.getLoans().subscribe(
      loansData => {
        this.loans = loansData;
      }
    );

    this.apiRequest.getAccounts().subscribe(
      (accounsData) => {
        this.accounts = accounsData;
        this.accountSelected = this.accounts[0];
        this.loadAccounts();
      }
    );
    this.buildForm();
    this.onChanges();
  }


  onChanges(): void {
    this.paymentParams.valueChanges.subscribe(() => {
     this.calculatePayment();
    });
  }

  buildForm(){
    this.paymentParams = this.fromBuilder.group({
      paymentDate: "2021-02-15",
      interes: 7.5,
      iva: 16,
      comercialDay: 360
    })
  }

  loadAccounts( status: string = "Activa" ){
    from(this.accounts).pipe(
      filter<any>(data => data.status === status),
      toArray(),
    ).subscribe(
      dataActive => {
        this.activeAccounts = dataActive;
        this.getLoans();
      },
    );
  }

  getLoans(index : number = 0){
    this.accountSelected = this.accounts[index]
    from(this.loans).pipe(
      filter<any>(data => data.client === this.accountSelected.client),
      toArray(),
    ).subscribe(
      clientLoans => {
        this.loanSelected = clientLoans
      }
    );
  }

  loansParams(indice : number){
    this.modalControl = true;
    this.toPayLoan = this.loanSelected[indice];
    this.calculatePayment();
  }

  calculatePayment() {
    const formValue = this.paymentParams.value;
    const percentInteres  = formValue.interes / 100;
    this.plazo = moment(formValue.paymentDate).diff(moment(this.toPayLoan.date), 'days');
    this.interes = (this.toPayLoan.amount * percentInteres * this.plazo) / formValue.comercialDay;
    this.iva = this.interes * formValue.iva;
    this.paymentWithInteres = this.toPayLoan.amount + this.interes + this.iva;
    const getAccount = this.getAcount(this.toPayLoan.client);
    if( getAccount.amount >= this.paymentWithInteres ){
      this.disableBtn = true;
    }else{
      this.disableBtn = false;
    }
    this.saldoDisponible = getAccount.amount;
  }

  getAcount(client:string) {
    let account = []
    for(let acct of this.accounts){
      if(acct.client === client){
        account = acct;
        break;
      }
    }
    return account;
  }

  doPayment(){
    for(let loan of this.loans){
      if(this.toPayLoan.id === loan.id && this.toPayLoan.client === loan.client){
        loan.status = 'pagado';
        break;
      }
    }

    for(let account of this.accounts){
      if(account.client === this.toPayLoan.client){
        let paymentResult = account.amount - this.paymentWithInteres;
        account.amount = paymentResult;
        break;
      }
    }
    this.dismiss();
  }

  toFixed(percentData: any ){
    return parseFloat(percentData).toFixed(2);
  }

  dismiss(){
    this.modalControl = false;
  }



}


