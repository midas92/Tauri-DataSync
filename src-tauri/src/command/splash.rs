use tauri::Manager;
use crate::command::database;

#[tauri::command]
pub fn close_splashscreen(window: tauri::Window) {
    // Close splashscreen
    if let Some(splashscreen) = window.get_window("splashscreen") {
        splashscreen.close().unwrap();
    }
    database::init();
    window.get_window("main").unwrap().show().unwrap();
}
