@REM Maven Wrapper startup script for Windows
@REM Automatically downloads Maven if not present

@echo off
setlocal

set MAVEN_PROJECTBASEDIR=%~dp0
set MAVEN_WRAPPER_PROPERTIES="%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.properties"

@REM Read distributionUrl from properties
for /f "usebackq tokens=1,2 delims==" %%a in (%MAVEN_WRAPPER_PROPERTIES%) do (
    if "%%a"=="distributionUrl" set DOWNLOAD_URL=%%b
)

set MAVEN_HOME=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.6
set MAVEN_CMD=%MAVEN_HOME%\bin\mvn.cmd

if exist "%MAVEN_CMD%" goto runMaven

echo Downloading Maven 3.9.6...
mkdir "%MAVEN_HOME%" 2>nul

powershell -Command "Invoke-WebRequest -Uri '%DOWNLOAD_URL%' -OutFile '%TEMP%\maven.zip'"
powershell -Command "Expand-Archive -Path '%TEMP%\maven.zip' -DestinationPath '%USERPROFILE%\.m2\wrapper\dists' -Force"

@REM Maven extracts to a subdirectory
if exist "%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.6\bin\mvn.cmd" (
    set MAVEN_CMD=%USERPROFILE%\.m2\wrapper\dists\apache-maven-3.9.6\bin\mvn.cmd
)

:runMaven
"%MAVEN_CMD%" %*
