import fs from "node:fs";

export type VideoSize = { width: number; height: number };

/**
 * Lee ancho y alto de un .mp4 desde su cabecera (caja moov > trak > tkhd),
 * sin dependencias. Sirve para saber en el build si un video es vertical.
 */
export function readMp4Size(filePath: string): VideoSize {
  const buf = fs.readFileSync(filePath);

  // Recorre las cajas MP4 entre start y end y devuelve [tipo, inicioDatos, fin].
  function* boxes(start: number, end: number): Generator<[string, number, number]> {
    let pos = start;
    while (pos + 8 <= end) {
      let size = buf.readUInt32BE(pos);
      const type = buf.toString("latin1", pos + 4, pos + 8);
      let header = 8;
      if (size === 1) {
        size = Number(buf.readBigUInt64BE(pos + 8));
        header = 16;
      } else if (size === 0) {
        size = end - pos;
      }
      if (size < header) return;
      yield [type, pos + header, Math.min(pos + size, end)];
      pos += size;
    }
  }

  for (const [type, s, e] of boxes(0, buf.length)) {
    if (type !== "moov") continue;
    for (const [t2, s2, e2] of boxes(s, e)) {
      if (t2 !== "trak") continue;
      for (const [t3, s3] of boxes(s2, e2)) {
        if (t3 !== "tkhd") continue;
        const offset = buf.readUInt8(s3) === 1 ? 88 : 76; // depende de la versión de la caja
        const width = buf.readUInt32BE(s3 + offset) >>> 16;
        const height = buf.readUInt32BE(s3 + offset + 4) >>> 16;
        if (width > 0 && height > 0) return { width, height }; // la pista de audio tiene 0×0
      }
    }
  }
  throw new Error(`No pude leer el tamaño del video ${filePath}. ¿Es un .mp4 válido?`);
}
