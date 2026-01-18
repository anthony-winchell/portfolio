import { Component } from '@angular/core';
import { Resume } from '../resume/resume';
import { RouterLink } from "@angular/router";
import { ProjectCard } from "../../project-card/project-card";

@Component({
  selector: 'app-home',
  imports: [Resume, RouterLink, ProjectCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
