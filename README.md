![Quiztime](https://itsquiztime.azurewebsites.net/android-chrome-192x192.png)
# QuizTime

Project available [Here](https://itsquiztime.azurewebsites.net/)

Tech used: Angular, TypeScript, .NET Core (MVC, Entity Framework, SignalR web sockets), MSSQL, Microsoft Azure

Gathered user feedback during a couple of sessions where the application was used live by over 100 students in a Mathematics university lecture at Warwick.

## How to run

The ASP.NET Core 2.0 SDK must be installed.

In order to succesfully build and run the application locally, the following must be modified:
1. appsettings.json - the "ConnectionString" should point to a local or cloud-hosted database.
2. After updating the "ConnectionString", the dotnet ef update database command must be run from the command-line.

## To run from Visual Studio:

Open the generated .csproj file, and run the app as normal from there.
The build process restores npm dependencies on the first run, which can take several minutes. Subsequent builds are much faster.

## To run from the .NET Core Command-Line Interface (CLI):

Ensure you have an environment variable called ASPNETCORE_Environment with a value of Development. On Windows (in non-PowerShell prompts), run SET ASPNETCORE_Environment=Development. On Linux or macOS, run export ASPNETCORE_Environment=Development.

Run dotnet build to verify the app builds correctly. On the first run, the build process restores npm dependencies, which can take several minutes. Subsequent builds are much faster.

Run dotnet run to start the app. 
