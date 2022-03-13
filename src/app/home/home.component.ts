import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UploadService } from  '../upload.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild("fileUpload", { static: false }) fileUpload!: ElementRef;
  files = [];

   constructor(private uploadService: UploadService) { }

  ngOnInit(): void {
     // Obtém os dados do arquivo
     fetch('assets/testes_cnpjs.txt')
     .then(response => response.text())
     .then(data => {
     // Do something with your data
     console.log('quebra com /r/n -> ', data.split('\r\n'));
     //  console.log(data);
     //  console.log('quebra com , -> ', data.split(','));
     //  console.log('tamanho total -> ', data.split('\r\n').length);
     var totalCnpjs = data.split('\r\n').length;

     for (var posicao = 0; posicao < totalCnpjs; posicao++){
       var arrayData: Array<String>;
       var lerLinhaALinha;

       arrayData = data.split('\r\n');
       lerLinhaALinha = arrayData[posicao].replace(',', '');
       console.log('linha -> ', posicao, ' valor -> ' , lerLinhaALinha);

       //  console.log('posição -> ', i);
       //  console.log('array ->', arrayData);
       //  console.log('tamanho do array->', arrayData.length);
     }
   })
   .catch(function(error) {
     console.log('Request failed', error);
   });
  }

  uploadFile(file: any) {
    const formData = new FormData();
    formData.append('file', file.data);
    file.inProgress = true;
    this.uploadService.upload(formData).pipe(
      map(event => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            file.progress = Math.round(event.loaded * 100 / event.total!);
            return file.progress;
          case HttpEventType.Response:
            return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        file.inProgress = false;
        return of(`${file.data.name} upload failed.`);
      })).subscribe((event: any) => {
        if (typeof (event) === 'object') {
          console.log(event.body);
        }
      });
  }

  private uploadFiles() {
    this.fileUpload.nativeElement.value = '';
    this.files.forEach(file => {
      this.uploadFile(file);
    });
  }

  onClick() {
    const fileUpload = this.fileUpload.nativeElement;fileUpload.onchange = () => {
    for (let index = 0; index < fileUpload.files.length; index++)
    {
     const file = fileUpload.files[index];
    //  this.files.push({ data: file, inProgress: false, progress: 0});
    }
      this.uploadFiles();
    };
    fileUpload.click();
  }

}
