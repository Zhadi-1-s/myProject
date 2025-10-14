import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { JwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideLegacyTranslate } from './translate.config';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
     provideClientHydration(),
     provideHttpClient(withInterceptorsFromDi()),
     provideLegacyTranslate(),
     {
      provide:HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi:true,
     }, 
     importProvidersFrom(NgbModule)
    ]
};
