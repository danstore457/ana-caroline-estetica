/**
 * Parses a Google Maps URL or address to generate a reliable, free, non-API-key Google Maps Embed iframe source.
 */
export function getEmbedUrl(mapUrl: string, address: string): string {
  if (!mapUrl && !address) {
    // Default fallback to Novo Gama if everything is empty
    return 'https://maps.google.com/maps?q=Quadra%2014,%20Lote%2019%20-%20Lunabel%203A,%20Novo%20Gama%20-%20GO&z=15&output=embed';
  }

  const cleanUrl = (mapUrl || '').trim();

  // 1. Check for decimal coordinates format like @-16.0787166,-48.073028
  const atCoordsRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const atCoordsMatch = cleanUrl.match(atCoordsRegex);
  if (atCoordsMatch) {
    const lat = atCoordsMatch[1];
    const lng = atCoordsMatch[2];
    return `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  }

  // 2. Check for 3d/4d coordinates format inside data parameters (e.g., !3d-16.0767072!4d-48.0636244)
  const dCoordsRegex = /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/;
  const dCoordsMatch = cleanUrl.match(dCoordsRegex);
  if (dCoordsMatch) {
    const lat = dCoordsMatch[1];
    const lng = dCoordsMatch[2];
    return `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
  }

  // 3. Fallback to using the text address or custom query text
  const query = address ? address : 'Quadra 14, Lote 19 - Lunabel 3A, Novo Gama - GO';
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;
}
