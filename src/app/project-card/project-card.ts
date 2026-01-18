import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-project-card',
  imports: [],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCard {
  @Input() name! : string;
  @Input() description! : string;
  @Input() technologies! : string[];
  @Input() github?: string;
  @Input() live?: string;

}
