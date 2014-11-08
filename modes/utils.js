function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.send(null);
    
    if(rawFile.status === 200 || rawFile.status == 0)
    {
        var allText = rawFile.responseText;
        return allText;
    }
    return false;
}