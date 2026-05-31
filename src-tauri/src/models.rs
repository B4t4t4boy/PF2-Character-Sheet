use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Character {
    pub name: String,
    pub race: String,
    pub class: String,
    pub level: u8,
    pub alignment: Alignment,
    pub abilities: AbilityScores,
}

impl Default for Character {
    fn default() -> Self {
        Self {
            name: "Unknown Legend".to_string(),
            race: "Human".to_string(),
            class: "Commoner".to_string(),
            level: 1,
            alignment: Alignment::Neutral,
            abilities: AbilityScores::default(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub enum Alignment {
    LawfulGood,
    NeutralGood,
    ChaoticGood,
    LawfulNeutral,
    Neutral,
    ChaoticNeutral,
    LawfulEvil,
    NeutralEvil,
    ChaoticEvil,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AbilityScores {
    pub strength: u8,
    pub dexterity: u8,
    pub constitution: u8,
    pub intelligence: u8,
    pub wisdom: u8,
    pub charisma: u8,
}

impl Default for AbilityScores {
    fn default() -> Self {
        Self {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
        }
    }
}
