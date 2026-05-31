mod models;
use models::Character;
use rfd::FileDialog;
use std::fs;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_character() -> Character {
    Character::default()
}

#[tauri::command]
fn save_character_file(json: String) -> Result<(), String> {
    if let Some(path) = FileDialog::new()
        .add_filter("JSON", &["json"])
        .set_file_name("character.json")
        .save_file()
    {
        fs::write(path, json).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
fn load_character_file() -> Result<String, String> {
    if let Some(path) = FileDialog::new()
        .add_filter("JSON", &["json"])
        .pick_file()
    {
        fs::read_to_string(path).map_err(|e| e.to_string())
    } else {
        Err("No file selected".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_character, save_character_file, load_character_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
