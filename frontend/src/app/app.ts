import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  // This component is used with `bootstrapApplication`, so it must be standalone
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  // property is `styleUrls` (plural)
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('frontend');
}
