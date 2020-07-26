import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { ModalService } from '../../../../services/modal.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BlogService } from '../../../../services/blog.service';
import { Blog } from '../../../../models/blog';
import { AlertifyService } from '../../../../services/alertify.service';
import { Comments } from '../../../../models/blogComment';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent implements OnInit {
  blog: any ;
  comments: any;
  commentsNotAccepted: any;
  userComment: any;
  _Id: number = 0;
  _commentId: number = 0;
  loadingCommentDel: boolean;
  loadingBlogDel: boolean;
  loadingAcceptedStatus: boolean;
  loadingNotAcceptedStatus: boolean;
  blogId: Number = 0 ;
  config: any  = {};
  config2: any  = {};
  config3: any  = {};
  loadingData: boolean;  
  loadingCommentData: boolean;
  blogComment = new Comments();
  loadingUserData: any;
  loadingDataComNotAccepted: boolean;
  loadingAcceptUserCommentData: any;
  imgUrl = environment.imageUrl + "UserImages/";
  blogDetailsId: Number = 0;
  _blogDetailsId: Number = 0;
  _userId: Number = 0;
  _commentRefuseId: Number = 0;
  loadingReasonStatus: boolean;
  reasonRequired: boolean = false;
  commentRequired: boolean = false;
  loadingRefusalCommentStatus: any;
  refusComments: any;
  loadingRefusComments: boolean;
  
  constructor(private route: ActivatedRoute,
    private blogSservice: BlogService,
    private spinner: NgxSpinnerService,
    private modalService: ModalService,
    private router: Router,
    private alertifyService: AlertifyService) { }

    ngOnInit() {
      this.route.params.subscribe(params => {
        this.blogDetailsId = +params['id']; 
    });

      this.getBlog();
      this.getBlogComments();
      this.getCommentsNotAccepted();
      this.getRefusalComments();

      this.config = {
        id: "blogComments",
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: this.comments.count
      };

      this.config2 = {
        id: "blogCommentsNotAccept",
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: this.commentsNotAccepted.count
      };

      this.config3 = {
        id: "blogCommentsRefuse",
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: this.refusComments.count
      };
      
    }
    
    getBlog(){
      this.route.data.subscribe(data => {
        this.blog = data['blog'];
        //console.log(this.blog);
      });
    }

    getBlogComments(){
      this.route.data.subscribe(data => {
        this.comments = data['comments'];
        //console.log(this.comments);
      });
    }

    getBlog_Comments() {
      //var id = +this.route.params['id']; 
      this.blogSservice.getComments(this.blogDetailsId)
        .subscribe((_comments) => {
          this.comments = _comments;
          this.config = {
            id : "blogComments",
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: this.comments.count
          };
      },() => {
        this.alertifyService.tError(' حدث خطأ ما ... حاول مرة اخرى ');
      });
    }

    getCommentsNotAccepted(){
      this.route.data.subscribe(data => {
        this.commentsNotAccepted = data['blogCommentsNotAccepted'];
      });
    }    

    getRefusalComments(){
      this.route.data.subscribe(data => {
        this.refusComments = data['refusalComments'];
        //console.log(this.refusComments);
      });
    }

    getComments_NotAccept() {
      this.blogSservice.getBlogCommentsWatting(this.blogDetailsId, 1)
        .subscribe((_comNotAcc) => {
          this.commentsNotAccepted = _comNotAcc;
          this.config2 = {
            id : "blogCommentsNotAccept",
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: this.commentsNotAccepted.count
          };
      },() => {
        this.alertifyService.tError(' حدث خطأ ما ... حاول مرة اخرى ');
      });
    }

    acceptBlogUserComment(blogId: Number, commentId: Number, status: boolean) {  
      this.loadingAcceptUserCommentData = commentId;
      this.blogSservice.acceptUserBlogComment(blogId, commentId, status)
        .subscribe(() => {
          setTimeout(() => {
            this.getComments_NotAccept();
            this.getBlog_Comments();
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

    refusalBlogUserComment(blogId: Number, commentId: Number, status: boolean) {  
      this.loadingRefusalCommentStatus = commentId;
      this.blogSservice.acceptUserBlogComment(blogId, commentId, status)
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

    getNextCommentsNotAccept(blogId, event) {
      this.loadingDataComNotAccepted = true;
      this.config2.currentPage = event;
      this.blogSservice.getBlogCommentsWatting(blogId, event)
        .subscribe(_commentsNotAccepted => {
          setTimeout(() => {
            this.commentsNotAccepted = _commentsNotAccepted;
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
   
    getNextRefusalComments(blogId, event) {
      this.loadingRefusComments = true;
      this.config3.currentPage = event;
      this.blogSservice.getBlogRefusalComments(blogId, event)
        .subscribe(_refusalComments => {
          setTimeout(() => {
            this.refusComments = _refusalComments;
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

    getUserComment(template: TemplateRef<any>, id: Number){
      this.userComment = this.commentsNotAccepted.data.find(b => b.id == id);
      this.modalService.showModal(template);
    }

    closeModal() { 
      this.modalService.hideModal();
      this.reasonRequired = false;
      this.commentRequired= false;
      //this.complaint = null;
    }

    openConfirmDelete(template: TemplateRef<any>, id: number) {
      this._Id = id;    
      this.modalService.showConfirmModal(template);
    }

    deleteBlog() {
      this.loadingBlogDel = true;
      this.blogSservice.delete(this._Id)
        .subscribe(() => {
          setTimeout(() => {
            this.alertifyService.tSuccess('تم حذف المدونة بنجاح');
            this.router.navigate(['/admin/blogs']);
          }, 500);
        }, error => {
          setTimeout(() => {          
            this.alertifyService.tError('خطأ فى عملية الحذف .. يرجى مراجعة الدعم الفنى');
            this.loadingBlogDel = false;
            this.modalService.hideModal();
          }, 500);
        }, () => {
          setTimeout(() => {
            this.loadingBlogDel = false;
            this.modalService.hideModal();
          }, 500);
        });
    }

    deleteComment() {
      this.loadingCommentDel = true;
      this.blogSservice.deleteComment(this._Id)
        .subscribe(() => {
          setTimeout(() => {
            this.alertifyService.tSuccess('تم حذف التعليق بنجاح');
            this.getCommentsByBlog(this.blog.id);   
          }, 100);
        }, error => {
          setTimeout(() => {          
            this.alertifyService.tError('خطأ فى عملية الحذف .. يرجى مراجعة الدعم الفنى');          
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
        this.blogSservice.getBlogRefusalComments(this.blogDetailsId, 1)
        .subscribe((_refusComments) => {
          this.refusComments = _refusComments;
          this.config3 = {
            id: "blogCommentsRefuse",
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: this.refusComments.count
          };  
        },() => {
          this.alertifyService.tError(' حدث خطأ ما ... حاول مرة اخرى ');
        });
      
    }

    deleteRefuseComment(){
      this.loadingCommentDel = true;
      this.blogSservice.deleteComment(this._commentRefuseId)
        .subscribe(() => {
          setTimeout(() => {
            this.alertifyService.tSuccess('تم حذف التعليق بنجاح');
            this.getRefusa_Comments();   
          }, 100);
        }, error => {
          setTimeout(() => {          
            this.alertifyService.tError('خطأ فى عملية الحذف .. يرجى مراجعة الدعم الفنى');          
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

    setAcceptStatus(status: boolean,id: Number) {
      this.blogId = id;
      this.loadingAcceptedStatus = true;
      this.blogSservice.setAcceptStatus(status,id)
          .subscribe(() => {
            setTimeout(() => {
              this.alertifyService.tSuccess('تم قبول المدونة');
              this.getBlogDetails(id);
              this.getCommentsByBlog(id);
              this.loadingAcceptedStatus = false;
          }, 100);
      }), () => {
        this.alertifyService.tError(('خطأ فى عملية التعديل ... يرجى الحاولة مرة اخرى'));
        this.loadingAcceptedStatus = false;
      }; 
    }

    setNotAcceptStatus(status: boolean, reason: string) {
      this.loadingReasonStatus = true;
      this.blogSservice.setNotAcceptStatus(this._blogDetailsId,this._userId, reason)

      .subscribe(_comments => {
        setTimeout(() => {
          debugger;
          this.alertifyService.tSuccess('تم الارسال بنجاح');
          this.getBlogDetails(this._blogDetailsId);
          this.getCommentsByBlog(this._blogDetailsId);
          this.loadingReasonStatus = false;
          this.closeModal();
      }, 100);
    },() => {
      setTimeout(() => {
        this.alertifyService.tError(' خطأ فى عملية التحميل... يرجى مراجعة الدعم الفنى ');
        this.loadingReasonStatus = false;
      }, 100); 
      }
      ,() => {
        setTimeout(() => {          
          this.loadingReasonStatus = false;
        }, 100);       
        
      });
    }

    confirmNotAccept(template: TemplateRef<any>,userId: Number, blogId: Number){
      this._blogDetailsId = blogId;
      this._userId = userId;      
      this.modalService.showModal(template);
    }

    getBlogDetails(blogId){
      debugger
      this.blogSservice.getBlogById(blogId)
      .subscribe((_blog) => {
          this.blog = _blog;
          console.log(this.blog);
    },() => {
        this.alertifyService.tError("خطأ فى تحميل البيانات يرجى مراجعة الدعم الفنى");   
      });
    }

    getCommentsByBlog(blogId) {
      this.blogSservice.getComments(blogId)
      .subscribe(_comments=> {
        setTimeout(() => {
          this.comments = _comments;
          this.config = {
            id: "blogComments",
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: this.comments.count
          };
      }, 100);
    },() => {
      setTimeout(() => {
        this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى");  
      }, 100);       
      }
      ,() => {
        setTimeout(() => {
        }, 100);
      });      
    }

    getNextComment(blogId, event) {
      this.loadingData = true;
      this.config.currentPage = event;
      this.blogSservice.getCommentsPaging(blogId, event)
        .subscribe(_comments => {
          setTimeout(() => {
            this.comments = _comments;
        }, 100);
      },() => {
        setTimeout(() => {
          this.alertifyService.tError("خطأ فى تحميل البيانات يرجى مراجعة الدعم الفنى");  
          this.loadingData = false;
        }, 100);       
        }
        ,() => {
          setTimeout(() => {          
            this.loadingData = false;
          }, 100);       
          
        });
    }

    showAdd(template: TemplateRef<any>){ 
      this.modalService.showModal(template);    
    }

    addComment(comment: string){  
      if(comment == '' || comment == null){
        this.commentRequired = true;
        return;
      }
      
      this.loadingCommentData = true;
      this.blogComment.blogId = this.blog.id;
      this.blogComment.comment = comment;

      this.blogSservice.addBlogComment(this.blogComment)
        .subscribe(() => {
          setTimeout(() => {
          //   this.blogSservice.getComments(this.blog.id)
          //   .subscribe(comments=> {
          //     this.comments = comments;
          // });
          this.getCommentsByBlog(this.blog.id);
          this.alertifyService.tSuccess("تم اضافة التعليق");
          this.closeModal();
        }, 100);
      },() => {
        setTimeout(() => {
          this.alertifyService.tError("خطأ فى تحميل البيانات يرجى مراجعة الدعم الفنى");  
          this.loadingCommentData = false;
        }, 100);       
        }
        ,() => {
          setTimeout(() => {          
            this.loadingCommentData = false;
          }, 100);       
          
        });
    }
  

}
