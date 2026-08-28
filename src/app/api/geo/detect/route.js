import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Récupérer l'IP depuis les headers
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';

    // Récupérer le pays depuis Cloudflare header (si disponible)
    const cfCountry = request.headers.get('cf-ipcountry');

    // Liste des pays européens (codes ISO)
    const europeanCountries = [
      'FR', 'BE', 'DE', 'IT', 'ES', 'PT', 'NL', 'CH', 'AT', 'LU',
      'GB', 'IE', 'SE', 'NO', 'DK', 'FI', 'IS', 'PL', 'CZ', 'SK',
      'HU', 'RO', 'BG', 'GR', 'HR', 'SI', 'EE', 'LV', 'LT', 'CY', 'MT'
    ];

    let region = 'GLOBAL';
    let country = cfCountry || 'UNKNOWN';
    let currency = 'EUR';
    let detectionMethod = 'cloudflare';

    // Si Cloudflare header disponible
    if (cfCountry) {
      if (cfCountry === 'DZ') {
        region = 'ALGERIA';
        currency = 'DZD';
      } else if (europeanCountries.includes(cfCountry)) {
        region = 'EUROPE';
        currency = 'EUR';
      }
    } else {
      // Fallback : utiliser une API de géolocalisation gratuite
      detectionMethod = 'ip-api';
      try {
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,currency`);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.status === 'success') {
            country = geoData.countryCode;

            if (country === 'DZ') {
              region = 'ALGERIA';
              currency = 'DZD';
            } else if (europeanCountries.includes(country)) {
              region = 'EUROPE';
              currency = 'EUR';
            }
          }
        }
      } catch (error) {
        console.error('Geo detection error:', error);
      }
    }

    return NextResponse.json({
      success: true,
      region,
      country,
      currency,
      ip: ip !== 'unknown' ? ip.substring(0, 10) + '...' : 'unknown', // Partial IP for privacy
      detectionMethod
    });
  } catch (error) {
    console.error('Error detecting region:', error);
    return NextResponse.json({
      success: false,
      region: 'GLOBAL',
      country: 'UNKNOWN',
      currency: 'EUR',
      error: error.message
    }, { status: 500 });
  }
}
