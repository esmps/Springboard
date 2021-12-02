def print_upper_words(words, must_start_with):
    """Takes in a list of words, prints only words with selected first letter in all caps"""
    for word in words:
        for letter in must_start_with:
            if word[0] == letter:
                print (word.upper())

# this should print "HELLO", "HEY", "YO", and "YES"
print_upper_words(["hello", "hey", "goodbye", "yo", "yes"],
                   must_start_with={"g", "y"})