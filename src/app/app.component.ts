import { Component, OnInit, OnDestroy, NgZone, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { merge } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { Keyboard } from '@awesome-cordova-plugins/keyboard/ngx';
import { environment } from '@env/environment';
import { Logger, UntilDestroy, untilDestroyed } from '@shared';
import { AzureKeyCredential, DocumentAnalysisClient } from '@azure/ai-form-recognizer';
import Swal from 'sweetalert2';

const log = new Logger('App');

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild('gstElement', { static: false }) gstElementRef: ElementRef | undefined;
  @ViewChild('aadharElement', { static: false }) aadharElementRef: ElementRef | undefined;
  @ViewChild('panElement', { static: false }) panElementRef: ElementRef | undefined;
  @ViewChild('aadharFile', { static: false }) aadharFile: ElementRef | undefined;
  @ViewChild('gstFile', { static: false }) gstFile: ElementRef | undefined;
  @ViewChild('panFile', { static: false }) panFile: ElementRef | undefined;

  key: string = '';
  endpoint: string = 'https://form-recognizer-extractify.cognitiveservices.azure.com/';
  gst: any = {};
  pan: any = {};
  aadhar: any = {};
  isLoading: boolean = false;
  message: string = "Processing...";

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private translateService: TranslateService,
    private zone: NgZone,
    private keyboard: Keyboard,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen
  ) { }

  async ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }

    log.debug('init');

    // Setup translations

    const onNavigationEnd = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));

    // Change page title on navigation or language change, based on route data
    merge(this.translateService.onLangChange, onNavigationEnd)
      .pipe(
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        switchMap((route) => route.data),
        untilDestroyed(this)
      )
      .subscribe((event) => {
        const title = event['title'];
        if (title) {
          this.titleService.setTitle(this.translateService.instant(title));
        }
      });
    // Cordova platform and plugins initialization
    document.addEventListener(
      'deviceready',
      () => {
        this.zone.run(() => this.onCordovaReady());
      },
      false
    );
  }

  ngOnDestroy() { }

  private onCordovaReady() {
    log.debug('device ready');

    if ((window as any).cordova) {
      log.debug('Cordova init');

      this.keyboard.hideFormAccessoryBar(true);
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    }
  }

  async onFileSelected(model: any, event: any) {
    const file: File = event.target.files[0];

    if (this.key.length == 0 || !file) {
      Swal.fire('Alert!', 'Enter API key', 'warning');
      if (this.aadharFile) {
        this.aadharFile.nativeElement.value = "";
      }
      if (this.panFile) {
        this.panFile.nativeElement.value = "";
      }
      if (this.gstFile) {
        this.gstFile.nativeElement.value = "";
      }

    } else {
      this.isLoading = true;

      const credential = new AzureKeyCredential(this.key);
      const client = new DocumentAnalysisClient(this.endpoint, credential);
      const poller = await client.beginAnalyzeDocument(model, file);
      const { documents } = await poller.pollUntilDone();
      if (!documents) {
        console.log('Expected at least one document in the result.');
      }

      this.isLoading = false;

      if (model == 'gst_model_1') {

        if (this.gstElementRef) {
          this.renderer.setProperty(this.gstElementRef.nativeElement, 'scrollTop', 0);
          this.gstElementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        let doc: any = documents![0];
        this.gst.Address = doc.fields.Address.value || '';
        this.gst.AuthName = doc.fields.AuthName.value || '';
        this.gst.Authority = doc.fields.Authority.value || '';
        this.gst.ConstitutionOfBusiness = doc.fields.ConstitutionOfBusiness.value || '';
        this.gst.DateOfLiability = doc.fields.DateOfLiability.value || '';
        this.gst.Designation = doc.fields.Designation.value || '';
        this.gst.DOI = doc.fields.DOI.value || '';
        this.gst.From = doc.fields.From.value || '';
        this.gst.JurisdictionalOffice = doc.fields.JurisdictionalOffice.value || '';
        this.gst.LegalName = doc.fields.LegalName.value || '';
        this.gst.RegistrationNum = doc.fields.RegistrationNum.value || '';
        this.gst.To = doc.fields.To.value || '';
        this.gst.TradeName = doc.fields.TradeName.value || '';
        this.gst.Type = doc.fields.Type.value || '';

        if (this.gstFile) {
          this.gstFile.nativeElement.value = "";
        }
      }

      else if (model == 'pan_model') {

        if (this.panElementRef) {
          this.renderer.setProperty(this.panElementRef.nativeElement, 'scrollTop', 0);
          this.panElementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        let doc: any = documents![0];
        this.pan.Name = doc.fields.Name.value || '';
        this.pan.FatherName = doc.fields.FatherName.value || '';
        this.pan.DOB = doc.fields.DOB.value || '';
        this.pan.PAN = doc.fields.PAN.value || '';

        if (this.panFile) {
          this.panFile.nativeElement.value = "";
        }
      }

      else if (model == 'aadhar_model') {

        if (this.aadharElementRef) {
          this.renderer.setProperty(this.aadharElementRef.nativeElement, 'scrollTop', 0);
          this.aadharElementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        let doc: any = documents![0];
        this.aadhar.Name = doc.fields.Name.value || '';
        this.aadhar.DOB = doc.fields.DOB.value || '';
        this.aadhar.Gender = doc.fields.Gender.value || '';
        this.aadhar.AadharNum = doc.fields.AadharNum.value || '';

        if (this.aadharFile) {
          this.aadharFile.nativeElement.value = "";
        }
      }
    }
  }
}
function tinyAlert() {
  throw new Error('Function not implemented.');
}

function simpleAlert() {
  throw new Error('Function not implemented.');
}
