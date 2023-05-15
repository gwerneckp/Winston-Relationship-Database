def splitLabel(label: str, maxLen: int = 20):
    result: str = ''
    splitLabel = label.replace('-', ' ').split(' ')
    thisLineCount = 0
    for split in splitLabel:
        if thisLineCount + len(split) > maxLen:
            result += '\n'
            thisLineCount = 0
        result += split + ' '
        thisLineCount += len(split) + 1
    return result


print(splitLabel("Gabriel Werneck Paiva"))
print(splitLabel('Adam Raillard-Gaborillaud'))
print(splitLabel("Sarah Elizabeth Johnson"))
print(splitLabel("Alexander Graham Bell"))
print(splitLabel("Emily Rose Thompson"))
print(splitLabel("Jacob William Anderson-Smith"))
print(splitLabel("Emma"))
print(splitLabel("Liam Jameson"))
print(splitLabel("Sophia Marie Miller"))
print(splitLabel("Oliver Alexander Robertson"))
print(splitLabel("Ava Grace Thompson-Smith"))
