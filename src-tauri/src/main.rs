// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod command;
mod file;
use command::database::{
    get_count_log, get_log_pagination, get_sync, insert_log, insert_sync_info,
    update_sync_create_on,
};
use command::file::get_file_metainfo;
use command::splash::close_splashscreen;
use file::google::{
    google_drive_download, google_drive_search, google_drive_update_content,
    google_drive_update_metadata, google_drive_upload,
};
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_oauth::init())
        .invoke_handler(tauri::generate_handler![
            close_splashscreen,
            get_file_metainfo,
            insert_log,
            get_log_pagination,
            get_count_log,
            insert_sync_info,
            get_sync,
            update_sync_create_on,
            google_drive_upload,
            google_drive_update_metadata,
            google_drive_download,
            google_drive_search,
            google_drive_update_content
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
