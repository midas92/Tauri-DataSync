use serde_json::{json, Value};
use std::collections::HashMap;
type Myresult<T> = std::result::Result<T, Error>;
use reqwest::multipart::{Form, Part};
use std::path::Path;
use serde::{Serialize, Deserialize};

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Request(#[from] reqwest::Error),
    #[error("{0}")]
    Custom(String),
}

#[derive(Serialize,Deserialize, Debug)]
struct FileMetadata {
    name: String,
    mime_type: String,
}

impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}



#[tauri::command]
pub async fn google_drive_upload(path: &str, token: &str) -> Myresult<serde_json::Value> {
    // let file = File::open(file_path).await?;

    // Create the request and attach the file to the body
    let client = reqwest::Client::new();
    let file_bytes = tokio::fs::read(path).await?;
    let file_name = Path::new(path).file_name().unwrap().to_str().unwrap();
    let part = Part::bytes(file_bytes).file_name(file_name.to_string());
    let json_value: Value = json!({"name": file_name.to_string()}).into();
    let metadata_part = Part::bytes(json_value.to_string().as_bytes().to_vec());
    let form: Form = Form::new().part("file", part);
    // .part("metadata", metadata_part);

    let request = client
        .post("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart")
        .bearer_auth(token)
        .header("Content-Type", "application/json")
        .multipart(form);
    // println!("hi, {}", request.to_string());
    let response = request.send().await?;
    response.json().await.map_err(Into::into)
}

#[tauri::command]
pub async fn google_drive_update_metadata(path: &str, token: &str,fileid:&str) -> Myresult<serde_json::Value> {
    // let file = File::open(file_path).await?;

    // Create the request and attach the file to the body
    let client = reqwest::Client::new();
    let file_name = Path::new(path).file_name().unwrap().to_str().unwrap();
    let metadata =FileMetadata {
        name : file_name.to_string(),
        mime_type: "drive/file".to_string(),
    };

    let request = client
        .patch(format!("https://www.googleapis.com/drive/v3/files/{}", fileid))
        .bearer_auth(token)
        .header("Content-Type", "application/json")
        .json(&metadata);
    // println!("hi, {}", request.to_string());
    let response = request.send().await?;
    response.json().await.map_err(Into::into)
}
