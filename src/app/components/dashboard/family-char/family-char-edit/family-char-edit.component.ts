import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { AlertifyService } from '../../../../services/alertify.service';
import { ModalService } from '../../../../services/modal.service';
import { FamilyCharactersService } from '../../../../services/family-characters.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'familyChar-edit',
  templateUrl: './family-char-edit.component.html',
  styleUrls: ['./family-char-edit.component.css']
})
export class FamilyCharEditComponent implements OnInit {
  @Input() familyChar: any = {};
  @Output() fcChanged = new EventEmitter();
  editForm: FormGroup;
  loading: Boolean;
  imgUrl = environment.imageUrl + "UserImages/";
  ckeConfig: any;
  userRole: string = "";

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private alertifyService: AlertifyService,
    private modalService: ModalService,
    private familyCharactersService: FamilyCharactersService) { }

  ngOnInit() {
    this.userRole = localStorage.getItem("userRoleName");
    this.ckeConfig = {
      allowedContent: false,
      forcePasteAsPlainText: true,
      font_names: 'Arial;Times New Roman;Verdana',
      toolbarGroups: [
        { name: 'document', groups: ['mode', 'document', 'doctools'] },
        { name: 'clipboard', groups: ['clipboard', 'undo'] },
        { name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing'] },
        { name: 'forms', groups: ['forms'] },
        '/',
        { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
        { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph'] },
        { name: 'links', groups: ['links'] },
        { name: 'insert', groups: ['insert'] },
        '/',
        { name: 'styles', groups: ['styles'] },
        { name: 'colors', groups: ['colors'] },
        { name: 'tools', groups: ['tools'] },
        { name: 'others', groups: ['others'] },
        { name: 'about', groups: ['about'] }
      ],
      removeButtons: 'Source,Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,Find,Replace,SelectAll,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Strike,Subscript,Superscript,CopyFormatting,RemoveFormat,Outdent,Indent,CreateDiv,Blockquote,BidiLtr,BidiRtl,Language,Unlink,Anchor,Image,Flash,Table,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Maximize,ShowBlocks,About'
      //removeButtons: 'Save,NewPage,Preview,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,Find,Replace,SelectAll,TextField,Textarea,Select,Button,CopyFormatting,Language,Unlink,Table,PageBreak,Maximize'
    };
    
    this.editForm = this.fb.group({ 
      id: [this.familyChar.id],
      title:[this.familyChar.title, [Validators.required]],
      description: [this.familyChar.description, [Validators.required]]
    });
    //console.log(this.familyChar);
  }

  closeModal() { 
    this.modalService.hideModal();
  }

  decline(): void {
    this.modalService.hideModal();
  }

  update(model) {
    this.loading = true;
    model.id = this.familyChar.id;
    
    this.familyCharactersService.update(model)
      .subscribe(() => {
        setTimeout(() => {
          this.fcChanged.emit(); //fire
          this.alertifyService.tSuccess('تم تعديل بيانات الشخصية بنجاح');           
        }, 100);
      }, error => {
        setTimeout(() => {
          this.alertifyService.tError('خطأ فى عملية التعديل');
          this.loading = false;
        }, 100);
      }, () => {
        setTimeout(() => {         
          this.loading = false;
          //this.getUsers();     
          this.closeModal();
        }, 100);
      });
  
  }
  


}
