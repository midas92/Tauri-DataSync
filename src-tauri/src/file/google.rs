type Myresult<T> = std::result::Result<T, Error>;
use serde::{Deserialize, Serialize};
// use std::fs::File;
use futures_util::TryStreamExt;
use std::path::Path;
use tokio::fs::File;
use tokio_util::codec::{BytesCodec, FramedRead};

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
    reqwest::Body::wrap_stream(stream)
}

#[tauri::command]
pub async fn google_drive_update_content(
    path: &str,
    fileid: &str,
    token: &str,
) -> Myresult<serde_json::Value> {
    let file = File::open(path).await?;
    let client = reqwest::Client::new();
    let filetobody = filetobody(file);
    let request = client
        .patch(format!(
            "https://www.googleapis.com/upload/drive/v3/files/{}?uploadType=multipart",
            fileid
        ))
        .bearer_auth(token)
        .header("Content-Type", "application/json")
        .body(filetobody);
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
        name: format!("{}--{}", file_name, mtime),
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
    filepath: bool,   // check whether directory path or filepath is
) -> Myresult<()> {
    // Create the request and attach the file to the body
    let client = reqwest::Client::new();

    let request = client
        .get(format!(
            "https://www.googleapis.com/drive/v3/files/{}?alt=media",
            fileid
        ))
        .bearer_auth(token);
    let response = request.send().await?;
    let bytes = response.bytes().await?;
    if filepath {
        std::fs::write(path.to_string(), &bytes).map_err(Into::into)
    } else {
        let requ1 = client
            .clone()
            .get(format!(
                "https://www.googleapis.com/drive/v3/files/{}",
                fileid
            ))
            .bearer_auth(token)
            .header("Content-Type", "application/json");
        let response1 = requ1.send().await?;
        let fileinfo = response1.json::<Fileinfo>().await?;
        let filename = fileinfo.name.split_once("--").unwrap();
        std::fs::write(format!("{}/{}", path, filename.0), &bytes).map_err(Into::into)
    }
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
