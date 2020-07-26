import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ModalService } from '../../../../services/modal.service';
import { Wife } from '../../../../models/wife';
import { WifeService } from '../../../../services/wife.service';
import { AlertifyService } from '../../../../services/alertify.service';

@Component({
  selector: 'user-wifes',
  templateUrl: './user-wifes.component.html',
  styleUrls: ['./user-wifes.component.css']
})
export class UserWifesComponent implements OnInit {
  editWife: Wife;
  @Input() userWifes: any;  
  wifesForm: FormGroup;
  loading: any;
  loadingDelete: any;
  wifeId: Number = 0;
  title: string = "";

  constructor(private wifeService: WifeService,private fb: FormBuilder,
    private modalService: ModalService,
    private alertifyService: AlertifyService) 
    { 
    }

  ngOnInit() {
    this.wifesForm = this.fb.group({
      id: [0],
      wName: ['', [Validators.required]],
      age: ['', [Validators.required, Validators.maxLength(3)]],
      address: ['', [Validators.required]]
    });
  }

  showAdd(template: TemplateRef<any>){
    this.wifesForm.controls['id'].setValue(0);
    this.wifesForm.controls['wName'].setValue('');
    this.wifesForm.controls['age'].setValue('');
    this.wifesForm.controls['address'].setValue('');

    this.title = "اضافة زوجة";
    this.editWife = new Wife;
    this.modalService.showModalMd(template);
  }
  
  updateWife(id: Number, template: TemplateRef<any>){
    this.title = "تعديل بيانات الزوجة";
    this.editWife = new Wife;
    this.editWife = this.userWifes.find(w => w.id == id);
    this.wifesForm.controls['id'].setValue(this.editWife.id);
    this.wifesForm.controls['wName'].setValue(this.editWife.wName);
    this.wifesForm.controls['age'].setValue(this.editWife.age);
    this.wifesForm.controls['address'].setValue(this.editWife.address);

    this.modalService.showModalMd(template);    
  }
  
  onSubmit(model: Wife){
    model.userId = this.userWifes[0].userId;
    
    if (model.id == 0 || model.id == undefined) {
      this.loading = true;
      this.wifeService.addWife(model)
        .subscribe(() => {
          setTimeout(() => {
            this.alertifyService.tSuccess("تم الحفظ بنجاح");
            this.getWifes(model.userId);
            this.closeModal();
            this.resetForm();
          }, 100);
        }, (err) => {
          setTimeout(() => {
            this.alertifyService.tError("خطأ فى عملية الحفظ .. يرجى مراجعة الدعم الفنى");
            this.loading = false;
          }, 100);
        }, () => {
          setTimeout(() => {
            this.loading = false;
          }, 100);
        });
    }
    else {
      this.loading = true;
      this.wifeService.updateWife(model)
        .subscribe(() => {
          setTimeout(() => {           
            this.alertifyService.tSuccess('تم التعديل بنجاح');
            this.getWifes(model.userId);
            this.closeModal();
            this.resetForm();
          }, 100);
        }, () => {
          setTimeout(() => {
            this.alertifyService.tError("خطأ فى عملية التعديل .. يرجى مراجعة الدعم الفنى");
            this.loading = false;
          }, 100);
        }, () => {
          setTimeout(() => {
            this.loading = false;
          }, 100);
        });
    }

  }

  getWifes(userId: any){
    this.wifeService.getWifes(userId)
        .subscribe((wifes) => {
          this.userWifes = wifes;
        }, () => {
          this.alertifyService.tError("حدث خطأ ما .. يرجى المحاولة مرة اخرى");
        });
  }
  
  resetForm() {
    this.wifesForm.reset();
    this.wifesForm.controls['id'].setValue(0);
    this.editWife = new Wife();
  }

  closeModal() {
    this.modalService.hideModal();
    this.resetForm();
  }

  checkMobilNumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  openConfirmDelete(id: Number, template: TemplateRef<any>) {
    debugger;
    this.wifeId = id;
    this.modalService.showConfirmModal(template);
  }

  deleteWife(){
    this.loadingDelete = true;
    this.wifeService.deleteWife(this.wifeId)
        .subscribe(() => {
          setTimeout(() => {
            this.alertifyService.tSuccess("تم الحذف بنجاح");
            this.getWifes(this.userWifes[0].userId);
            this.loadingDelete = false;
            this.closeModal();
          }, 100);
        }, (err) => {
          setTimeout(() => {
            this.alertifyService.tError("خطأ فى عملية الحذف .. يرجى مراجعة الدعم الفنى");
            this.loadingDelete = false;
          }, 100);
        }, () => {
          setTimeout(() => {
            this.loadingDelete = false;
          }, 100);
        });
  }
}
