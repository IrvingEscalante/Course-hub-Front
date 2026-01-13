import { ModalConfirmation } from '../../../shared/components/modal-confirmation/modal-confirmation';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PullRequestBasicOut, PullRequestChange } from '../../../core/models/pull_request.model';
import { PullRequestChangeItemComponent } from '../../../shared/components/pull-request-components/pull-request-change-item/pull-request-change-item.component';
import { Avatar } from '../../../shared/components/avatar/avatar';
import { PullRequestService } from '../../../core/services/pull_request/pull-request.service';


interface GroupedChanges {
  added: PullRequestChange[];
  updated: PullRequestChange[];
  deleted: PullRequestChange[];
}

@Component({
  selector: 'app-pull-request-detail',
  standalone: true,
  imports: [CommonModule, PullRequestChangeItemComponent, Avatar, ModalConfirmation],
  templateUrl: './pull-request-detail.html',
  styleUrl: './pull-request-detail.css'
})
export class PullRequestDetail implements OnInit {
  prId: number = 0;
  pr: PullRequestBasicOut | null = null;
  changes: PullRequestChange[] = [];
  groupedChanges: GroupedChanges = { added: [], updated: [], deleted: [] };
  
  isLoading: boolean = true;
  isProcessing: boolean = false;
  error: string | null = null;
  showModalAccept: boolean = false;
  showModalReject: boolean = false;
  showAcceptModal() {
    this.showModalAccept = true;
  }

    showRejectModal() {
      this.showModalReject = true;
    }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private prService: PullRequestService
  ) {}

  ngOnInit() {
    this.prId = +this.route.snapshot.paramMap.get('id')!;
    if (this.prId) {
      this.loadPRDetails();
    } else {
      this.error = 'ID de PR inválido';
      this.isLoading = false;
    }
  }

  loadPRDetails() {
    this.isLoading = true;
    this.prService.getPRById(this.prId).subscribe({
      next: (pr) => {
        this.pr = pr;
        this.loadChanges();
      },
      error: (err) => {
        this.error = err.error?.detail || 'Error al cargar el PR';
        this.isLoading = false;
      }
    });
  }

  loadChanges() {
    this.prService.getPRChanges(this.prId).subscribe({
      next: (response) => {
        this.changes = response.changes || [];
        this.groupChangesByAction();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.error?.detail || 'Error al cargar los cambios';
        this.isLoading = false;
      }
    });
  }

  groupChangesByAction() {
    this.groupedChanges = {
      added: this.changes.filter(c => c.action === 'ADD'),
      updated: this.changes.filter(c => c.action === 'UPDATE'),
      deleted: this.changes.filter(c => c.action === 'DELETE')
    };
  }

  acceptPR() {
    this.isProcessing = true;
    this.prService.acceptPR(this.prId).subscribe({
      next: () => {
        this.pr!.status_pull = 'closed';
        this.isProcessing = false;
        this.showModalAccept = false;
        setTimeout(() => {
          this.router.navigate(['/course', 'detail', this.pr?.id_course_target.toString()]);
        }, 800);
      },
      error: (err) => {
        this.showModalAccept = false;
        alert(err.error?.detail || 'Error al aceptar el PR');
        this.isProcessing = false;
      }
    });
  }

  rejectPR() {
    this.isProcessing = true;
    this.prService.rejectPR(this.prId).subscribe({
      next: () => {
        this.pr!.status_pull = 'rejected';
        this.isProcessing = false;
        this.showModalReject = false;
        setTimeout(() => {
          this.router.navigate(['/course', 'detail', this.pr?.id_course_target.toString()]);
        }, 800);
      },
      error: (err) => {
        this.showModalReject = false;
        alert(err.error?.detail || 'Error al rechazar el PR');
        this.isProcessing = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/course', 'detail', this.pr?.id_course_target?.toString()]);
  }

  getEntityIcon(entityType: string): string {
    const icons: { [key: string]: string } = {
      'course': 'school',
      'module': 'library_books',
      'publication': 'article',
      'content': 'image'
    };
    return icons[entityType] || 'edit';
  }

  getEntityLabel(entityType: string): string {
    const labels: { [key: string]: string } = {
      'course': 'Curso',
      'module': 'Módulo',
      'publication': 'Publicación',
      'content': 'Contenido'
    };
    return labels[entityType] || entityType;
  }
}
