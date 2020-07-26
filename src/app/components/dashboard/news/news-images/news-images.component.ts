import { Component, OnInit, Output, Input, EventEmitter, TemplateRef } from '@angular/core';
import { NewsImage } from '../../../../models/newsImage';
import { environment } from '../../../../../environments/environment';
import { FileUploader } from 'ng2-file-upload';
import { AlertifyService } from '../../../../services/alertify.service';
import { ModalService } from '../../../../services/modal.service';
import { NewsService } from '../../../../services/news.service';

@Component({
  selector: 'news-images',
  templateUrl: './news-images.component.html',
  styleUrls: ['./news-images.component.css']
})
export class NewsImagesComponent implements OnInit {
  newImages: NewsImage[];
  @Output() imageListChanged: EventEmitter<NewsImage[]> = new EventEmitter();
  @Input() images: NewsImage[];
  _imgId: number = 0; 
  isFound = false;
  loadingDel: boolean;

  imgUrl = environment.imageUrl + "NewImags/";
  baseUrl = environment.apiUrl + 'uploader/upload/';
  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;
  
  constructor(private modalService: ModalService,
    private alertifyService: AlertifyService,
    private newsService: NewsService) { }

  ngOnInit() {
    this.newImages = this.images;
    this.uploadImages();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  uploadImages() {
      this.uploader = new FileUploader({
      url: this.baseUrl + 'NewImags',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false };
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const imageName: any = response;
        const item = {
          id: 0,
          imagePath: imageName,
          isMain: false,
          newsId: 0
        }
        this.newImages.push(item);
        this.imageListChanged.emit(this.newImages);
      }
    };
  }

  openConfirmDeleteImage(template: TemplateRef<any>, id: number) {
    this.newImages.forEach(element => {
      if (element.id == id && element.isMain == true) {    
          this.isFound = true;
          return;
        } 
      });

      if(this.isFound == false) { 
        this._imgId = id;    
        this.modalService.showConfirmModal(template);
      }
      else{
        this.isFound = false;
      }
  }

  closeModal() { 
    this.modalService.hideModal();
  }

  deleteImag() {
    this.loadingDel = true;        
        this.newsService.deleteImage(this._imgId)
          .subscribe(() => {
            setTimeout(() => {
              this.newImages.splice(this.newImages.findIndex(ci => ci.id === this._imgId), 1);              
              this.alertifyService.tSuccess('تم حذف صورة الخبر بنجاح');
              this.modalService.hideModal();
              this.loadingDel = false;
            }, 100);
          }, () => {
            setTimeout(() => { 
               this.alertifyService.tError('خطأ فى عملية الحذف .. حاول مره اخرى');              
                this.loadingDel = false;
                this.modalService.hideModal();
            }, 100);
          });  
  }

  setMainImage(image: NewsImage) {
    let isFound = false;
    this.newImages.forEach(element => {    
    if (element.id == image.id && element.isMain == true) {        
        isFound = true;
        return;
      } 
    });

    if(isFound == false){
      this.newsService.setMainImage(image)
      .subscribe(() => {
        setTimeout(() => {
          this.newImages.forEach(element => {  
            if (element.id == image.id) {
              element.isMain = true;
            }
            else {
              element.isMain  = false;
            }
          });
          this.alertifyService.tSuccess('تم تعيين صورة الخبر كصورة رئيسية ');
        }, 100);
      }, () => {
        setTimeout(() => {
          this.alertifyService.tError('خطأ فى عملية تعيين الصورة .. حاول مرة اخرى');
        }, 100);
      });
    }
  
  }




}
