function generateSocietyCode(name){
    let prefix = name.toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (prefix.length < 3) {
        throw new Error("Society name must have at least 3 valid alphanumeric characters.");
    }

    prefix = prefix.slice(0,3)
    const random = Date.now().toString(32).toUpperCase()
    const suffix = random.slice(random.length - 4, random.length)
    return prefix+suffix
}

export {generateSocietyCode}