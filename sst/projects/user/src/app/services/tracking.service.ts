import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TrackingService {

    private apiUrl = 'http://localhost/news/backend/record_visit.php';

    constructor(private http: HttpClient) { }

    /**
     * Records a visit to a section or a specific post
     * @param section Name of the news section (e.g., 'Sports', 'Economy')
     * @param postId ID of the specific news post (optional)
     */
    logVisit(section: string, postId: number | null = null): void {
        const payload = {
            section_name: section,
            post_id: postId
        };

        this.http.post(this.apiUrl, payload).subscribe({
            error: (err) => console.error('Tracking failed:', err)
        });
    }
}
