// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod command;
mod file;
use command::splash::close_splashscreen;
use command::database::{insert_log, get_log_pagination, get_count_log};
use file::google::{google_drive_update_metadata, google_drive_upload, google_drive_download, google_drive_search, google_drive_update_content};
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            close_splashscreen,
            insert_log,
            get_log_pagination,
            get_count_log,
            google_drive_upload,
            google_drive_update_metadata,
            google_drive_download,
            google_drive_search,
            google_drive_update_content
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
