import { Component, OnInit } from '@angular/core';
import { DriverStandingsService } from '../services/driver-standings.service';
import { Driver } from '../../types/driver';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-standings',
  templateUrl: './standings-component.html',
  styleUrls: ['./standings-component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class StandingsComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'driver_country_code','season_team_name', 'season_points'];
  public dataSource: Driver[] = [];
  public originalData: Driver[] = [];
  public isLoading: boolean = false;
  public season: number = 2024;
  public teamFilter: string[] = []; 
  public nationalityFilter: string[] = []; 
  public teamOptions: string[] = [];
  public nationalityOptions: string[] = [];

  sortMap: { [key: string]: string | null } = {
    name: null,
    position: null,
    season_team_name: null
  };

  constructor(private driverStandingsService: DriverStandingsService) {}

  ngOnInit(): void {
    this.getStandingsForSeason();
    this.sortMap['position'] = 'asc';
  }

  getStandingsForSeason() {
    this.isLoading = true;
    this.driverStandingsService.getDriverStandings(this.season)
      .subscribe((drivers: Driver[]) => {
        this.originalData = drivers;
        this.dataSource = [...this.originalData];
        this.teamOptions = this.getUniqueValues('season_team_name');
        this.nationalityOptions = this.getUniqueValues('driver_country_code');

        const sortedByPoints = [...drivers].sort((a, b) => b.season_points - a.season_points);
        sortedByPoints.forEach((driver, index) => {
          driver.position = index + 1;
        });

        this.isLoading = false;
      });
  }

  getUniqueValues(property: keyof Driver): string[] {
    return [...new Set(this.originalData.map(d => d[property]).filter(Boolean))] as string[];
  }

  sortData(column: string) {
    const currentSort = this.sortMap[column];
    this.resetSortColumns(column);
    
    this.sortMap[column] = currentSort === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  private resetSortColumns(excludeColumn: string) {
    Object.keys(this.sortMap).forEach(key => {
      if (key !== excludeColumn) this.sortMap[key] = null;
    });
  }

  toggleFilter(type: 'team' | 'nationality', value: string) {
    if (type === 'team') {
      this.toggleArrayValue(this.teamFilter, value);
    } else if (type === 'nationality') {
      this.toggleArrayValue(this.nationalityFilter, value);
    }
    this.applyFilters();
  }

  private toggleArrayValue(array: string[], value: string) {
    const index = array.indexOf(value);
    if (index === -1) {
      array.push(value); 
    } else {
      array.splice(index, 1);
    }
  }

  applyFilters() {
    let filteredData = [...this.originalData];

    if (this.teamFilter.length > 0) {
      filteredData = filteredData.filter(d => this.teamFilter.includes(d.season_team_name));
    }

    if (this.nationalityFilter.length > 0) {
      filteredData = filteredData.filter(d => this.nationalityFilter.includes(d.driver_country_code));
    }

    const [activeColumn, sortDirection] = Object.entries(this.sortMap)
      .find(([_, direction]) => direction !== null) || [null, null];

    if (activeColumn && sortDirection) {
      filteredData = this.sortByColumn(filteredData, activeColumn, sortDirection);
    }

    this.dataSource = filteredData;
  }

  private sortByColumn(data: Driver[], column: string, direction: string): Driver[] {
    return data.sort((a, b) => {
      let aValue: any, bValue: any;
  
      if (column === 'name') {
        aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
        bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
      } else {
        aValue = a[column as keyof Driver];
        bValue = b[column as keyof Driver];
      }
  
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
  
      const compareStringA = String(aValue).toLowerCase();
      const compareStringB = String(bValue).toLowerCase();
      
      return direction === 'asc' 
        ? compareStringA.localeCompare(compareStringB)
        : compareStringB.localeCompare(compareStringA);
    });
  }

  getHeaderName(column: string): string {
    const headerMap: { [key: string]: string } = {
      'position': 'Position',
      'driver_country_code': 'Nationality',
      'name': 'Name',
      'season_team_name': 'Team',
      'season_points': 'Points'
    };
    return headerMap[column] || column;
  }
}