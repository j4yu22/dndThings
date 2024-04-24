import random

def roll_d8():
    """
    Simulates rolling a d8 (8-sided die).

    Returns:
        int: The result of the die roll, between 1 and 8 inclusive.
    """
    return random.randint(1, 8)


def roll_d6():
    """
    Simulates rolling a d6 (6-sided die).

    Returns:
        int: The result of the die roll, between 1 and 6 inclusive.
    """
    return random.randint(1, 6)


def chaos_bolt(iterations=100000):
    """
    Calculates the average damage for the 'chaos bolt' over a specified number of iterations.

    Parameters:
        iterations (int): The number of times to simulate the damage calculation.

    Returns:
        None
    """
    total_dmg = 0
    actual_iterations = 0

    for _ in range(iterations):
        roll1 = roll_d8()
        roll2 = roll_d8()
        roll3 = roll_d6()
        subtotal = roll1 + roll2 + roll3
        total_dmg += subtotal
        actual_iterations += 1

        while roll1 == roll2:
            roll1 = roll_d8()
            roll2 = roll_d8()
            roll3 = roll_d6()
            subtotal = roll1 + roll2 + roll3
            total_dmg += subtotal
            actual_iterations += 1

    average = total_dmg / actual_iterations
    print(f"Average damage for chaos bolt: {average:.2f}")


def main():
    try:
        spell = input(int("1 : Chaos Bolt\nSelect Number to choose spell."))

    except:
        pass

    if spell:
        chaos_bolt()