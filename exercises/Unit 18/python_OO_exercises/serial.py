"""Python serial number generator."""

class SerialGenerator:
    """Machine to create unique incrementing serial numbers.
    
    >>> serial = SerialGenerator(start=100)

    >>> serial.generate()
    100

    >>> serial.generate()
    101

    >>> serial.generate()
    102

    >>> serial.reset()

    >>> serial.generate()
    100
    """

    "Create starting serial number"
    def __init__(self, start):
        self.start = start
        self.serial = self.start - 1

    def __repr__(self):
        return f"SerialGenerator start={self.start} next={self.serial + 1}"

    "Generates next serial number"
    def generate(self):
        self.serial += 1
        return self.serial

    "Resets serial number order back to start"
    def reset(self):
        self.serial = self.start