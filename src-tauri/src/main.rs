// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod command;
mod file;
use command::splash::close_splashscreen;
fn main() {
    tauri::Builder::default()
    .plugin(tauri_plugin_sqlite::init())
    .invoke_handler(tauri::generate_handler![close_splashscreen,])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
