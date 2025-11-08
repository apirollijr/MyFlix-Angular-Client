import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-genre-info',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './genre-info.component.html',
  styleUrl: './genre-info.component.scss'
})
export class GenreInfoComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      genre: any;
    },
    public dialogRef: MatDialogRef<GenreInfoComponent>
  ) { }

}
