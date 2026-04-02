import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-task-ui',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './task-ui.html',
  styleUrl: './task-ui.css',
})
export class TaskUI {

}
