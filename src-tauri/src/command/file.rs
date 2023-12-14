use std::{fs, time::SystemTime};

#[tauri::command]
pub fn get_file_metainfo(file_path: &str) -> SystemTime {
    let meta_data = fs::metadata(file_path).unwrap();
    meta_data.modified().unwrap()
}
