import type { Shape } from '../lib/catalog'

/** Hand-drawn SVG product "photos", so the demo ships with no image files and stays crisp at any size. */
const bodies: Record<Shape, { body: string; extra?: string; rim?: [number, number, number, number] }> = {
  mug: { body: 'M62 66h76v70q0 20-20 20H82q-20 0-20-20z', extra: 'M138 82q30 0 30 24t-30 24', rim: [100, 66, 38, 8] },
  cup: { body: 'M70 92h60l-6 52q-2 12-14 12H90q-12 0-14-12z', rim: [100, 92, 30, 7] },
  bowl: { body: 'M34 100h132q-6 56-66 56T34 100z', rim: [100, 100, 66, 14] },
  'deep-bowl': { body: 'M40 82h120q0 74-60 74T40 82z', rim: [100, 82, 60, 13] },
  plate: { body: 'M24 120a76 22 0 0 0 152 0v6a76 22 0 0 1-152 0z', rim: [100, 120, 76, 22] },
  vase: { body: 'M88 40h24v18q26 16 26 52v20q0 26-38 26t-38-26v-20q0-36 26-52z', rim: [100, 40, 12, 4] },
  'bud-vase': { body: 'M93 82h14v12q22 8 22 32 0 30-29 30t-29-30q0-24 22-32z', rim: [100, 82, 7, 2.5] },
  pitcher: { body: 'M70 56h56l10-8-4 18q8 18 8 44v20q0 26-40 26t-40-26v-20q0-30 10-54z', extra: 'M66 76q-26 4-24 30t28 26', rim: [98, 56, 28, 6] },
}

export function ProductArt({ shape, color, className }: { shape: Shape; color: string; className?: string }) {
  const s = bodies[shape]
  const [cx, cy, rx, ry] = s.rim ?? [100, 60, 30, 6]
  const id = `${shape}-${color.slice(1)}`
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`g-${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".22" />
          <stop offset=".45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".18" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="162" rx="70" ry="9" fill="#000" opacity=".12" />
      {s.extra && <path d={s.extra} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round" />}
      <path d={s.body} fill={color} />
      <path d={s.body} fill={`url(#g-${id})`} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={color} />
      <ellipse cx={cx} cy={cy + (shape === 'plate' ? 0 : 1)} rx={rx * (shape === 'plate' ? 0.66 : 0.86)} ry={ry * (shape === 'plate' ? 0.62 : 0.7)} fill="#000" opacity=".16" />
    </svg>
  )
}
