import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

type PageToken = number | '…';

@Component({
  selector: 'app-ui-simple-page-navigator',
  templateUrl: './ui-simple-page-navigator.html',
  styleUrls: ['./ui-simple-page-navigator.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class UiSimplePageNavigator implements OnChanges {
  @Input() totalItems = 0;
  @Input() page = 1;      // 1-based
  @Input() pageSize = 9;

  @Input() pageSizeOptions: number[] = [6, 9, 12, 18];
  @Input() showPageSize = true;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  pageCount = 1;
  tokens: PageToken[] = [];

  ngOnChanges(_changes: SimpleChanges): void {
    this.recompute();
  }

  prev(): void {
    if (this.page <= 1) return;
    this.emitPage(this.page - 1);
  }

  next(): void {
    if (this.page >= this.pageCount) return;
    this.emitPage(this.page + 1);
  }

  onTokenClick(t: PageToken): void {
    if (t === '…') return;
    this.emitPage(t);
  }

  onPageSizeSelect(raw: string): void {
    const nextSize = Math.max(1, Number.parseInt(raw, 10) || this.pageSize);
    if (nextSize === this.pageSize) return;

    this.pageSizeChange.emit(nextSize);
    this.pageChange.emit(1); // reset pagina
  }

  isActive(t: PageToken): boolean {
    return t !== '…' && t === this.page;
  }

  ariaCurrent(t: PageToken): 'page' | null {
    return this.isActive(t) ? 'page' : null;
  }

  trackToken(index: number, t: PageToken): string {
    return `${t}_${index}`;
  }

  private emitPage(p: number): void {
    const nextPage = this.clampInt(p, 1, this.pageCount);
    if (nextPage === this.page) return;
    this.pageChange.emit(nextPage);
  }

  private recompute(): void {
    const safeTotal = Math.max(0, this.totalItems | 0);
    const safePageSize = Math.max(1, this.pageSize | 0);

    this.pageSize = safePageSize;
    this.pageCount = Math.max(1, Math.ceil(safeTotal / safePageSize));
    this.page = this.clampInt(this.page, 1, this.pageCount);
    this.tokens = this.buildTokens(this.page, this.pageCount);
  }

  private clampInt(x: number, min: number, max: number): number {
    if (!Number.isFinite(x)) return min;
    const v = Math.floor(x);
    if (v < min) return min;
    if (v > max) return max;
    return v;
  }

  private buildTokens(current: number, total: number): PageToken[] {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const set = new Set<number>();
    set.add(1);
    set.add(total);

    for (let p = current - 1; p <= current + 1; p++) {
      if (p >= 1 && p <= total) set.add(p);
    }

    if (current <= 3) {
      set.add(2); set.add(3); set.add(4);
    }
    if (current >= total - 2) {
      set.add(total - 1); set.add(total - 2); set.add(total - 3);
    }

    const pages = Array.from(set).sort((a, b) => a - b);

    const out: PageToken[] = [];
    for (let i = 0; i < pages.length; i++) {
      out.push(pages[i]);
      const next = pages[i + 1];
      if (next != null && next - pages[i] > 1) out.push('…');
    }
    return out;
  }
}
