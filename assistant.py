"""
To do:
add a 'roll' command with a refactored dice roller
get a daemon thread for a tkinter GUI dashboard
get something to scrape spells from wikidot and give descriptions
add ability to calculate saving throws and automatically roll them
add level - pb dictionary
"""

import gspread
from oauth2client.service_account import ServiceAccountCredentials
import tkinter as tk
from tkinter import ttk
import re


class Character:
    def __init__(self, nickname, name, level, max_health, current_health, temp_hp, martial_ability, spell_casting_ability, weapon_bonus, spell_focus_bonus, str_score, dex_score, con_score, int_score, wis_score, cha_score, saving_throws, crit_roll, initiative):
        self.nickname = nickname
        self.name = name
        self.level = level
        self.max_health = max_health
        self.current_health = max_health
        self.temp_hp = temp_hp
        self.martial_ability = martial_ability
        self.spell_casting_ability = spell_casting_ability
        self.weapon_bonus = weapon_bonus
        self.spell_focus_bonus = spell_focus_bonus
        self.str_score = str_score
        self.dex_score = dex_score
        self.con_score = con_score
        self.int_score = int_score
        self.wis_score = wis_score
        self.cha_score = cha_score
        self.saving_throws = saving_throws
        self.crit_roll = crit_roll
        self.initiative = initiative

    def __repr__(self):
        return (f"{self.name} (Level {self.level})\n"
                f"Nickname: {self.nickname}, Max Health: {self.max_health}\n"
                f"Martial Ability: {self.martial_ability}, Spell Casting Ability: {self.spell_casting_ability}\n"
                f"Weapon Bonus: {self.weapon_bonus}, Spell Focus Bonus: {self.spell_focus_bonus}\n"
                f"STR: {self.str_score}, DEX: {self.dex_score}, CON: {self.con_score}\n"
                f"INT: {self.int_score}, WIS: {self.wis_score}, CHA: {self.cha_score}\n"
                f"Saving Throws: {self.saving_throws}, Crit Roll: {self.crit_roll}, Initiative: {self.initiative}\n")


def parse_characters(sheet, initiatives):
    characters = {}
    character_data = sheet.get_all_records()
    for data in character_data:
        normalized_name = data['Character Name'].strip().lower()  # Normalize the name
        char = Character(
            nickname=data['Discord DnD Server Nickname'].strip().lower(),  # Also normalize nickname
            name=normalized_name,
            level=int(data['Level']),
            max_health=int(data['Max Health (Integer only)']),
            current_health = int(data['Max Health (Integer only)']),
            temp_hp=0,
            martial_ability=data['Martial Ability'],
            spell_casting_ability=data['Spell Casting Ability'],
            weapon_bonus=data['+__ Weapon'],
            spell_focus_bonus=data['+__ Spellcasting Focus'],
            str_score=int(data['Strength Score']),
            dex_score=int(data['Dexterity Score']),
            con_score=int(data['Constitution Score']),
            int_score=int(data['Intelligence Score']),
            wis_score=int(data['Wisdom Score']),
            cha_score=int(data['Charisma Score']),
            saving_throws=data['Saving Throw Proficiencies'],
            crit_roll=data['Lowest Possible Number Roll for Crit'],
            initiative=initiatives.get(data['Discord DnD Server Nickname'], None)
        )
        characters[normalized_name] = char
    return characters


def read_initiatives(filename):
    """
    Reads a text file with initiative rolls formatted as 'name : [number rolled]'.
    Assumes each entry is on a new line.

    Parameters:
        filename (str): The path to the text file containing the initiative rolls.

    Returns:
        dict: A dictionary mapping names to their initiative rolls.
    """
    initiatives = {}
    with open(filename, 'r') as file:
        lines = file.readlines()
        for line in lines:
            if line.strip():
                parts = line.strip().split(':', 1)
                if len(parts) == 2:
                    discord_name, roll = parts[0].strip(), parts[1].strip()
                    try:
                        initiatives[discord_name] = int(roll)
                    except ValueError:
                        print(f"Error converting roll to integer: {roll}")
                        continue
    return initiatives


# Access the google sheet and parse the data
def fetch_data():
    scope = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
    creds = ServiceAccountCredentials.from_json_keyfile_name('D:\\python\\gitstuff\\dndThings\\dndthings-91b2e9bcd84b.json', scope)
    client = gspread.authorize(creds)
    sheet = client.open_by_key("1fWAHuARSuJ42jQtFhg_KBclv72Gbt2A7skX2L55WeHA").sheet1
    initiatives = read_initiatives('d:\\python\\gitstuff\\dndthings\\initiative.txt')
    characters = parse_characters(sheet, initiatives)
    return characters


#commands start here

# Extend the dictionary of patterns to handle various command formats
command_patterns = {
    'initiative_list': re.compile(r'^init$'),
    'health': re.compile(r'^hp (\S+) ([+-]\d+)$'),
    'temp_hp': re.compile(r'^temp (\S+) (\d+)$'),  # Pattern to set temp HP
}

def execute_command(command_type, characters, *args):
    try:
        if command_type == 'initiative_list':
            for char in sorted(characters.values(), key=lambda c: c.initiative, reverse=True):
                print(f"{char.name} - Initiative: {char.initiative}")
        elif command_type == 'health':
            name, change = args
            change = int(change)
            update_health(characters, name, change)
        elif command_type == 'temp_hp':
            name, temp_hp = args
            temp_hp = int(temp_hp)
            set_temp_hp(characters, name, temp_hp)
    except ValueError:
        print("Invalid number provided.")



def parse_command(command, characters):
    """Parses a command using regular expressions and executes it if valid."""
    for cmd_type, pattern in command_patterns.items():
        match = pattern.match(command)
        if match:
            execute_command(cmd_type, characters, *match.groups())
            return True
    return False


def update_health(characters, name, change):
    """Updates the health of a character, considering temp HP."""
    if name in characters:
        character = characters[name]
        if change < 0:  # Damage is being dealt
            temp_reduction = min(-change, character.temp_hp)
            character.temp_hp -= temp_reduction
            change += temp_reduction  # Reduce the incoming damage by the temp HP absorbed
        character.current_health += change
        if character.current_health > character.max_health:
            character.current_health = character.max_health
        elif character.current_health < 0:
            character.current_health = 0
        print(f"{name.title()}'s new health: {character.current_health}, temp HP: {character.temp_hp}")
    else:
        print(f"Character '{name.title()}' not found.")


def set_temp_hp(characters, name, temp_hp):
    """Sets temporary hit points for a character."""
    if name in characters:
        character = characters[name]
        characters[name].temp_hp = temp_hp
        print(f"{name.title()}'s new health: {character.current_health}, temp HP: {character.temp_hp}")
    else:
        print(f"Character '{name.title()}' not found.")


def main():
    """Continuously process commands until 'exit' is entered."""
    characters = fetch_data()
    while True:
        command = input("Enter command (or type 'exit' to quit): ").strip().lower()
        if command == 'exit':
            break
        if not parse_command(command, characters):
            print("Invalid command or format. Please try again.")

if __name__ == "__main__":
    main()