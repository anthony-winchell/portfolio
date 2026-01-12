import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkActive } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLinkActive, Navbar, Footer],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
