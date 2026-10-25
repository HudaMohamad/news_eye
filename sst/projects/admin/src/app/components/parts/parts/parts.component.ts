import { Component, OnInit } from '@angular/core';
import { ApiService, Part } from '../../services/api.service';

@Component({
  selector: 'app-parts',
  templateUrl: './parts.component.html',
  styleUrls: ['./parts.component.css']
})
export class PartsComponent implements OnInit {
  parts: Part[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getAllParts().subscribe({
      next: (data) => {
        this.parts = data;
      },
      error: (err) => {
        console.error('Error fetching parts:', err);
      }
    });
  }
}
