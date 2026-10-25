// ✅ استدعاء مكتبة Bootstrap لتفعيل القوائم المنسدلة وكل مكونات JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// ✅ تشغيل تطبيق Angular

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));


