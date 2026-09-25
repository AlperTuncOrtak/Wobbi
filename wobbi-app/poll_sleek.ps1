$deviceCode = 'sdc_di-ihewVNQ634rXfXSfhxqckS3vELJJRlSlyslZhuJQ'
$envFile = 'c:\Users\trexg\Desktop\code\wobbi\wobbi-app\.env'

while ($true) {
    Start-Sleep -Seconds 5
    try {
        $response = Invoke-RestMethod -Uri 'https://sleek.design/api/v1/device/poll' -Method Post -ContentType 'application/json' -Body "{"deviceCode": "$deviceCode"}"
        if ($response.data.apiKey) {
            Write-Host "Successfully retrieved API Key!"
            Add-Content -Path $envFile -Value "
SLEEK_API_KEY=$($response.data.apiKey)"
            break
        }
    } catch {
        $errorResponse = $_.Exception.Response
        if ($errorResponse) {
            $reader = New-Object System.IO.StreamReader($errorResponse.GetResponseStream())
            $errorBody = $reader.ReadToEnd() | ConvertFrom-Json
            if ($errorBody.error.code -eq 'authorization_pending') {
                Write-Host "Waiting for user approval..."
            } elseif ($errorBody.error.code -eq 'expired') {
                Write-Host "Code expired. Exiting."
                break
            } else {
                Write-Host "Error: $($errorBody.error.code)"
            }
        }
    }
}
