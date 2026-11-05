use std::io::Read;
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter};
use base64::Engine;

const BRIDGE_HTML: &str = r#"<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="referrer" content="no-referrer"><title>OrdiFi Studio Â· Xverse Import</title>
<style>body{font:16px system-ui;background:#10141d;color:#f4f4f5;max-width:720px;margin:70px auto;padding:24px}button{border:0;border-radius:9px;padding:14px 20px;background:#f7931a;color:#111;font-weight:700;cursor:pointer}button:disabled{opacity:.5}p{line-height:1.6}#status{white-space:pre-wrap;background:#1b2430;border-radius:10px;padding:18px}</style>
</head><body><h1>OrdiFi Studio Â· Xverse</h1><p>Temporary, read-only wallet import. No transaction or signature requests. Your collection will appear in Studio for review.</p><button id="import">Read Xverse Wallet</button><p id="status">Ready. Make sure Xverse is enabled in this Chrome profile.</p><script src="/bridge.js" defer></script></body></html>"#;
const BRIDGE_JS: &str = include_str!(concat!(env!("CARGO_MANIFEST_DIR"), "/wallet-bridge/bridge.js"));

#[tauri::command]
fn start_wallet_import(app: AppHandle) -> Result<String, String> {
    // Loopback-only, session-specific, single-use HTTP endpoint.
    let server = tiny_http::Server::http("127.0.0.1:0")
        .map_err(|e| format!("Cannot open local bridge: {e}"))?;
    let port = server.server_addr().to_ip()
        .ok_or_else(|| "Unable to resolve bridge address".to_string())?.port();
    let token = uuid::Uuid::new_v4().to_string();
    let url = format!("http://127.0.0.1:{port}/#{}", token);
    let origin = format!("http://127.0.0.1:{port}");

    // Open the wallet's browser explicitly; Tauri itself uses WebView2.
    #[cfg(target_os = "windows")]
    {
        use std::path::PathBuf;
        let mut candidates = Vec::<PathBuf>::new();
        if let Ok(path) = std::env::var("PROGRAMFILES") {
            candidates.push(PathBuf::from(path).join("Google/Chrome/Application/chrome.exe"));
        }
        if let Ok(path) = std::env::var("PROGRAMFILES(X86)") {
            candidates.push(PathBuf::from(path).join("Google/Chrome/Application/chrome.exe"));
        }
        if let Ok(path) = std::env::var("LOCALAPPDATA") {
            candidates.push(PathBuf::from(path).join("Google/Chrome/Application/chrome.exe"));
        }
        let chrome = candidates.into_iter().find(|p| p.is_file())
            .ok_or_else(|| "Google Chrome was not found. Install Chrome with Xverse first.".to_string())?;
        std::process::Command::new(chrome).arg(&url).spawn()
            .map_err(|e| format!("Failed to launch Chrome: {e}"))?;
    }
    #[cfg(not(target_os = "windows"))]
    {
        return Err("The first bridge version supports Windows Chrome only.".into());
    }

    std::thread::spawn(move || {
        let deadline = Instant::now() + Duration::from_secs(300);
        while Instant::now() < deadline {
            let maybe_request = match server.recv_timeout(Duration::from_millis(200)) {
                Ok(value) => value,
                Err(_) => break,
            };
            let Some(mut request) = maybe_request else { continue };
            let path = request.url().split('?').next().unwrap_or("");
            let method = request.method().as_str();
            let header = |key: &str| -> String {
                request.headers().iter()
                    .find(|h| h.field.as_str().as_str().eq_ignore_ascii_case(key))
                    .map(|h| h.value.as_str().to_string())
                    .unwrap_or_default()
            };
            let host_ok = header("host") == format!("127.0.0.1:{port}");
            if !host_ok {
                let _ = request.respond(tiny_http::Response::from_string("Bad host")
                    .with_status_code(403));
                continue;
            }
            if method == "GET" && path == "/" {
                let response = tiny_http::Response::from_string(BRIDGE_HTML)
                    .with_header(tiny_http::Header::from_bytes("Content-Type", "text/html; charset=utf-8").unwrap())
                    .with_header(tiny_http::Header::from_bytes("Referrer-Policy", "no-referrer").unwrap())
                    .with_header(tiny_http::Header::from_bytes("Cache-Control", "no-store").unwrap())
                    .with_header(tiny_http::Header::from_bytes("X-Content-Type-Options", "nosniff").unwrap())
                    .with_header(tiny_http::Header::from_bytes("Content-Security-Policy", "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'none'").unwrap());
                let _ = request.respond(response);
            } else if method == "GET" && path == "/bridge.js" {
                let response = tiny_http::Response::from_string(BRIDGE_JS)
                    .with_header(tiny_http::Header::from_bytes("Content-Type", "text/javascript; charset=utf-8").unwrap())
                    .with_header(tiny_http::Header::from_bytes("Cache-Control", "no-store").unwrap())
                    .with_header(tiny_http::Header::from_bytes("X-Content-Type-Options", "nosniff").unwrap());
                let _ = request.respond(response);
            } else if method == "POST" && path == "/import" {
                // Reject cross-origin requests, untrusted HTTP clients and huge payloads.
                let authorized = header("origin") == origin
                    && header("x-ordifi-token") == token
                    && header("content-type").to_ascii_lowercase().starts_with("application/json");
                let length = header("content-length").parse::<usize>().unwrap_or(0);
                if !authorized || length == 0 || length > 20 * 1024 * 1024 {
                    let _ = request.respond(tiny_http::Response::from_string("Not authorized")
                        .with_status_code(403));
                    continue;
                }
                let mut body = Vec::with_capacity(length);
                let valid_body = request.as_reader().take((length + 1) as u64)
                    .read_to_end(&mut body).is_ok() && body.len() == length;
                let parsed = if valid_body {
                    serde_json::from_slice::<serde_json::Value>(&body).ok()
                } else { None };
                if let Some(payload) = parsed {
                    let structurally_valid = payload.get("schema").and_then(|v| v.as_str()) == Some("ordifi-xverse-import")
                        && payload.get("version").and_then(|v| v.as_u64()) == Some(1)
                        && payload.get("blockchain").and_then(|v| v.as_str()) == Some("bitcoin")
                        && payload.get("inscriptions").and_then(|v| v.as_array()).is_some();
                    if structurally_valid && app.emit("ordifi-wallet-import", payload).is_ok() {
                        let _ = request.respond(tiny_http::Response::from_string("Imported into Studio preview")
                            .with_header(tiny_http::Header::from_bytes("Cache-Control", "no-store").unwrap()));
                        break; // one-use token; stop accepting connections
                    }
                }
                let _ = request.respond(tiny_http::Response::from_string("Invalid import data")
                    .with_status_code(400));
            } else {
                let _ = request.respond(tiny_http::Response::from_string("Not found")
                    .with_status_code(404));
            }
        }
    });
    Ok("Chrome opened. Approve the read-only Xverse connection.".into())
}


// Read RAW inscription content by ID only. No URL from wallet response is trusted.
// Configure ORDIFI_CONTENT_BASE_URL to point to a trusted /content endpoint.
// This is an external content source, NOT a Webapp StudioSync or DraftState import.
#[tauri::command]
async fn fetch_ordinal_content(inscription_id: String) -> Result<String, String> {
    let (txid, index) = inscription_id.split_once('i')
        .ok_or_else(|| "Invalid inscription ID".to_string())?;
    if txid.len() != 64 || !txid.bytes().all(|b| b.is_ascii_hexdigit())
        || index.is_empty() || !index.bytes().all(|b| b.is_ascii_digit()) || index.len() > 12 {
        return Err("Invalid inscription ID".into());
    }

    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(30))
        .redirect(reqwest::redirect::Policy::none())
        .build().map_err(|e| e.to_string())?;

    let mut bases = Vec::<String>::new();
    if let Ok(configured) = std::env::var("ORDIFI_CONTENT_BASE_URL") {
        let configured = configured.trim().trim_end_matches('/');
        // Only explicitly configured HTTPS endpoints (or a loopback development server).
        let approved = configured.starts_with("https://")
            || configured.starts_with("http://127.0.0.1:")
            || configured.starts_with("http://localhost:");
        if approved && configured.len() < 250 && !configured.contains('?')
            && !configured.contains('#') && !configured.contains('@') {
            bases.push(configured.to_string());
        } else {
            return Err("ORDIFI_CONTENT_BASE_URL must be an HTTPS /content base (localhost HTTP allowed for development)".into());
        }
    }
    bases.push("https://ordifi.io/api/inscription".into());
    bases.push("https://ordinals.com/content".into());

    const MAX_BYTES: usize = 16 * 1024 * 1024;
    let mut errors = Vec::new();
    for base in bases {
        let url = if base.ends_with("/api/inscription") {
            format!("{base}/{inscription_id}?raw=1")
        } else {
            format!("{base}/{inscription_id}")
        };
        let result: Result<Vec<u8>, String> = async {
            let mut response = client.get(&url).send().await.map_err(|e| e.to_string())?;
            if !response.status().is_success() {
                return Err(format!("HTTP {}", response.status()));
            }
            if response.content_length().is_some_and(|n| n > MAX_BYTES as u64) {
                return Err("content exceeds 16 MB".into());
            }
            let mut bytes = Vec::new();
            while let Some(chunk) = response.chunk().await.map_err(|e| e.to_string())? {
                if bytes.len() + chunk.len() > MAX_BYTES {
                    return Err("content exceeds 16 MB".into());
                }
                bytes.extend_from_slice(&chunk);
            }
            if bytes.is_empty() { return Err("empty content".into()); }
            Ok(bytes)
        }.await;
        match result {
            Ok(bytes) => return Ok(base64::engine::general_purpose::STANDARD.encode(bytes)),
            Err(message) => errors.push(format!("{base}: {message}")),
        }
    }
    Err(errors.join(" | "))
}

// Generate a local preview image with an isolated headless Windows browser.
// The fixed public endpoint is intentional: wallet-provided data is never a URL.
#[tauri::command]
async fn render_ordinal_preview(inscription_id: String) -> Result<String, String> {
    let (txid, index) = inscription_id.split_once('i')
        .ok_or_else(|| "Invalid inscription ID".to_string())?;
    if txid.len() != 64 || !txid.bytes().all(|b| b.is_ascii_hexdigit())
        || index.is_empty() || index.len() > 12 || !index.bytes().all(|b| b.is_ascii_digit()) {
        return Err("Invalid inscription ID".into());
    }
    #[cfg(target_os = "windows")]
    {
        use std::path::PathBuf;
        use std::process::Command;
        let mut candidates = Vec::<PathBuf>::new();
        for env in ["PROGRAMFILES(X86)", "PROGRAMFILES", "LOCALAPPDATA"] {
            if let Ok(root) = std::env::var(env) {
                candidates.push(PathBuf::from(&root).join("Microsoft/Edge/Application/msedge.exe"));
                candidates.push(PathBuf::from(&root).join("Google/Chrome/Application/chrome.exe"));
            }
        }
        let browser = candidates.into_iter().find(|v| v.is_file())
            .ok_or_else(|| "Microsoft Edge or Chrome not found".to_string())?;
        let task_dir = std::env::temp_dir().join(format!("ordifi-preview-{}", uuid::Uuid::new_v4()));
        std::fs::create_dir(&task_dir).map_err(|e| e.to_string())?;
        let screenshot = task_dir.join("preview.png");
        let profile = task_dir.join("profile");
        let result: Result<Vec<u8>, String> = (|| {
            // embed=1 selects the existing OrdiFi viewer variant, not a composed UTXO.
            let url = format!("https://ordifi.io/api/inscription/{inscription_id}?embed=1");
            let mut child = Command::new(browser)
                .arg("--headless=new")
                .arg("--default-background-color=00000000")
                .arg("--no-first-run")
                .arg("--no-default-browser-check")
                .arg("--disable-extensions")
                .arg("--hide-scrollbars")
                .arg("--disable-background-networking")
                .arg("--window-size=480,480")
                .arg("--virtual-time-budget=3000")
                .arg(format!("--user-data-dir={}", profile.display()))
                .arg(format!("--screenshot={}", screenshot.display()))
                .arg(url)
                .stdout(std::process::Stdio::null())
                .stderr(std::process::Stdio::null())
                .spawn().map_err(|e| format!("Preview browser launch failed: {e}"))?;
            let deadline = std::time::Instant::now() + std::time::Duration::from_secs(18);
            loop {
                if let Some(status) = child.try_wait().map_err(|e| e.to_string())? {
                    if !status.success() {
                        return Err(format!("Browser preview failed: {status}"));
                    }
                    break;
                }
                if std::time::Instant::now() >= deadline {
                    let _ = child.kill();
                    let _ = child.wait();
                    return Err("Browser preview timed out".into());
                }
                std::thread::sleep(std::time::Duration::from_millis(100));
            }
            let bytes = std::fs::read(&screenshot)
                .map_err(|e| format!("No preview screenshot produced: {e}"))?;
            if !bytes.starts_with(b"\x89PNG\r\n\x1a\n") {
                return Err("Preview is not a PNG".into());
            }
            if bytes.len() > 8 * 1024 * 1024 { return Err("Preview exceeds 8 MB".into()); }
            Ok(bytes)
        })();
        let _ = std::fs::remove_dir_all(task_dir);
        return result.map(|bytes| base64::engine::general_purpose::STANDARD.encode(bytes));
    }
    #[cfg(not(target_os = "windows"))]
    { Err("HTML preview capture currently supports Windows only".into()) }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![start_wallet_import, fetch_ordinal_content, render_ordinal_preview])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
