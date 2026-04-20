# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY LocalEventOrganizer/LocalEventOrganizer.csproj LocalEventOrganizer/
RUN dotnet restore LocalEventOrganizer/LocalEventOrganizer.csproj

COPY LocalEventOrganizer/ LocalEventOrganizer/
RUN dotnet publish LocalEventOrganizer/LocalEventOrganizer.csproj -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "LocalEventOrganizer.dll"]
