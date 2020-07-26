import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../../../services/settings.service';
import { AlertifyService } from '../../../services/alertify.service';
import { Terms } from '../../../models/terms';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {
  termsForm: FormGroup ;
  termsModel: Terms = new Terms();
  loading: boolean;
  ckeConfig: any;
  definationRequired: boolean;

  constructor(private fb: FormBuilder, private alertifyService: AlertifyService,
    private settingsService: SettingsService,
    private route: ActivatedRoute) { }

    ngOnInit() {
      
    this.ckeConfig = {
      height :600,
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
        this.termsModel = data['terms'];
      });
    }

    getData() {
      this.settingsService.getTerms()
        .subscribe((_terms) => {
          if(_terms != null){
            this.termsModel = _terms;
            // this.termsForm.controls['id'].setValue(_terms.id);
            // this.termsForm.controls['termss'].setValue(_terms.termss);
          }
        },() => {
          this.alertifyService.tError('خطأ فى تحميل البيانات ... يرجى الحاولة مرة اخرى');        
        },() => {

        });
    }
  
    onSubmit(termssModel){
      debugger
      if(termssModel.termss == '' || termssModel.termss == null){
        this.definationRequired = true;
        return;
      }

      if(termssModel.id == 0 || termssModel.id == undefined){
        this.loading = true;
        termssModel.id = 0;
        this.settingsService.saveTerms(termssModel)
          .subscribe(() => {
            setTimeout(() => {
              this.alertifyService.tSuccess("تمت الحفظ بنجاح");
              this.definationRequired = false;
            }, 100);
          }, () => {
            setTimeout(() => {            
              this.alertifyService.tError('خطأ فى تحميل البيانات ... يرجى الحاولة مرة اخرى');
              this.loading = false;
              this.definationRequired = false;
            }, 100);
          }, () => {
            setTimeout(() => {         
               this.loading = false;  
               this.definationRequired = false;         
              this.getData();
            }, 100);
          });
      }
      else{
        debugger
        this.loading = true;      
        this.settingsService.updateTerms(termssModel)
          .subscribe(() => {
            setTimeout(() => {
              this.alertifyService.tSuccess('تمت عملية التعديل بنجاح');
              this.definationRequired = false;            
            }, 100);
          }, () => {
            setTimeout(() => {            
              this.alertifyService.tError('خطأ فى تحميل البيانات ... يرجى الحاولة مرة اخرى');
              this.loading = false;
              this.definationRequired = false;
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
