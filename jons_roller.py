import random
import re

def parse_dice_input(dice_input):
    """
    Parses the dice input into a list of parts (dice rolls and modifiers).

    Parameters:
        dice_input (str): The dice input string.

    Returns:
        list: A list of parts extracted from the dice input.
    """
    return [part.strip() for part in re.split(r'\+', dice_input)]

def roll_dice(num_dice, dice_type, roll_type=None):
    """Rolls dice and applies modifiers like 'adv', 'disadv', and 'gwf' (Great Weapon Fighting)."""
    rolls = [random.randint(1, dice_type) for _ in range(num_dice)]

    if roll_type in ['adv', 'disadv']:
        extra_rolls = [random.randint(1, dice_type) for _ in range(num_dice)]
        final_rolls = [max(roll, extra_roll) if roll_type == 'adv' else min(roll, extra_roll) for roll, extra_roll in zip(rolls, extra_rolls)]
        roll_display = "\n".join([f"{roll}|{extra_roll} -> {max(roll, extra_roll) if roll_type == 'adv' else min(roll, extra_roll)}" for roll, extra_roll in zip(rolls, extra_rolls)])
        roll_sum = sum(final_rolls)

    elif roll_type == 'gwf':
        roll_details = []
        final_rolls = []
        for roll in rolls:
            if roll == 1 or roll == 2:
                reroll = random.randint(1, dice_type)
                final_rolls.append(reroll)
                roll_details.append(f"{roll} | {reroll} -> {reroll}")
            else:
                final_rolls.append(roll)
                roll_details.append(str(roll))
        roll_display = " , ".join(roll_details)
        roll_sum = sum(final_rolls)  # Sum the final adjusted rolls

    else:
        roll_display = " , ".join(str(r) for r in rolls)
        roll_sum = sum(rolls)  # Sum the original rolls

    return roll_display, roll_sum


def handle_crit(roll_sum, is_crit):
    """
    Doubles the roll sum if a critical hit is indicated.

    Parameters:
        roll_sum (int): The sum of rolls to potentially double.
        is_crit (bool): Indicates whether a critical hit is applied.

    Returns:
        int: The potentially doubled roll sum.
    """
    return roll_sum * 2 if is_crit else roll_sum

def format_rolls_output(rolls_output, total_sum):
    """
    Formats the rolls output and total sum into a string, handling each segment on a new line.

    Parameters:
        rolls_output (list): The list of formatted roll strings.
        total_sum (int): The total sum of all rolls and modifiers.

    Returns:
        str: The formatted output string.
    """
    detailed_rolls = " + ".join(f"[{roll}]" for roll in rolls_output)
    final_output = f"{detailed_rolls}\n= {total_sum}"
    return final_output


def main():
    while True:
        dice_input = input("Enter your dice roll (or 'exit' to quit): ")
        if dice_input.lower() == 'exit':
            break

        is_crit = 'crit' in dice_input.lower()
        parts = parse_dice_input(dice_input.replace('crit', '') if is_crit else dice_input)
        total_sum = 0
        rolls_output = []

        for part in parts:
            match = re.match(r'(\d+)d(\d+)(\s+(adv|disadv|gwf))?', part)
            if match:
                num_dice, dice_type, _, roll_type = match.groups()
                rolls, roll_sum = roll_dice(int(num_dice), int(dice_type), roll_type)
                roll_sum = handle_crit(roll_sum, is_crit)
                rolls_output.append(f"{rolls} = {roll_sum}")
                total_sum += roll_sum
            else:
                try:
                    modifier = int(part)
                    total_sum += modifier
                    rolls_output.append(str(modifier))
                except ValueError:
                    print(f"Invalid format: {part}")
                    break

        print(format_rolls_output(rolls_output, total_sum))

if __name__ == "__main__":
    main()