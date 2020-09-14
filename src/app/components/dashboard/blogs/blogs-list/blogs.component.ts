import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { NgxSpinnerService } from 'ngx-spinner';
import { Blog } from '../../../../models/blog';
import { AlertifyService } from '../../../../services/alertify.service';
import { BlogService } from '../../../../services/blog.service';
import { ModalService } from '../../../../services/modal.service';
import { Filters } from '../../../../models/filterBlogs';
import { BsDatepickerConfig, BsDaterangepickerDirective } from 'ngx-bootstrap';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
  blogForm: FormGroup;
  blog: any;
  blogs: any;
  loading: boolean;
  loadingData: boolean;
  config: any = {};
  blogsCount: any;
  showSave: boolean;
  showEdit: boolean;
  title: string;
  _id: number = 0;
  loadingDel: boolean;
  loadingDetails: boolean;
  loadingAcceptedStatus: boolean;
  loadingNotAcceptedStatus: boolean;
  loadingAll: boolean;
  search_By: string = '';
  searchWord: string = '';
  bsConfig: Partial<BsDatepickerConfig>;
  dateFrom: Date = null;
  dateTo: Date = null;
  filters: Filters = new Filters();
  loadingSearch: boolean;
  private datePipe: DatePipe
  bsInlineRangeValue: any;
  loadingNewSearch: any;
  editMode: boolean = false;
  loadingWattingStatus: boolean;
  imgUrl = environment.imageUrl + "UserImages/";
  blogStatus: string = "all";
  searchNow: string = "الكل";
  userRole: string = "";
 

  constructor(private alertifyService: AlertifyService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private blogSservice: BlogService,
    private spinner: NgxSpinnerService,
    private modalService: ModalService,
    private router: Router) 
    {
      this.blog = new Blog;
      this.showSave = true;
      this.showEdit = false;
      this.title = "إضافة مدونة";    
     }

  ngOnInit() {
    this.userRole = localStorage.getItem("userRoleName");
    this.bsConfig = {
      containerClass: 'theme-green',
      dateInputFormat: 'YYYY/MM/DD',
      isAnimated: true
    };

    this.blogForm = this.fb.group({
      id: [0],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      allowComment: [false]
    });

    this.route.data.subscribe(data => {
      this.blogs = data['blogsList'];
      //console.log(this.blogs);
    });

    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.blogs.count
    };

   
  }

  getNextBlogs(event) {
    this.loadingData = true;
    this.config.currentPage = event;

    switch (this.blogStatus) {
      case "all": {
        this.blogSservice.getAll(event)
          .subscribe(_blogs => {
            setTimeout(() => {
              this.blogs = _blogs;
            }, 100);
          }, () => {
            setTimeout(() => {
              this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى");
              this.loadingData = false;
            }, 100);
          }
            , () => {
              setTimeout(() => {
                this.loadingData = false;
              }, 100);

            });
        break;
      }
      case "accept": {
        this.blogSservice.getBlogs_Status(true, event)
          .subscribe(_blogs => {
            setTimeout(() => {
              this.blogs = _blogs;
              this.loadingData = false;
            }, 100);
          }), () => {
            setTimeout(() => {
              this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى");
              this.loadingData = false;
            }, 100);
          };
        break;
      }
      case "notAccept": {
        this.blogSservice.getBlogs_Status(false, event)
          .subscribe(_blogs => {
            setTimeout(() => {
              this.blogs = _blogs;
              this.loadingData = false;
            }, 100);
          }), () => {
            setTimeout(() => {
              this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى");
              this.loadingData = false;
            }, 100);
          };
        break;
      }
      default: {
        this.blogSservice.getBlogs_Status(null, event)
          .subscribe(_blogs => {
            setTimeout(() => {
              this.blogs = _blogs;
              this.loadingData = false;
            }, 100);
          }), () => {
            setTimeout(() => {
              this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى");
              this.loadingData = false;
            }, 100);
          };
        break;
      }
    }

  }

  getBlogs_Accepted(status: any) {
    this.blogStatus = "accept";
    this.loadingAcceptedStatus = true;
    
    this.blogSservice.getBlogs_Status(status, 1)
      .subscribe(_blogs => {
        setTimeout(() => {
          this.searchNow = "تم الموافقة";
          this.blogs = _blogs;
          this.loadingAcceptedStatus = false;
          this.config = {
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: _blogs.count
          };
        }, 100);
      }), () => {
        setTimeout(() => {
          this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى");
          this.loadingAcceptedStatus = false;
        }, 100);
      };
  }

  getBlogs_NotAccepted(status: any) {
    this.blogStatus = "notAccept";
    this.loadingNotAcceptedStatus = true;
    
    this.blogSservice.getBlogs_Status(status, 1)
      .subscribe(_blogs => {
        setTimeout(() => {
          this.searchNow = "مرفوضة";
          this.blogs = _blogs;
          this.loadingNotAcceptedStatus = false;
          this.config = {
            itemsPerPage: 7,
            currentPage: 1,
            totalItems: _blogs.count
          };
        }, 100);
      }), () => {
        setTimeout(() => {
          this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى");
          this.loadingNotAcceptedStatus = false;
        }, 100);
      };
  }

  getBlogs_Watting(status: any) {
    this.blogStatus = "watting";
    this.loadingWattingStatus = true;

    this.blogSservice.getBlogs_Status(status ,1)
      .subscribe(_blogs => {
        setTimeout(() => {
          this.searchNow = "قيد الانتظار";
          this.blogs = _blogs;
          this.loadingWattingStatus = false;
          this.config = {
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: _blogs.count
          };
        }, 100);
      }), () => {
        setTimeout(() => {
          this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى");
          this.loadingWattingStatus = false;
        }, 100);
      };
  }

  getBlogs_All() {
    this.blogStatus = "all";
    this.loadingAll = true;
    this.config.currentPage = 1;
    this.blogSservice.getAll(1)
      .subscribe(_blogs => {
        setTimeout(() => {
          this.searchNow = "الكل";
          this.blogs = _blogs;
          this.config = {
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: _blogs.count
          };
        }, 100);
      }, () => {
        setTimeout(() => {
          this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى");
          this.loadingAll = false;
        }, 100);
      }
        , () => {
          setTimeout(() => {
            this.loadingAll = false;
          }, 100);
        });
  }

  filterBlogs() {
    // var _dateFrom = new Date(this.dateFrom).toLocaleDateString(); 
    // var _dateFrom = new Date(this.dateFrom).toLocaleDateString(); 

    // if(this.search_By == ""){
    //   alert("من فضلك إختر نوع البحث!");
    //   return;
    // }

    debugger;
    this.filters.SearckKey = this.searchWord;
    this.filters.DateFrom = this.dateFrom == null ? '' : this.dateFrom.toLocaleDateString();
    this.filters.DateTo = this.dateTo == null ? '' : this.dateTo.toLocaleDateString();

    this.loadingSearch = true;
    this.blogSservice.filterBlog(this.filters)
      .subscribe((_blogs) => {
        setTimeout(() => {
          this.blogs = _blogs;
          this.loadingSearch = false;
          // this.config = {
          //   itemsPerPage: 10,
          //   currentPage: 1,
          //   totalItems: this.blogs.count
          // };
        }, 100);
      }, (err) => {
        setTimeout(() => {
          this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى");
          this.loadingSearch = false;
        }, 100);
      }, () => {
        setTimeout(() => {
          this.loadingSearch = false;
        }, 100);
      });

  }

  getBlogs(event) {
    this.loadingData = true;
    //this.spinner.show();
    this.config.currentPage = event;
    this.blogSservice.getAll(event)
      .subscribe(_blogs => {
        setTimeout(() => {
          this.blogs = _blogs;
        }, 100);
      }, () => {
        setTimeout(() => {
          this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى");
          this.loadingData = false;
          //this.spinner.hide();  
        }, 100);
      }
        , () => {
          setTimeout(() => {
            this.loadingData = false;
            this.spinner.hide();
          }, 100);

        });
  } 

  showBlog(id, template: TemplateRef<any>) {
    this.blog = this.blogs.data.find(b => b.id == id);
    debugger
    this.blogForm.controls['id'].setValue(this.blog.id);
    this.blogForm.controls['title'].setValue(this.blog.title);
    this.blogForm.controls['description'].setValue(this.blog.description);
    this.blogForm.controls['allowComment'].setValue(this.blog.allowComment);

    this.showSave = false;
    this.showEdit = true;
    this.title = "تعديل المدونة"
    window.scroll(0, 0);
    this.editMode = true;
  }

  onSubmit(model: Blog) {
    if (model.id == 0 || model.id == undefined) {
      model.allowComment = model.allowComment == null ? false : true;
      this.loading = true;
      this.blogSservice.save(model)
        .subscribe(() => {
          setTimeout(() => {
            this.alertifyService.tSuccess("تم حفظ المدونة بنجاح");
            this.getBlogs(1); 
            this.resetForm();           
          }, 100);
        }, (err) => {
          setTimeout(() => {
            this.alertifyService.tError("خطأ فى عملية الحفظ .. يرجى مراجعة الدعم الفنى");
            this.loading = false;
          }, 100);
        }, () => {
          setTimeout(() => {
            this.resetForm();
            this.loading = false;
          }, 100);
        });
    }
    else {
      this.loading = true;
      this.blogSservice.update(model)
        .subscribe(() => {
          setTimeout(() => {           
            this.alertifyService.tSuccess('تم تعديل المدونة بنجاح');
            this.editMode = false;
          }, 100);
        }, () => {
          setTimeout(() => {
            this.alertifyService.tError('خطأ فى عملية التعديل');
            this.loading = false;
          }, 100);
        }, () => {
          setTimeout(() => {
            this.loading = false;
            this.getBlogs(1);
            this.resetForm();
            this.title = "إضافة المدونة"
            this.editMode = false;
          }, 100);
        });
    }
  }
  
  openConfirmDelete(template: TemplateRef<any>, id: number) {
    this._id = id;
    this.modalService.showConfirmModal(template);
  }

  delete() {
    this.loadingDel = true;
    this.blogSservice.delete(this._id)
      .subscribe(() => {
        setTimeout(() => {
          this.alertifyService.tSuccess('تم حذف المدونة بنجاح');
        }, 100);
      }, () => {
        setTimeout(() => {
          this.alertifyService.tError("خطأ فى تحميل البيانات ... يرجى المحاولة مرة اخرى");
          this.loadingDel = false;
          this.modalService.hideModal();
        }, 100);
      }, () => {
        setTimeout(() => {
          this.loadingDel = false;
          this.modalService.hideModal();
          this.getBlogs(1);
          this.resetForm();
        }, 100);
      });
  }

  showBlogDetails(id: number) {
    // this.loadingDetails = true;
    // setTimeout(() => {
    //   this.loadingDetails = false;
    // }, 100);
    this.router.navigate(['/admin', 'blog-details', id]);
  }

  clear() {
    // this.blog = {
    //   id: 0,
    //   title: '',
    //   description: '',
    //   allowComment: false,

    // };
    this.showSave = true;
    this.showEdit = false;
    this.title = "إضافة مدونة";
    this.blogForm.reset();
    this.editMode = false;
  }

  resetForm() {
    this.blogForm.reset();
    this.blogForm.controls['id'].setValue(0);

    // this.blog = {
    //   id: 0,
    //   title: '',
    //   description: '',
    //   allowComment: false
    // };
    this.blog = new Blob();
    this.showSave = true;
    this.showEdit = false;
    this.title = "إضافة مدونة";
  }

  closeModal() {
    this.modalService.hideModal();
    //this.complaint = null;
  }

  decline(): void {
    this.modalService.hideModal();
  }


}
