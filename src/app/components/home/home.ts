import { Component } from '@angular/core';
import { Projects } from '../projects/projects';
import { Resume } from '../resume/resume';

@Component({
  selector: 'app-home',
  imports: [Projects, Resume],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
