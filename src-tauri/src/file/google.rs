type Myresult<T> = std::result::Result<T, Error>;
use serde::{Deserialize, Serialize};
// use std::fs::File;
use std::io::Write;
use std::path::Path;
use tokio_util::codec::{FramedRead, BytesCodec};
use tokio::fs::File;
use futures_util::TryStreamExt;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Request(#[from] reqwest::Error),
}

#[derive(Serialize, Deserialize, Debug)]
struct FileMetadata {
    name: String,
    r#type: String,
    description: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct Fileinfo {
    name: String,
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
    let client = reqwest::Client::new();
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
) -> Myresult<()> {
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
            "https://www.googleapis.com/drive/v3/files/{}",
            fileid
        ))
        .bearer_auth(token)
        .header("Content-Type", "application/json");
    
    let response = request.send().await?;
    let bytes = response.bytes().await?;
    let response1 = requ1.send().await?;
    let fileinfo = response1.json::<Fileinfo>().await?;
    let mut file = std::fs::File::create(format!(
        "{}/{}",
        path, fileinfo.name
    ))?;
    file.write_all(&bytes).map_err(Into::into)
    
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
