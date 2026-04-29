$docxFiles = Get-ChildItem -Path 'c:\FullStack Project\UI FullStack\*.docx'
if ($docxFiles.Length -eq 0) {
    Write-Host "No docx files found"
    exit
}
$docxPath = $docxFiles[0].FullName

$zipPath = 'c:\FullStack Project\UI FullStack\Unimeet_temp.zip'
$extractPath = 'c:\FullStack Project\UI FullStack\Unimeet_Extracted'

Remove-Item -Path $zipPath -ErrorAction SilentlyContinue
Remove-Item -Path $extractPath -Recurse -Force -ErrorAction SilentlyContinue

Copy-Item -LiteralPath $docxPath -Destination $zipPath
Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force
[xml]$docxml = Get-Content -Path "$extractPath\word\document.xml" -Raw
$ns = New-Object System.Xml.XmlNamespaceManager($docxml.NameTable)
$ns.AddNamespace('w', 'http://schemas.openxmlformats.org/wordprocessingml/2006/main')
$nodes = $docxml.SelectNodes('//w:p', $ns)
$text = ''
foreach ($node in $nodes) {
    $runNodes = $node.SelectNodes('.//w:t', $ns)
    $part = ''
    foreach ($run in $runNodes) {
        $part += $run.InnerText
    }
    if ($part -ne '') {
        $text += $part + "`r`n"
    }
}
$text | Out-File -FilePath 'c:\FullStack Project\UI FullStack\Unimeet_Extracted.txt' -Encoding utf8
Write-Host "Extraction complete for $docxPath"
