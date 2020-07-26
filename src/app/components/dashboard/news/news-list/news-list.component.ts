import { Component, OnInit, TemplateRef, Output, Input, EventEmitter } from '@angular/core';
import { AlertifyService } from '../../../../services/alertify.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NewsService } from '../../../../services/news.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalService } from '../../../../services/modal.service';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Filters } from '../../../../models/filterBlogs';
import { News } from '../../../../models/news';
import { NewsImage } from '../../../../models/newsImage';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {
  newsList: any;
  news: News;
  config: any = {};
  loadingDetails: any;
  loadingData: boolean;
  _id: Number = 0;
  loadingSearch: any;
  loadingDel: boolean;
  loadingAll: boolean;
  loadingAcceptedStatus: boolean;
  loadingNotAcceptedStatus: boolean;
  bsConfig: Partial<BsDatepickerConfig>;
  searchWord: string = '';
  dateFrom: Date = null;
  dateTo: Date = null;
  filters: Filters = new Filters();
  showAdd: boolean;
  showList: boolean;
  newsForm: FormGroup;
  loading: boolean;
  showSave: boolean;
  showEdit: boolean;
  newsTitle: string;
  newsTypes: any;
  loadingEdit: any;
  newsImages: NewsImage[];
  loadingWattingStatus: boolean;
  newsImageUrl = environment.imageUrl + "NewImags/";
  newsStatus: string = "all";
  of: Number = 1;
  searchNow: string = "الكل";
  isLoading:boolean;


  constructor(private alertifyService: AlertifyService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private newsService: NewsService,
    private spinner: NgxSpinnerService,
    private modalService: ModalService,
    private router: Router) {
      this.isLoading = true;
     }

    ngOnInit() {
      this.getNewsType();
      this.showAdd = false;
      this.showList = true;

      this.route.data.subscribe(data => {
        this.newsList = data['newsList'];
        //console.log(this.newsList);
      });

      this.config = {
        itemsPerPage: 10,
        currentPage: 1,
        totalItems: this.newsList.count
      };

      this.bsConfig = {
        containerClass: 'theme-green',
        dateInputFormat: 'YYYY/MM/DD',
        isAnimated: true
      };

      this.news = new News();
      this.newsTitle = "إضافة خبر";

      this.newsForm = this.fb.group({
        id: [0],
        title: ['', [Validators.required]],
        newsTypeId: [, [Validators.required, Validators.min(1)]],
        description: ['', [Validators.required]],
        allowComment: [false]
      });

    }
  
    hideLoader(){
      this.isLoading = false;
    }

    getImagesList(newsImages: NewsImage[]) {
      this.newsImages = newsImages;
    }

    onSubmit(model: News) {
      if (model.id == 0 || model.id == undefined) {
        this.loading = true;
        model.newsImages = this.newsImages;

        if (model.newsImages.length > 0) {
          var res = model.newsImages.find(p => p.isMain === true);
          if (res == null) {
            model.newsImages[0].isMain = true;
          }
        }

        this.newsService.save(model)
          .subscribe(() => {
            setTimeout(() => {
              this.alertifyService.tSuccess("تم حفظ الخبر بنجاح");
              this.getAllNews();
              this.showAdd = false;
              this.showList = true;
            }, 100);
          }, (err) => {
            setTimeout(() => {
              this.alertifyService.tError("خطأ غير متوقع .. حاول مرة اخرى");
              this.loading = false;
              console.log(err);
            }, 100);
          }, () => {
            setTimeout(() => {
              this.loading = false;
              this.resetForm();
            }, 100);
          });
      }
      //edit
      else {
        this.loading = true;
        this.news.newsImages = this.newsImages;

        debugger
        if (this.news.newsImages.length > 0) {
          var res = this.news.newsImages.find(p => p.isMain === true);
          if (res == null) {
            this.news.newsImages[0].isMain = true;
          }
        }

        this.newsService.update(this.news)
          .subscribe(() => {
            setTimeout(() => {
              this.alertifyService.tSuccess('تم تعديل الخبر بنجاح');
              this.getAllNews();
              this.showAdd = true;
              this.showList = false;
            }, 100);
          }, () => {
            setTimeout(() => {
              this.alertifyService.tError("خطأ فى عملية التعديل .. حاول مرة اخرى");
              this.loading = false;
            }, 100);
          }, () => {
            setTimeout(() => {
              this.loading = false;
              this.resetForm();
              this.newsTitle = "إضافة خبر"
            }, 100);
          });
      }
    }

    getNewsType() {
      this.newsService.getNewsType()
        .subscribe(_newsType => {
          this.newsTypes = _newsType;
        });
    }

    getAllNews() {
      this.of = 1
      this.newsStatus = "all";
      this.loadingAll = true;
      this.newsService.getAll(1)
        .subscribe(_newsList => {
          setTimeout(() => {
            this.searchNow = "الكل";
            this.newsList = _newsList;
            this.config = {
              itemsPerPage: 10,
              currentPage: 1,
              totalItems: this.newsList.count
            };
          }, 100);
        }, () => {
          setTimeout(() => {
            this.alertifyService.tError("خطأ فى تحميل البيانات حاول مرة اخرى");
            this.loadingAll = false;
          }, 100);
        }
          , () => {
            setTimeout(() => {
              this.loadingAll = false;
            }, 100);

          });
    }

    getNewsById(id: Number) {
      this.loadingEdit = id;
      this.newsService.getNewsById(id)
        .subscribe(_news => {
          setTimeout(() => {
            this.showList = false;
            this.showAdd = true;
            this.newsTitle = "تعديل الخبر";
            this.news = _news.news;
            this.newsImages = _news.images;
          }, 100);
        }, () => {
          setTimeout(() => {
            this.alertifyService.tError("خطأ فى تحميل البيانات ... حاول مرة اخرى");
            this.loadingEdit = 0;
          }, 100);
        }
          , () => {
            setTimeout(() => {
              this.loadingEdit = 0;
            }, 100);

          });
    }

    getNextNews(event) {
      this.loadingData = true;
      this.config.currentPage = event;
      this.of = event;

      switch (this.newsStatus) {
        case "all": {
          this.newsService.getAll(event)
            .subscribe(_newsList => {
              setTimeout(() => {
                this.newsList = _newsList;
              }, 100);
            }, () => {
              setTimeout(() => {
                this.alertifyService.tError("خطأ فى تحميل البيانات حاول مرة اخرى");
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
          this.newsStatus = "accept";
          this.newsService.getNewsByStatus(true, event)
            .subscribe(_newsList => {
              setTimeout(() => {
                this.newsList = _newsList;
              }, 100);
            }, () => {
              setTimeout(() => {
                this.alertifyService.tError("خطأ فى تحميل البيانات حاول مرة اخرى");
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
        case "notAccept": {
          this.newsStatus = "notAccept";
          this.newsService.getNewsByStatus(false, event)
            .subscribe(_newsList => {
              setTimeout(() => {
                this.newsList = _newsList;
              }, 100);
            }, () => {
              setTimeout(() => {
                this.alertifyService.tError("خطأ فى تحميل البيانات حاول مرة اخرى");
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
        default: {
          this.newsStatus = "watting";
          this.newsService.getNewsWatting(event)
            .subscribe(_newsList => {
              setTimeout(() => {
                this.newsList = _newsList;
              }, 100);
            }, () => {
              setTimeout(() => {
                this.alertifyService.tError("خطأ فى تحميل البيانات حاول مرة اخرى");
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
      }
    }

    getNewsDetails(id: Number) {
      this.loadingDetails = id;
      // setTimeout(() => {
      this.news = this.newsList.data.find(n => n.id == id);
      this.router.navigate(['/admin', 'news-details', id]);
      // }, 100); 
      //this.loadingDetails = 0;
    }

    closeModal() {
      this.modalService.hideModal();
    }

    showAddNews() {
      this.resetForm();
      this.showAdd = true;
      this.showList = false;
    }

    getNewsWatting() {
      this.newsStatus = "watting";
      this.loadingWattingStatus = true;
      this.newsService.getNewsWatting(1)
        .subscribe(_newsList => {
          setTimeout(() => {
            this.searchNow = "قيد الانتظار";
            this.newsList = _newsList;
            this.config = {
              itemsPerPage: 10,
              currentPage: 1,
              totalItems: this.newsList.count
            };
          }, 100);
        }, () => {
          setTimeout(() => {
            this.alertifyService.tError("خطأ فى تحميل البيانات حاول مرة اخرى");
            this.loadingWattingStatus = false;
          }, 100);
        }
          , () => {
            setTimeout(() => {
              this.loadingWattingStatus = false;
            }, 100);

          });
    }

    getNewsAccepted(status: boolean) {
      this.newsStatus = "accept";
      this.loadingAcceptedStatus = true;
      this.newsService.getNewsByStatus(status, 1)
        .subscribe(_newsList => {
          setTimeout(() => {
            this.searchNow = "تم الموافقة";
            this.newsList = _newsList;
            this.config = {
              itemsPerPage: 10,
              currentPage: 1,
              totalItems: this.newsList.count
            };
          }, 100);
        }, () => {
          setTimeout(() => {
            this.alertifyService.tError("خطأ فى تحميل البيانات حاول مرة اخرى");
            this.loadingAcceptedStatus = false;
          }, 100);
        }
          , () => {
            setTimeout(() => {
              this.loadingAcceptedStatus = false;
            }, 100);

          });
    }

    getNewsNotAccepted(status: boolean) {
      this.newsStatus = "notAccept";
      this.loadingNotAcceptedStatus = true;
      this.newsService.getNewsByStatus(status, 1)
        .subscribe(_newsList => {
          setTimeout(() => {
            this.searchNow = "مرفوضة";
            this.newsList = _newsList;
            this.config = {
              itemsPerPage: 10,
              currentPage: 1,
              totalItems: this.newsList.count
            };
          }, 100);
        }, () => {
          setTimeout(() => {
            this.alertifyService.tError("خطأ فى تحميل البيانات حاول مرة اخرى");
            this.loadingNotAcceptedStatus = false;
          }, 100);
        }
          , () => {
            setTimeout(() => {
              this.loadingNotAcceptedStatus = false;
            }, 100);

          });
    }

    openConfirmDelete(template: TemplateRef<any>, id: Number) {
      this._id = id;
      this.modalService.showConfirmModal(template);
    }

    delete() {
      this.loadingDel = true;
      this.newsService.delete(this._id)
        .subscribe(() => {
          setTimeout(() => {
            this.alertifyService.tSuccess('تم حذف الخبر بنجاح');
            this.getAllNews();
          }, 100);
        }, error => {
          setTimeout(() => {
            this.alertifyService.tError('خطأ فى عملية الحذف .. حاول مرة اخرى');
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

    filterNews() {
      this.filters.SearckKey = this.searchWord;
      this.filters.DateFrom = this.dateFrom == null ? '' : this.dateFrom.toLocaleDateString();
      this.filters.DateTo = this.dateTo == null ? '' : this.dateTo.toLocaleDateString();

      this.loadingSearch = true;
      this.newsService.filterNews(this.filters)
        .subscribe((_news) => {
          setTimeout(() => {
            debugger
            this.newsList = _news;
            this.config = {
              itemsPerPage: 10,
              currentPage: 1,
              totalItems: this.newsList.count
            };
          }, 100);
        }, (err) => {
          setTimeout(() => {
            this.alertifyService.tError("خطأ فى عملية البحث .. حاول مرة اخرى");
            this.loadingSearch = false;
          }, 100);
        }, () => {
          setTimeout(() => {
            this.loadingSearch = false;
          }, 100);
        });

    }

    resetForm() {
      this.newsForm.reset();
      // this.newsForm.controls['id'].setValue(0);
      // this.newsForm.controls['title'].setValue('');
      // this.newsForm.controls['newsTypeId'].setValue(0);
      // this.newsForm.controls['description'].setValue('');
      // this.newsForm.controls['allowComment'].setValue(false);
      this.news = new News();
      // this.news = {
      //   id: 0,
      //   title: '',
      //   newsTypeId: 0,
      //   description: '',
      //   allowComment: false
      // };
      this.showSave = true;
      this.showEdit = false;
      this.newsTitle = "إضافة خبر";

      this.showAdd = false;
      this.showList = true;
      this.newsImages = [];
      //this.newNewsImages = [];
    }

    clear() {
      // this.news = {
      //   id: 0,
      //   title: '',
      //   newsTypeId: 0,
      //   description: '',
      //   allowComment: false
      // };
      this.showSave = true;
      this.showEdit = false;
      this.newsTitle = "إضافة خبر";
      this.newsForm.reset();

      this.showAdd = false;
      this.showList = true;
    }

}
