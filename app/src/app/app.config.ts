import { ApplicationConfig, provideAppInitializer, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideJebamo } from 'jebamo-angular';
import { TrayIcon } from '@tauri-apps/api/tray';
import { Menu } from '@tauri-apps/api/menu';

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    provideRouter(routes, withViewTransitions(), withComponentInputBinding()),
    provideJebamo(),
    /*provideAppInitializer(async () => {
      const menu = await Menu.new({
        items: [
          {
            id: 'quit',
            text: 'Quit',
          },
        ]
      });
      await TrayIcon.new({
        menu,
        menuOnLeftClick: true,
        tooltip: 'awesome tray tooltip',
        icon: 'icons/icon.png'
      });
    })*/
  ]
};
