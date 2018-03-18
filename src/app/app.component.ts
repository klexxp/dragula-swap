import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

interface Image {
  index: number,
  file: File,
  size: string
  thumb: SafeUrl
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  objectKeys = Object.keys;
  images: Image[] = [];
  assets: object = {};
  sizes: string[] = [
    'Bucket 1', 'Bucket 2', 'Bucket 3', 'Bucket 4'
  ]

  constructor(
    private dragulaService: DragulaService,
    private sanitizer: DomSanitizer
  ) {  }


  ngOnInit() {
    this.dragulaService.dropModel.subscribe(args => {
      let [bag, el, target, source] = args;

      if(target.attributes.class.value === 'assetList') {

        let imageIndex = parseInt(el.attributes.imageIndex.value);
        let targetSizeIndex = target.attributes.sizeIndex.value;

        if(this.assets[targetSizeIndex].length >= 2) {
          if(source.attributes.class.value === 'assetList') {
            let sourceSizeIndex = source.attributes.sizeIndex.value;

            this.assets[sourceSizeIndex].push(
              this.assets[targetSizeIndex].splice(
                this.assets[targetSizeIndex].findIndex(
                  asset => asset.index !== imageIndex
                )
              ,1)[0]
            );
          } else {
            this.images.push(
              this.assets[targetSizeIndex].splice(
                this.assets[targetSizeIndex].findIndex(
                  asset => asset.index !== imageIndex
                )
              ,1)[0]
            );
          }
        }
      }
    });

    for(let i=0; i<this.sizes.length; i++) {
      this.assets[this.sizes[i]] = [];
    }
  }

  onAddFiles(fileList: FileList) {
    for(let i=0; i<fileList.length; i++) {
      this.images.push({
        index: i,
        file: fileList[i],
        size: '',
        thumb: this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(fileList[i]))
      });
    }
  }

  onPublishAssets() {
    console.log(this.assets);
  }
}
