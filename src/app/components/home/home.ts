import { Component } from '@angular/core';
import { Projects } from '../projects/projects';
import { Resume } from '../resume/resume';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [Projects, Resume, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
