// ✅ استدعاء مكتبة Bootstrap لتفعيل القوائم المنسدلة وكل مكونات JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { installStaticApi } from './static-api';

// ✅ نسخة GitHub Pages: الأخبار من ملفات JSON بدل الـ PHP
if (environment.staticApi) {
  installStaticApi();
}

// ✅ تشغيل تطبيق Angular

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
