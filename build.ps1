$env:JAVA_HOME = "C:\Users\Administrator\jdk17"
$env:ANDROID_HOME = "C:\Users\Administrator\AppData\Local\Android\Sdk"
$env:GRADLE_USER_HOME = "D:\.gradle"
$env:Path = "C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin;C:\Users\Administrator\AppData\Local\pnpm\bin;C:\Users\Administrator\jdk17\bin;$env:Path"

Set-Location "D:\Backup\Documents\ysc\music\android"

# ensure configs
"sdk.dir=$env:ANDROID_HOME" | Out-File local.properties -Encoding ASCII
@"
RELEASE_STORE_FILE=../app/banban.keystore
RELEASE_STORE_PASSWORD=banban123
RELEASE_KEY_ALIAS=banban
RELEASE_KEY_PASSWORD=banban123
"@ | Out-File keystore.properties -Encoding ASCII

Write-Host "Starting Gradle build..."
.\gradlew assembleRelease --no-daemon --stacktrace 2>&1
