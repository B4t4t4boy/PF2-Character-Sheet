mod models;

use models::Character;

fn main() {
    let char_sheet = Character::default();
    println!("Character Sheet: {:#?}", char_sheet);
}

