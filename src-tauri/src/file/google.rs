use serde_json::{json, Value};
use std::collections::HashMap;
type Myresult<T> = std::result::Result<T, Error>;
use reqwest::header::CONTENT_DISPOSITION;
use reqwest::multipart::{Form, Part};
use serde::{Deserialize, Serialize};
use std::path::Path;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Request(#[from] reqwest::Error),
    #[error("{0}")]
    Custom(String),
}

#[derive(Serialize, Deserialize, Debug)]
struct FileMetadata {
    name: String,
    mime_type: String,
    description: String,
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
pub async fn google_drive_update_metadata(
    path: &str,
    token: &str,
    fileid: &str,
    mtime: &str,
) -> Myresult<serde_json::Value> {
    // Create the request and attach the file to the body
    let client = reqwest::Client::new();
    let file_name = Path::new(path).file_name().unwrap().to_str().unwrap();
    let metadata = FileMetadata {
        name: file_name.to_string(),
        mime_type: "drive/file".to_string(),
        description: format!("bodycloud-{}", mtime),
    };

    let request = client
        .patch(format!(
            "https://www.googleapis.com/drive/v3/files/{}",
            fileid
        ))
        .bearer_auth(token)
        .header("Content-Type", "application/json")
        .json(&metadata);
    // println!("hi, {}", request.to_string());
    let response = request.send().await?;
    response.json().await.map_err(Into::into)
}

#[tauri::command]
pub async fn google_drive_download(
    path: &str,
    token: &str,
    fileid: &str,
) -> Myresult<serde_json::Value> {
    // Create the request and attach the file to the body
    let client = reqwest::Client::new();

    let request = client
        .patch(format!(
            "https://drive.google.com/uc?export=download&id={}",
            fileid
        ))
        .bearer_auth(token)
        .header("Content-Type", "application/json");

    // println!("hi, {}", request.to_string());
    let response = request.send().await?;
    let result_content = response
        .headers();
    println!("this is result {:?}", response);
    // let content_disposition = match result_content {
    //     Ok(content) => content.to_string(),
    //     Err(err) => {
    //         eprintln!("Error: {}", err);
    //         "".to_string()
    //     }
    // };
    // let filename = content_disposition
    //     .split(';')
    //     .find(|part| part.trim().starts_with("filename="))
    //     .unwrap()
    //     .trim()
    //     .trim_start_matches("filename=")
    //     .trim_matches('"');
    // println!("this is file {}",filename);
    response.json().await.map_err(Into::into)
}
#[tauri::command]
pub async fn google_drive_search(
    token: &str,
) -> Myresult<serde_json::Value> {
    // Create the request and attach the file to the body
    let client = reqwest::Client::new();

    let request = client
        .get( format!("https://www.googleapis.com/drive/v3/files?q=fullText+contains+'{}'", "bodycloud")
        )
        .bearer_auth(token)
        .header("Content-Type", "application/json");
    let response = request.send().await?;
    response.json().await.map_err(Into::into)
}
