import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-mcp-plugin-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './mcp-plugin-dialog.component.html',
  styleUrl: './mcp-plugin-dialog.component.css'
})
export class McpPluginDialogComponent {
  private fb = inject(FormBuilder);
  public form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<McpPluginDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: [data?.name || '', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      title: [data?.title || '', Validators.required],
      description: [data?.description || ''],
      icon: [data?.icon || 'extension'],
      type: [data?.type || 'sse', Validators.required],
      url: [data?.config?.url || '', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]]
    });
  }

  submit() {
    if (this.form.valid) {
      const val = this.form.value;
      // Transform to match backend McpPlugin expected structure
      const plugin = {
        name: val.name,
        title: val.title,
        description: val.description,
        icon: val.icon,
        type: val.type,
        config: {
          url: val.url
        }
      };
      this.dialogRef.close(plugin);
    }
  }
}
