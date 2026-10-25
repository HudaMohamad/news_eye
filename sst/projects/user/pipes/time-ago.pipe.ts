import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {

  transform(
    value: string | Date | null,
    format: 'relative' | 'short' | 'full' = 'relative'
  ): string {
    if (!value) return '—';  // fallback لو التاريخ غير موجود

    const tz = 'Asia/Damascus';
    const postMoment = moment.tz(value, tz);   // وقت الخبر بتوقيت دمشق
    const nowMoment = moment().tz(tz);        // الوقت الحالي بتوقيت دمشق

    const seconds = nowMoment.diff(postMoment, 'seconds');
    const minutes = nowMoment.diff(postMoment, 'minutes');
    const hours = nowMoment.diff(postMoment, 'hours');
    const days = nowMoment.diff(postMoment, 'days');

    if (format === 'relative') {
      if (seconds < 60) return 'الآن';     // إذا كانت أقل من 60 ثانية
      if (minutes < 1) return 'منذ دقيقة';              // إذا كانت أقل من دقيقة
      if (minutes < 60) return `منذ ${minutes} دقيقة`;
      if (hours < 24) return `منذ ${hours} ساعة`;
      if (days < 7) return `منذ ${days} يوم`;
      return postMoment.format('D MMMM YYYY, HH:mm'); // أخبار أقدم من أسبوع
    }

    if (format === 'short') {
      return postMoment.format('DD/MM/YYYY');
    }

    if (format === 'full') {
      return postMoment.format('dddd، D MMMM YYYY - HH:mm');
    }

    return '';
  }
}
