import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RbacService } from '../rbac.service';

@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  @Input('hasPermission') resource!: string;
  @Input('hasPermissionAction') action: string = 'view';

  private destroy$ = new Subject<void>();

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private rbacService: RbacService
  ) {}

  ngOnInit() {
    this.rbacService.hasPermission(this.resource, this.action)
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasPermission: any) => {
        if (hasPermission) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}