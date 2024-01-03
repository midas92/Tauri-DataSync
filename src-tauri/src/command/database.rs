use rsqlite::Database;
use serde::Deserialize;
use serde::Serialize;
use std::fs;
use std::path::Path;

#[derive(Debug, Serialize, Deserialize)]
pub struct Log {
    id: i32,
    drive: String,
    r#type: String,
    upload: String,
    create_on: String,
    path: String,
    prev_on: String,
}
#[derive(Debug, Serialize, Deserialize)]
pub struct Sync {
    id: i32,
    status: bool,
    detail: i32,
    r#type: String,
    file_path: String,
    create_on: String,
    file_id: String,
}

// Check if a database file exists, and create one if it does not.
pub fn init() {
    if !db_file_exists() {
        create_db_file();
    }
    create_table();
}
// check whether the table exists in database file
pub fn create_table() {
    let db_path = get_db_path();
    let connection = Database::open(&db_path).unwrap();
    connection
        .execute(
            "create table if not exists logs (
                id integer primary key autoincrement not null,
                create_on text not null,
                prev_on text not null,
                drive text not null,
                type text not null,
                path text not null,
                upload text not null
     )",
            (),
        )
        .unwrap();
    connection
        .execute(
            "CREATE TABLE if not exists sync (
            id        INTEGER PRIMARY KEY AUTOINCREMENT
                              NOT NULL,
            type      TEXT    NOT NULL,
            detail    INTEGER NOT NULL,
            file_id    TEXT    NOT NULL,
            file_path  TEXT    NOT NULL,
            status INTEGER NOT NULL,
            create_on TEXT    NOT NULL
        )",
            (),
        )
        .unwrap();
}

// Create the database file.
fn create_db_file() {
    let db_path = get_db_path();
    let db_dir = Path::new(&db_path).parent().unwrap();

    // If the parent directory does not exist, create it.
    if !db_dir.exists() {
        fs::create_dir_all(db_dir).unwrap();
    }

    // Create the database file.
    fs::File::create(db_path).unwrap();
}

// Check whether the database file exists.
fn db_file_exists() -> bool {
    let db_path = get_db_path();
    // println!("hello, Db _ path, {:?}", db_path);
    Path::new(&db_path).exists()
}

// Get the path where the database file should be located.
fn get_db_path() -> String {
    let home_dir = dirs::home_dir().unwrap();
    home_dir.to_str().unwrap().to_string() + "/.config/cloudsync/database.sqlite"
}

// Inset the row in log table
#[tauri::command]
pub fn insert_log(
    drive: &str,
    action_type: &str,
    create: &str,
    prev: &str,
    upload: &str,
    path: &str,
) {
    let db_path = get_db_path();
    let connection = Database::open(&db_path).unwrap();
    connection
        .execute(
            "insert into logs(create_on, prev_on, drive, type, upload, path) values(?, ?, ?, ?, ?, ?)",
            (create, prev, drive, action_type, upload, path),
        )
        .unwrap();
}

// Get the number of logs in log table
#[tauri::command]
pub fn get_log_pagination(current_page: i32) -> Vec<Log> {
    let offset = (current_page - 1) * 5;
    let db_path = get_db_path();
    let connection = Database::open(&db_path).unwrap();
    // let mut stmt = connection.prepare("SELECT * FROM log");
    let mut logs: Vec<Log> = Vec::new();
    connection
        .for_each(
            "SELECT * FROM logs ORDER BY id DESC Limit ?, 5;",
            offset,
            |id: i32,
             create_on: String,
             prev_on: String,
             drive: String,
             r#type: String,
             path: String,
             upload: String| {
                logs.push(Log {
                    id: id,
                    drive: drive,
                    r#type: r#type,
                    create_on: create_on,
                    prev_on: prev_on,
                    upload: upload,
                    path: path,
                });
            },
        )
        .unwrap();
    return logs;
}

// Get the number of total logs in log table
#[tauri::command]
pub fn get_count_log() -> i32 {
    let db_path = get_db_path();
    let connection = Database::open(&db_path).unwrap();
    // let mut stmt = connection.prepare("SELECT * FROM log");
    let count: i32 = connection.collect("select count(*) from logs", ()).unwrap();
    return count;
}

// Insert the row in sync table
#[tauri::command]
pub fn insert_sync_info(
    r#type: &str,
    detail: i32,
    file_id: &str,
    file_path: &str,
    create_on: &str,
    status: bool,
) {
    let sync_status = match status {
        true => 1,
        false => 0,
    };
    let db_path = get_db_path();
    let connection = Database::open(&db_path).unwrap();
    connection
        .execute(
            "insert into sync(type, detail, file_id, file_path, create_on, status) values(?, ?, ?, ?, ?, ?)",
            (r#type, detail, file_id, file_path, create_on, sync_status),
        )
        .unwrap();
}

// Get the last sync data in sync table
#[tauri::command]
pub fn get_sync() -> Vec<Sync> {
    let db_path = get_db_path();
    let connection = Database::open(&db_path).unwrap();
    // let mut stmt = connection.prepare("SELECT * FROM log");
    let mut data: Vec<Sync> = Vec::new();

    connection
        .for_each(
            "select * from sync ORDER BY id DESC
    LIMIT 1",
            (),
            |id: i32,
             r#type: String,
             detail: i32,
             fild_id: String,
             file_path: String,
             status: i32,
             create_on: String| {
                let state: bool = if status == 1 { true } else { false };
                data.push(Sync {
                    id: id,
                    status: state,
                    detail: detail,
                    r#type: r#type,
                    create_on: create_on,
                    file_id: fild_id,
                    file_path: file_path,
                });
            },
        )
        .unwrap();
    return data;
}

// Update create_on in sync table
#[tauri::command]
pub fn update_sync_create_on(id: i32, time: &str) {
    let db_path = get_db_path();
    let connection = Database::open(&db_path).unwrap();
    connection
        .execute(
            "UPDATE sync
            SET create_on = ?
            WHERE id = ?",
            (time, id),
        )
        .unwrap();
}
