import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StadiumOwnerStadiumsService } from '../../services/stadium-owner-stadiums/stadium-owner-stadiums.service';
import { Stadium } from '../../models/stadium';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-stadiums',
  templateUrl: './stadiums.component.html',
  styleUrls: ['./stadiums.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CurrencyPipe]
})
export class StadiumsComponent implements OnInit {
  stadiums: Stadium[] = [];
  editedStadium: Stadium = { id: 0, name: '', address: '', google_maps_link: '', facilities: '', images: [], schedule: [] };
  originalSchedule: any[] = []; // Store original schedule to preserve sportCost
  showEdit = false;
  weekdayOptions: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  uploadProgress: number = 0;
  uploadError: string | null = null;

  constructor(
    private stadiumService: StadiumOwnerStadiumsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    console.log('StadiumsComponent initialized');
  }

  ngOnInit() {
    console.log('ngOnInit called');
    this.fetchStadiums();
  }

  getAllImages(): string[] {
    const allImages: string[] = [];
    this.stadiums.forEach(stadium => {
      if (Array.isArray(stadium.images) && stadium.images.length > 0) {
        const validImages = stadium.images.filter(img => this.isValidImagePath(img));
        console.log(`Valid images for ${stadium.name}:`, validImages);
        allImages.push(...validImages);
      } else {
        console.log(`No images for ${stadium.name}:`, stadium.images);
      }
    });
    console.log('Total images collected:', allImages);
    return allImages;
  }

  private isValidImagePath(img: string): boolean {
    if (!img || typeof img !== 'string') {
      console.warn('Invalid image path:', img);
      return false;
    }
    const isValid = img.startsWith('https://') || img.startsWith('http://');
    if (!isValid) {
      console.warn('Skipping invalid image path:', img);
    }
    return isValid;
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    console.error('Image failed to load:', {
      src: imgElement.src,
      error: event
    });
    imgElement.classList.add('image-placeholder');
    imgElement.src = '';
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadProgress = 0;
      this.uploadError = null;
      const files = Array.from(input.files);
      let completed = 0;
      files.forEach(file => {
        this.stadiumService.uploadImage(file).subscribe({
          next: (url) => {
            this.editedStadium.images = [...this.editedStadium.images, url];
            completed++;
            this.uploadProgress = (completed / files.length) * 100;
            console.log('Uploaded image URL:', url);
            console.log('Updated editedStadium.images:', this.editedStadium.images);
            this.cdr.detectChanges();
          },
          error: (error) => {
            this.uploadError = error.message;
            this.uploadProgress = 0;
            console.error('Upload error:', error);
            this.cdr.detectChanges();
          }
        });
      });
    }
  }

  removeImage(index: number) {
    console.log('Removing image at index:', index);
    this.editedStadium.images.splice(index, 1);
    console.log('Updated editedStadium.images:', this.editedStadium.images);
    this.cdr.detectChanges();
  }

  fetchStadiums() {
    console.log('fetchStadiums called');
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to view stadiums.');
      this.router.navigate(['/login']);
      return;
    }
    this.stadiumService.getStadiums(token).subscribe({
      next: (data) => {
        this.stadiums = data;
        console.log('Fetched stadiums with schedule:', JSON.stringify(this.stadiums, null, 2));
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching stadiums:', error);
        alert(`Error fetching stadiums: ${error.message}`);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  navigateToAddStadium() {
    console.log('Navigating to add-stadium');
    this.router.navigate(['/stadium-owner/add-stadium']);
  }

  enableEdit(stadium: Stadium) {
    console.log('enableEdit called with stadium:', JSON.stringify(stadium, null, 2));
    if (!stadium) {
      console.error('Stadium is undefined or null');
      return;
    }
    this.editedStadium = {
      ...stadium,
      schedule: Array.isArray(stadium.schedule) ? stadium.schedule.map(s => {
        const sportCost = typeof s.sportCost === 'number' && !isNaN(s.sportCost) && s.sportCost >= 0 ? s.sportCost : 0;
        console.log(`Processing schedule for ${s.sport || 'unknown sport'}: original sportCost = ${s.sportCost}, assigned sportCost = ${sportCost}`);
        return {
          sport: s.sport || '',
          day: s.day || '',
          fromTime: s.fromTime || '',
          toTime: s.toTime || '',
          maxPlayers: s.maxPlayers || 0,
          sportCost: s.sportCost ?? 0
        };
      }) : [],
      images: Array.isArray(stadium.images) ? [...stadium.images] : []
    };
    this.originalSchedule = JSON.parse(JSON.stringify(stadium.schedule || [])); // Deep copy original schedule
    console.log('Original schedule stored:', JSON.stringify(this.originalSchedule, null, 2));
    console.log('Edited stadium set:', JSON.stringify(this.editedStadium, null, 2));
    this.showEdit = true;
    this.cdr.detectChanges();
  }

  cancelEdit() {
    console.log('cancelEdit called');
    this.showEdit = false;
    this.editedStadium = { id: 0, name: '', address: '', google_maps_link: '', facilities: '', images: [], schedule: [] };
    this.originalSchedule = [];
    this.cdr.detectChanges();
  }

  saveEdit() {
    console.log('Saving edit with editedStadium:', JSON.stringify(this.editedStadium, null, 2));
    console.log('Original schedule:', JSON.stringify(this.originalSchedule, null, 2));
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to save changes.');
      this.router.navigate(['/login']);
      return;
    }
    if (!this.editedStadium.name || !this.editedStadium.address || !this.editedStadium.google_maps_link) {
      alert('Name, Address, and Google Maps Link are required.');
      return;
    }
    if (this.editedStadium.schedule && this.editedStadium.schedule.length > 0) {
      for (const schedule of this.editedStadium.schedule) {
        if (!schedule.sport) {
          alert('Sport is required for all schedules.');
          return;
        }
        if (schedule.day && !this.weekdayOptions.includes(schedule.day)) {
          alert(`Invalid day: ${schedule.day}. Choose a valid day of the week.`);
          return;
        }
        if (schedule.fromTime && schedule.toTime && schedule.fromTime >= schedule.toTime) {
          alert(`Start time must be earlier than end time for ${schedule.sport || 'schedule'}.`);
          return;
        }
        const parsedCost = Number(schedule.sportCost);
if (isNaN(parsedCost) || parsedCost < 0) {
  alert(`Cost per player for ${schedule.sport} must be a non-negative number.`);
  return;
}
schedule.sportCost = parsedCost;

      }
      // Preserve original sportCost for unchanged schedules
      this.editedStadium.schedule = this.editedStadium.schedule.map((sched, i) => {
        // Find matching original schedule by sport, day, times, and maxPlayers
        
        const original = this.originalSchedule.find(os => 
          os.sport === sched.sport &&
          os.day === sched.day &&
          os.fromTime === sched.fromTime &&
          os.toTime === sched.toTime &&
          os.maxPlayers === sched.maxPlayers
        );
        if (original && typeof original.sportCost === 'number' && !isNaN(original.sportCost) && original.sportCost > 0) {
          // Only preserve if current sportCost is 0 or unchanged
          const currentSportCost = typeof sched.sportCost === 'number' && !isNaN(sched.sportCost) ? sched.sportCost : 0;
          if (currentSportCost === 0 || currentSportCost === original.sportCost) {
            console.log(`Preserving original sportCost for ${sched.sport}: ${original.sportCost} (current: ${currentSportCost})`);
            return { ...sched, sportCost: original.sportCost };
          }
        }
        console.log(`Using current sportCost for ${sched.sport}: ${sched.sportCost}`);
        return sched;
      });
    }
    console.log('Final editedStadium before update:', JSON.stringify(this.editedStadium, null, 2));
    this.stadiumService.updateStadium(this.editedStadium, token).subscribe({
      next: (response) => {
        console.log('Update response:', response);
        const index = this.stadiums.findIndex(s => s.id === this.editedStadium.id);
        if (index !== -1) {
          this.stadiums[index] = { ...this.editedStadium };
        }
        this.showEdit = false;
        this.originalSchedule = [];
        alert('Stadium updated successfully!');
        this.fetchStadiums();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error updating stadium:', error);
        alert(`Error updating stadium: ${error.message}`);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  deleteStadium(id: number) {
    console.log('deleteStadium called with id:', id);
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to delete stadium.');
      this.router.navigate(['/login']);
      return;
    }
    if (confirm('Are you sure you want to delete this stadium?')) {
      this.stadiumService.deleteStadium(id, token).subscribe({
        next: () => {
          this.stadiums = this.stadiums.filter(s => s.id !== id);
          alert('Stadium deleted successfully!');
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error deleting stadium:', error);
          alert(`Error deleting stadium: ${error.message}`);
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
    }
  }

  addSchedule() {
    console.log('addSchedule called');
    this.editedStadium.schedule = this.editedStadium.schedule || [];
    this.editedStadium.schedule.push({
      sport: '',
      day: '',
      fromTime: '',
      toTime: '',
      maxPlayers: 0,
      sportCost: 0
    });
    this.cdr.detectChanges();
  }

  removeSchedule(index: number) {
    console.log('removeSchedule called with index:', index);
    this.editedStadium.schedule.splice(index, 1);
    this.cdr.detectChanges();
  }
}