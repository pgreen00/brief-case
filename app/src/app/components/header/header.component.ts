import { Component } from '@angular/core';
import { JeButton, JeIconButton, JeNav, JePopover } from 'jebamo-angular';

@Component({
  selector: 'bc-header',
  imports: [JeNav, JeIconButton, JePopover, JeButton],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  scaleUp() {
    const root = document.querySelector<HTMLElement>(':root')!
    const scale = window.getComputedStyle(root).getPropertyValue('--bc-scale')
    root.style.setProperty('--bc-scale', `${Number(scale.replace('px', '')) + 1}px`)
  }

  scaleDown() {
    const root = document.querySelector<HTMLElement>(':root')!
    const scale = window.getComputedStyle(root).getPropertyValue('--bc-scale')
    root.style.setProperty('--bc-scale', `${Number(scale.replace('px', '')) - 1}px`)
  }
}
