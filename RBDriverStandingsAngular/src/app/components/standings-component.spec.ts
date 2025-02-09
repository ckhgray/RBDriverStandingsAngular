import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Driver } from '../../types/driver';
import { DriverStandingsService } from '../services/driver-standings.service';
import { StandingsComponent } from './standings-component';

describe('StandingsComponent', () => {
  let component: StandingsComponent;
  let fixture: ComponentFixture<StandingsComponent>;
  let driverStandingsService: jasmine.SpyObj<DriverStandingsService>;

  const mockDrivers: Driver[] = [
    { 
      driver_uuid: 'uuid-1',
      first_name: 'Lewis', 
      last_name: 'Hamilton', 
      driver_country_code: 'GB',
      team_uuid: 'team-uuid-1',
      season_team_name: 'Mercedes', 
      season_points: 100 
    },
    { 
      driver_uuid: 'uuid-2',
      first_name: 'Max', 
      last_name: 'Verstappen', 
      driver_country_code: 'NL',
      team_uuid: 'team-uuid-2',
      season_team_name: 'Red Bull', 
      season_points: 150 
    },
    { 
      driver_uuid: 'uuid-3',
      first_name: 'Charles', 
      last_name: 'Leclerc', 
      driver_country_code: 'MC',
      team_uuid: 'team-uuid-3',
      season_team_name: 'Ferrari', 
      season_points: 120 
    },
  ]

  beforeEach(async () => {
    const driverStandingsServiceMock = jasmine.createSpyObj('DriverStandingsService', ['getDriverStandings']);
    driverStandingsServiceMock.getDriverStandings.and.returnValue(of(mockDrivers));

    await TestBed.configureTestingModule({
      imports: [StandingsComponent],
      providers: [
        { provide: DriverStandingsService, useValue: driverStandingsServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StandingsComponent);
    component = fixture.componentInstance;
    driverStandingsService = TestBed.inject(DriverStandingsService) as jasmine.SpyObj<DriverStandingsService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default season and load standings', () => {
    expect(driverStandingsService.getDriverStandings).toHaveBeenCalledWith(2024);
    expect(component.dataSource).toEqual(mockDrivers);
    expect(component.originalData).toEqual(mockDrivers);
  });

  it('should calculate driver positions correctly based on season_points', () => {
    const maxDriver = component.originalData.find(d => d.first_name === 'Max');
    const charlesDriver = component.originalData.find(d => d.first_name === 'Charles');
    const lewisDriver = component.originalData.find(d => d.first_name === 'Lewis');

    expect(maxDriver?.position).toEqual(1);
    expect(charlesDriver?.position).toEqual(2);
    expect(lewisDriver?.position).toEqual(3);
  });

  it('should sort drivers by position descending then ascending when toggled', () => {
    component.sortMap['position'] = 'asc';

    component.sortData('position');
    const positionsDesc = component.dataSource.map(driver => driver.position);
    expect(positionsDesc).toEqual([3, 2, 1]);

    component.sortData('position');
    const positionsAsc = component.dataSource.map(driver => driver.position);
    expect(positionsAsc).toEqual([1, 2, 3]);
  });

  it('should generate unique team and nationality options', () => {
    expect(component.teamOptions).toEqual(['Mercedes', 'Red Bull', 'Ferrari']);
    expect(component.nationalityOptions).toEqual(['GB', 'NL', 'MC']);
  });

  it('should sort by points descending initially', () => {
    component.sortMap['season_points'] = 'desc';
    component.applyFilters();
  
    const points = component.dataSource.map(d => d.season_points);
    expect(points).toEqual([150, 120, 100]);
  });

  it('should toggle sort direction when sorting', () => {
    component.sortData('season_points');
    const points = component.dataSource.map(d => d.season_points);
    expect(points).toEqual([100, 120, 150]);
    expect(component.sortMap['season_points']).toBe('asc');
  });

  it('should filter by team correctly', () => {
    component.toggleFilter('team', 'Mercedes');
    expect(component.dataSource.length).toBe(1);
    expect(component.dataSource[0].season_team_name).toBe('Mercedes');
  });

  it('should filter by nationality correctly', () => {
    component.toggleFilter('nationality', 'NL');
    expect(component.dataSource.length).toBe(1);
    expect(component.dataSource[0].driver_country_code).toBe('NL');
  });

  it('should combine multiple filters', () => {
    component.toggleFilter('team', 'Red Bull');
    component.toggleFilter('nationality', 'NL');
    expect(component.dataSource.length).toBe(1);
    expect(component.dataSource[0].first_name).toBe('Max');
  });

  it('should reset other sorts when sorting new column', () => {
    component.sortData('name');
    expect(component.sortMap['name']).toBe('asc');
    expect(component.sortMap['position']).toBeNull();
  });

  it('should handle empty data gracefully', () => {
    driverStandingsService.getDriverStandings.and.returnValue(of([]));
    component.season = 2023;
    component.getStandingsForSeason();
    expect(component.dataSource).toEqual([]);
    expect(component.teamOptions).toEqual([]);
  });

  it('should update standings when season changes', () => {
    component.season = 2023;
    component.getStandingsForSeason();
    expect(driverStandingsService.getDriverStandings).toHaveBeenCalledWith(2023);
  });

  it('should toggle filter values correctly', () => {
    component.toggleFilter('team', 'Mercedes');
    expect(component.teamFilter).toEqual(['Mercedes']);
    component.toggleFilter('team', 'Mercedes');
    expect(component.teamFilter).toEqual([]);
  });
});