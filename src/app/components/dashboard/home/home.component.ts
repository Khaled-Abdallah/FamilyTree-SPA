import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DefinitionLineage } from '../../../models/DefinitionLineage';
import { AlertifyService } from '../../../services/alertify.service';
import { DefinitionService } from '../../../services/definition.service';
import { Observable, fromEvent, merge, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//import { hubConnection } from '@aspnet/signalr-client';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  definitionForm: FormGroup ;
  definitionModel: DefinitionLineage = new DefinitionLineage();
  loading: boolean;
  public Editor = ClassicEditor;
  public config = {
    placeholder:'تفاصيل التعريف والنسب',
    language: 'ar'
  }
  ckeConfig: any;
  definationRequired: boolean;
  userRole: string = "";

  constructor(private fb: FormBuilder, private alertifyService: AlertifyService,
    private definitionService: DefinitionService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    
    this.userRole = localStorage.getItem("userRoleName");
    
    this.ckeConfig = {
      height :500,
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

    //this.getData();

    this.route.data.subscribe(data => {
      this.definitionModel = data['definition']; 
      if(this.definitionModel == null){
        this.definitionModel = new DefinitionLineage();
      }
    });
    
  }

  getData() {
    this.definitionService.get()
      .subscribe((_definition: DefinitionLineage) => {
        if(_definition != null){
          debugger
          this.definitionModel = _definition;
        }
      },() => {
        this.alertifyService.tError('خطأ فى تحميل البيانات ... يرجى الحاولة مرة اخرى');
      },() => {
      });
  }

  onSubmit(definitionModel){
    if(definitionModel.treeDefinition == '' || definitionModel.treeDefinition == null){
      this.definationRequired = true;
      return;
    }
    this.definationRequired = false;

    if(definitionModel.id == 0 || definitionModel.id == undefined){
      this.loading = true;
      definitionModel.id = 0;
      this.definitionService.save(definitionModel)
        .subscribe(() => {
          setTimeout(() => {
            this.alertifyService.tSuccess("تمت عملية الحفظ بنجاح");
            this.getData();
            this.definationRequired = false;
          }, 100);
        }, () => {
          setTimeout(() => {            
            this.alertifyService.tError("خطأ فى عملية الحفظ .. يرجى المحاولة مره اخرى");            
            this.loading = false;
            this.definationRequired = false;
          }, 100);
        }, () => {
          setTimeout(() => {         
             this.loading = false;           
            this.getData();
            this.definationRequired = false;
          }, 100);
        });
    }
    else{
      this.loading = true;      
      this.definitionService.update(definitionModel)
        .subscribe(() => {
          setTimeout(() => {
            this.alertifyService.tSuccess('تم التعديل بنجاح');  
            this.getData();     
            this.definationRequired = false;       
          }, 100);
        }, () => {
          setTimeout(() => {            
            this.alertifyService.tError('خطأ فى عملية التعديل ... يرجى الحاولة مرة اخرى');
            this.loading = false;
          }, 100);
        }, () => {
          setTimeout(() => {         
             this.loading = false;  
             this.definationRequired = false;         
             this.getData();     
          }, 100);
        });
    }
  }

}
