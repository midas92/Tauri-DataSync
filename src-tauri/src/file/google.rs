use serde_json::{json, Value};
use std::collections::HashMap;
type Myresult<T> = std::result::Result<T, Error>;
use reqwest::header::CONTENT_DISPOSITION;
use reqwest::multipart::{Form, Part};
use serde::{Deserialize, Serialize};
// use std::fs::File;
use std::io::Write;
use std::path::Path;
use tokio_util::codec::{FramedRead, BytesCodec};
use tokio::fs::File;
use tauri::Runtime;
use futures_util::TryStreamExt;

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
    r#type: String,
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
    let file = File::open(path).await?;

    // Create the request and attach the file to the body
    let client = reqwest::Client::new();
    // let file_bytes = tokio::fs::read(path).await?;
    // let file_name = Path::new(path).file_name().unwrap().to_str().unwrap();
    // let part = Part::bytes(file_bytes);
    // let form: Form = Form::new().part("file", part);

    let filetobody = filetobody(file);
    let request = client
        .post("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart")
        .bearer_auth(token)
        .header("Content-Type", "application/json")
        .body(filetobody);
    let response = request.send().await?;
    response.json().await.map_err(Into::into)
}

fn filetobody(file: File) -> reqwest::Body {
    let stream = FramedRead::new(file, BytesCodec::new()).map_ok(|r| r.freeze());
    reqwest::Body::wrap_stream(
        stream,
    )
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
        r#type: "application/json".to_string(),
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
        .get(format!(
            "https://www.googleapis.com/drive/v3/files/{}?alt=media",
            fileid
        ))
        .bearer_auth(token);
    let requ1 = client
        .clone()
        .get(format!(
            "https://drive.google.com/uc?export=download&id={}",
            fileid
        ))
        .bearer_auth(token)
        .header("Content-Type", "application/json");
    
    let response = request.send().await?;
    println!("1");
    let bytes = response.bytes().await?;
    println!("2");
    let mut file = std::fs::File::create(format!(
        "{}/sd.db",
        path
    ))?;
    println!("3");
    let writeresult = file.write_all(&bytes);
    println!("write result {:?}", writeresult);
    requ1.send().await?.json().await.map_err(Into::into)
}

#[tauri::command]
pub async fn google_drive_search(token: &str) -> Myresult<serde_json::Value> {
    // Create the request and attach the file to the body
    let client = reqwest::Client::new();

    let request = client
        .get(format!(
            "https://www.googleapis.com/drive/v3/files?q=fullText+contains+'{}'",
            "bodycloud"
        ))
        .bearer_auth(token)
        .header("Content-Type", "application/json");
    let response = request.send().await?;
    response.json().await.map_err(Into::into)
}
