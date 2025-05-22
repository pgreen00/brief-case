import { provideAppInitializer } from "@angular/core";
import { Menu } from "@tauri-apps/api/menu";
import { TrayIcon } from "@tauri-apps/api/tray";

export const provideSystemTray = () => provideAppInitializer(async () => {
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
})
