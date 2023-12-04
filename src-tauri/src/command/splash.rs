use tauri::Manager;
use crate::command::database;

#[tauri::command]
pub fn close_splashscreen(window: tauri::Window) {
    // Close splashscreen
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }
    database::init();
    // Show main window
    window.get_window("main").unwrap().show().unwrap();
}
