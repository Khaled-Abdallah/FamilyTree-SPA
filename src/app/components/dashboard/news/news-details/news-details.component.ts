import { Component, OnInit, TemplateRef, AfterContentInit, ContentChildren, ViewChild } from '@angular/core';
import { NewsService } from '../../../../services/news.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalService } from '../../../../services/modal.service';
import { AlertifyService } from '../../../../services/alertify.service';
import { NewsComments } from '../../../../models/newsComments';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-news-details',
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.css']
})
export class NewsDetailsComponent implements OnInit { 
  newsDetails: any;
  comments: any;
  commentsWatting: any;
  userComment: any;
  _id: number = 0;
  loadingDel: any;
  loadingAcceptedStatus:boolean;
  loadingNotAcceptedStatus: boolean;
  config: any  = {};
  config2: any  = {};
  config3: any  = {};
  loadingCommenyData: boolean;
  loadingAcceptUserCommentData: any;
  loadingDataComNotAccepted: boolean;
  newsComment = new NewsComments();
  newsId: Number = 0;
  newsDetailsId: Number = 0;
  loadingCommentData: boolean;
  loadingCommentDel: boolean;
  _comentId: Number = 0;
  _newsId: Number = 0;
  galleryOptions: NgxGalleryOptions[];
  galleryImages:  NgxGalleryImage[];
  newsImageUrl = environment.imageUrl + "NewImags/";
  userImageUrl = environment.imageUrl + "UserImages/";
  commentsNotAccepted: any;
  loadingRefusalCommentStatus: any;
  loadingRefusComments: any;
  commentRequired: boolean = false;
  _commentRefuseId: number = 0;
  _userId: Number = 0;
  reasonRequired: any;
  userRole: string = "";

  // private connectionIsEstablished = false;  
  // private hubConnection: HubConnection;  

  constructor(private route: ActivatedRoute,
    private newsService: NewsService,
    private spinner: NgxSpinnerService,
    private modalService: ModalService,
    private router: Router,
    private alertifyService: AlertifyService) { }

    ngOnInit() {
      this.userRole = localStorage.getItem("userRoleName");
      this.route.params.subscribe(params => {
          this.newsDetailsId = +params['id']; 
      });

      this.getNewsDetails();
      this.getNewsComments();
      this.getCommentsWatting();
      this.getCommentsNotAccepted();
      
      this.galleryOptions = [
        {
          width: '700px',
          height: '499px',
          imagePercent: 100,
          thumbnailsColumns: 5,
          imageAnimation: NgxGalleryAnimation.Fade,
          preview: false
        }
      ];  
      this.galleryImages = this.getNewsImages();
      
     
    }

  

    getNextRefusBlogComments(newsId, event) {
      this.loadingRefusComments = true;
      this.config3.currentPage = event;

      this.newsService.getNewsRefusalComments(newsId, event)
        .subscribe(_commentsNotAccepted => {
          setTimeout(() => {
            this.commentsNotAccepted = _commentsNotAccepted;
        }, 100);
      },() => {
        setTimeout(() => {
          this.alertifyService.tError(' حدث خطأ ما ... حاول مرة اخرى ');
          this.loadingRefusComments = false;
        }, 100);       
        }
        ,() => {
          setTimeout(() => {          
            this.loadingRefusComments = false;
          }, 100);
        });
    } 
    
    getCommentsNotAccepted() {
      this.route.data.subscribe(data => {
        this.commentsNotAccepted = data['refusalComments'];
      });
      
      this.config3 = {
        id : "commentsNotAcceptedId",
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: this.commentsNotAccepted.count
      };
    }

    getNewsDetails(){
      this.route.data.subscribe(data => {
        this.newsDetails = data['news'];
        //console.log(this.newsDetails);
      });
    }

    getNewsComments(){
      this.route.data.subscribe(data => {
        this.comments = data['newsComments'];
      });

      this.config = {
        id : "commentsAcepted",
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: this.comments.count
      };
    }

    getNews_Comments() {
      //var id = +this.route.params['id']; 
      this.newsService.getComments(this.newsDetailsId)
        .subscribe((_comments) => {
          this.comments = _comments;
          this.config = {
            id : "commentsAcepted",
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: this.comments.count
          };
      },() => {
        this.alertifyService.tError(' حدث خطأ ما ... حاول مرة اخرى ');
      });
    }

    getCommentsWatting() {
      this.route.data.subscribe(data => {
        this.commentsWatting = data['newsCommentsWatting'];
      });
      
      this.config2 = {
        id : "commentsWattingId",
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: this.commentsWatting.count
      };
    }

    getComments_NotAccept() {
      //var id = +this.route.params['id']; 
      this.newsService.getNewsCommentsWatting(this.newsDetailsId, 1)
        .subscribe((_comNotAcc) => {
          this.commentsWatting = _comNotAcc;
          this.config2 = {
            id : "commentsWattingId",
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: this.commentsWatting.count
          };
      },() => {
        this.alertifyService.tError(' حدث خطأ ما ... حاول مرة اخرى ');
      });
    }
    
    acceptUserComment(newsId: Number, commentId: Number) {
      this.loadingAcceptUserCommentData = commentId;
      this.newsService.acceptUserComment(newsId, commentId)
        .subscribe(() => {
          setTimeout(() => {
            this.getComments_NotAccept();
            this.getNews_Comments();
            this.alertifyService.tSuccess('تم قبول التعليق');
        }, 100);
      },() => {
        setTimeout(() => {
          this.alertifyService.tError(' حدث خطأ ما ... حاول مرة اخرى ');
          this.loadingAcceptUserCommentData = 0;
        }, 100);       
        }
        ,() => {
          setTimeout(() => {          
            this.loadingAcceptUserCommentData = 0;
          }, 100);
        });
    }  

    getNextCommentsNotAccept(newsId, event) {
      this.loadingDataComNotAccepted = true;
      this.config2.currentPage = event;
      this.newsService.getNewsCommentsWatting(newsId, event)
        .subscribe(_commentsNotAccepted => {
          setTimeout(() => {
            this.commentsWatting = _commentsNotAccepted;
        }, 100);
      },() => {
        setTimeout(() => {
          this.alertifyService.tError(' حدث خطأ ما ... حاول مرة اخرى ');
          this.loadingDataComNotAccepted = false;
        }, 100);       
        }
        ,() => {
          setTimeout(() => {          
            this.loadingDataComNotAccepted = false;
          }, 100);
        });
    }

    getNextComment(newsId, event) {
      this.loadingCommenyData = true;
      this.config.currentPage = event;
      this.newsService.getCommentsPaging(newsId, event)
        .subscribe(_comments => {
          setTimeout(() => {
            this.comments = _comments;
        }, 100);
      },() => {
        setTimeout(() => {
          this.alertifyService.tError(' حدث خطأ ما ... حاول مرة اخرى ');
          this.loadingCommenyData = false;
        }, 100);       
        }
        ,() => {
          setTimeout(() => {          
            this.loadingCommenyData = false;
          }, 100);
        });
    }
    
    getUserComment(template: TemplateRef<any>, id: Number){
      this.userComment = this.commentsWatting.data.find(b => b.id == id);
      this.modalService.showModal(template);
    }

    getNewsImages() {
      const imageUrls = [];
      for (let i = 0; i < this.newsDetails.images.length; i++){
        imageUrls.push({
        small : this.newsImageUrl + this.newsDetails.images[i].imagePath,
        medium : this.newsImageUrl + this.newsDetails.images[i].imagePath,
        big : this.newsImageUrl + this.newsDetails.images[i].imagePath
        ,description : "description"
        });
      }
      return imageUrls;
  }

    setAcceptStatus(status: boolean,id: Number) {
      this.loadingAcceptedStatus = true;
      this.newsService.setAcceptStatus(status,id)
          .subscribe(() => {
            setTimeout(() => {
              this.alertifyService.tSuccess('تم قبول الخبر');
              this.getNewsById(id);
              this.getCommentsByNews(id);
              this.loadingAcceptedStatus = false;
          }, 100);
      }, () => {
        this.alertifyService.tError('خطأ فى تحميل البيانات ... يرجى الحاولة مرة اخرى');
        this.loadingAcceptedStatus = false;
      }); 
    }

    setNotAcceptStatus(status: boolean, reason: any) {
      this.loadingNotAcceptedStatus = true;
      this.newsService.setNotAcceptStatus(status,this.newsDetailsId, this._userId, reason)
          .subscribe(() => {
            setTimeout(() => {
              this.alertifyService.tSuccess('تم رفض الخبر');
              this.getNewsById(this.newsDetailsId);
              this.getCommentsByNews(this.newsDetailsId);
              this.loadingNotAcceptedStatus = false;
              this.modalService.hideModal();
          }, 100);
      }, () => {
        this.alertifyService.tError(' حدث خطأ ما ... حاول مرة اخرى ');
        this.loadingNotAcceptedStatus = false;
      }); 
    }

    confirmNotAccept(template: TemplateRef<any>,userId: Number, newsId: Number){
      this.newsDetailsId = newsId;
      this._userId = userId;      
      this.modalService.showModal(template);
    }

    getNewsById(id: Number) {
      this.newsService.getById(id)
          .subscribe((_newsDetails) => {
            this.newsDetails = _newsDetails
      }), () => {
        this.alertifyService.tError(' حدث خطأ ما ... حاول مرة اخرى ');
      }; 
    }

    getCommentsByNews(nId: Number) {
      this.newsService.getCommentsPaging(nId, 1)
      .subscribe(comments=> {
        this.comments = comments;
          this.config = {
            id: "commentsAcepted",
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: this.comments.count
          };
    },() => {
        this.alertifyService.tError(' حدث خطأ ما ... حاول مرة اخرى ');    
      });      
    }
  
    showAdd(template: TemplateRef<any>, id:Number){
      this.newsId = id;
      this.modalService.showModal(template);    
    }
    
    addComment(comment: string){  
      if(comment == '' || comment == null){
         this.commentRequired = true;
         return;
      }

      this.loadingCommentData = true;
      this.newsComment.newsId = this.newsId;
      this.newsComment.comment = comment;
      this.newsService.addNewsComment(this.newsComment)
        .subscribe(() => {
          setTimeout(() => {
            debugger
          this.getCommentsByNews(this.newsId);
          this.closeModal();
          this.alertifyService.tSuccess("تم اضافة التعليق");
        }, 100);
      },() => {
        setTimeout(() => {
          this.alertifyService.tError(' حدث خطأ ما ... حاول مرة اخرى ');    
          this.loadingCommentData = false;
        }, 100);       
        }
        ,() => {
          setTimeout(() => {          
            this.loadingCommentData = false;
          }, 100);       
          
        });
    }

    delete() {
      this.loadingDel = true;
      this.newsService.delete(this._id)
        .subscribe(() => {
          setTimeout(() => {
            this.alertifyService.tSuccess('تم حذف الخبر بنجاح');    
            this.router.navigate(['/admin', 'news-list']);      
          }, 100);
        }, error => {
          setTimeout(() => {          
            this.alertifyService.tError('خطأ غير متوقع .. حاول مرة اخرى'); 
            this.loadingDel = false;         
            this.modalService.hideModal();          
          }, 100);
        }, () => {
          setTimeout(() => {
            this.loadingDel = false;
            this.modalService.hideModal();
            //this.resetForm();
            
          }, 100);
        });
    }
    
    openConfirmDelete(template: TemplateRef<any>, id: number) {
      this._id = id;    
      this.modalService.showConfirmModal(template);
    }

    openDelete(template: TemplateRef<any>, commentId: number){
      this._comentId = commentId;
      this.modalService.showConfirmModal(template);
    }

    closeModal() { 
      this.modalService.hideModal();
      this.commentRequired = false;
    }
    
    deleteComment(newsId: number): void {
      this.loadingCommentDel = true;
      this.newsService.deleteComment(this._comentId)
        .subscribe(() => {
          setTimeout(() => {
            this.alertifyService.tSuccess('تم حذف التعليق بنجاح');
              this.getCommentsByNews(newsId);
          }, 100);
        }, error => {
          setTimeout(() => {          
            this.alertifyService.tError('خطأ غير متوقع .. حاول مرة اخرى'); 
            this.modalService.hideModal();
            this.loadingCommentDel = false;
          }, 100);
        }, () => {
          setTimeout(() =>  {
            this.modalService.hideModal();
              this.loadingCommentDel = false;
          }, 100);
        });
    }

    confirmDeleteRefuseComment(template: TemplateRef<any>, commentId: number){
      this._commentRefuseId = commentId;    
      this.modalService.showConfirmModal(template);
    }

    
    deleteRefuseComment(){
      this.loadingCommentDel = true;
      this.newsService.deleteComment(this._commentRefuseId)
        .subscribe(() => {
          setTimeout(() => {
            this.alertifyService.tSuccess('تم حذف التعليق بنجاح');
            this.getRefusa_Comments();   
          }, 100);
        }, error => {
          setTimeout(() => {          
            this.alertifyService.tError(' حدث خطأ ما ... حاول مرة اخرى');          
            this.modalService.hideModal();
            this.loadingCommentDel = false;
          }, 100);
        }, () => {
          setTimeout(() =>  {
            this.modalService.hideModal();
              this.loadingCommentDel = false;
          }, 100);
        });
    }

    getRefusa_Comments(){
      this.newsService.getNewsRefusalComments(this.newsDetailsId, 1)
      .subscribe((_refusComments) => {
        this.commentsNotAccepted = _refusComments;
        this.config3 = {
          id: "commentsNotAcceptedId",
          itemsPerPage: 10,
          currentPage: 1,
          totalItems: this.commentsNotAccepted.count
        };  
      },() => {
        this.alertifyService.tError(' حدث خطأ ما ... حاول مرة اخرى ');
      });
    
    }

    refusalNewsUserComment(newsId: Number, commentId: Number) {  
      this.loadingRefusalCommentStatus = commentId;
      this.newsService.refuseUserComment(newsId, commentId)
        .subscribe(() => {
          setTimeout(() => {
            this.getComments_NotAccept();
            this.getRefusa_Comments();
            this.alertifyService.tSuccess('تم رفض التعليق');
        }, 100);
      },() => {
        setTimeout(() => {
          this.alertifyService.tError(' حدث خطأ ما ... حاول مرة اخرى ');
          this.loadingRefusalCommentStatus = 0;
        }, 100);       
        }
        ,() => {
          setTimeout(() => {          
            this.loadingRefusalCommentStatus = 0;
          }, 100);
        });
    } 



}
