$env_text = Get-Content .env.local
$url = ($env_text | Select-String -Pattern '^OPTIMIZELY_RENDER_URL=' | Select-Object -First 1).Line
$url = $url.Substring($url.IndexOf('=') + 1).Trim()
$key = ($env_text | Select-String -Pattern '^OPTIMIZELY_RENDER_KEY=' | Select-Object -First 1).Line
$key = $key.Substring($key.IndexOf('=') + 1).Trim()
$endpoint = "$($url.TrimEnd('/'))/content/v2?auth=$([Uri]::EscapeDataString($key))"

$queries = [ordered]@{
  showAllUrls = 'query { CMSPage(locale: en, limit: 100) { items { _metadata { url { default hierarchical } } } } }'
  testLikeArticle = 'query { CMSPage(locale: en, limit: 5, where: { _metadata: { url: { default: { like: "*article*" } } } }) { total items { _metadata { url { default } } } } }'
  testStartsWith = 'query { CMSPage(locale: en, limit: 5, where: { _metadata: { url: { default: { startsWith: "/en/article" } } } }) { total items { _metadata { url { default } } } } }'
  testFulltextArticle = 'query { CMSPage(locale: en, limit: 3, where: { _fulltext: { match: "article" } }) { total } }'
}

foreach ($name in $queries.Keys) {
  Write-Host "=== $name ==="
  $payload = [pscustomobject]@{ query = $queries[$name] }
  $body = $payload | ConvertTo-Json -Compress
  try {
    $resp = Invoke-WebRequest -Method Post -Uri $endpoint -ContentType "application/json" -Body $body -UseBasicParsing
    $resp.Content
  } catch {
    if ($_.Exception.Response) {
      $sr = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
      Write-Host $sr.ReadToEnd()
    } else {
      Write-Host "ERROR: $($_.Exception.Message)"
    }
  }
  Write-Host ""
}