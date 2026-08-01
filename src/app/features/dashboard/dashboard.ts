import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardService } from './services/dashboard.service';

@Component({
  selector:'app-dashboard',
  standalone:true,
  imports:[CommonModule],
  templateUrl:'./dashboard.html',
  styleUrl:'./dashboard.css'
})
export class Dashboard implements OnInit{

  private dashboardService=inject(DashboardService);

  summary=signal<any>(null);

  ngOnInit(): void {

    this.loadSummary();

  }

  loadSummary(){

    this.dashboardService.getSummary()

      .subscribe({

        next:response=>{

          this.summary.set(response.data);

        },

        error:error=>{

          console.error(error);

        }

      });

  }

}