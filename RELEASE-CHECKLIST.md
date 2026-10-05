# ViltIQ – att fixa före release

## Prestanda / appstart
- Förbättra starttiden ytterligare för hemskärmsgenvägen/PWA på iPhone.
- Nuvarande lösning är användbar men inte tillräckligt snabb för release.
- Optimera första rendering, nätverksanrop, script-laddning och återanvändning av cache utan att nya versioner fastnar.
- Målet är att Start-vyn ska kännas omedelbar och att övriga funktioner laddas utan märkbar väntan när de öppnas.

## Viktigt
- Behåll versionskontrollen så att nya frontendändringar slår igenom snabbt även från sparad hemskärmsgenväg.
- Undvik att tvinga omladdning av alla resurser vid varje start.
