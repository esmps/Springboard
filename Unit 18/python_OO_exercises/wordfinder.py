"""Word Finder: finds random words from a dictionary."""

import random

class WordFinder:
    """Word finder that returns random words from a file of words
    >>> words  = WordFinder("animals.txt")
    6 words read
    >>> words.random() in ["cat", "dog", "porcupine", "bunny", "mouse", "deer"]
    True
    >>> words.random() in ["cat", "dog", "porcupine", "bunny", "mouse", "deer"]
    True
    >>> words.random() in ["cat", "dog", "porcupine", "bunny", "mouse", "deer"]
    True
    """

    def __init__(self, file_path):
        """Read words from file and report number of words read"""
        words_file = open(file_path)
        self.words = self.parse(words_file)
        print(f"{len(self.words)} words read")

    def parse(self, file):
        """Create list of words without newline character"""
        return [words.strip() for words in file]

    def random(self):
        """Picks and returns random word from parsed list"""
        return random.choice(self.words)


class SpecialWordFinder(WordFinder):
    """Word finder that excludes blank lines and comments
    >>> words  = WordFinder("complex.txt")
    6 words read
    >>> words.random() in ["pear", "banana", "apple", "carrot", "kale", "onion"]
    True
    >>> words.random() in ["pear", "banana", "apple", "carrot", "kale", "onion"]
    True
    >>> words.random() in ["pear", "banana", "apple", "carrot", "kale", "onion"]
    True
    """
    def parse(self, file):
        return [words.strip() for words in file if words.strip() and not words.startswith("#")]