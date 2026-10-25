import { Directive, ElementRef, HostListener } from '@angular/core';

/**
 * أي صورة <img> ما بتنحمّل (رابط مكسور أو صورة محذوفة)
 * بتتبدّل تلقائياً بصورة بديلة فيها لوغو القناة.
 */
@Directive({
  selector: 'img',
  standalone: true
})
export class ImgFallbackDirective {
  private static readonly FALLBACK = 'assets/placeholder.jpg';

  constructor(private el: ElementRef<HTMLImageElement>) {}

  @HostListener('error')
  onError(): void {
    const img = this.el.nativeElement;
    // منمنع حلقة لا نهائية إذا الصورة البديلة نفسها ما انحمّلت
    if (!img.src.endsWith(ImgFallbackDirective.FALLBACK)) {
      img.src = ImgFallbackDirective.FALLBACK;
    }
  }
}
